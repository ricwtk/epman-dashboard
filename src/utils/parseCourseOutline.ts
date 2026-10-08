/**
 * parseCourseOutline.ts
 *
 * Converts a course outline .docx file (Sunway University format)
 * into a Course object that matches the Course interface in course.ts.
 * Handles missing tables gracefully using isolated section parsers.
 */

import mammoth from 'mammoth';
import type { Co, Assessment, Breakdown, Plan, Course } from '@/types/course';

// ─── Internal types ──────────────────────────────────────────────────────────

interface ParseOptions {
  /** Set to true when passing an ArrayBuffer (browser environment). */
  isBrowser?: boolean;
  /** Original filename — used to extract revision code and course code. */
  filename?: string;
}

interface CourseSummary {
  name: string;
  code: string;
  category: string;
  semester: number;
  year: number;
  credits: number;
  synopsis: string;
  transferableSkills: string[];
  deliveryMethods: string[];
  lecturers: string[];
  prerequisites: string[];
}

type Table = string[][];

// ─── Utility Helpers ────────────────────────────────────────────────────────

/**
 * Safely execute a section parser, falling back to a default value if missing or invalid.
 */
function safeParse<T>(parserFn: () => T, fallback: T, sectionName: string): T {
  try {
    return parserFn();
  } catch (error) {
    console.warn(
      `[CourseOutlineParser] Warning: Failed to parse ${sectionName}. Using fallback value.`,
      error
    );
    return fallback;
  }
}

/**
 * Parse a Bloom's Taxonomy string like "C3", "C 3", or "A2" into ['c', 3].
 * Domain letters: C = Cognitive, A = Affective, P = Psychomotor
 */
function parseBloomTax(raw: string): [string, number] {
  const match = raw.trim().match(/([C|A|P|c|a|p])\s*(\d+)/i);
  if (!match) return ['c', 1];
  return [match[1]!.toLowerCase(), parseInt(match[2]!, 10)];
}

/**
 * Parse a cell like "WK1\nWK2\nWK3" or "WK1 WK2 WK3" into [1, 2, 3].
 */
function parseIndexList(raw: string, prefix = ''): number[] {
  if (!raw) return [];
  const regex = prefix ? new RegExp(`${prefix}\\s*(\\d+)`, 'gi') : /(\d+)/g;
  const matches: number[] = [];
  let m: RegExpExecArray | null;
  while ((m = regex.exec(raw)) !== null) {
    const n = parseInt(m[1]!, 10);
    if (!matches.includes(n)) matches.push(n);
  }
  return matches.sort((a, b) => a - b);
}

/**
 * Determine semester/year from a string like "Semester 3 / Year 2".
 */
function parseSemesterYear(raw: string): { semester: number; year: number } {
  const semMatch = raw.match(/semester\s*(\d+)/i);
  const yearMatch = raw.match(/year\s*(\d+)/i);
  return {
    semester: semMatch ? parseInt(semMatch[1]!, 10) : 1,
    year: yearMatch ? parseInt(yearMatch[1]!, 10) : 1,
  };
}

/**
 * Parse comma, 'and', or newline-separated lists into sanitized string arrays.
 */
