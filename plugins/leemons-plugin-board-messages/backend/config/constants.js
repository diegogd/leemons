const permissionsPrefix = 'board-messages';

const permissionNames = {
  boardMessages: `${permissionsPrefix}.board-messages`,
};

const permissions = [
  {
    permissionName: permissionNames.boardMessages,
    actions: ['view', 'update', 'create', 'delete', 'admin'],
    localizationName: {
      es: 'Mensajes personales',
      en: 'Board messages',
    },
  },
];

const menuItems = [
  // Main
  {
    item: {
      key: 'boardMessages',
      order: 101,
      url: '/private/board-messages/list',
      iconSvg: '/public/board-messages/menu-icon.svg',
      activeIconSvg: '/public/board-messages/menu-icon-active.svg',
      label: {
        es: 'Mensajes personales',
        en: 'Board messages',
      },
    },
    permissions: [
      {
        permissionName: permissionNames.boardMessages,
        actionNames: ['view', 'admin'],
      },
    ],
  },
];

const widgets = {
  items: [
    // ---- Dashboard
    {
      zoneKey: 'dashboard.program.left',
      key: `${permissionsPrefix}.dashboard`,
      url: 'dashboard/index',
    },
    {
      zoneKey: `assignables.class.ongoing`,
      key: `${permissionsPrefix}.class-dashboard`,
      url: 'class-dashboard/index',
      properties: {
        noPadding: true,
      },
    },
  ],
};

module.exports = {
  pluginName: permissionsPrefix,
  permissions: {
    permissions,
    names: permissionNames,
  },
  menuItems,
  widgets,
};
