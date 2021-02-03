require('dotenv-defaults').config();

/**
 * Zapise uzivatelovo ID na zoznam ludi, ktori nechcu byt oznaceni.
 * @param {string} userID - slack user ID
 * @return {boolean} True, ak sa zapis podaril, inak false
 */
function zapisNaZoznam(userID) {
    console.warn("TODO");

    return false;
}

/**
 * Odstran uzivatelovo ID zo zoznamu, ludi ktori nechcu byt oznaceni.
 * @param {string} userID - slack user ID
 * @return {boolean} True, ak sa zapis podaril, inak false
 */
function odstranZoZoznamu(userID) {
    console.warn("TODO");

    return false;
}

/**
 * Vrati zoznam ID ludi, ktori nechcu byt oznaceny.
 * @return {Array} pole uzivatelskych slack ID
 */
function vratZoznam() {
    console.warn("TODO");

    return [];
}

module.exports = {
    "zapisNaZoznam": zapisNaZoznam,
    "odstranZoZoznamu": odstranZoZoznamu,
    "vratZoznam": vratZoznam
  };