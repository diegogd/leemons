/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');

const path = require('path');
const { addLocalesDeploy } = require('leemons-multilanguage');
const { addPermissionsDeploy } = require('leemons-permissions');
const { addWidgetZonesDeploy, addWidgetItemsDeploy } = require('leemons-widgets');
const { LeemonsMultiEventsMixin } = require('leemons-multi-events');
const { addMenuItemsDeploy } = require('leemons-menu-builder');
const { widgets, permissions, menuItems } = require('../config/constants');
const { getServiceModels } = require('../models');

/** @type {ServiceSchema} */
module.exports = () => ({
  name: 'academic-portfolio.deploy',
  version: 1,
  mixins: [
    LeemonsMultiEventsMixin(),
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsDeploymentManagerMixin(),
  ],
  multiEvents: [
    {
      events: ['menu-builder.init-main-menu', 'academic-portfolio.init-permissions'],
      handler: async (ctx) => {
        const [mainMenuItem, ...otherMenuItems] = menuItems;
        await addMenuItemsDeploy({
          keyValueModel: ctx.tx.db.KeyValue,
          item: mainMenuItem,
          ctx,
        });
        ctx.tx.emit('init-menu');
        await addMenuItemsDeploy({
          keyValueModel: ctx.tx.db.KeyValue,
          item: otherMenuItems,
          ctx,
        });
        ctx.tx.emit('init-submenu');
      },
    },
  ],
  events: {
    'deployment-manager.install': async (ctx) => {
      // TODO migration: ESTA PARTE DEL CÓDIGO CREEMOS QUE NO DEBERÍA LANZARSE AL INICIAR EL DEPLOY SINO CUANDO SE RECIBIERA UN DETERMINADO EVENTO
      //! Ya que es necesario tener unos perfiles (estudiante y profesor) que solo se generan el el proceso de creación del superAdmin desde frontend en la instanción

      // ! depende de users.permissions.addCustomPermissionToUserAgentx

      /* LO COMENTAMOS PARA PODER SEGUIR
        const {
          syncProgramProfilePermissionsIfNeed,
          // eslint-disable-next-line global-require
        } = require('../core/classes/__update__/syncProgramProfilePermissionsIfNeed');
        await syncProgramProfilePermissionsIfNeed({ ctx });
      */

      // Register widget zone
      await addWidgetZonesDeploy({ keyValueModel: ctx.tx.db.KeyValue, zones: widgets.zones, ctx });

      // Locales
      await addLocalesDeploy({
        keyValueModel: ctx.tx.db.KeyValue,
        locale: ['es', 'en'],
        i18nPath: path.resolve(__dirname, `../i18n/`),
        ctx,
      });
    },
    'multilanguage.newLocale': async (ctx) => {
      await addLocalesDeploy({
        keyValueModel: ctx.tx.db.KeyValue,
        locale: ctx.params.code,
        i18nPath: path.resolve(__dirname, `../i18n/`),
        ctx,
      });
      return null;
    },
    // Widget items
    'dashboard.init-widget-zones': async (ctx) => {
      await addWidgetItemsDeploy({ keyValueModel: ctx.tx.db.KeyValue, items: widgets.items, ctx });
    },
    // Permissions
    'users.init-permissions': async (ctx) => {
      await addPermissionsDeploy({
        keyValueModel: ctx.tx.db.KeyValue,
        permissions: permissions.permissions,
        ctx,
      });
    },

    // TODO migration: Este es el evento que debería lanzar users cuando crea los perfiles y entonces sí poder hacer syncProgramProfilePermissionsIfNeeded
    /*
    'users.create-initial-profiles': async (ctx) => {
      const {
        syncProgramProfilePermissionsIfNeed,
        // eslint-disable-next-line global-require
      } = require('../core/classes/__update__/syncProgramProfilePermissionsIfNeed');
      // ! depende de users.permissions.addCustomPermissionToUserAgentx
      await syncProgramProfilePermissionsIfNeed({ ctx });
    },
    */
  },
  created() {
    mongoose.connect(process.env.MONGO_URI);
  },
});
