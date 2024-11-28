// config/swagger.js

const swaggerJSDoc = require("swagger-jsdoc");

// Swagger configuration options
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Expense Tracker API",
      version: "1.0.0",
      description: "API documentation for the Expense Tracker App",
    },
    components: {
      schemas: {
        // Reusable response schema examples for success and error
        SuccessResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Success",
            },
            data: {
              type: "object",
              example: {},
            },
          },
        },
        UnauthorizedResponse: {
          type: "object",
          properties: {
            error: {
              type: "string",
              example: "Unauthorized",
            },
          },
        },
        InternalErrorResponse: {
          type: "object",
          properties: {
            error: {
              type: "string",
              example: "Internal Server Error",
            },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"], // Path to your route files
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
