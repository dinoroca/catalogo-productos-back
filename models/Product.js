const mongoose = require('mongoose');
const crypto = require('crypto');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'La descripción del producto es obligatoria'],
    },
    imageUrl: {
        type: String,
        required: [true, 'La URL de la imagen es obligatoria'],
    },
    price: {
        type: String, // Guardamos el precio encriptado
        required: [true, 'El precio es obligatorio'],
    },
    originalPrice: {
        type: Number,
        required: [true, 'El precio original es obligatorio'],
        select: false, // No incluir en las consultas por defecto
    },
    technicalDetails: {
        type: Object,
        default: {},
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

// Middleware para encriptar el precio antes de guardar
productSchema.pre('save', function (next) {
    // Solo encriptar si el precio ha sido modificado
    if (!this.isModified('originalPrice')) return next();

    try {
        // Guardamos el precio original en un campo oculto
        this.originalPrice = this.price;

        // Encriptamos el precio
        const cipher = crypto.createCipher('aes-256-cbc', process.env.PRICE_HASH_KEY);
        let encryptedPrice = cipher.update(this.originalPrice.toString(), 'utf8', 'hex');
        encryptedPrice += cipher.final('hex');

        this.price = encryptedPrice;
        next();
    } catch (error) {
        next(error);
    }
});

// Método estático para desencriptar el precio
productSchema.statics.decryptPrice = function (encryptedPrice) {
    try {
        const decipher = crypto.createDecipher('aes-256-cbc', process.env.PRICE_HASH_KEY);
        let decryptedPrice = decipher.update(encryptedPrice, 'hex', 'utf8');
        decryptedPrice += decipher.final('utf8');
        return parseFloat(decryptedPrice);
    } catch (error) {
        console.error('Error al desencriptar el precio:', error);
        return null;
    }
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;