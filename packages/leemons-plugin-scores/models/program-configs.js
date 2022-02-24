module.exports = {
  modelName: 'program-configs',
  collectionName: 'program-configs',
  options: {
    useTimestamps: true,
  },
  attributes: {
    program: {
      references: {
        collection: 'plugins_academic-portfolio::programs',
      },
    },
    period: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    periodFinal: {
      type: 'string',
    },
    teacherCanAddCustomAvgNote: {
      type: 'boolean',
      options: {
        defaultTo: false,
      },
    },
    teacherReminderPeriod: {
      type: 'string',
    },
    teacherReminderNumberOfPeriods: {
      type: 'integer',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
