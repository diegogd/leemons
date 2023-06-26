const { mongoose, newModel } = require('leemons-mongodb');

const commonSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    deploymentID: {
      type: String,
      required: true,
      index: true,
    },
    key: {
      type: String,
      required: true,
      index: true,
    },
    locale: {
      type: String,
      required: true,
      index: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const commonModel = newModel(mongoose.connection, 'multilanguage_Common', commonSchema);

module.exports = { commonModel };
