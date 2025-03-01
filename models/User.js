const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Por favor proporcione un nombre de usuario'],
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Por favor proporcione un correo electrónico'],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Por favor proporcione un correo electrónico válido'],
    },
    password: {
        type: String,
        required: [true, 'Por favor proporcione una contraseña'],
        minlength: 6,
        select: false, // No incluir en las consultas por defecto
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

// Middleware para hashear la contraseña antes de guardar
userSchema.pre('save', async function (next) {
    // Solo hashear si la contraseña ha sido modificada
    if (!this.isModified('password')) return next();

    try {
        // Generar un salt
        const salt = await bcrypt.genSalt(10);
        // Hashear la contraseña con el salt
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;