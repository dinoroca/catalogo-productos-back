const PDFDocument = require('pdfkit');
const LeadEmail = require('../models/LeadEmail');
const Product = require('../models/Product');

/**
 * @desc    Almacenar un correo electrónico de lead
 * @route   POST /api/pdf/store-email
 * @access  Public
 */
const storeLeadEmail = async (req, res) => {
    try {
        const { email, productId } = req.body;

        // Verificar si el producto existe
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado',
            });
        }

        // Obtener información adicional del cliente
        const ipAddress = req.ip || req.connection.remoteAddress;
        const userAgent = req.get('User-Agent') || '';

        // Almacenar el correo electrónico
        await LeadEmail.create({
            email,
            productId,
            ipAddress,
            userAgent,
        });

        res.status(201).json({
            success: true,
            message: 'Correo electrónico almacenado correctamente',
        });
    } catch (error) {
        console.error('Error al almacenar correo:', error);
        res.status(500).json({
            success: false,
            message: 'Error al almacenar correo electrónico',
            error: error.message,
        });
    }
};

/**
 * @desc    Generar y descargar ficha técnica en PDF
 * @route   GET /api/pdf/download/:productId
 * @access  Public/Private (según autenticación)
 */
const downloadProductPDF = async (req, res) => {
    try {
        const { productId } = req.params;

        // Verificar si el producto existe
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado',
            });
        }

        // Crear un nuevo documento PDF
        const doc = new PDFDocument();

        // Configurar encabezados de respuesta
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=ficha_tecnica_${productId}.pdf`);

        // Pipe el PDF a la respuesta HTTP
        doc.pipe(res);

        // Añadir contenido al PDF
        doc.fontSize(20).text('Ficha Técnica del Producto', { align: 'center' });
        doc.moveDown();

        // Información básica del producto
        doc.fontSize(16).text('Información del Producto');
        doc.moveDown(0.5);
        doc.fontSize(12).text(`Nombre: ${product.name}`);
        doc.moveDown(0.5);
        doc.fontSize(12).text(`Descripción: ${product.description}`);
        doc.moveDown(0.5);

        // Si el usuario está autenticado, mostrar el precio
        if (req.isAuthenticated) {
            try {
                const decryptedPrice = Product.decryptPrice(product.price);
                doc.fontSize(12).text(`Precio: $${decryptedPrice.toFixed(2)}`);
                doc.moveDown(0.5);
            } catch (error) {
                console.error('Error al desencriptar precio:', error);
            }
        }

        // Detalles técnicos
        doc.fontSize(16).text('Detalles Técnicos');
        doc.moveDown(0.5);

        if (product.technicalDetails && Object.keys(product.technicalDetails).length > 0) {
            Object.entries(product.technicalDetails).forEach(([key, value]) => {
                doc.fontSize(12).text(`${key}: ${value}`);
                doc.moveDown(0.5);
            });
        } else {
            doc.fontSize(12).text('No hay detalles técnicos disponibles para este producto.');
        }

        // Añadir fecha y pie de página
        doc.moveDown(2);
        doc.fontSize(10).text(`Generado el: ${new Date().toLocaleDateString()}`, { align: 'center' });

        // Finalizar el PDF
        doc.end();
    } catch (error) {
        console.error('Error al generar PDF:', error);
        res.status(500).json({
            success: false,
            message: 'Error al generar PDF',
            error: error.message,
        });
    }
};

/**
 * @desc    Verificar la necesidad de email para descargar el PDF
 * @route   GET /api/pdf/check-auth/:productId
 * @access  Public
 */
const checkPDFAccess = async (req, res) => {
    try {
        // Verificar si el usuario está autenticado
        const requiresEmail = !req.isAuthenticated;

        res.status(200).json({
            success: true,
            requiresEmail,
            isAuthenticated: req.isAuthenticated,
        });
    } catch (error) {
        console.error('Error al verificar acceso PDF:', error);
        res.status(500).json({
            success: false,
            message: 'Error al verificar acceso a PDF',
            error: error.message,
        });
    }
};

module.exports = {
    storeLeadEmail,
    downloadProductPDF,
    checkPDFAccess,
};