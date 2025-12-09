import { Injectable, Logger } from '@nestjs/common';
import { ConnectionPool, IResult, Request, config as SqlConfig } from 'mssql';
import { DatabaseConfigDto } from './dto/database-config.dto';
import {
  AggregateConfigDto,
  ColumnSelectionDto,
} from './dto/dynamic-aggregate.dto';

interface QueryResult {
  success: boolean;
  message: string;
  result?: IResult<any>;
  data?: any[];
  columns?: string[];
}

@Injectable()
export class SqlService {
  private readonly logger = new Logger(SqlService.name);

  private async connect(
    config: DatabaseConfigDto,
  ): Promise<{ success: boolean; message: string; pool?: ConnectionPool }> {
    try {
      const sqlConfig: SqlConfig = {
        user: config.username,
        password: config.password,
        server: config.host,
        port: config.port,
        database: config.database,
        options: { encrypt: true, trustServerCertificate: true },
        requestTimeout: config.requestTimeout || 30000,
        pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
      };

      const pool = new ConnectionPool(sqlConfig);
      await pool.connect();
      return { success: true, message: 'Connected', pool };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  private async executeQuery(
    pool: ConnectionPool,
    query: string,
    params?: Record<string, any>,
  ): Promise<QueryResult> {
    if (!pool.connected) {
      return { success: false, message: 'Connection lost', columns: [] };
    }

    try {
      const request = pool.request();
      if (params) {
        Object.entries(params).forEach(([key, value]) =>
          request.input(key, value),
        );
      }

      const result = await request.query(query);
      const columns = result.recordset.columns
        ? Object.keys(result.recordset.columns)
        : [];

      return {
        success: true,
        message: 'Query executed',
        result,
        data: result.recordset,
        columns,
      };
    } catch (error: any) {
      return { success: false, message: error.message, columns: [] };
    }
  }

  private generateWrappedQuery(
    originalQuery: string,
    selections: NonNullable<DatabaseConfigDto['selections']>,
    topN?: number,
  ): string {
    if (!selections || selections.length === 0) {
      return topN
        ? `SELECT TOP ${topN} * FROM (${originalQuery}) AS T`
        : originalQuery;
    }

    const selectParts: string[] = [];
    const groupByParts: string[] = [];

    selections.forEach((sel) => {
      if (sel.func) {
        const alias = sel.alias || `${sel.func}_${sel.column}`;
        selectParts.push(`${sel.func}([${sel.column}]) AS [${alias}]`);
      } else {
        selectParts.push(`[${sel.column}]`);
        groupByParts.push(`[${sel.column}]`);
      }
    });

    const topClause = topN ? `TOP ${topN} ` : '';
    let query = `SELECT ${topClause}${selectParts.join(', ')}\nFROM (${originalQuery}) AS SubQuery`;

    if (groupByParts.length > 0) {
      query += `\nGROUP BY ${groupByParts.join(', ')}`;
    }

    this.logger.log(`Generated query:\n${query}`);
    return query;
  }

  async executeGeneralQuery(config: DatabaseConfigDto): Promise<QueryResult> {
    let pool: ConnectionPool | null = null;

    try {
      const connectResult = await this.connect(config);
      if (!connectResult.success || !connectResult.pool) {
        return { success: false, message: connectResult.message, columns: [] };
      }
      pool = connectResult.pool;

      let finalQuery: string;

      if (config.selections && config.selections.length > 0) {
        finalQuery = this.generateWrappedQuery(
          config.query,
          config.selections,
          config.topN,
        );
      } else {
        finalQuery = config.topN
          ? `SELECT TOP ${config.topN} * FROM (${config.query}) AS T`
          : config.query;
      }

      return await this.executeQuery(pool, finalQuery, config.params);
    } catch (error: any) {
      this.logger.error(`Execute error: ${error.message}`);
      return { success: false, message: error.message, columns: [] };
    } finally {
      if (pool) await pool.close();
    }
  }
}
