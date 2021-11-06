async function run() {

  require('dotenv-defaults').config();

  const { WebClient } = require('@slack/web-api');

  const parse = require('csv-parse/lib/sync')
  const fs = require('fs');
  
  const noTag = require('./no-tag');
  
  const removeDiacritics = require('diacritics').remove;

  const web = new WebClient(process.env.ZIVIJO_SLACK_TOKEN);

  // nachystam si dnesny datum v strukturovanej podobe //
  const dnesnyDatum = new Date().toISOString().split('T')[0];
  const dnesnyDen = dnesnyDatum.split("-")[2];
  const dnesnyMesiac = dnesnyDatum.split("-")[1];

  console.log("dnesnyDatum, dnesnyDen, dnesnyMesiac", dnesnyDatum, dnesnyDen, dnesnyMesiac);

  /**
   * Vrati random ikonku pre bota z definovaneho pola.
   * @return {string} kod emoji
   */
  function vyberIkonku() {
    // vyberem random

    const ikonkyPreBota = process.env.ZIVIJO_IKONKY.split(",");

    return ikonkyPreBota[Math.floor(Math.random() * ikonkyPreBota.length)];
  }

  /**
   * Metoda vrati pole mien, ktore dnes vo vseobecnosti oslavuju meniny.
   * @return {Array} Na vystupe je pole krstnych mien, ktore maju dnes meniny.
   */
  function ktoMaMeniny() {
    try {
      console.log(process.env.ZIVIJO_CSV_MENINY);
      // precitam CSV s menami podla datumu z disku //
      const csvAsString = fs.readFileSync(process.env.ZIVIJO_CSV_MENINY, 'utf8');

      // console.log("csvAsString", csvAsString);
      
      // naprasujem CSV //
      const records = parse(csvAsString, {
        columns: ['datum', 'mena'],
        skip_empty_lines: true,
        delimiter: ';',
        on_record: function(record, {lines}) {
          // data rovno prefiltrujem iba na dnesny den //
          // console.log(record, lines);

          if (record["datum"] == dnesnyMesiac + "-" + dnesnyDen) {
            // console.info("Toto je dnesny den");
            return record["mena"].split(",");
          } else {
            return null;
          }
        }
      });

      // console.log("records", records);

      if (records.length != 1) {
        // nenasiel som prave 1 dnesny den, a to je zle, jediny ze by bol novy rok alebo 1. sviatok vianocny //
        console.error("Nenasiel som prave jeden dnesny den v CSV zozname mien!", records, dnesnyDen, dnesnyMesiac);
        return [];
      }

      if (records[0].length == 0) {
        console.error("Dnesny den v CSV neobsahuje ziadne mena!", records, dnesnyDen, dnesnyMesiac);
        // return [];
        process.exit(1);
      }

      // vsetko OK, vraciam pole s menami //
      return records[0];
    } catch (error) {
      console.error("Nastala chyba pri parsovani CSV s menami podla dna!", error);
      process.exit(1);
    }
  }

  /**
   * Metoda ziska zoznam ludi, ktori su v channeli.
   * @return {Array} Na vystupe je pole slack ID ludi, ktorych sa to tyka.
   */
  async function precitajLudiZchannelu() {
    let conversationsListOutput, usersListOutput, result = [];

    try {
        // vyslistujem si zoznam vsetkych channelov (default su len public) //
        conversationsListOutput = await web.conversations.list({
            "exclude_archived": true,
            "types": 'public_channel,private_channel'
        });
    } catch (error) {
        const msg = "Nepodarilo sa dopytat zoznam channelov";
        console.log(msg, error);console.error(msg, error);
        // process.exit(1);
        return [];
    }

    if (!conversationsListOutput || conversationsListOutput.ok == false) {
        const msg = "Nepodarilo sa dopytat zoznam channelov";
        console.log(msg, error);console.error(msg, error);
        // process.exit(1);
        return [];
    }
    // console.log("conversationsListOutput", conversationsListOutput);

    const searchedChannel = conversationsListOutput.channels.find(channel => channel.name == process.env.ZIVIJO_SLACK_CHANNEL);

    // console.log("searchedChannel", searchedChannel);

    if (searchedChannel == undefined) {
        const msg = "Nenasiel som channel: '" + process.env.ZIVIJO_SLACK_CHANNEL + "'";
        console.log(msg);console.error(msg);
        process.exit(1);
    }

    try {
        // vyslistujem si zoznam vsetkych uzivatelov channela //
        usersListOutput = await web.conversations.members({
            "channel": searchedChannel.id
        });
    } catch (error) {
        const msg = "Nepodarilo sa dopytat zoznam ludi z channela";
        console.log(msg, searchedChannel.id, error);console.error(msg, searchedChannel.id, error);
        // process.exit(1);
        return [];
    }

    // console.log("usersListOutput", usersListOutput);
    
    if (!usersListOutput || usersListOutput.ok == false) {
      const msg = "Nepodarilo sa dopytat zoznam ludi z channela";
      console.log(msg, error);console.error(msg, error);
      // process.exit(1);
      return [];
    }

    let usersInfoOutput, i;

    // usersListOutput.members.forEach(async function(userID) {
    for (i = 0; i < usersListOutput.members.length; i++) {
        const userID = usersListOutput.members[i];

        try {
            // docitam si metainformacie k uzivatelom channela //
            usersInfoOutput = await web.users.info({
                "user": userID
            });
        } catch (error) {
            const msg = "Nepodarilo sa dociyat uzivatela na zaklade ID!";
            console.log(msg, userID, error);console.error(msg, userID, error);
            // process.exit(1);
            continue;
        }
        
        // console.log("usersInfoOutput", usersInfoOutput);

        if (!usersInfoOutput || usersInfoOutput.ok == false) {
          const msg = "Nepodarilo sa dociyat uzivatela na zaklade ID!";
          console.log(msg, error);console.error(msg, error);
          // process.exit(1);
          continue;
        }

        if (usersInfoOutput.user.deleted == true || usersInfoOutput.user.is_bot == true || usersInfoOutput.user.id == "USLACKBOT") {
          // ak je zmazany, alebo bot, alebo ... preskakujem
          // console.log("prekskaujem usera", user);
          continue;
        }

        result.push(usersInfoOutput.user);
    }

    return result;
  }

  /**
   * Znormalizuje meno - odstrani diakritiku a prevedie ho na male pismena.
   * @param {string} meno - neznormalizovane meno s diakritikou a velkymi pismenami
   * @return {string} znormalizovane meno bez diakritiky, vsetko malymi pismenami
   */
  function znormalizujMeno(meno) {
    // console.log("normalizujem meno", meno);

    if (meno == "" || meno == undefined) {
      console.error("Neprislo meno na znormalizovanie!", meno);
      return meno;
    }

    return removeDiacritics(meno).toLocaleLowerCase();
  }

  /**
   * Metoda vrati pole slack ID ludi z firmy, ktori maju dnes meniny.
   * @param {Array} dnesMajuMeniny - pole krstnych mien, ktore maju dnes vo vseobecnosti meniny.
   * @param {Array} ludiaZchannelu - pole ludi, ktori su v channeli
   * @return {Array} Na vystupe je pole slack ID ludi, ktorych sa to tyka.
   */
  function ktoZkolegovMaMeniny(dnesMajuMeniny, ludiaZchannelu) {
    if (!dnesMajuMeniny) {
      console.log("Dnes nema nikto meniny?", dnesMajuMeniny);
      return [];
    }

    // znormalizujem mena //
    const dnesMajuMeninyZnormalizovane = dnesMajuMeniny.map(function(meno){
      return znormalizujMeno(meno);
    });

    // console.log("dnesMajuMeninyZnormalizovane", dnesMajuMeninyZnormalizovane);

    let result = [];

    ludiaZchannelu.forEach(user => {
      // console.log("user", user);
      
      let attributeName = "real_name_normalized";

      if (!user.profile[attributeName].includes(" ")) {
        // mozno ma prehodene display a real name //
        attributeName = "display_name_normalized";
      }

      let splitOutput = user.profile[attributeName].split(" ");

      const meno = znormalizujMeno(splitOutput[0]);
      const priezvisko = znormalizujMeno(splitOutput[1]);

      if (dnesMajuMeninyZnormalizovane.indexOf(meno) != -1 || dnesMajuMeninyZnormalizovane.indexOf(priezvisko) != -1) {
        // tento uzivatel dnes oslavuje meniny
        result.push(user.id);
      }
    });

    // console.log("result", result);
    return result;
  }

  /**
   * Metoda vrati pole slack ID ludi z firmy, ktori maju dnes narodeniny.
   * @param {Array} ludiaZchannelu - pole ludi, ktori su v channeli
   * @return {Array} Na vystupe je pole slack ID ludi, ktorych sa to tyka.
   */
  function ktoZkolegovMaNarodeniny(ludiaZchannelu) {
    try {
      // precitam CSV s menami podla datumu z disku //
      const csvAsString = fs.readFileSync(process.env.ZIVIJO_CSV_NARODENINY, 'utf8');

      // console.log("csvAsString", csvAsString);
      
      // naprasujem CSV //
      const records = parse(csvAsString, {
        columns: ['email', 'datum-narodenia'],
        skip_empty_lines: true,
        delimiter: ',',
        on_record: function(record, {lines}) {
          // data rovno prefiltrujem iba na dnesny den //
          // console.log(record, lines);
          
          // splitnem datum narodenia ktore je v ISO forme //
          let splitOutput = record["datum-narodenia"].split("-");

          if ((splitOutput[1] == dnesnyMesiac) && (splitOutput[2] == dnesnyDen)) {
            // console.info("Toto je oslavenec", record);
            return record["email"];
          } else {
            return null;
          }
        }
      });

      const oslavenci = records;

      console.log("Dnes maju tito kolegovia narodeniny: ", oslavenci);

      if (oslavenci.length == 0) {
        console.info("Dnes nemal nikto narodky :( ");
        return [];
      }
      
      let result = [];

      ludiaZchannelu.forEach(user => {
        // preiterujem uzivatelov z channelu a najdem oslavencov podla emailu //
        if (oslavenci.indexOf(user.profile.email) != -1) {
          // odlozim si slack ID tohoto oslavenca //
          result.push(user.id);
        }
      });

      if (oslavenci.length != result.length) {
        console.warn("Nepodarilo sa mi najst kazdeho oslavenca v channeli!", oslavenci);
      }

      return result;
    } catch (error) {
      console.error("Nastala chyba pri parsovani CSV s datumami narodenin!", error);
      process.exit(1);
    }
  }

  /**
   * Vytvori telo spravy, ktora sa posled do channelu.
   * @param {Array} dnesMajuMeniny - pole mien pre dnesny den
   * @param {Array} kolegoviaMeniny - pole slack ID kolegov, ktori maju dnes meniny
   * @param {Array} kolegoviaNarodeniny - pole slack ID kolegov, ktori maju dnes narodeniny
   * @return {string} Telo slack spravy, ktora sa odosle.
   */
  function buildMessageText(dnesMajuMeniny, kolegoviaMeniny, kolegoviaNarodeniny) {
    let result;

    // console.log("kolegoviaMeniny", kolegoviaMeniny);
    const noTagZoznam = noTag.vratZoznam();
    
    // vyfiltrujem uzivatelov o tych ktori nechcu byt tagnuti //

    let vyfiltrovaniKolegoviaMeniny = kolegoviaMeniny.filter(function(item) {
      if (noTagZoznam.indexOf(item) != -1) {
        // ak je na noTag zozname => nevratim ho //
        return false;
      } else {
        return true;
      }
    });
    
    let vyfiltrovaniKolegoviaNarodeniny = kolegoviaNarodeniny.filter(function(item) {
      if (noTagZoznam.indexOf(item) != -1) {
        // ak je na noTag zozname => nevratim ho //
        return false;
      } else {
        return true;
      }
    });

    // vseobecna hlaska o meninach //
    if (dnesMajuMeniny.length > 1) {
      result = "Dnes majú meniny " + dnesMajuMeniny.slice(0, -1).join(', ') +' a ' + dnesMajuMeniny.slice(-1);
    } else {
      // prave 1 clovek ma meniny //
      result = "Dnes má meniny " + dnesMajuMeniny;
    }

    // konkretni ludia z firmy meniny //
    if (vyfiltrovaniKolegoviaMeniny.length > 0) {
      let mapnuti = vyfiltrovaniKolegoviaMeniny.map(value => "<@" + value +">");
      result = result + "\n" + "a z našich radov sú to " + mapnuti.join(", ") + ". Gratulujeme!";
    }

    // konkretni ludia z firmy narodeniny //
    if (vyfiltrovaniKolegoviaNarodeniny.length > 0) {
      let mapnuti = vyfiltrovaniKolegoviaNarodeniny.map(value => "<@" + value +">");
      result = result + "\nA k narodeninám gratulujeme " + mapnuti.join(", ") + ". Gratulujeme!";
    }

    return result;
  }

  // pripravim si mena ktore maju dnes meniny //
  const dnesMajuMeniny = ktoMaMeniny();

  console.log("Dnes maju meniny: ", dnesMajuMeniny);

  // precitam vsetkych ludi z channelu //
  const ludiaZchannelu = await precitajLudiZchannelu();

  console.log("ludiaZchannelu: ", ludiaZchannelu);

  // porovnam kto z ludi v channeli ma meniny //
  const kolegoviaMeniny = await ktoZkolegovMaMeniny(dnesMajuMeniny, ludiaZchannelu);

  console.log("Dnes maju kolegovia meniny: ", kolegoviaMeniny);

  // pozriem sa kto z kolegov ma dnes narodky //
  const kolegoviaNarodeniny = ktoZkolegovMaNarodeniny(ludiaZchannelu);

  console.log("Dnes maju tito kolegovia z channelu narodeniny: ", kolegoviaNarodeniny);

  // poslem spravu do channelu //

  try {
    // Use the `chat.postMessage` method to send a message from this app
    await web.chat.postMessage({
      channel: process.env.ZIVIJO_SLACK_CHANNEL,
      text: buildMessageText(dnesMajuMeniny, kolegoviaMeniny, kolegoviaNarodeniny),
      icon_emoji: vyberIkonku()
    });
  } catch (error) {
    console.log("Nepodarilo sa poslat spravu do slacku", error);
    process.exit(1);
  }

  console.log('Message posted!');
};

module.exports = {
  "run": run
};