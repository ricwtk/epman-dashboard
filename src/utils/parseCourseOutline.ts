/**
 * parseCourseOutline.ts
 *
 * Converts a course outline .docx file (Sunway University format)
 * into a Course object that matches the Course interface in course.ts.
 *
 * Usage (Node.js):
 *   import { parseCourseOutline } from './parseCourseOutline';
 *   const course = await parseCourseOutline('./202301_ETC2073_Artificial_Intelligence.docx');
 *
 * Browser usage:
 *   Pass an ArrayBuffer instead of a file path.
 *   const course = await parseCourseOutline(arrayBuffer, { isBrowser: true });
 *
 * Dependencies:
 *   npm install mammoth
 *   npm install --save-dev @types/mammoth
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

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Parse a Bloom's Taxonomy string like "C3" or "A2" into ['c', 3].
 * Domain letters: C = Cognitive, A = Affective, P = Psychomotor
 */
function parseBloomTax(raw: string): [string, number] {
  const match = raw.trim().match(/^([A-Za-z])(\d+)$/);
  if (!match) return ['c', 1];
  return [match[1]!.toLowerCase(), parseInt(match[2]!, 10)];
}

/**
 * Parse a cell like "WK1\nWK2\nWK3" or "WK1 WK2 WK3" into [1, 2, 3].
 */
