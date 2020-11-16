const assert = require('assert');
const dotenv = require("dotenv");

// read in the .env file
dotenv.config();

// capture the environment variables the application needs
const { AZURE_SERVICEBUS_CONNECTION_STRING,
    AZURE_SERVICEBUS_QUEUE,
    AZURE_SQLSERVER_URL,
    AZURE_SQLSERVER_USER,
    AZURE_SQLSERVER_USER_PWD,
    AZURE_SQLSERVER_CON_TIMEOUT,
    AZURE_SQLSERVER_DB,
    AZURE_ACCOUNT_NAME,
    AZURE_CLIENT_SECRET,
    AZURE_TENANT_ID,
    AZURE_CLIENT_ID,
    SCRAPE_API_KEY,
    IMAGE_URL_FMT
} = process.env;

// validate the required configuration information
assert(IMAGE_URL_FMT, "Image url fmt configuration is required.");
assert(SCRAPE_API_KEY, "Scrape api key configuration is required.");
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

export {
    AZURE_SERVICEBUS_CONNECTION_STRING
    , AZURE_SERVICEBUS_QUEUE
    , AZURE_SQLSERVER_URL
    , AZURE_SQLSERVER_USER
    , AZURE_SQLSERVER_USER_PWD
    , AZURE_SQLSERVER_CON_TIMEOUT
    , AZURE_SQLSERVER_DB
    , AZURE_ACCOUNT_NAME
    , AZURE_CLIENT_SECRET
    , AZURE_TENANT_ID
    , AZURE_CLIENT_ID
    , SCRAPE_API_KEY
    , IMAGE_URL_FMT
}