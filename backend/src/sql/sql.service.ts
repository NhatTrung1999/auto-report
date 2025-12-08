import { Injectable, Logger } from '@nestjs/common';
import { ConnectionPool, IResult, Request, config as SqlConfig } from 'mssql';
import { DatabaseConfigDto } from './dto/database-config.dto';
import { AggregateConfigDto } from './dto/aggregate-config.dto';

@Injectable()
export class SqlService {
  private readonly logger = new Logger(SqlService.name);
  async connect(config: DatabaseConfigDto | AggregateConfigDto): Promise<{
    success: boolean;
    message: string;
    pool?: ConnectionPool;
  }> {
    let pool: ConnectionPool | null = null;

    try {
      const sqlConfig: SqlConfig = {
        user: (config as any).username,
        password: (config as any).password,
        server: (config as any).host,
        port: (config as any).port,
        database: (config as any).database,
        options: {
          encrypt: true,
          trustServerCertificate: true,
        },
        requestTimeout: (config as any).requestTimeout || 15000,
        pool: {
          max: 10,
          min: 0,
          idleTimeoutMillis: 30000,
        },
      };

      pool = new ConnectionPool(sqlConfig);
      await pool.connect();

      this.logger.log(
        `Connected to ${(config as any).database} on ${(config as any).host}:${(config as any).port}`,
      );

      return {
        success: true,
        message: 'Connected successfully!',
        pool,
      };
    } catch (error) {
      this.logger.error(`Connect failed: ${error.message}`);
      return {
        success: false,
        message: `Connect error: ${error.message}`,
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
      return { success: false, message: 'Pool is not connected.' };
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

  private generateAggregateQuery(config: AggregateConfigDto): string {
    const { table, selections, topN } = config;

    console.log(table, selections, topN);
    if (selections.length === 0) {
      throw new Error('No selections provided.');
    }

    const selectParts = selections.map((sel) => {
      const alias = `${sel.func}${sel.column}`;
      return `${sel.func}(${sel.column}) AS ${alias}`;
    });

    let query = `SELECT ${selectParts.join(', ')} FROM ${table}`;

    if (topN) {
      query = `SELECT TOP ${topN} ${selectParts.join(', ')} FROM ${table}`;
    }

    const upperQuery = query.toUpperCase();
    if (!upperQuery.startsWith('SELECT ')) {
      throw new Error('Generated query must start with SELECT.');
    }

    this.logger.log(`Generated aggregate query: ${query}`);
    return query;
  }

  // Hàm execute chung (regular hoặc aggregate)
  async executeGeneralQuery(
    config: DatabaseConfigDto | AggregateConfigDto,
    isAggregate: boolean = false,
  ): Promise<{
    success: boolean;
    message: string;
    result?: IResult<any>;
    data?: any[];
    columns?: string[];
  }> {
    let pool: ConnectionPool | null = null;
    let query: string;
    let params: { [key: string]: any } | undefined;

    try {
      const connectResult = await this.connect(config);
      if (!connectResult.success || !connectResult.pool) {
        return { success: false, message: connectResult.message };
      }
      pool = connectResult.pool;

      if (isAggregate) {
        query = this.generateAggregateQuery(config as AggregateConfigDto);
        params = undefined;
      } else {
        query = (config as DatabaseConfigDto).query;
        params = (config as DatabaseConfigDto).params;
      }

      const queryResult = await this.executeQuery(pool, query, params);
      return queryResult;
    } catch (error) {
      this.logger.error(`General query failed: ${error.message}`);
      return { success: false, message: `Execute error: ${error.message}` };
    } finally {
      if (pool) {
        await pool.close();
        this.logger.log('Pool closed after general query.');
      }
    }
  }
}
