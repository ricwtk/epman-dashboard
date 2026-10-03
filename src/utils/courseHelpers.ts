import { COURSE_TYPES } from "@/constants";
import { formatId, getNumbersOfObjectList } from "./common";
// import { courses } from "./courseExamples";
import type {
  Course,
  Co,
  Allocation,
  Plan,
  Assessment,
  Breakdown,
  CourseInfo,
  CourseMappingInfo,
} from "@/types/course";
import { Document, Packer, PageOrientation, TextRun, Paragraph, Table, WidthType, AlignmentType, UnderlineType, VerticalAlignTable, TableRow, TableCell } from "docx";
import { saveAs } from 'file-saver';
import { get } from "@vueuse/core";

// currently using courseExamples.ts
// export function getCourseByCode(code: string): Course {
//   return courses.find((course) => course.code === code) || createCourseObject({ code: code });
// }

// currently using courseExamples.ts
// export function getCourseInfoByCode(code: string): { code: string, name: string, credits: number } {
//   let thisCourse = courses.find((course) => course.code === code) || createCourseObject({ code: code });
//   return { code: thisCourse.code, name: thisCourse.name, credits: thisCourse.credits };
// }

// currently using courseExamples.ts
// export function getCourseList(): { code: string, name: string }[] {
//   return courses.map((course) => ({ code: course.code, name: course.name }));
// }

export const getTotalHours = (hours: { online: number, f2f: number }) => (hours.online + hours.f2f);

export const getTopicHours = (hours: Allocation) =>
  getTotalHours(hours.lecture)
  + getTotalHours(hours.tutorial)
  + getTotalHours(hours.practical)
  + getTotalHours(hours.assessment)
  + getTotalHours(hours.others)
  + getTotalHours(hours.self);

export const getTotalComponentHours = (teachingPlan: Plan[], component: keyof Allocation) => {
  const total = teachingPlan.reduce((acc, topic) => {
    return acc + getTotalHours(topic.hours[component]);
  }, 0);
  return total;
};

export const getTotalComponentOnlineHours = (teachingPlan: Plan[], component: keyof Allocation) => {
  const total = teachingPlan.reduce((acc, topic) => {
    return acc + topic.hours[component].online;
  }, 0);
  return total;
};

export const getTotalComponentF2FHours = (teachingPlan: Plan[], component: keyof Allocation) => {
  const total = teachingPlan.reduce((acc, topic) => {
    return acc + topic.hours[component].f2f;
  }, 0);
  return total;
};

export const getTotalHoursForCourse = (teachingPlan: Plan[]) => {
  const total = teachingPlan.reduce((acc, topic) => {
    return acc + getTopicHours(topic.hours);
  }, 0);
  return total;
};

export const getCreditHours = (totalHours: number) => Math.round(totalHours / 40);

// default objects creation
export const createCourseObject = (overrides?: Partial<Course>): Course => {
  const newCourse: Course = {
    id: "",
    code: "",
    name: "",
    prerequisites: [],
    lecturers: [],
    category: "",
    courseType: COURSE_TYPES[0].key,
    semester: 1,
    year: 1,
    credits: 0,
    synopsis: "",
    transferableSkills: [],
    deliveryMethods: [],
    cos: [],
    startFrom: ['semester', new Date().toISOString().substring(0, 7)],
    assessments: [],
    teachingPlan: [],
    references: {
      main: [],
      additional: [],
    },
    gradingScheme: "default",
    committed: {
      on: new Date(),
      by: ""
    },
    revision: "1.0.0",
    parentRevision: "",
    ...overrides
  };
  newCourse.id = formatId(newCourse);
  return newCourse;
};

export const createCo = (overrides?: Partial<Co>): Co => ({
  description: "",
  bloomtax: ['', 0],
  pos: [],
  wks: [],
  wps: [],
  eas: [],
  sdg: false,
  ...overrides
});

export const createPlan = (description?: string, overrides?: Partial<Allocation>): Plan => ({
  description: description || '',
  hours: {
    lecture: { online: 0, f2f: 0 },
    practical: { online: 0, f2f: 0 },
    tutorial: { online: 0, f2f: 0 },
    assessment: { online: 0, f2f: 0 },
    self: { online: 0, f2f: 0 },
    others: { online: 0, f2f: 0 },
    ...overrides
  }
});

