// spusta sa hned po builde. Skontroluje ci appka ma vsetko potrebne pre beh

async function run() {
    require('dotenv-defaults').config();

    const testType = "BUILD";

    const fs = require('fs');

    let errors = [];

    if (!fs.existsSync(process.env.ZIVIJO_CSV_MENINY)) {    
        const msg = "Skript nevidi CSV subor s menami podla kalendara!";
        console.log(msg, "'"+process.env.ZIVIJO_CSV_MENINY+"'");console.error(msg, "'"+process.env.ZIVIJO_CSV_MENINY+"'");
        process.exit(1);
    } else {   
        console.log("CSV subor s menami podla kalendara najdeny", process.env.ZIVIJO_CSV_MENINY);
    }

    if (errors.length > 0) {
        const msg = testType + " testy NEZBEHLI v poriadku.";
        console.log(msg, errors);console.error(msg, errors);
        process.exit(1);
    } else {
        console.log(testType + " testy zbehli v poriadku.");
    }
};

module.exports = {
  "run": run
};

run();