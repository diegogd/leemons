async function updateConfigEvent(config, event) {
  return leemons.api(
    {
      url: 'calendar/configs/event/update',
      allAgents: true,
    },
    {
      method: 'POST',
      body: {
        config,
        event,
      },
    }
  );
}

export default updateConfigEvent;
