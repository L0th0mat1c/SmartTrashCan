const { createLogger, format, transports } = require("winston");
const { combine, timestamp, colorize, printf } = format;

const myCustomLevels = {
  levels: {
    info: 0,
    warn: 1,
    error: 2,
    fatal: 3,
  },
  colors: {
    info: "blue",
    warn: "green",
    error: "yellow",
    fatal: "red",
  },
};
const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});
const logger = createLogger({
  format: combine(
    colorize(),
    timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
    myFormat
  ),
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new transports.Console(),
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.File({ filename: "combined.log" }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
// if (process.env.NODE_ENV !== "production") {
//   const { format } = winston;
//   logger.add(
//     const consoleLogger =
//   );
// }
module.exports = logger;
