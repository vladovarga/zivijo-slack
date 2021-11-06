require('dotenv-defaults').config();

const main = require('../core/main');
const cron = require('node-cron');

console.log('Pouzity cron expression', process.env.ZIVIJO_CRON_EXPRESSION);

const validateOutput = cron.validate(process.env.ZIVIJO_CRON_EXPRESSION);

if (!validateOutput) {
    const msg = "Cron expression nie je validny!";
    console.log(msg, process.env.ZIVIJO_CRON_EXPRESSION);console.error(msg, process.env.ZIVIJO_CRON_EXPRESSION);
    process.exit(1);
}

console.log('Cron expression validny');

// vsetko v poriadku => pustam cron //

cron.schedule(process.env.ZIVIJO_CRON_EXPRESSION, () => {
    console.log('Spustam cron job');

    main.run();
}, {
    timezone: "Europe/Bratislava"
});

const express = require('express');

const app = express();

/*
 * healthz
 */
app.get('/healthz', (req, res) => {
  res.send('<h2>Cron server bezi.</h2>');
});

/*
 * samotny cron
 */
app.get('/', async (req, res) => {
  console.log('Spustam cron job');
  
  await main.run();
  
  // vratim prazdny 200 response
  return res.send('Vsetko zbehlo v poriadku.');
});

const server = app.listen(process.env.ZIVIJO_CRON_PORT, () => {
  console.log('Cron server pocuva na porte %d in %s mode', server.address().port, app.settings.env);
});