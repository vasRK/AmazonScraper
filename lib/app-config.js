"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AZURE_CLIENT_ID = exports.AZURE_TENANT_ID = exports.AZURE_CLIENT_SECRET = exports.AZURE_ACCOUNT_NAME = exports.AZURE_SQLSERVER_DB = exports.AZURE_SQLSERVER_CON_TIMEOUT = exports.AZURE_SQLSERVER_USER_PWD = exports.AZURE_SQLSERVER_USER = exports.AZURE_SQLSERVER_URL = exports.AZURE_SERVICEBUS_QUEUE = exports.AZURE_SERVICEBUS_CONNECTION_STRING = void 0;
var assert = require('assert');
var dotenv = require("dotenv");
// read in the .env file
dotenv.config();
// capture the environment variables the application needs
var _a = process.env, AZURE_SERVICEBUS_CONNECTION_STRING = _a.AZURE_SERVICEBUS_CONNECTION_STRING, AZURE_SERVICEBUS_QUEUE = _a.AZURE_SERVICEBUS_QUEUE, AZURE_SQLSERVER_URL = _a.AZURE_SQLSERVER_URL, AZURE_SQLSERVER_USER = _a.AZURE_SQLSERVER_USER, AZURE_SQLSERVER_USER_PWD = _a.AZURE_SQLSERVER_USER_PWD, AZURE_SQLSERVER_CON_TIMEOUT = _a.AZURE_SQLSERVER_CON_TIMEOUT, AZURE_SQLSERVER_DB = _a.AZURE_SQLSERVER_DB, AZURE_ACCOUNT_NAME = _a.AZURE_ACCOUNT_NAME, AZURE_CLIENT_SECRET = _a.AZURE_CLIENT_SECRET, AZURE_TENANT_ID = _a.AZURE_TENANT_ID, AZURE_CLIENT_ID = _a.AZURE_CLIENT_ID;
exports.AZURE_SERVICEBUS_CONNECTION_STRING = AZURE_SERVICEBUS_CONNECTION_STRING;
exports.AZURE_SERVICEBUS_QUEUE = AZURE_SERVICEBUS_QUEUE;
exports.AZURE_SQLSERVER_URL = AZURE_SQLSERVER_URL;
exports.AZURE_SQLSERVER_USER = AZURE_SQLSERVER_USER;
exports.AZURE_SQLSERVER_USER_PWD = AZURE_SQLSERVER_USER_PWD;
exports.AZURE_SQLSERVER_CON_TIMEOUT = AZURE_SQLSERVER_CON_TIMEOUT;
exports.AZURE_SQLSERVER_DB = AZURE_SQLSERVER_DB;
exports.AZURE_ACCOUNT_NAME = AZURE_ACCOUNT_NAME;
exports.AZURE_CLIENT_SECRET = AZURE_CLIENT_SECRET;
exports.AZURE_TENANT_ID = AZURE_TENANT_ID;
exports.AZURE_CLIENT_ID = AZURE_CLIENT_ID;
// validate the required configuration information
assert(AZURE_CLIENT_ID, "Client id configuration is required.");
assert(AZURE_TENANT_ID, "Tenant id configuration is required.");
assert(AZURE_CLIENT_SECRET, "Client name configuration is required.");
assert(AZURE_ACCOUNT_NAME, "Account name configuration is required.");
assert(AZURE_SERVICEBUS_CONNECTION_STRING, "Service bus configuration is required.");
assert(AZURE_SERVICEBUS_QUEUE, "ServiceBus Queue name configuration is required.");
assert(AZURE_SQLSERVER_URL, "SQL configuration is required.");
assert(AZURE_SQLSERVER_USER, "SQL USER configuration is required.");
assert(AZURE_SQLSERVER_USER_PWD, "SQL USER Password configuration is required.");
assert(AZURE_SQLSERVER_CON_TIMEOUT, "SQL Connection timeout configuration is required.");
assert(AZURE_SQLSERVER_DB, "SQL DB name configuration is required.");
//# sourceMappingURL=app-config.js.map