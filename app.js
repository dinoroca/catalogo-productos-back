const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const pdfRoutes = require('./routes/pdfRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logger para desarrollo
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Montar rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/pdf', pdfRoutes);

// Ruta base para verificar que la API está funcionando
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API del catálogo de productos funcionando correctamente',
    version: '1.0.0',
  });
});

// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
  const error = new Error(`Ruta no encontrada: ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Middleware para manejar errores
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

// Para pruebas
module.exports = app;