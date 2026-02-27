const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logFile = path.join(__dirname, 'application.log');
  }

  log(message, level) {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} [${level.toUpperCase()}] ${message}\n`;
    fs.appendFileSync(this.logFile, logMessage);
    console.log(logMessage);
  }

  info(message) {
    this.log(message, 'info');
  }

  warn(message) {
    this.log(message, 'warn');
  }

  error(message) {
    this.log(message, 'error');
  }

  debug(message) {
    this.log(message, 'debug');
  }

  trace(message) {
    this.log(message, 'trace');
  }
}

module.exports = new Logger();