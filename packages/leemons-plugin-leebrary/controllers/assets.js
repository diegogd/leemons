const { isEmpty, isString } = require('lodash');
const { CATEGORIES } = require('../config/constants');
const { add } = require('../src/services/assets/add');
const { update } = require('../src/services/assets/update');
const { duplicate } = require('../src/services/assets/duplicate');
const { remove } = require('../src/services/assets/remove');
const { getByUser } = require('../src/services/assets/getByUser');
const { search: getByCriteria } = require('../src/services/search');
const { getByCategory } = require('../src/services/permissions/getByCategory');
const { getByIds } = require('../src/services/assets/getByIds');
const { getByAsset: getPermissions } = require('../src/services/permissions/getByAsset');
const { getUsersByAsset } = require('../src/services/permissions/getUsersByAsset');
const canAssignRole = require('../src/services/permissions/helpers/canAssignRole');
const { getById: getCategory } = require('../src/services/categories/getById');

async function setAsset(ctx) {
  const { id } = ctx.params;
  const { categoryId, tags, file: assetFile, cover: assetCover, ...assetData } = ctx.request.body;
  const filesData = ctx.request.files;
  const { userSession } = ctx.state;

  if (isEmpty(categoryId)) {
    throw new global.utils.HttpError(400, 'Category is required');
  }

  const category = await getCategory(categoryId);

  let file;
  let cover;

  // Media files
  if (category.key === CATEGORIES.MEDIA_FILES) {
    if (!filesData && !assetFile) {
      throw new global.utils.HttpError(400, 'No file was uploaded');
    }

    if (filesData?.files) {
      const files = filesData.files.length ? filesData.files : [filesData.files];

      if (files.length > 1) {
        throw new global.utils.HttpError(501, 'Multiple file uploading is not enabled yet');
      }

      [file] = files;
    } else {
      file = assetFile;
    }

    cover = filesData?.cover || assetCover || assetData.coverFile;
  }
  // Bookmarks
  else if (category.key === CATEGORIES.BOOKMARKS) {
    cover = assetCover || filesData?.cover || assetData.coverFile;
  }

  // ES: Preparamos las Tags en caso de que lleguen como string
  // EN: Prepare the tags in case they come as string
  let tagValues = tags || [];

  if (isString(tagValues)) {
    tagValues = tagValues.split(',');
  }

  let asset;

  if (id) {
    asset = await update.call(
      { calledFrom: leemons.plugin.prefixPN('') },
      { ...assetData, id, category, categoryId, cover, file, tags: tagValues },
      { userSession }
    );
  } else {
    asset = await add.call(
      { calledFrom: leemons.plugin.prefixPN('') },
      { ...assetData, category, categoryId, cover, file, tags: tagValues },
      { userSession }
    );
  }

  const { role } = await getPermissions(asset.id, { userSession });

  let assetPermissions = await getUsersByAsset(asset.id, { userSession });
  assetPermissions = assetPermissions.map((user) => {
    const item = { ...user };
    item.editable = canAssignRole(role, item.permissions[0], item.permissions[0]);
    return item;
  });

  ctx.status = 200;
  ctx.body = { status: 200, asset: { ...asset, canAccess: assetPermissions } };
}

async function removeAsset(ctx) {
  const { id } = ctx.params;
  const { userSession } = ctx.state;

  const deleted = await remove(id, { userSession });
  ctx.status = 200;
  ctx.body = {
    status: 200,
    deleted,
  };
}

async function duplicateAsset(ctx) {
  const { id: assetId } = ctx.params;
  const { userSession } = ctx.state;

  const asset = await duplicate.call({ calledFrom: leemons.plugin.prefixPN('') }, assetId, {
    userSession,
  });
  ctx.status = 200;
  ctx.body = {
    status: 200,
    asset,
  };
}

async function getAsset(ctx) {
  const { id: assetId } = ctx.params;
  const { userSession } = ctx.state;

  const [asset] = await getByIds(assetId, { withFiles: true, checkPermissions: true, userSession });

  if (!asset) {
    throw new global.utils.HttpError(400, 'Asset not found');
  }

  const { role: assignerRole, permissions } = await getPermissions(assetId, { userSession });

  if (!permissions?.view) {
    throw new global.utils.HttpError(401, 'Unauthorized to view this asset');
  }

  let assetPermissions = false;

  if (permissions?.edit) {
    assetPermissions = await getUsersByAsset(assetId, { userSession });
    assetPermissions = assetPermissions.map((user) => {
      const item = { ...user };
      item.editable = canAssignRole(assignerRole, item.permissions[0], item.permissions[0]);
      return item;
    });
  }

  ctx.status = 200;
  ctx.body = {
    status: 200,
    asset: { ...asset, canAccess: assetPermissions },
  };
}

async function getAssets(ctx) {
  const { category, criteria, type, published, preferCurrent } = ctx.request.query;
  const { userSession } = ctx.state;

  if (isEmpty(category)) {
    throw new global.utils.HttpError(400, 'Not category was specified');
  }

  let assets;
  const assetPublished = ['true', true, '1', 1].includes(published);

  if (!isEmpty(criteria) || !isEmpty(type)) {
    assets = await getByCriteria(
      { category, criteria, type },
      { published: assetPublished, preferCurrent, userSession }
    );
  } else {
    assets = await getByCategory(category, {
      published: assetPublished,
      preferCurrent,
      userSession,
    });
  }

  ctx.status = 200;
  ctx.body = {
    status: 200,
    assets,
  };
}

async function getAssetsByIds(ctx) {
  const { userSession } = ctx.state;
  const {
    assets: assetIds,
    filters: { published },
  } = ctx.request.body;

  if (isEmpty(assetIds)) {
    throw new global.utils.HttpError(400, 'Not assets was specified');
  }

  const assets = await getByIds(assetIds, {
    withFiles: true,
    checkPermissions: true,
    published,
    userSession,
  });

  ctx.status = 200;
  ctx.body = {
    status: 200,
    assets,
  };
}

async function myAssets(ctx) {
  const { userSession } = ctx.state;
  const assets = await getByUser(userSession.id);
  ctx.status = 200;
  ctx.body = { status: 200, assets };
}

/**
 * Get URL metadata
 * @param {*} ctx
 */
async function getUrlMetadata(ctx) {
  const { url } = ctx.request.query;
  if (isEmpty(url)) {
    throw new global.utils.HttpError(400, 'url is required');
  }
  const { body: html } = await global.utils.got(url);
  const metas = await global.utils.metascraper({ html, url });

  ctx.status = 200;
  ctx.body = { status: 200, metas };
}

module.exports = {
  add: setAsset,
  update: setAsset,
  remove: removeAsset,
  duplicate: duplicateAsset,
  my: myAssets,
  get: getAsset,
  list: getAssets,
  listByIds: getAssetsByIds,
  urlMetadata: getUrlMetadata,
};
