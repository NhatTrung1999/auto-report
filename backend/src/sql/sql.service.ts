import { Injectable, Logger } from '@nestjs/common';
import { ConnectionPool, IResult, Request, config as SqlConfig } from 'mssql';
import { DatabaseConfigDto } from './dto/database-config.dto';

@Injectable()
export class SqlService {
  private readonly logger = new Logger(SqlService.name);
  private pool: ConnectionPool | null = null;

  async connect(
    config: DatabaseConfigDto,
  ): Promise<{ success: boolean; message: string; pool?: ConnectionPool }> {
    try {
      const sqlConfig: SqlConfig = {
        user: config.username,
        password: config.password,
        server: config.host,
        port: config.port,
        database: config.database,
        options: {
          encrypt: true,
          trustServerCertificate: true,
        },
        requestTimeout: config.requestTimeout || 15000,
        pool: {
          max: 10,
          min: 0,
          idleTimeoutMillis: 30000,
        },
      };
      this.pool = new ConnectionPool(sqlConfig);
      await this.pool.connect();

      this.logger.log(
        `Connected successfully to ${config.database} on ${config.host}:${config.port}`,
      );
      return {
        success: true,
        message: 'Connected successfully!',
        pool: this.pool,
      };
    } catch (error) {
      this.logger.error(`Connection failed: ${error.message}`);
      return {
        success: false,
        message: `Connection failed: ${error.message}`,
      };
    }
  }

  async executeQuery(
    pool: ConnectionPool,
    query: string,
    params?: { [key: string]: any },
  ): Promise<{
    success: boolean;
    message: string;
    result?: IResult<any>;
    data?: any[];
    columns?: string[];
  }> {
    if (!pool.connected) {
      return {
        success: true,
        message: 'Pool is not connected.',
      };
    }

    try {
      const request: Request = pool.request();
      if (params) {
        Object.keys(params).forEach((key) => {
          request.input(key, params[key]);
        });
      }
      const result: IResult<any> = await request.query(query);
      this.logger.log(`Query executed: ${query.substring(0, 50)}...`);
      const columns = result.recordset.columns
        ? Object.keys(result.recordset.columns)
        : [];
      return {
        success: true,
        message: 'Query executed successfully!',
        result,
        data: result.recordset,
        columns,
      };
    } catch (error) {
      this.logger.error(`Query failed: ${error.message}`);
      return {
        success: false,
        message: `Query error: ${error.message}`,
      };
    }
  }
}
