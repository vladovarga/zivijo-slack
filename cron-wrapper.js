const cron = require('node-cron');
const fs = require('fs');

const constants = require('./constants');
const main = require('./main');

// skontrolujem prerekvizity: slack token, pritomnost csv suboru

if (!constants.slackToken) {
    const msg = "Nie je definovana SLACK_TOKEN env premenna!";
    console.log(msg);console.error(msg);
    process.exit(1);
}

if (!fs.existsSync(constants.cestaMeninyCsv)) {
    const msg = "Skript nevidi CSV subor s menami podla kalendara!";
    console.log(msg, constants.cestaMeninyCsv);console.error(msg, constants.cestaMeninyCsv);
    process.exit(1);
}

if (!fs.existsSync(constants.cestaNarodeninyCsv)) {
    const msg = "Skript nevidi CSV subor s narodeninami!";
    console.log(msg, constants.cestaNarodeninyCsv);console.error(msg, constants.cestaNarodeninyCsv);
    process.exit(1);
}

// vsetko v poriadku => pustam cron //

cron.schedule(constants.cronExpression, () => {
    console.log('Spustam cron');

    main.run();
}, {
    timezone: "Europe/Bratislava"
});