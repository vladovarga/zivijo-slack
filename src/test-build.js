// spusta sa hned po builde. Skontroluje ci appka ma vsetko potrebne pre beh

async function run() {
    const constants = require('./constants');

    const fs = require('fs');

    let errors = [];

    if (!fs.existsSync(constants.cestaMeninyCsv)) {    
        const msg = "Skript nevidi CSV subor s menami podla kalendara!";
        console.log(msg, "'"+constants.cestaMeninyCsv+"'");console.error(msg, "'"+constants.cestaMeninyCsv+"'");
        process.exit(1);
    } else {   
        console.log("CSV subor s menami podla kalendara najdeny", constants.cestaMeninyCsv);
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