const mongoose = require("mongoose");
const logger = require("../utils/logger");

const dbURI = process.env.DBURL;

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 50,
    wtimeoutMS: 2500,
  })
  .then(logger.info("Connected to database"))
  .catch((err) => logger.warn(`error: ${err}`));
