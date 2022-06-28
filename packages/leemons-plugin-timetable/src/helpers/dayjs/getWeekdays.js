const dayjs = require('dayjs');
dayjs.extend(require('dayjs/plugin/localeData'));

module.exports = async function getWeekdays(locale = 'en') {
  return dayjs()
    .locale(locale)
    .localeData()
    .weekdays()
    .map((day) => day.toLowerCase());
};