export const createAssessment = (overrides?: Partial<Assessment>): Assessment => ({
  description: '',
  component: '',
  format: '',
  weightage: 0,
  cos: [],
  breakdown: [],
  wps: {},
  eas: {},
  ...overrides
});

export const createBreakdown = (overrides?: Partial<Breakdown>): Breakdown => ({
  description: '',
  weightage: 0,
  co: 1,
  wps: [],
  eas: [],
  rubrics: {},
  ...overrides
});

export const createCourseInfo = (course?: Partial<Course>): CourseInfo => ({
  name: course?.name || "",
  code: course?.code || "",
  credits: course?.credits || 0,
  category: course?.category || "",
  lecturers: course?.lecturers || [],
  courseType: course?.courseType || COURSE_TYPES[0].key,
  transferableSkills: course?.transferableSkills || [],
  deliveryMethods: course?.deliveryMethods || []
});

export const createCourseMappingInfo = (course?: Partial<Course>): CourseMappingInfo => {
  const pos = getNumbersOfObjectList(course?.cos || [], 'pos') || [];
  const wks = getNumbersOfObjectList(course?.cos || [], 'wks') || [];
  const wps = getNumbersOfObjectList(course?.cos || [], 'wps') || [];
  const eas = getNumbersOfObjectList(course?.cos || [], 'eas') || [];
  const sdg = course?.cos?.some(c => c.sdg) || false;
  return {
    semester: course?.semester || 0,
    name: course?.name || "",
    code: course?.code || "",
    credits: course?.credits || 0,
    pos: pos,
    wks: wks,
    wps: wps,
    eas: eas,
    sdg: sdg,
  };
};

export function getCEPCEA(assessment: Assessment, coIndex: number, componentType: 'wp' | 'ea', componentList: string[][]): string[][] {
  const descriptors: string[][] = []
  const componentKey = `${componentType}s` as 'wps' | 'eas'
  const componentLabel = `${componentType.toUpperCase()}`
  if (assessment) {
    if (assessment.breakdown.length > 0) {
      for (const breakdown of assessment.breakdown) {
        if (breakdown.co == coIndex) {
          if (breakdown[componentKey] && breakdown[componentKey].length > 0) {
            descriptors.push(...breakdown[componentKey].sort().map(
              (componentNumber: number) => componentList[componentNumber-1] || [`${componentLabel}${componentNumber}`, ]
            ))
          }
        }
      }
    } else {
      if (assessment.cos.includes(coIndex)) {
        const coKey = `CO${coIndex}`
        if (assessment[componentKey] && assessment[componentKey][coKey] && assessment[componentKey][coKey].length > 0) {
          descriptors.push(...assessment[componentKey][coKey].sort().map(
            (componentNumber: number) => componentList[componentNumber-1] || [`${componentLabel}${componentNumber}`, ]
          ))
        }
      }
    }
  }
  return [...new Map(descriptors.map(descriptor => [descriptor[0], descriptor])).values()]
}

function numberlistToString(numbers: number[]): string {
  return numbers.join(",");
}

function createBodyCell(content: unknown, isCenteredColumn: boolean): TableCell {
  if (typeof content === "string") {
    return new TableCell({
      children: [
        new Paragraph({
          children: [new TextRun({ text: content })],
          alignment: isCenteredColumn ? AlignmentType.CENTER : AlignmentType.LEFT,
        }),
      ],
    });
  }

  if (Array.isArray(content)) {
    const paragraphs: Paragraph[] = [];

    content.forEach((line: string[], idx: number) => {
      const headline = line.length > 1 ? line.slice(0, 2).join(" ") : line[0] ?? "";
      const textRuns: TextRun[] = [
        new TextRun({
          text: headline,
          underline: { type: UnderlineType.SINGLE },
        }),
      ];

      if (line.length > 2) {
        textRuns.push(new TextRun({ text: line.slice(2).join(" "), break: 1 }));
      }

      paragraphs.push(
        new Paragraph({
          children: textRuns,
          alignment: AlignmentType.LEFT,
        })
      );

      // Add a blank paragraph spacing between items
      if (idx < content.length - 1) {
        paragraphs.push(new Paragraph({ text: "" }));
      }
    });

    return new TableCell({ children: paragraphs });
  }

  return new TableCell({ children: [new Paragraph({ text: "" })] });
}

