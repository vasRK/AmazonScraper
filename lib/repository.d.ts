import { ConnectionPool } from 'mssql';
export declare class Repository {
    pool: ConnectionPool;
    constructor();
    GetConnection(): Promise<ConnectionPool>;
    CloseConnection(): Promise<void>;
}
