const express = require('express');
const router = express.Router();
const {
    storeLeadEmail,
    downloadProductPDF,
    checkPDFAccess
} = require('../controllers/pdfController');
const { checkAuth } = require('../middlewares/authMiddleware');

// Rutas para gestionar PDFs
router.post('/store-email', storeLeadEmail);
router.get('/check-auth/:productId', checkAuth, checkPDFAccess);
router.get('/download/:productId', checkAuth, downloadProductPDF);

module.exports = router;