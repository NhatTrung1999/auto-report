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
import { AggregateConfigDto } from './dto/dynamic-aggregate.dto';

@Controller('sql')
export class SqlController {
  private readonly logger = new Logger(SqlController.name);
  constructor(private readonly sqlService: SqlService) {}

  @Post('columns')
  async getColumns(@Body() config: DatabaseConfigDto) {
    const result = await this.sqlService.executeGeneralQuery(config);

    if (result.success) {
      return {
        success: true,
        message: 'Columns fetched',
        columns: result.columns ?? [],
      };
    }

    throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
  }

  @Post('connect-and-query')
  async connectAndExecute(@Body() config: DatabaseConfigDto) {
    const result = await this.sqlService.executeGeneralQuery(config);

    if (result.success) {
      return {
        success: true,
        message: 'Query executed',
        data: result.data ?? [],
        columns: result.columns ?? [],
        rowsAffected: result.result?.rowsAffected[0] ?? 0,
      };
    }

    throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
  }
}
