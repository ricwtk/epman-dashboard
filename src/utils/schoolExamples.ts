import type { School } from "@/types/school";

export const schools: School[] = [
  {
    code: "SEN",
    name: "School of Engineering",
    programmes: ["BEEE", "BCHE", "BMEC", "BMRE", "BCIV"],
    components: {
      wks: [
        {
          "attribute": "Natural and Social Sciences",
          "descriptor": "A systematic, theory-based understanding of the natural sciences applicable to the discipline and awareness of relevant social sciences"
        },
        {
          "attribute": "Mathematics and Computer Science",
          "descriptor": "Conceptually-based mathematics, numerical analysis, data analysis, statistics and formal aspects of computer and information science to support detailed analysis and modelling applicable to the discipline"
        },
        {
          "attribute": "Engineering Fundamentals",
          "descriptor": "A systematic, theory-based formulation of engineering fundamentals required in the engineering discipline."
        },
        {
          "attribute": "Engineering Specialist Knowledge",
          "descriptor": "Engineering specialist knowledge that provides theoretical frameworks and bodies of knowledge for the accepted practice areas in the engineering discipline; much is at the forefront of the discipline."
        },
        {
          "attribute": "Engineering Design and Operations",
          "descriptor": "Knowledge, including efficient resource use, environmental impacts, whole-life cost, re-use of resources, net zero carbon, and similar concepts, that supports engineering design and operations in a practice area"
        },
        {
          "attribute": "Engineering Practice",
          "descriptor": "Knowledge of engineering practice (technology) in the practice areas in the engineering discipline."
        },
        {
          "attribute": "Engineers in Society",
          "descriptor": "Knowledge of the role of engineering in society and identified issues in engineering practice in the discipline, such as the professional responsibility of an engineer to public safety and sustainable development"
        },
        {
          "attribute": "Research Skills",
          "descriptor": "Engagement with selected knowledge in the current research literature of the discipline, awareness of the power of critical thinking and creative approaches to evaluate emerging issues"
        },
        {
          "attribute": "Professional and Ethical Responsibility",
          "descriptor": "Ethics, inclusive behavior and conduct. Knowledge of professional ethics, responsibilities, and norms of engineering practice. Awareness of the need for diversity by reason of ethnicity, gender, age, physical ability etc. with mutual understanding and respect, and of inclusive attitudes"
        }
      ],
      wps: [
        {
          "attribute": "Depth of Knowledge Required",
          "descriptor": "Cannot be resolved without in-depth engineering knowledge at the level of one or more of WK3, WK4, WK5, WK6 or WK8 which allows a fundamentals-based, first principles analytical approach."
        },
        {
          "attribute": "Range of conflicting requirements",
          "descriptor": "Involve wide-ranging and/or conflicting technical and non-technical issues (such as ethical, sustainability, legal, political, economic, or social)."
        },
        {
          "attribute": "Depth of analysis required",
          "descriptor": "Have no obvious solution and require abstract thinking, creativity, and originality in analysis to formulate suitable models."
        },
        {
          "attribute": "Familiarity of issues",
          "descriptor": "Involve infrequently encountered issues."
        },
        {
          "attribute": "Extent of applicable codes",
          "descriptor": "Address problems not encompassed by standards and codes of practice for professional engineering."
        },
        {
          "attribute": "Extent of stakeholder involvement and level of conflicting requirements",
          "descriptor": "Involve collaboration across engineering disciplines, other fields, and/or diverse groups of stakeholders with widely varying needs."
        },
        {
          "attribute": "Interdependence",
          "descriptor": "Address high-level problems including many component parts or sub-problems."
        }
      ],
      eas: [
        {
          "attribute": "Range of resources",
          "descriptor": "Involve the use of diverse resources including people, data and information, natural, financial and physical resources and appropriate technologies including analytical and/or design software."
        },
        {
          "attribute": "Level of interactions",
          "descriptor": "Require optimal resolution of interactions between wide-ranging and/or conflicting technical, non-technical, and engineering issues."
        },
        {
          "attribute": "Innovation",
          "descriptor": "Involve creative use of engineering principles, innovative solutions for a conscious purpose, and research-based knowledge."
        },
        {
          "attribute": "Consequences to society and the environment",
          "descriptor": "Have significant consequences in a range of contexts, characterised by difficulty of prediction and mitigation."
        },
        {
          "attribute": "Familiarity",
          "descriptor": "Can extend beyond previous experiences by applying principle-based approaches."
        }
      ]
    }
  }
]
