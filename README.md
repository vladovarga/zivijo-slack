# Živijó!

Slack bot/cron. Vie zbiehat v pravidelnom intervale.
- zisti si, kto ma v dany den meniny a posle to ako spravu do slack channelu.
- ak niekto z uzivatelov channelu ma v dany den meniny, zagratuluje mu a tagne ho.
- ak niekto z uzivatelov channelu ma v dany den narodeniny, zagratuluje mu a tagne ho.

Zoznam mien ako aj zoznam narodenin sa beru z prilozenych .csv suborov. Example .csv suboru pre narodeniny je definovany v ../csv/narodeniny.example.csv

Zoznam mien pouzity odtialto - https://github.com/chovajsa/menny-kalendar-sk

## Konfiguracne parametre

Parametre su definovane ako env premenne. Je mozne zadefinovat ich priamo na prostredi alebo pomocou .env suboru. Niektore default parametre su definovane v .env.defaults

* ZIVIJO_SLACK_TOKEN - slack token potrebny na pripojenie do workspace. Required.
* ZIVIJO_CRON_EXPRESSION - definuje cron expression ako casto a kedy sa ma bot spustit. Premenna sa pouzije len v pripade ze sa bot spusta cez cron-wrapper.js    
* ZIVIJO_CHANNEL - meno channelu, do ktoreho bude bot postovat. (bez hashtagu)
* ZIVIJO_CSV_MENINY - cesta k .csv suboru so zoznamom mien podla kalendara.
* ZIVIJO_CSV_NARODENINY - cesta k .csv suboru so zoznamom narodenin.
* ZIVIJO_IKONKY - ikonky ktore budu reprezentovat bota pri posielani spravy
* ZIVIJO_APP_PORT - port na ktorom bude pocuvat server ktory obsluhuje slack bota
* ZIVIJO_CRON_PORT - port na ktorom bude pocuvat server pre spustenie cron jobu
* ZIVIJO_SLACK_SIGNING_SECRET - secret na overovanie podpisov