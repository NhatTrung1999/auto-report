import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Logger,
} from '@nestjs/common';
import { SqlService } from './sql.service';
import { DatabaseConfigDto } from './dto/database-config.dto';
import { ConnectionPool } from 'mssql';

@Controller('sql')
export class SqlController {
  private readonly logger = new Logger(SqlController.name);
  constructor(private readonly sqlService: SqlService) {}

  @Post('connect-and-query')
  async connectAndExecute(@Body() config: DatabaseConfigDto) {
    const connectResult = await this.sqlService.connect(config);

    if (!connectResult.success || !connectResult.pool) {
      throw new HttpException(connectResult.message, HttpStatus.BAD_REQUEST);
    }

    try {
      const queryResult = await this.sqlService.executeQuery(
        connectResult.pool,
        config.query,
        config.params,
      );

      if (queryResult.success) {
        return {
          success: true,
          message: 'Connected and query executed successfully!',
          data: queryResult.data,
          rowsAffected: queryResult.result?.rowsAffected[0] || 0,
        };
      } else {
        throw new HttpException(queryResult.message, HttpStatus.BAD_REQUEST);
      }
    } finally {
      if (connectResult.pool) {
        await connectResult.pool.close();
        this.logger.log('Pool closed.');
      }
    }
  }

  @Post('columns')
  async getColumns(@Body() config: DatabaseConfigDto) {
    let pool: ConnectionPool | undefined;

    try {
      const connectResult = await this.sqlService.connect(config);
      if (!connectResult.success || !connectResult.pool) {
        throw new HttpException(connectResult.message, HttpStatus.BAD_REQUEST);
      }
      pool = connectResult.pool;

      const queryResult = await this.sqlService.executeQuery(
        pool,
        config.query,
        config.params,
      );

      if (queryResult.success && queryResult.columns) {
        return {
          success: true,
          message: 'Columns fetched successfully!',
          columns: queryResult.columns,
        };
      } else {
        throw new HttpException(
          queryResult.message || 'No columns found.',
          HttpStatus.BAD_REQUEST,
        );
      }
    } finally {
      if (pool) {
        await pool.close();
        this.logger.log('Pool closed after fetching columns.');
      }
    }
  }
}
