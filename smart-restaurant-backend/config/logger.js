const { createLogger, format, transports } = require("winston");

const logger = createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.printf(({ timestamp, level, message, stack }) =>
      stack
        ? `[${timestamp}] ${level.toUpperCase()}: ${message}\n${stack}`
        : `[${timestamp}] ${level.toUpperCase()}: ${message}`
    )
  ),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
    new transports.File({ filename: "logs/error.log",    level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),
  ],
});

// db.js එකට සහ server.js එකට කෙලින්ම පාවිච්චි කරන්න පුළුවන් වෙන්න මේ විදිහට export කරමු
module.exports = {
  info: (msg) => logger.info(msg),
  error: (msg) => logger.error(msg),
  warn: (msg) => logger.warn(msg),
  debug: (msg) => logger.debug(msg)
};