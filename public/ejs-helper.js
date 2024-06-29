const moment = require('moment');

module.exports = {
  formatDate: (date) => {
    return moment(date).format('YYYY-MM-DD');
  },
  findValue: (items, itemId, field) => {
    const item = items.find(val => val.item_id === itemId && val[field]);
    return item ? item[field] : '';
  },
};