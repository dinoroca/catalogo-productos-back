const crypto = require('crypto');

/**
 * Genera un hash unidireccional para un valor dado
 * @param {String} value - Valor a hashear
 * @returns {String} Hash del valor
 */
const hashValue = (value) => {
    return crypto
        .createHash('sha256')
        .update(String(value))
        .digest('hex');
};

/**
 * Genera una cadena aleatoria para usar como sal
 * @param {Number} length - Longitud de la cadena
 * @returns {String} Cadena aleatoria
 */
const generateRandomString = (length = 16) => {
    return crypto
        .randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
};

module.exports = {
    hashValue,
    generateRandomString
};