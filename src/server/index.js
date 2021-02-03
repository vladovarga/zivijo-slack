require('dotenv-defaults').config();

const express = require('express');
const bodyParser = require('body-parser');
const signature = require('./verifySignature');

const main = require('../core/main');
const noTag = require('../core/no-tag');

const app = express();

/*
 * Parse application/x-www-form-urlencoded && application/json
 * Use body-parser's `verify` callback to export a parsed raw body
 * that you need to use to verify the signature
 */
const rawBodyBuffer = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
};

app.use(bodyParser.urlencoded({ verify: rawBodyBuffer, extended: true }));
app.use(bodyParser.json({ verify: rawBodyBuffer }));

/*
 * healthz
 */
app.get('/healthz', (req, res) => {
  res.send('<h2>Server bezi.</h2>');
});

/*
 * Endpoint ktory pocuva na slash commandy zo slacku.
 * Skontroluje verifikacny token a odpovie na prikaz.
 */
app.post('/command', async (req, res) => {
  console.log("Prisiel mi post command: ", req.body);

  if (!signature.isVerified(req)) {
    // verifikujem podpis
    console.error('Neverifikovaný podpis!');
    return res.status(404).send();
  }

  // vytiahnem text prikazu
  const { text } = req.body;

  console.log(text);

  if (text == "verzia") {
    // ak si pyta verziu, vratim ju a skoncim
    return res.send(process.env.npm_package_version);
  } else if (text == "zomri") {
    // treba to killnut
    res.send(":skull_and_crossbones: Zomieram...");
    process.exit(1);
  } else if (text == "spusti") {
    // spustim hlavnu proceduru na vyprintovanie menin, narodenin, ...
    res.send("Spustam...");
    
    main.run();
    return;
  } else if (text == "zakaz") {
    // zapisem uzivatela na no-tag zoznam
    
    if (noTag.zapisNaZoznam(req.body.user_id)) {
      res.send("Zapisal som si Ta na zoznam :(");
    } else {
      res.send("Nepodarilo sa mi Ta zapisat na zoznam :worried:");
    }
    return;
  } else if (text == "povol") {
    // odmazem uzivatela z no-tag zoznamu
    if (noTag.odstranZoZoznamu(req.body.user_id)) {
      res.send("Hned ako sa bude dat tak Ti gratulujem :)");
    } else {
      res.send("Nepodarilo sa mi ta vyhodit zo zoznamu :worried:");
    }
    
    return;
  }

  // vratim prazdny 200 response
  return res.send('');
});

const server = app.listen(process.env.ZIVIJO_APP_PORT, () => {
  console.log('Bot server pocuva na porte %d in %s mode', server.address().port, app.settings.env);
});