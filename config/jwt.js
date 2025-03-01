const jwt = require('jsonwebtoken');

/**
 * Genera un token JWT para un usuario
 * @param {Object} user - Objeto de usuario (sin la contraseña)
 * @returns {String} Token JWT
 */
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

/**
 * Verifica un token JWT
 * @param {String} token - Token JWT a verificar
 * @returns {Object} Datos del usuario decodificados
 */
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Token inválido o expirado');
    }
};

module.exports = {
    generateToken,
    verifyToken
};