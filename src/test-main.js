// spusta sa tesne pred behom appky //
async function run() {
    const constants = require('./constants');

    if (!constants.slackToken) {
        const msg = "Nie je definovana ZIVIJO_SLACK_TOKEN env premenna!";
        console.log(msg);console.error(msg);
        process.exit(1);
    }

    console.log("Slack token nastaveny", constants.slackToken.substr(0, 8) + "******" + constants.slackToken.substr(-4) );

    const fs = require('fs');

    if (!fs.existsSync(constants.cestaNarodeninyCsv)) {
        const msg = "Skript nevidi CSV subor s narodeninami!";
        console.log(msg, constants.cestaNarodeninyCsv);console.error(msg, constants.cestaNarodeninyCsv);
        process.exit(1);
    }

    console.log("CSV subor s narodeninami najdeny", constants.cestaNarodeninyCsv);

    const { WebClient } = require('@slack/web-api');
    const web = new WebClient(constants.slackToken);

    (async function() {
        let webTestResult;

        try {
            // nova instancia bez tokenu, lebo inak sa mi token vrati v odpovedi a to nemozem printnut //
            const webTest = new WebClient();

            webTestResult = await webTest.api.test();
        } catch (error) {
            const msg = "Nepodarilo sa spojit so Slack API pomocou tokenu!";
            console.log(msg, error);console.error(msg, error);
            process.exit(1);
        }

        console.log("API TEST", webTestResult);

        try {
            webTestResult = await web.auth.test()
        } catch (error) {
            const msg = "Nepodarilo sa autentifikovat voci Slack API!";
            console.log(msg, error);console.error(msg, error);
            process.exit(1);
        }

        console.log("AUTH TEST", webTestResult);
    })();

    console.log("Testy zbehli v poriadku.");
};

module.exports = {
  "run": run
};

run();