const express = require("express");
const parser = require("body-parser");
const cors = require("cors");
const Hash = require("./shared/libraries/hash");

const serviceApp = (envConfig, ROUTER, PATH) => {
  const app = express();
  app.use(express.json({ limit: "100mb" }));
  app.use("/public", express.static("public"));
  app.use(parser.urlencoded({ extended: false }));
  app.use(parser.json());

  app.use((req, res, next) => {
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Content-Security-Policy", "default-src 'self'");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
    next();
  });

  app.use(
    cors({
      origin: ["http://localhost:5000", "http://localhost:3000"],
      methods: ["GET", "POST", "PUT"],
      credentials: true,
    })
  );

  const createModifyRequest = (CONFIG) => {
    return (req, res, next) => {
      req.ENV = CONFIG;
      if (req.body.secure != null && req.body.secure != undefined) {
        req.body = JSON.parse(Hash.decrypt(req.body.secure));
      }
      next();
    };
  };
  app.use(PATH, createModifyRequest(envConfig), ROUTER);
  return app;
};

const addErrorHandlingMiddleware = (app) => {
  app.use(async (req, res) => {
    return res.status(400).send("invalid URL.");
  });
};

const startServer = (app, envConfig) => {
  app.listen(envConfig.APP_PORT, () => {
    console.log(`App is running on ${envConfig.BASE_URL}`);
  });
};

module.exports = { serviceApp, addErrorHandlingMiddleware, startServer };
