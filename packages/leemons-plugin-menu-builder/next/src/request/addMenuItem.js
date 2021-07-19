async function addMenuItem(body) {
  return leemons.api(
    {
      url: 'menu-builder/menu/:key/add-item',
      query: {
        key: body.menuKey,
      },
    },
    { method: 'POST', body }
  );
}

export default addMenuItem;