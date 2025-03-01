const { verifyToken } = require('../config/jwt');
const User = require('../models/User');

/**
 * Middleware para proteger rutas que requieren autenticación
 */
const protect = async (req, res, next) => {
    try {
        let token;

        // Verificar si el token está en el header de autorización
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Verificar si el token existe
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No estás autorizado para acceder a este recurso',
            });
        }

        // Verificar el token
        const decoded = verifyToken(token);

        // Buscar el usuario por ID
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'El usuario asociado a este token ya no existe',
            });
        }

        // Adjuntar el usuario a la solicitud
        req.user = user;
        next();
    } catch (error) {
        console.error('Error de autenticación:', error);
        return res.status(401).json({
            success: false,
            message: 'No estás autorizado para acceder a este recurso',
        });
    }
};

/**
 * Middleware opcional para verificar autenticación sin bloquear
 * Útil para mostrar/ocultar contenido condicional (como precios)
 */
const checkAuth = async (req, res, next) => {
    try {
        let token;

        // Verificar si el token está en el header de autorización
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Si no hay token, continuar, pero marcar como no autenticado
        if (!token) {
            req.isAuthenticated = false;
            return next();
        }

        // Verificar el token
        const decoded = verifyToken(token);

        // Buscar el usuario por ID
        const user = await User.findById(decoded.id);

        if (!user) {
            req.isAuthenticated = false;
            return next();
        }

        // El usuario está autenticado
        req.isAuthenticated = true;
        req.user = user;
        next();
    } catch (error) {
        // En caso de error, marcar como no autenticado pero permitir continuar
        req.isAuthenticated = false;
        next();
    }
};

module.exports = {
    protect,
    checkAuth
};