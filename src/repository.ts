import { ConnectionPool } from 'mssql';
import {
    AZURE_SQLSERVER_USER, AZURE_SQLSERVER_USER_PWD,
    AZURE_SQLSERVER_URL, AZURE_SQLSERVER_DB
} from './app-config';

var config = {
    user: AZURE_SQLSERVER_USER,
    password: AZURE_SQLSERVER_USER_PWD,
    server: AZURE_SQLSERVER_URL,
    database: AZURE_SQLSERVER_DB
};

export class Repository {
    pool: ConnectionPool;
    constructor() {
        this.pool = new ConnectionPool(config);
    }

    async GetConnection() {
        return await this.pool.connect();
    }

    async CloseConnection() {
        this.pool.close()
    }
}


