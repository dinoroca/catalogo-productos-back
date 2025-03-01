const Product = require('../models/Product');
const crypto = require('crypto');

/**
 * @desc    Obtener todos los productos
 * @route   GET /api/products
 * @access  Public (pero precio solo visible para usuarios autenticados)
 */
const getProducts = async (req, res) => {
    try {
        const products = await Product.find();

        // Filtrar los datos según la autenticación
        const processedProducts = products.map(product => {
            const productObj = product.toObject();

            // Si el usuario está autenticado, desencriptar el precio
            if (req.isAuthenticated) {
                try {
                    productObj.price = Product.decryptPrice(product.price);
                } catch (error) {
                    console.error('Error al desencriptar precio:', error);
                    productObj.price = null;
                }
            } else {
                // Si no está autenticado, eliminar el campo de precio
                delete productObj.price;
            }

            return productObj;
        });

        res.status(200).json({
            success: true,
            count: processedProducts.length,
            data: processedProducts,
            isAuthenticated: req.isAuthenticated,
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener productos',
            error: error.message,
        });
    }
};

/**
 * @desc    Obtener un producto por ID
 * @route   GET /api/products/:id
 * @access  Public (pero precio solo visible para usuarios autenticados)
 */
const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado',
            });
        }

        // Convertir a objeto para manipularlo
        const productObj = product.toObject();

        // Si el usuario está autenticado, desencriptar el precio
        if (req.isAuthenticated) {
            try {
                productObj.price = Product.decryptPrice(product.price);
            } catch (error) {
                console.error('Error al desencriptar precio:', error);
                productObj.price = null;
            }
        } else {
            // Si no está autenticado, eliminar el campo de precio
            delete productObj.price;
        }

        res.status(200).json({
            success: true,
            data: productObj,
            isAuthenticated: req.isAuthenticated,
        });
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener producto',
            error: error.message,
        });
    }
};

/**
 * @desc    Crear un nuevo producto
 * @route   POST /api/products
 * @access  Private
 */
const createProduct = async (req, res) => {
    try {
        const { name, description, imageUrl, price, technicalDetails } = req.body;

        // Crear el producto con el precio original sin encriptar
        const product = await Product.create({
            name,
            description,
            imageUrl,
            originalPrice: price,
            price, // Se encriptará automáticamente en el middleware pre-save
            technicalDetails: technicalDetails || {},
        });

        res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente',
            data: product,
        });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear producto',
            error: error.message,
        });
    }
};

/**
 * @desc    Actualizar un producto
 * @route   PUT /api/products/:id
 * @access  Private
 */
const updateProduct = async (req, res) => {
    try {
        const { name, description, imageUrl, price, technicalDetails } = req.body;

        let updateData = {
            name,
            description,
            imageUrl,
            technicalDetails,
        };

        // Si se actualiza el precio, actualizamos el precio original y dejamos que el middleware lo encripte
        if (price) {
            updateData.originalPrice = price;

            // Encriptamos el precio manualmente ya que el middleware solo se ejecuta en save()
            const cipher = crypto.createCipher('aes-256-cbc', process.env.PRICE_HASH_KEY);
            let encryptedPrice = cipher.update(price.toString(), 'utf8', 'hex');
            encryptedPrice += cipher.final('hex');

            updateData.price = encryptedPrice;
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Producto actualizado exitosamente',
            data: product,
        });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar producto',
            error: error.message,
        });
    }
};

/**
 * @desc    Eliminar un producto
 * @route   DELETE /api/products/:id
 * @access  Private
 */
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Producto eliminado exitosamente',
        });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar producto',
            error: error.message,
        });
    }
};

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
};