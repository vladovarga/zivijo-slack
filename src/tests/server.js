// spusta sa tesne pred behom appky //
async function run() {
    require('dotenv-defaults').config();

    let errors = [];        // pole s pripadnymi chybami

    if (!process.env.ZIVIJO_SLACK_SIGNING_SECRET) {
        errors.push({
            "message": "Nie je definovana ZIVIJO_SLACK_SIGNING_SECRET env premenna!",
            "info": null
        });
    } else {
        console.log("ZIVIJO_SLACK_SIGNING_SECRET nastaveny", process.env.ZIVIJO_SLACK_SIGNING_SECRET.substr(0, 4) + "******" + process.env.ZIVIJO_SLACK_SIGNING_SECRET.substr(-4) );
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