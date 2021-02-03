// spusta sa tesne pred behom appky //
async function run() {
    require('dotenv-defaults').config();

    let errors = [];        // pole s pripadnymi chybami

    if (!process.env.ZIVIJO_SLACK_TOKEN) {
        errors.push({
            "message": "Nie je definovana ZIVIJO_SLACK_TOKEN env premenna!",
            "info": null
        });
    } else {
        console.log("Slack token nastaveny", process.env.ZIVIJO_SLACK_TOKEN.substr(0, 8) + "******" + process.env.ZIVIJO_SLACK_TOKEN.substr(-4) );
    }

    const fs = require('fs');

    if (!fs.existsSync(process.env.ZIVIJO_CSV_NARODENINY)) {
        errors.push({
            "message": "Skript nevidi CSV subor s narodeninami!",
            "info": process.env.ZIVIJO_CSV_NARODENINY
        });
    } else {
        console.log("CSV subor s narodeninami najdeny", process.env.ZIVIJO_CSV_NARODENINY);
    }

    const { WebClient } = require('@slack/web-api');
    const web = new WebClient(process.env.ZIVIJO_SLACK_TOKEN);

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