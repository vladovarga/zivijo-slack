// zakladne konstanty //

module.exports = {
    // cron expression kedy pustat bota
    // cronExpression: pohladajEnv("ZIVIJO_CRON_EXPRESSION", '0 7 * * *'),
    cronExpression: pohladajEnv("ZIVIJO_CRON_EXPRESSION", '*/10 * * * * *'),
    
    // slack token pre appku
    slackToken: pohladajEnv("ZIVIJO_SLACK_TOKEN"),
    
    // channel do ktoreho bude bo postovat
    slackChannel: pohladajEnv("ZIVIJO_CHANNEL", '#general'),
    
    // cesta k CSV suboru so zoznamom mien podla kalendara
    cestaMeninyCsv: pohladajEnv("ZIVIJO_CSV_MENINY", 'src/csv/kalendar.mien.csv'),

    // cesta k CSV suboru so zoznamom narodenin jumpakov
    cestaNarodeninyCsv: pohladajEnv("ZIVIJO_CSV_NARODENINY", 'src/csv/narodeniny.csv'),

    ikonkyPreBota: [':champagne:', ':tada:', ':clinking_glasses:', ':confetti_ball:',':gift:'],
};

/**
 * Prezrie env premennu a ak najde pozadovanu premennu, tak ju vrati. Inak vrati default.
 * @param {string} kluc - kluc env premennej
 * @param {string} defaultHodnota - default hodnota ak nenajde env premennu
 * @return {string} hodnota premennej
 */
function pohladajEnv(kluc, defaultHodnota) {
    if (process.env[kluc]) {
        return process.env[kluc];
    } else {
        if (!defaultHodnota) {
            console.error("Nie je definovana default hodnota pre premennu: ", kluc);
        }
        return defaultHodnota;
    }
}