import { configure, getLogger } from "log4js";
const logger = getLogger();
logger.level = "info";
logger.debug("Logging started");

configure({
    appenders: {
        everything: { type: 'file', filename: 'scraper.log' }
    },
    categories: {
        default: { appenders: ['everything'], level: 'info' }
    }

});

export { logger as _logger };