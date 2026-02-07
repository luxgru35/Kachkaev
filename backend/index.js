require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const sequelize = require('./config/db');
const checkApiKey = require('./middleware/checkApiKey');

const eventsRoutes = require('./routes/events');
const usersRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('combined'));

// Swagger документация
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Events Management API',
      version: '1.0.0',
      description: 'REST API для управления мероприятиями',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        apiKey: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Тестовый маршрут
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Events Management API',
    documentation: '/api-docs',
  });
});

// API маршруты с проверкой ключа
app.use('/events', checkApiKey, eventsRoutes);
app.use('/users', checkApiKey, usersRoutes);

// Обработка ошибок 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Функция для синхронизации БД и запуска сервера
async function startServer() {
  try {
    // Проверка подключения к БД
    await sequelize.authenticate();
    console.log('✓ Database connection established');

    // Синхронизация моделей с БД
    await sequelize.sync({ alter: true });
    console.log('✓ Database models synchronized');

    // Запуск сервера
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ API documentation available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
