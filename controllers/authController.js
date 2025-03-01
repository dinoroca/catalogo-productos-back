const User = require('../models/User');
const { generateToken } = require('../config/jwt');

/**
 * @desc    Registrar un nuevo usuario
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Verificar si todos los campos están presentes
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Por favor proporcione todos los campos requeridos',
            });
        }

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'El usuario o correo electrónico ya está registrado',
            });
        }

        // Crear el nuevo usuario
        const user = await User.create({
            username,
            email,
            password,
        });

        // Generar token JWT
        const token = generateToken({
            _id: user._id,
            email: user.email,
        });

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al registrar usuario',
            error: error.message,
        });
    }
};

/**
 * @desc    Iniciar sesión
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar si todos los campos están presentes
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Por favor proporcione correo electrónico y contraseña',
            });
        }

        // Buscar el usuario y seleccionar el campo de contraseña
        const user = await User.findOne({ email }).select('+password');

        // Verificar si el usuario existe
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas',
            });
        }

        // Verificar si la contraseña coincide
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas',
            });
        }

        // Generar token JWT
        const token = generateToken({
            _id: user._id,
            email: user.email,
        });

        res.status(200).json({
            success: true,
            message: 'Inicio de sesión exitoso',
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({
            success: false,
            message: 'Error al iniciar sesión',
            error: error.message,
        });
    }
};

/**
 * @desc    Obtener el perfil del usuario actual
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
    try {
        // El usuario ya está disponible en req.user gracias al middleware protect
        res.status(200).json({
            success: true,
            data: {
                _id: req.user._id,
                username: req.user.username,
                email: req.user.email,
            },
        });
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener perfil de usuario',
            error: error.message,
        });
    }
};

module.exports = {
    register,
    login,
    getMe,
};