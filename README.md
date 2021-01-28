# Živijó!

Slack bot/cron. Vie zbiehat v pravidelnom intervale.
- zisti si, kto ma v dany den meniny a posle to ako spravu do slack channelu.
- ak niekto z uzivatelov channelu ma v dany den meniny, zagratuluje mu a tagne ho.
- ak niekto z uzivatelov channelu ma v dany den narodeniny, zagratuluje mu a tagne ho.

Zoznam mien ako aj zoznam narodenin sa beru z prilozenych .csv suborov. Example .csv suboru pre narodeniny je definovany v ../csv/narodeniny.example.csv

Zoznam mien pouzity odtialto - https://github.com/chovajsa/menny-kalendar-sk

# Konfiguracne parametre

Parametre potrebne pre beh skriptu su definovane v subore constants.js.

Appka hlada nasledovne nastavenia v env premennych: 

ZIVIJO_SLACK_TOKEN - slack token potrebny na pripojenie do workspace. Required.

ZIVIJO_CRON_EXPRESSION - definuje cron expression ako casto a kedy sa ma bot spustit. Je optional. Default je '0 7 * * *' (tj o 7:00 rano). Premenna sa pouzije len v pripade ze sa bot spusta cez cron-wrapper.js
    
ZIVIJO_CHANNEL - meno channelu, do ktoreho bude bot postovat. Je optional, default je '#general'
    
ZIVIJO_CSV_MENINY - cesta k .csv suboru so zoznamom mien podla kalendara. Je optional, default je '../csv/kalendar.mien.csv'

ZIVIJO_CSV_NARODENINY - cesta k .csv suboru so zoznamom narodenin. Je optional, default je '../csv/narodeniny.csv'