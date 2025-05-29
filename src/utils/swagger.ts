import { Application } from 'express'; 
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Booking App API',
    version: '1.0.0',
    description: 'This is a simple API documentation for the Booking App',
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/app/api/**/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export const swaggerSetup = (app: Application): void => { 
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
