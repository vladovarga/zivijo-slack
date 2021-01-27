// zakladne konstanty //

module.exports = {
    cronExpression: '*/10 * * * * *',          // cron expression kedy pustat bota
    slackToken: process.env.SLACK_TOKEN,       // slack token pre appku
    slackChannel: '#general',                  // channel do ktoreho bude bo postovat
    cestaMeninyCsv: 'kalendar.mien.csv',       // cesta k CSV suboru so zoznamom mien podla kalendara
    cestaNarodeninyCsv: 'narodeniny.csv',      // cesta k CSV suboru so zoznamom narodenin jumpakov

    ikonkyPreBota: [':champagne:', ':tada:', ':clinking_glasses:', ':confetti_ball:',':gift:'],
};