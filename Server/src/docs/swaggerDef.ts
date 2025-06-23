export const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'MVP API',
        version: '1.0.0',
        description: 'MVP project backend documentation',
    },
    servers: [
        {
            url: 'http://localhost:3000/api',
            description: 'Development server',
        },
    ],
    tags: [
        { name: 'Auth', description: 'Authentication routes' },
        { name: 'Wallet', description: 'Wallet routes' },
        { name: 'Payments', description: 'Payment routes' },
        { name: 'Withdrawals', description: 'Withdrawal routes' },
        { name: 'Bank', description: 'Bank details' },
        { name: 'Savings', description: 'User savings' },
        { name: 'Transactions', description: 'Transaction logs' },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT', // Optional; helps Swagger UI show it's a JWT
            },
        },
    },

};
