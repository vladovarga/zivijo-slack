// spusta sa hned po builde. Skontroluje ci appka ma vsetko potrebne pre beh

const constants = require('./constants');

const fs = require('fs');

if (!fs.existsSync(constants.cestaMeninyCsv)) {
    const msg = "Skript nevidi CSV subor s menami podla kalendara!";
    console.log(msg, constants.cestaMeninyCsv);console.error(msg, constants.cestaMeninyCsv);
    process.exit(1);
}

console.log("CSV subor s menami podla kalendara najdeny", constants.cestaMeninyCsv);

console.log("Testy zbehli v poriadku.");