function parseIndexList(raw: string, prefix = ''): number[] {
  if (!raw) return [];
  const regex = prefix ? new RegExp(`${prefix}(\\d+)`, 'gi') : /(\d+)/g;
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
 * Parse a string like "Analytical Skills, Problem-Solving and Scientific Skills" into ["Analytical Skills", "Problem-Solving", "Scientific Skills"]
 */
function parseItemList(raw: string): string[] {
  return raw.replace(" and ", " , ").split(",").map(s => s.trim()).filter(Boolean)
}

/**
 * Parse a string like "X", "-", "" into a boolean value.
 * "X" is treated as true, everything else is treated as false.
 */

function parseBoolean(raw: string): boolean {
  return raw.trim().toUpperCase() === 'X';
}

/**
 * Extract all tables from the raw HTML output of mammoth.
 * Returns an array of tables, each table being an array of rows of cell strings.
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

// ─── Section parsers ────────────────────────────────────────────────────────

/**
 * Parse Section 1 (Course Summary) from plain text.
 * Looks for label:value pairs in the text.
 */
// function parseSection1(text: string): CourseSummary {
function parseSection1(tables: Table[]): CourseSummary {
  const get = (label: string): string => {
    if (!summaryTable) return ''
    const regex = new RegExp(`${label}`);
    const idx = summaryTable.findIndex(r => r.some(c => regex.test(c.trim())))
    if (idx == -1) return ''
    const m = summaryTable[idx]![1];
    return m ? m.replace(/\s+/g, ' ').trim() : '';
  };

  const summaryTable = tables.find((rows) =>
    rows.some(r => r.some((c) => /^Course Name$/.test(c.trim())))
  )

  const semYear = parseSemesterYear(get('Semester/Year Offered'));

  const transferableRaw = get('Transferable Skills').replace(/^and\s+/i, ',');
  const transferableSkills = parseItemList(transferableRaw)
  // const transferableSkills = transferableRaw
  //   ? transferableRaw[1]!.trim().split(/[,\n]/).map((s) => s.trim()).filter(Boolean)
  //   : [];

  const deliveryRaw = get('Delivery Method').replace(/^and\s+/i, ',');
  const deliveryMethods = parseItemList(deliveryRaw)
  // const deliveryMethods = deliveryRaw
  //   ? deliveryRaw[1]!.trim().split(/[,\n]/).map((s) => s.trim()).filter(Boolean)
  //   : [];

  const lecturersRaw = get('Lecturer');
  const lecturers = parseItemList(lecturersRaw)
  // const lecturers = lecturersRaw.split(/[,\n]/).map((s) => s.trim()).filter(Boolean);

  const prereqRaw = get('Pre-requisite');
  const prerequisites = parseItemList(prereqRaw)
  // const prerequisites = prereqRaw
  //   ? prereqRaw.split(/[,\n]/).map((s) => s.trim()).filter(Boolean)
  //   : [];

  return {
    name: get('Course Name'),
    code: get('Course Code'),
    category: (get('Category') || 'core').toLowerCase(),
    semester: semYear.semester,
    year: semYear.year,
    credits: parseInt(get('SLT Credit Hours') || get('Credit Hours') || '3', 10),
    synopsis: get('Synopsis'),
    transferableSkills,
    deliveryMethods,
    lecturers,
    prerequisites,
  };
}

/**
 * Parse Section 2 (Course Outcomes) from the CO table.
 *
 * Expected columns: CO | Description | LD/BT | PO | WK | WP | EA
 */
function parseSection2(tables: Table[]): Co[] {
  const coTable = tables.find((rows) => {
    const dataRows = rows.filter(
      (r) => /^CO\s*\d+$/i.test(r[0]!) || /^\d+$/.test(r[0]!)
    );
    return dataRows.length >= 1 && rows[0]!.length >= 5;
  });

  if (!coTable) return [];

  const cos: Co[] = [];

  for (const row of coTable) {
    if (!/^CO\s*\d+$/i.test(row[0]!) && !/^\d+$/.test(row[0]!)) continue;

    const description = (row[1] ?? '').replace(/\s+/g, ' ').trim();
    const bloomRaw = (row[2] ?? '').trim();

    cos.push({
      description,
      bloomtax: parseBloomTax(bloomRaw),
      pos: parseIndexList(row[3] ?? '', 'PO'),
      wks: parseIndexList(row[4] ?? '', 'WK'),
      wps: parseIndexList(row[5] ?? '', 'WP'),
      eas: parseIndexList(row[6] ?? '', 'EA'),
      sdg: parseBoolean(row[7] ?? ''),
    });
  }

  return cos;
}

/**
 * Parse Section 3 (Assessment Strategy) from the assessment table.
 *
 * Expected columns: Component | Method | Weightage | CO1 | CO2 | CO3 | CO4 ...
 */
function parseSection3(tables: Table[], _coCount: number): Assessment[] {
  const assessTable = tables.find((rows) =>
    rows.some(
      (r) =>
        r.some((c) => /^\d+$/.test(c.trim())) &&
        r.some((c) => /CO\d+|Assessment/i.test(c))
    )
  );

  if (!assessTable) return [];

  const headerIdx = assessTable.findIndex((r) =>
    r.some((c) => /^CO\s*\d+$/i.test(c) || /^Weightage/i.test(c))
  );

  const header = assessTable[headerIdx] ?? [];
  const coColIndices: Record<number, number> = {};
  header.forEach((cell, idx) => {
    const m = cell.match(/^CO\s*(\d+)$/i);
    if (m) coColIndices[parseInt(m[1]!, 10)] = idx;
  });
  const weightCellIdx = header.length - Object.keys(coColIndices).length - 1;
  const hasFormat = header.length - Object.keys(coColIndices).length > 3;

  const assessments: Assessment[] = [];

  for (let i = headerIdx + 1; i < assessTable.length; i++) {
    const row = assessTable[i]!;
    if (row.length < 3) continue;
    const idxAdj = row.length == header.length ? 0 : -1;
    const compCell = idxAdj == -1 ? assessments[assessments.length-1]!.component : row[0]!.trim()
    const descCell = row[1 + idxAdj]!.trim()
    const formatCell = hasFormat ? row[2 + idxAdj]!.trim() : '';
    const weightStr = row[weightCellIdx + idxAdj]!.replace(/[^0-9]/g, '').trim();
    const weightage = weightStr ? parseInt(weightStr, 10) : 0;

    const rowCos: number[] = [];
    if (Object.keys(coColIndices).length > 0) {
      for (const [co, idx] of Object.entries(coColIndices)) {
        if ((row[idx + idxAdj] ?? '').trim().toUpperCase() === 'X') {
          rowCos.push(parseInt(co, 10));
        }
      }
    } else {
      for (let c = 3; c < row.length; c++) {
        if (row[c + idxAdj]!.trim().toUpperCase() === 'X') rowCos.push(c - 2);
      }
    }

    assessments.push({
      description: descCell.replace(/\s+/g, ' ').trim(),
      component: compCell.replace(/\s+/g, ' ').trim(),
      format: formatCell,
      weightage: weightage,
      cos: rowCos,
      breakdown: [],
    });
  }

  return assessments;
}

/**
 * Parse Section 4 (Teaching Plan) from the topic SLT table.
 *
 * Expected columns: Topic | L | T | P | A | O | IL | Total
 */
function parseSection4(tables: Table[]): Plan[] {
  const planTable = tables.find((rows) =>
    rows.some((r) => r.some((c) => /^L$/.test(c)) && r.some((c) => /^T$/.test(c)))
    && rows.some((r) => r.some((c) => /^Topic\s+SLT$/.test(c)))
  );

  if (!planTable) return [];

  const headerIdx = planTable.findIndex(
    (r) => r.some((c) => /^L$/.test(c)) && r.some((c) => /^T$/.test(c))
  );
  if (headerIdx < 0) return [];

  const header = planTable[headerIdx]!;
  const colL  = header.indexOf('L')+1;
  const colT  = header.indexOf('T')+1;
  const colP  = header.indexOf('P')+1;
  const colA = header.indexOf('A') + 1;
  const colO  = header.indexOf('O')+1;
  const colIL = header.indexOf('IL')+1;

  const plans: Plan[] = [];

  for (let i = headerIdx + 1; i < planTable.length; i++) {
    const row = planTable[i]!;
    // const description = (row[0] ?? '').replace(/\s+/g, ' ').trim();
    const description = (row[0] ?? '')
      // .split(/\r?\n/)
      // .map(l => l.trim())
      // .filter(l => l !== '')
    if (!description) continue;
    if (/^(Sub-total|Total SLT|SLT Credit)/i.test(description)) continue;

    const n = (idx: number): number =>
      idx >= 0 && row[idx] ? parseInt(row[idx], 10) || 0 : 0;

    plans.push({
      description,
      hours: {
        lecture:    { online: 0, f2f: n(colL) },
        tutorial:   { online: 0, f2f: n(colT) },
        practical:  { online: 0, f2f: n(colP) },
        assessment: { online: 0, f2f: n(colA) },
        others:     { online: 0, f2f: n(colO) },
        self:       { online: 0, f2f: n(colIL) },
      },
    });
  }

  return plans;
}

/**
 * Parse references from the references table.
 * Expected: two-column table with "Main Reference" / "Additional References".
 */
function parseReferences(tables: Table[]): { main: string[], additional: string[] } {
  const refTable = tables.find((rows) =>
    rows.some((r) => /main\s+reference/i.test(r[0] ?? ''))
  );

  if (!refTable) return { main: [], additional: [] };

  const mainReferences: string[] = [];
  const additionalReferences: string[] = [];

  for (const row of refTable) {
    const labelCell = (row[0] ?? '').toLowerCase();
    // const descCell  = (row[1] ?? '').replace(/\s+/g, ' ').trim();
    const descCells = (row[1] ?? '')
      .split(/\n/g)
      .map(s => s.replace(/\s+/g, ' ').trim()).filter(Boolean);

    if (descCells.length < 1) continue;

    descCells.forEach(descStr => {
      if (/main/.test(labelCell)) {
        mainReferences.push(descStr);
      } else if (/additional/.test(labelCell)) {
        additionalReferences.push(descStr);
      }
    })
  }

  return { main: mainReferences, additional: additionalReferences };
}

// ─── Main export ─────────────────────────────────────────────────────────────

/**
 * Parse a course outline .docx file and return a fully-typed Course object.
 *
 * @param source   File path string (Node.js) or ArrayBuffer (browser).
 * @param options  Parsing options.
 */
export async function parseCourseOutline(
  source: string | ArrayBuffer,
  options: ParseOptions = {}
): Promise<Course> {
  const { isBrowser = false, filename = '' } = options;

  // ── 1. Extract HTML (preserves table structure) and raw text ──────────────
  const [htmlResult, textResult] = await (isBrowser
    ? Promise.all([
        mammoth.convertToHtml({ arrayBuffer: source as ArrayBuffer }),
        mammoth.extractRawText({ arrayBuffer: source as ArrayBuffer }),
      ])
    : Promise.all([
        mammoth.convertToHtml({ path: source as string }),
        mammoth.extractRawText({ path: source as string }),
      ]));

  const html = htmlResult.value;
  const text = textResult.value;

  // ── 2. Extract all tables from HTML ───────────────────────────────────────
  const tables = extractTables(html);

  // ── 3. Parse each section ─────────────────────────────────────────────────
  // const summary  = parseSection1(text);
  const summary  = parseSection1(tables);
  const code     = summary.code;

  const cos          = parseSection2(tables);
  const assessments  = parseSection3(tables, cos.length);
  const teachingPlan = parseSection4(tables);
  const references   = parseReferences(tables);

  // ── 4. Assemble the Course object ─────────────────────────────────────────
  const course: Course = {
    id: "",
    code,
    name: summary.name,
    prerequisites: summary.prerequisites,
    lecturers: summary.lecturers,
    category: summary.category,
    courseType: "examBased",
    semester: summary.semester,
    year: summary.year,
    credits: summary.credits,
    synopsis: summary.synopsis,
    transferableSkills: summary.transferableSkills,
    deliveryMethods: summary.deliveryMethods,
    cos,
    startFrom: ["", ""],
    assessments,
    teachingPlan,
    references,
    gradingScheme: 'default',
    committed: { on: null, by: '' },
    revision: "",
    parentRevision: '',
  };

  return course;
}
