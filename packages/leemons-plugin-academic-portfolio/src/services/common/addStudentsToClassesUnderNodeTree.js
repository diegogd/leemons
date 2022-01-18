const _ = require('lodash');
const { table } = require('../tables');
const { getClassesUnderNodeTree } = require('./getClassesUnderNodeTree');
const { addClassStudents } = require('../classes/addClassStudents');

async function addStudentsClassesUnderNodeTree(
  nodeTypes,
  nodeType,
  nodeId,
  students,
  { transacting: _transacting } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      const classes = await getClassesUnderNodeTree(nodeTypes, nodeType, nodeId, { transacting });
      return Promise.all(
        _.map(classes, (_class) =>
          addClassStudents({ class: _class.id, students }, { transacting })
        )
      );
    },
    table.class,
    _transacting
  );
}

module.exports = { addStudentsClassesUnderNodeTree };