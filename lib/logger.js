"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._logger = void 0;
var log4js_1 = require("log4js");
var logger = log4js_1.getLogger();
exports._logger = logger;
logger.level = "info";
logger.debug("Logging started");
log4js_1.configure({
    appenders: {
        everything: { type: 'file', filename: 'scraper.log' }
    },
    categories: {
        default: { appenders: ['everything'], level: 'info' }
    }
});
//# sourceMappingURL=logger.js.map