"use strict";

const log = message => {
  console.log(
    `[${new Date().toLocaleTimeString()} ${new Date().toLocaleDateString()}] INFO: ${message}`
  );
};

const logError = message => {
  console.log(
    `[${new Date().toLocaleTimeString()} ${new Date().toLocaleDateString()}] ERROR: ${message}`
  );
};

module.exports = {log, logError};
