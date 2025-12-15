import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConnectionPool, IResult, Request, config as SqlConfig } from 'mssql';
import { DatabaseConfigDto } from './dto/database-config.dto';
import { Sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';

interface QueryResult {
  success: boolean;
  message: string;
  result?: IResult<any>;
  data?: any[];
  columns?: string[];
}

@Injectable()
export class SqlService {
  constructor(@Inject('ERP') private readonly ERP: Sequelize) {}

  private readonly logger = new Logger(SqlService.name);

  private async getColumnDataType(
    pool: ConnectionPool,
    tableAlias: string,
    columnName: string,
  ): Promise<string | null> {
    try {
      const metaQuery = `
        SELECT DATA_TYPE 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE COLUMN_NAME = @colName
        AND TABLE_NAME IN (
          SELECT TABLE_NAME 
          FROM INFORMATION_SCHEMA.TABLES 
          WHERE TABLE_TYPE = 'BASE TABLE'
        )
      `;

      const request = pool.request();
      request.input('colName', columnName);
      const result = await request.query(metaQuery);

      if (result.recordset.length > 0) {
        return result.recordset[0].DATA_TYPE.toLowerCase();
      }
      return null;
    } catch (err) {
      this.logger.warn(`Cannot get data type for column ${columnName}`);
      return null;
    }
  }

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
        options: {
          encrypt: true,
          trustServerCertificate: true,
        },
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

  private async generateWrappedQuery(
    pool: ConnectionPool,
    originalQuery: string,
    selections: NonNullable<DatabaseConfigDto['selections']>,
    topN?: number,
  ): Promise<string> {
    if (!selections || selections.length === 0) {
      return topN
        ? `SELECT TOP ${topN} * FROM (${originalQuery}) AS T`
        : originalQuery;
    }

    const selectParts: string[] = [];
    const groupByParts: string[] = [];

    const numericTypes = [
      'int',
      'bigint',
      'smallint',
      'tinyint',
      'decimal',
      'numeric',
      'float',
      'real',
      'money',
      'smallmoney',
    ];

    for (const sel of selections) {
      if (sel.func) {
        const funcUpper = sel.func.toUpperCase();
        if (['SUM', 'AVG', 'MIN', 'MAX'].includes(funcUpper)) {
          const dataType = await this.getColumnDataType(pool, '', sel.column);
          if (dataType && !numericTypes.includes(dataType)) {
            throw new Error(
              `Không thể dùng hàm ${sel.func} cho cột "${sel.column}" vì kiểu dữ liệu là "${dataType}".`,
            );
          }
        }
        const alias = sel.alias || `${sel.func}_${sel.column}`;
        selectParts.push(`${sel.func}([${sel.column}]) AS [${alias}]`);
      } else {
        selectParts.push(`[${sel.column}]`);
        groupByParts.push(`[${sel.column}]`);
      }
    }

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
        finalQuery = await this.generateWrappedQuery(
          pool,
          config.SQLCode,
          config.selections,
          config.topN,
        );
      } else {
        finalQuery = config.topN
          ? `SELECT TOP ${config.topN} * FROM (${config.SQLCode}) AS T`
          : config.SQLCode;
      }

      return await this.executeQuery(pool, finalQuery, config.params);
    } catch (error: any) {
      this.logger.error(`Execute error: ${error.message}`);
      return {
        success: false,
        message: error.message || 'Lỗi thực thi query',
        columns: [],
      };
    } finally {
      if (pool) await pool.close();
    }
  }

  async getCodeID(codeId: string, ip: string) {
    // const query = `SELECT * FROM SQLQueryData WHERE CodeID = '${codeId}' AND ClientIP = '${ip}'`;
    const query = `SELECT * FROM SQLQueryData WHERE CodeID = '${codeId}' AND ClientIP = '${ip}'`;
    const record = await this.ERP.query(query, {
      type: QueryTypes.SELECT,
    });

    if (!record || record.length === 0) {
      throw new NotFoundException('CodeID not found');
    }

    return record;
  }
}