function generateRubricTemplate(courseName: string, assessmentName: string, body: Row[]): Document {
  // header
  const rubricTitle = new Paragraph({
    children: [
      new TextRun({
        text: `Rubric Template for ${courseName} (${assessmentName})`,
        bold: true,
        underline: { type: UnderlineType.SINGLE }
      }),
    ]
  })

  const headerCellText = ["CO", "PO", "WK", "SDG", "CEP/CEA Descriptors", "Criteria"]
  const scoreLevels = ["0-1", "2-3", "4-5", "6-7", "8-10"]
  const totalHeaderCellChars = headerCellText.reduce((acc, text) => acc + text.length, 0)

  // Table Row 1: Main Headers
  const headerRow1Cells: TableCell[] = headerCellText.map((text) => {
    const relativeWidth = (50 / totalHeaderCellChars) * text.length;
    return new TableCell({
      children: [
        new Paragraph({
          children: [new TextRun({ text, bold: true })],
          alignment: AlignmentType.CENTER,
        }),
      ],
      verticalAlign: VerticalAlignTable.CENTER,
      rowSpan: 2,
      width: {
        type: WidthType.PERCENTAGE,
        size: relativeWidth,
      },
    });
  });

  headerRow1Cells.push(
    new TableCell({
      children: [
        new Paragraph({
          children: [new TextRun({ text: "Scores", bold: true })],
          alignment: AlignmentType.CENTER,
        }),
      ],
      verticalAlign: VerticalAlignTable.CENTER,
      columnSpan: scoreLevels.length,
    })
  );

  // Table Row 2: Score Level Subheaders
  const headerRow2Cells: TableCell[] = scoreLevels.map((score) => (
    new TableCell({
      children: [
        new Paragraph({
          children: [new TextRun({ text: score })],
          alignment: AlignmentType.CENTER,
        }),
      ],
      verticalAlign: VerticalAlignTable.CENTER,
    })
  ));

  const rows: TableRow[] = [
    new TableRow({ children: headerRow1Cells }),
    new TableRow({ children: headerRow2Cells }),
  ];

  // Table Body Rows
  for (const rowContent of body) {
    const rowCells: TableCell[] = [];

    // Render defined metadata/descriptor columns
    for (let colIdx = 0; colIdx < rowContent.length; colIdx++) {
      const isCenteredColumn = colIdx < 4;
      rowCells.push(createBodyCell(rowContent[colIdx], isCenteredColumn));
    }

    // 1. Explicitly add the empty 'Criteria' cell
    rowCells.push(new TableCell({ children: [new Paragraph({ text: "" })] }));

    // Render score level input cells (Fixed bug: matching scoreLevels.length exactly)
    for (let s = 0; s < scoreLevels.length; s++) {
      rowCells.push(
        new TableCell({
          children: [new Paragraph({ text: "" })],
        })
      );
    }

    rows.push(new TableRow({ children: rowCells }));
  }

  // // table
  // // // header row 1
  // let rows: TableRow[] = []
  // let thisRow: TableCell[] = []
  // for (let i = 0; i < headerCellText.length; i++) {
  //   thisRow.push(new TableCell({
  //     children: [
  //       new Paragraph({
  //         children: [new TextRun({ text: headerCellText[i], bold: true })],
  //         alignment: AlignmentType.CENTER
  //       })
  //     ],
  //     verticalAlign: VerticalAlignTable.CENTER,
  //     rowSpan: 2,
  //     width: {
  //       type: WidthType.PERCENTAGE,
  //       size: 50 / totalHeaderCellChars * (headerCellText[i]?.length ?? 0),
  //     }
  //   }))
  // }
  // thisRow.push(new TableCell({
  //   children: [
  //     new Paragraph({
  //       children: [new TextRun({ text: "Scores", bold: true })],
  //       alignment: AlignmentType.CENTER
  //     })
  //   ],
  //   verticalAlign: VerticalAlignTable.CENTER,
  //   columnSpan: scoreLevels.length
  // }))
  // rows.push(new TableRow({ children: thisRow }))

  // // // header row 2
  // thisRow = []
  // for (let i = 0; i < scoreLevels.length; i++) {
  //   thisRow.push(new TableCell({
  //     children: [
  //       new Paragraph({
  //         children: [new TextRun({ text: scoreLevels[i] })],
  //         alignment: AlignmentType.CENTER
  //       })
  //     ],
  //     verticalAlign: VerticalAlignTable.CENTER,

  //   }))
  // }
  // rows.push(new TableRow({ children: thisRow }))

  // // // body
  // if (body.length > 0) {
  //   for (let i = 0; i < body.length; i++) {
  //     thisRow = []
  //     for (let j = 0; j < body[i]!.length; j++) {
  //       let thisContent = body[i]![j]
  //       let thisCell: Paragraph[] = []
  //       if (typeof thisContent === "string") {
  //         thisCell = [new Paragraph({
  //           children: [new TextRun({ text: body[i]![j]!.toString() })],
  //           alignment: j < 4 ? AlignmentType.CENTER : AlignmentType.LEFT
  //         })]
  //       }
  //       if (Array.isArray(thisContent)) {
  //         thisCell = thisContent.map((line: string[], idx: number, arr: string[][]) => {
  //           let texts = []
  //           let headline = ""
  //           if (line.length > 1) {
  //             headline = line.slice(0, 2).join(" ")
  //           } else {
  //             headline = line[0]!
  //           }
  //           texts.push(new TextRun({
  //             text: headline,
  //             underline: { type: UnderlineType.SINGLE }
  //           }))
  //           if (line.length > 2) {
  //             texts.push(new TextRun({ text: line.slice(2).join(" "), break: 1 }))
  //           }
  //           let paras = [
  //             new Paragraph({
  //               children: texts,
  //               alignment: AlignmentType.LEFT
  //             })
  //           ]
  //           if (idx < arr.length - 1) {
  //             paras.push(new Paragraph({ text: "" }))
  //           }
  //           return paras
  //         }).flat()
  //       }
  //       thisRow.push(new TableCell({ children: thisCell }))
  //     }
  //     for (let j = 0; j < scoreLevels.length+1; j++) {
  //       thisRow.push(new TableCell({ children: [new Paragraph({ text: "" })] }))
  //     }
  //     rows.push(new TableRow({ children: thisRow }))
  //   }
  // }

  const rubricTable = new Table({
    margins: {
      top: 120,    // 120 dxa = ~6pt (~0.08 inch)
      bottom: 120,
      left: 180,   // 180 dxa = ~9pt (~0.125 inch)
      right: 180
    },
    rows,
  })

  return new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Arial",
            size: 20 // 10pt (half-points)
          }
        }
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: {
              orientation: PageOrientation.LANDSCAPE,
            }
          }
        },
        children: [
          rubricTitle,
          rubricTable,
        ],
      },
    ],
  })
}

