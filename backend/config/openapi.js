const openapi = require("@wesleytodd/openapi");

const oapi = openapi({
  openapi: "3.0.0",
  info: {
    title: "BillSplit Backend",
    description: "Generated docs from an Express api",
    version: "1.0.0",
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
});

module.exports = oapi;
