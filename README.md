# Catálogo de Productos Web - Backend

Backend para una aplicación web de catálogo de productos con autenticación de usuarios, precios condicionales y descarga de fichas técnicas en PDF.

## Tecnologías Utilizadas

### Backend
- **Node.js**: Entorno de ejecución para JavaScript del lado del servidor
- **Express**: Framework web para Node.js
- **MongoDB**: Base de datos NoSQL
- **Mongoose**: ODM (Object Data Modeling) para MongoDB y Node.js
- **JWT (JSON Web Tokens)**: Para autenticación
- **bcryptjs**: Para el hash de contraseñas
- **PDFKit**: Generación de PDFs
- **dotenv**: Manejo de variables de entorno

## Requisitos Previos

- Node.js (v14.x o superior)
- MongoDB (No es necesario instalar porque se usa MongoDB Atlas)
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git https://github.com/dinoroca/catalogo-productos-backend.git
cd catalogo-productos-backend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
   - Crear el archivo `.env` en la raíz del proyecto backend
   - Copiar el contenido del bloc de notas adjunto a `.env`

4. Iniciar el servidor en modo desarrollo:
```bash
node --watch app.js
```

## Estructura del Proyecto

El proyecto sigue una arquitectura MVC (Modelo-Vista-Controlador):

- **/src/models**: Definición de esquemas y modelos de MongoDB
- **/src/controllers**: Lógica de negocio y manejo de peticiones
- **/src/routes**: Definición de rutas de la API
- **/src/middlewares**: Funciones intermedias como autenticación
- **/src/config**: Configuraciones de la aplicación
- **/src/utils**: Funciones de utilidad

## Características Implementadas

1. **Sistema de Autenticación**:
   - Registro de usuarios
   - Inicio de sesión (login)
   - Protección de rutas mediante JWT

2. **Gestión de Productos**:
   - CRUD completo para productos
   - Precios encriptados visibles solo para usuarios autenticados

3. **Sistema de PDF**:
   - Generación de fichas técnicas en PDF
   - Acceso condicional para usuarios autenticados
   - Captura de correos electrónicos para usuarios no autenticados

4. **Seguridad**:
   - Hash unidireccional de contraseñas
   - Encriptación de precios
   - Protección de rutas sensibles

## Decisiones de Diseño

1. **Estructura MVC**: Se eligió esta estructura para mantener una clara separación de responsabilidades.

2. **Encriptación de Precios**: Los precios se almacenan encriptados en la base de datos y solo se desencriptan cuando un usuario autenticado los solicita.

3. **Middleware de Autenticación**: Se implementaron dos middlewares:
   - `protect`: Bloquea totalmente el acceso a rutas protegidas
   - `checkAuth`: Verifica la autenticación sin bloquear el acceso, útil para mostrar contenido condicional

4. **Almacenamiento de Leads**: Los correos electrónicos de usuarios no autenticados que descargan fichas técnicas se almacenan para posible seguimiento comercial.

## API Endpoints

### Autenticación
- **POST /api/auth/register**: Registrar un nuevo usuario
- **POST /api/auth/login**: Iniciar sesión
- **GET /api/auth/me**: Obtener perfil del usuario actual (requiere autenticación)

### Productos
- **GET /api/products**: Obtener todos los productos
- **GET /api/products/:id**: Obtener un producto específico
- **POST /api/products**: Crear un nuevo producto (requiere autenticación)
- **PUT /api/products/:id**: Actualizar un producto (requiere autenticación)
- **DELETE /api/products/:id**: Eliminar un producto (requiere autenticación)

### PDF y Leads
- **GET /api/pdf/check-auth/:productId**: Verificar si un usuario puede descargar la ficha técnica directamente
- **GET /api/pdf/download/:productId**: Descargar ficha técnica en PDF
- **POST /api/pdf/store-email**: Almacenar correo electrónico de lead para descarga

## Seguridad y Buenas Prácticas

1. **Variables de Entorno**: Uso de variables de entorno para información sensible
2. **Validación de Datos**: Verificación de datos de entrada en los controladores
3. **Manejo de Errores**: Sistema consistente de manejo de errores
4. **Encriptación**: Hash de contraseñas y encriptación de información sensible