type Row = [
  co?: string,
  pos?: string,
  wks?: string,
  sdg?: string,
  wpsNeas?: string[][]
]
export async function exportRubricsHelper(courseName: string, assessmentName: string, assessment: Assessment, cos: Co[], wpList?: string[][], eaList?: string[][]): Promise<void> {
  // console.log(assessment, cos)
  let rows: Row[]
  // get COs
  if (assessment.breakdown.length > 0) {
    rows = [...new Set(assessment.breakdown.map(breakdown => breakdown.co))].map(coIndex => [coIndex.toString()])
  } else {
    rows = cos.map((_,coIndex) => [(coIndex+1).toString()])
  }
  // get POs, WKs, SDG
  rows = rows.map(([coIndex]) => {
    const co = cos[parseInt(coIndex!)-1]
    return [coIndex!, numberlistToString(co?.pos ?? []), numberlistToString(co?.wks ?? []), co?.sdg ? "✓" : "-"]
  })
  // get WP and EA
  rows = rows.map(([coIndex, pos, wks, sdg]) => {
    let wps: number[] = []
    let eas: number[] = []
    if (assessment.breakdown.length > 0) {
      const coI = parseInt(coIndex!)
      for (const breakdown of assessment.breakdown) {
        if (breakdown.co === coI) {
          wps.push(...(breakdown.wps ?? []))
          eas.push(...(breakdown.eas ?? []))
        }
      }
    } else {
      wps = assessment.wps?.[`CO${coIndex}`] ?? []
      eas = assessment.eas?.[`CO${coIndex}`] ?? []
    }
    let wpsStr = [...new Set(wps)].map(wp => wpList?.[wp-1] ?? [`WP${wp}`])
    let easStr = [...new Set(eas)].map(ea => eaList?.[ea-1] ?? [`EA${ea}`])
    return [coIndex!, pos!, wks!, sdg!, [wpsStr, easStr].flat()]
  })

  // console.log(rows)
  const doc = generateRubricTemplate(courseName, assessmentName, rows)

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${courseName} ${assessmentName}.docx`);
}
