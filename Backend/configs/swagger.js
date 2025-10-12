const swaggerSchema = require('./swaggerSchema');

const swaggerConfig = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library Card Generator API",
      version: "1.0.0",
      description: "Library Card Generator API Documentation",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development Server"
      }
    ],
    components: {
      schemas: swaggerSchema,
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: [
    "./routes/*.js"
  ]
};

const swaggerUIOptions = {
  explorer: true,
  customSiteTitle: "Library Card Generator API Documentation"
};

module.exports = {
  swaggerConfig,
  swaggerUIOptions
};