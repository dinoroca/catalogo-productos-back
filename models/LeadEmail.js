const mongoose = require('mongoose');

const leadEmailSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'El correo electrónico es obligatorio'],
        match: [/^\S+@\S+\.\S+$/, 'Por favor proporcione un correo electrónico válido'],
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'El ID del producto es obligatorio'],
    },
    downloadedAt: {
        type: Date,
        default: Date.now,
    },
    ipAddress: {
        type: String,
        default: '',
    },
    userAgent: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});

const LeadEmail = mongoose.model('LeadEmail', leadEmailSchema);

module.exports = LeadEmail;