module.exports = {
  modelName: 'programs',
  collectionName: 'programs',
  options: {
    useTimestamps: true,
  },
  attributes: {
    name: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    abbreviation: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    // ES: Si credits es null es que no tiene sistema de creditos
    credits: {
      type: 'integer',
      options: {
        defaultTo: null,
      },
    },
    maxGroupAbbreviation: {
      type: 'integer',
      options: {
        notNull: true,
      },
    },
    maxGroupAbbreviationIsOnlyNumbers: {
      type: 'boolean',
      options: {
        defaultTo: false,
      },
    },
    // ES: Define el numero máximos de cursos que puede tener el programa
    maxNumberOfCourses: {
      type: 'integer',
      options: {
        defaultTo: 0,
      },
    },
    courseCredits: {
      type: 'integer',
      options: {
        defaultTo: 0,
      },
    },
    hideCoursesInTree: {
      type: 'boolean',
      options: {
        defaultTo: false,
      },
    },
    haveSubstagesPerCourse: {
      type: 'boolean',
    },
    // year | semester | trimester | quarter | month | week | day
    substagesFrequency: {
      type: 'string',
    },
    numberOfSubstages: {
      type: 'integer',
      options: {
        defaultTo: 1,
      },
    },
    useDefaultSubstagesName: {
      type: 'boolean',
    },
    maxSubstageAbbreviation: {
      type: 'integer',
    },
    maxSubstageAbbreviationIsOnlyNumbers: {
      type: 'boolean',
    },
    haveKnowledge: {
      type: 'boolean',
    },
    maxKnowledgeAbbreviation: {
      type: 'integer',
    },
    maxKnowledgeAbbreviationIsOnlyNumbers: {
      type: 'boolean',
    },
    subjectsFirstDigit: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    subjectsDigits: {
      type: 'integer',
      options: {
        notNull: true,
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};