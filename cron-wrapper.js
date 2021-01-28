const cron = require('node-cron');

const constants = require('./constants');
const main = require('./main');

// vsetko v poriadku => pustam cron //

cron.schedule(constants.cronExpression, () => {
    console.log('Spustam cron');

    main.run();
}, {
    timezone: "Europe/Bratislava"
});