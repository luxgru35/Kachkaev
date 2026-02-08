import 'dotenv/config';
import express, { Express } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import passport from 'passport';
import sequelize from '@config/db.js';
import checkApiKey from '@middleware/checkApiKey.js';
import eventsRoutes from '@routes/events.js';
import usersRoutes from '@routes/users.js';
import authRoutes from '@routes/auth.js';

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('combined'));

// Initialize passport
app.use(passport.initialize());

// Swagger documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Events Management API',
      version: '2.0.0',
      description: 'REST API for managing events with TypeScript',
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
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Test route
app.get('/', (_req, res): void => {
  res.json({
    message: 'Welcome to Events Management API v2.0',
    documentation: '/api-docs',
  });
});

// API routes
app.use('/auth', authRoutes);
app.use('/events', checkApiKey, eventsRoutes);
app.use('/users', checkApiKey, usersRoutes);

// 404 handler
app.use((_req, res): void => {
  res.status(404).json({ error: 'Route not found' });
});

// Function to start server
async function startServer(): Promise<void> {
  try {
    // Check database connection
    await sequelize.authenticate();
    console.log('✓ Database connection established');

    // Sync models
    await sequelize.sync({ alter: true });
    console.log('✓ Database models synchronized');

    // Start server
    app.listen(PORT, (): void => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ API documentation available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
