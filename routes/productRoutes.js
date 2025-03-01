const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsUser
} = require('../controllers/productController');
const { protect, checkAuth } = require('../middlewares/authMiddleware');

// Rutas con verificación de autenticación (no bloqueantes)
router.get('/', checkAuth, getProducts);
router.get('/:id', checkAuth, getProduct);

// Rutas protegidas (requieren autenticación)
router.get('/prods/user', protect, getProductsUser);
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;