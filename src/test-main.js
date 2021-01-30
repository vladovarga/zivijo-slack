// spusta sa tesne pred behom appky //
async function run() {
    const constants = require('./constants');
    let errors = [];        // pole s pripadnymi chybami

    if (!constants.slackToken) {
        errors.push({
            "message": "Nie je definovana ZIVIJO_SLACK_TOKEN env premenna!",
            "info": null
        });
    } else {
        console.log("Slack token nastaveny", constants.slackToken.substr(0, 8) + "******" + constants.slackToken.substr(-4) );
    }

    const fs = require('fs');

    if (!fs.existsSync(constants.cestaNarodeninyCsv)) {
        errors.push({
            "message": "Skript nevidi CSV subor s narodeninami!",
            "info": constants.cestaNarodeninyCsv
        });
    } else {
        console.log("CSV subor s narodeninami najdeny", constants.cestaNarodeninyCsv);
    }

    const { WebClient } = require('@slack/web-api');
    const web = new WebClient(constants.slackToken);

    let webTestResult;

    try {
        // nova instancia bez tokenu, lebo inak sa mi token vrati v odpovedi a to nemozem printnut //
        const webTest = new WebClient();

        webTestResult = await webTest.api.test();

        console.log("API TEST", webTestResult);
    } catch (error) {
        errors.push({
            "message": "Nepodarilo sa spojit so Slack API pomocou tokenu!",
            "info": error
        });
    }

    try {
        webTestResult = await web.auth.test()

        console.log("AUTH TEST", webTestResult);
    } catch (error) {
        errors.push({
            "message": "Nepodarilo sa autentifikovat voci Slack API!",
            "info": error
        });
    }

    if (errors.length > 0) {
        const msg = "Testy NEZBEHLI v poriadku.";
        console.log(msg, errors);console.error(msg, errors);
        process.exit(1);
    } else {
        console.log("Testy zbehli v poriadku.");
    }
};

module.exports = {
  "run": run
};

run();