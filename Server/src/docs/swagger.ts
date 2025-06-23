import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { swaggerDefinition } from './swaggerDef';

const options = {
    swaggerDefinition,
    apis: ['src/routes/*.ts'], // Adjust if your routes are elsewhere
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: any) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
