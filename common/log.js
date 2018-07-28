const log4js = require('log4js');
log4js.configure({
    appenders: { travel: { type: 'file', filename: 'travel.log' } },
    categories: { default: { appenders: ['travel'], level: 'info' } }
  });