function parseItemList(raw: string): string[] {
  return raw
    .replace(/\band\b/gi, ',')
    .split(/,|\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Parse checkmarks ('X', 'x', '✓', 'YES') into boolean values.
 */
function parseBoolean(raw: string): boolean {
  const clean = raw.trim().toUpperCase();
  return clean === 'X' || clean === 'YES' || clean === '✓' || clean === '✔';
}

/**
 * Extract all tables from the raw HTML output of mammoth.
 */
function extractTables(html: string): Table[] {
  const tables: Table[] = [];
  const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  let tableMatch: RegExpExecArray | null;

  while ((tableMatch = tableRegex.exec(html)) !== null) {
    const rows: string[][] = [];
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let rowMatch: RegExpExecArray | null;

    while ((rowMatch = rowRegex.exec(tableMatch[1]!)) !== null) {
      const cells: string[] = [];
      const cellRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
      let cellMatch: RegExpExecArray | null;

      while ((cellMatch = cellRegex.exec(rowMatch[1]!)) !== null) {
        const text = cellMatch[1]!
          .replace(/<\/p>/gi, '\n')
          .replace(/<\/li>/gi, '\n')
          .replace(/<br\s*\/?>/gi, '\n')
          .replace(/<[^>]+>/g, '')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&nbsp;/g, ' ')
          .replace(/&#x2019;/g, "'")
          .replace(/&#x201C;/g, '"')
          .replace(/&#x201D;/g, '"')
          .replace(/[ \t]+/g, ' ')
          .trim();
        cells.push(text);
      }
      if (cells.length > 0) rows.push(cells);
    }
    if (rows.length > 0) tables.push(rows);
  }
  return tables;
}

// ─── Section Parsers ─────────────────────────────────────────────────────────

function parseSection1(tables: Table[]): CourseSummary {
  const summaryTable = tables.find((rows) =>
    rows.some((r) => r.some((c) => /^Course Name$/i.test(c.trim())))
  );

  const get = (label: string): string => {
    if (!summaryTable) return '';
    const regex = new RegExp(label, 'i');
    const row = summaryTable.find((r) => r.some((c) => regex.test(c.trim())));
    if (!row) return '';
    const labelIdx = row.findIndex((c) => regex.test(c.trim()));
    const val = row[labelIdx + 1] ?? '';
    return val.replace(/\s+/g, ' ').trim();
  };

  const semYear = parseSemesterYear(get('Semester/Year Offered'));

  return {
    name: get('Course Name'),
    code: get('Course Code'),
    category: (get('Category') || 'core').toLowerCase(),
    semester: semYear.semester,
    year: semYear.year,
    credits: parseInt(get('SLT Credit Hours') || get('Credit Hours') || '3', 10),
    synopsis: get('Synopsis'),
    transferableSkills: parseItemList(get('Transferable Skills')),
    deliveryMethods: parseItemList(get('Delivery Method')),
    lecturers: parseItemList(get('Lecturer')),
    prerequisites: parseItemList(get('Pre-requisite')),
  };
}

function parseSection2(tables: Table[]): Co[] {
  const coTable = tables.find((rows) => {
    const dataRows = rows.filter(
      (r) => /^CO\s*\d+$/i.test(r[0] ?? '') || /^\d+$/.test(r[0] ?? '')
    );
    return dataRows.length >= 1 && (rows[0]?.length ?? 0) >= 5;
  });

  if (!coTable) return [];

  const cos: Co[] = [];

  for (const row of coTable) {
    if (!/^CO\s*\d+$/i.test(row[0] ?? '') && !/^\d+$/.test(row[0] ?? '')) continue;

    cos.push({
      description: (row[1] ?? '').replace(/\s+/g, ' ').trim(),
      bloomtax: parseBloomTax(row[2] ?? ''),
      pos: parseIndexList(row[3] ?? '', 'PO'),
      wks: parseIndexList(row[4] ?? '', 'WK'),
      wps: parseIndexList(row[5] ?? '', 'WP'),
      eas: parseIndexList(row[6] ?? '', 'EA'),
      sdg: parseBoolean(row[7] ?? ''),
    });
  }

  return cos;
}

function parseSection3(tables: Table[], _coCount: number): Assessment[] {
  const assessTable = tables.find((rows) =>
    rows.some(
      (r) =>
        r.some((c) => /Assessment/.test(c)) &&
        r.some((c) => /CO/i.test(c)) //r.some((c) => /CO\d+/i.test(c))
    )
  );

  if (!assessTable) return [];

  const singleRowHeader = assessTable.some((row) => row.some((c) => /CO\d+/i.test(c)));
  console.log("singleRowHeader", singleRowHeader);

  const firstRow = assessTable[0] ?? [];
  const componentColIdx = firstRow.findIndex((c) => /Component/i.test(c));
  const descColIdx = firstRow.findIndex((c) => /Method/i.test(c));
  const weightColIdx = firstRow.findIndex((c) => /Weightage/i.test(c));
  const formatColIdx = firstRow.findIndex((c) => /Format/i.test(c));
  const coStartColIdx = firstRow.findIndex((c) => !/Assessment/.test(c) && /CO/i.test(c));

  // const coNumber = singleRowHeader ? firstRow.length - coStartColIdx : assessTable[1]?.length;
  const fullRowLength = singleRowHeader ? firstRow.length : firstRow.length - 1 + (assessTable[1]?.length ?? 0);

  // const headerIdx = assessTable.findIndex((r) =>
  //   r.some((c) => /^CO\s*\d+$/i.test(c) || /^Weightage/i.test(c))
  // );

  // const header = assessTable[headerIdx] ?? [];
  // const coColIndices: Record<number, number> = {};
  // header.forEach((cell, idx) => {
  //   const m = cell.match(/^CO\s*(\d+)$/i);
  //   if (m) coColIndices[parseInt(m[1]!, 10)] = idx;
  // });

  // const weightCellIdx = header.length - Object.keys(coColIndices).length - 1;
  // const hasFormat = header.length - Object.keys(coColIndices).length > 3;

  const assessments: Assessment[] = [];

  for (let i = singleRowHeader ? 1 : 2; i < assessTable.length; i++) {
    const row = assessTable[i]!;
    console.log(row)
    const idxAdj = row.length === fullRowLength ? 0 : -1;
    const lastAssessment = assessments[assessments.length - 1];
    const compCell = (row[componentColIdx + idxAdj] ?? lastAssessment?.component ?? '').trim();
    const descCell = (row[descColIdx + idxAdj] ?? '').trim();
    const formatCell = (row[formatColIdx + idxAdj] ?? '').trim();
    const weightStr = (row[weightColIdx + idxAdj] ?? '').replace(/[^0-9]/g, '').trim();
    console.log(weightColIdx, weightStr)
    const weightage = weightStr ? parseInt(weightStr, 10) : 0;

    const rowCos: number[] = [];
    for (let c = coStartColIdx + idxAdj; c < row.length; c++) {
      if (parseBoolean(row[c] ?? '')) rowCos.push(c - (coStartColIdx + idxAdj) + 1);
    }

    assessments.push({
      description: descCell.replace(/\s+/g, ' ').trim(),
      component: compCell.replace(/\s+/g, ' ').trim(),
      format: formatCell,
      weightage,
      cos: rowCos,
      breakdown: [],
    });
  }

  return assessments;
}

function parseSection4(tables: Table[]): Plan[] {
  const planTable = tables.find(
    (rows) =>
      rows.some((r) => r.some((c) => /^L$/i.test(c.trim())) && r.some((c) => /^T$/i.test(c.trim()))) &&
      rows.some((r) => r.some((c) => /Topic\s+SLT/i.test(c)))
  );

  if (!planTable) return [];

  const headerIdx = planTable.findIndex(
    (r) => r.some((c) => /^L$/i.test(c.trim())) && r.some((c) => /^T$/i.test(c.trim()))
  );
  if (headerIdx < 0) return [];

  const header = planTable[headerIdx]!.map((c) => c.trim().toUpperCase());
  const colL = header.indexOf('L');
  const colT = header.indexOf('T');
  const colP = header.indexOf('P');
  const colA = header.indexOf('A');
  const colO = header.indexOf('O');
  const colIL = header.indexOf('IL');

  const plans: Plan[] = [];

  for (let i = headerIdx + 1; i < planTable.length; i++) {
    const row = planTable[i]!;
    const description = (row[0] ?? '').replace(/\s+/g, ' ').trim();
    if (!description) continue;
    if (/^(Sub-total|Total SLT|SLT Credit)/i.test(description)) continue;

    const n = (idx: number): number =>
      idx >= 0 && row[idx] ? parseInt(row[idx]!, 10) || 0 : 0;

    plans.push({
      description,
      hours: {
        lecture: { online: 0, f2f: n(colL) },
        tutorial: { online: 0, f2f: n(colT) },
        practical: { online: 0, f2f: n(colP) },
        assessment: { online: 0, f2f: n(colA) },
        others: { online: 0, f2f: n(colO) },
        self: { online: 0, f2f: n(colIL) },
      },
    });
  }

  return plans;
}

function parseReferences(tables: Table[]): { main: string[]; additional: string[] } {
  const refTable = tables.find((rows) =>
    rows.some((r) => /main\s+reference/i.test(r[0] ?? ''))
  );

  if (!refTable) return { main: [], additional: [] };

  const mainReferences: string[] = [];
  const additionalReferences: string[] = [];

  for (const row of refTable) {
    const labelCell = (row[0] ?? '').toLowerCase();
    const descCells = (row[1] ?? '')
      .split(/\n/g)
      .map((s) => s.replace(/\s+/g, ' ').trim())
      .filter(Boolean);

    if (descCells.length < 1) continue;

    descCells.forEach((descStr) => {
      if (/main/.test(labelCell)) {
        mainReferences.push(descStr);
      } else if (/additional/.test(labelCell)) {
        additionalReferences.push(descStr);
      }
    });
  }

  return { main: mainReferences, additional: additionalReferences };
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export async function parseCourseOutline(
  source: string | ArrayBuffer,
  options: ParseOptions = {}
): Promise<Course> {
  const { isBrowser = false } = options;

  const [htmlResult] = await (isBrowser
    ? Promise.all([mammoth.convertToHtml({ arrayBuffer: source as ArrayBuffer })])
    : Promise.all([mammoth.convertToHtml({ path: source as string })]));

  const tables = extractTables(htmlResult.value);

  // Default fallback object for Section 1 if the summary table is missing
  const defaultSummary: CourseSummary = {
    name: '',
    code: '',
    category: 'core',
    semester: 1,
    year: 1,
    credits: 3,
    synopsis: '',
    transferableSkills: [],
    deliveryMethods: [],
    lecturers: [],
    prerequisites: [],
  };

  // Safe parsing execution per section
  const summary = safeParse(() => parseSection1(tables), defaultSummary, 'Course Summary');
  const cos = safeParse(() => parseSection2(tables), [], 'Course Outcomes');
  const assessments = safeParse(() => parseSection3(tables, cos.length), [], 'Assessments');
  const teachingPlan = safeParse(() => parseSection4(tables), [], 'Teaching Plan');
  const references = safeParse(() => parseReferences(tables), { main: [], additional: [] }, 'References');

  for (const assessment of assessments) {
    assessment.cos.forEach((coI) => {
      if (cos.length < coI) return
      const co = cos[coI - 1]
      if (co) {
        if (!assessment.wps) assessment.wps = {}
        if (!assessment.eas) assessment.eas = {}
        assessment.wps[`CO${coI}`] = co.wps;
        assessment.eas[`CO${coI}`] = co.eas;
      }
    })
  }

  return {
    id: '',
    code: summary.code,
    name: summary.name,
    prerequisites: summary.prerequisites,
    lecturers: summary.lecturers,
    category: summary.category,
    courseType: 'examBased',
    semester: summary.semester,
    year: summary.year,
    credits: summary.credits,
    synopsis: summary.synopsis,
    transferableSkills: summary.transferableSkills,
    deliveryMethods: summary.deliveryMethods,
    cos,
    startFrom: ['', ''],
    assessments,
    teachingPlan,
    references,
    gradingScheme: 'default',
    committed: { on: null, by: '' },
    revision: '',
    parentRevision: '',
  };
}
