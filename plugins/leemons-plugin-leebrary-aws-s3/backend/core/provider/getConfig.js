/**
 * This function retrieves the first configuration object from the database.
 * If no configuration objects are found, it returns null.
 *
 * @param {Object} params - The parameters object.
 * @param {MoleculerContext} params.ctx - The Moleculer context, used to interact with the database.
 * @returns {Promise<Object|null>} The first configuration object from the database, or null if no configurations are found.
 */
async function getConfig({ ctx } = {}) {
  let configs = [];
  if (
    process.env.AWS_REGION &&
    process.env.AWS_ACCESS_KEY &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_S3_BUCKET
  ) {
    configs = [
      {
        id: 'aws-ses',
        deploymentID: ctx.meta.deploymentID,
        bucket: process.env.AWS_S3_BUCKET,
        region: process.env.AWS_REGION,
        accessKey: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    ];
  } else {
    configs = await ctx.tx.db.Config.find({}).lean();
  }
  if (configs.length > 0) return configs[0];
  return null;
}

module.exports = { getConfig };
