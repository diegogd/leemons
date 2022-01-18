const add = require('../src/services/levelSchemas/add');
const get = require('../src/services/levelSchemas/get');
// const getNames = require('../src/services/levelSchemas/getNames');
const update = require('../src/services/levelSchemas/update');
const deleteLS = require('../src/services/levelSchemas/delete');
const list = require('../src/services/levelSchemas/list');
const setNames = require('../src/services/levelSchemas/setNames');
const setDescriptions = require('../src/services/levelSchemas/setDescriptions');
const setParent = require('../src/services/levelSchemas/setParent');
const setIsSubject = require('../src/services/levelSchemas/setIsSubject');

module.exports = {
  add,
  get,
  //   getNames,
  update,
  delete: deleteLS,
  list,
  setNames,
  setDescriptions,
  setParent,
  setIsSubject,
};