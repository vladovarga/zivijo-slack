const cron = require('node-cron');

const constants = require('./constants');
const main = require('./main');

console.log('Pouzity cron expression', constants.cronExpression);

const validateOutput = cron.validate(constants.cronExpression);

if (!validateOutput) {
    const msg = "Cron expression nie je validny!";
    console.log(msg, constants.cronExpression);console.error(msg, constants.cronExpression);
    process.exit(1);
}

console.log('Cron expression validny');

// vsetko v poriadku => pustam cron //

cron.schedule(constants.cronExpression, () => {
    console.log('Spustam cron job');

    main.run();
}, {
    timezone: "Europe/Bratislava"
});