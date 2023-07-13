const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
var http = require("http");
var fs = require("fs");
require("dotenv").config();
const logger = require("./utils/logger");
const about = require("./utils/about.json");
const swaggerUI = require("swagger-ui-express");
const swaggerJSDOC = require("swagger-jsdoc");

const port = process.env.PORT || 8000;
const baseURL =
  process.NODE_ENV === "production"
    ? "https://smart-trash-can-group13.herokuapp.com"
    : "http://localhost:8000";

// Swagger config
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library API",
      version: "1.0.0",
      description: "API Smart Trash Can",
    },
    securityDefinitions: {
      bearerAuth: {
        type: "apiKey",
        name: "Authorization",
        scheme: "Bearer",
        in: "header",
      },
    },
    servers: [
      {
        url: baseURL,
      },
    ],
  },
  apis: ["./routes/*.js"],
};
const specs = swaggerJSDOC(options);
// db init
require("./utils/db");
const app = express();
// Récupération des toutes les routes dans le dossier routes
fs.readdir("./routes", (err, files) => {
  files.forEach((file) => {
    app.use("/", require("./routes/" + file));
  });
});
// Logger and about response
app.use((req, res, next) => {
  logger.info(`${req.method} url: ${req.url}`);
  next();
});
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

/**
 * @swagger
 * /:
 *   get:
 *     description: Welcome to Smart Trash Can API !
 *     responses:
 *       200:
 *         description: Returns a description of service.
 */
app.get("/", (req, res) => {
  res.send(about);
});

app.use(
  cors({
    origin: "*",
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(port, () => {
  logger.info(`Server listening on port ${baseURL}`);
});
