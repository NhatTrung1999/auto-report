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
import { AggregateConfigDto } from './dto/aggregate-config.dto';

@Controller('sql')
export class SqlController {
  private readonly logger = new Logger(SqlController.name);
  constructor(private readonly sqlService: SqlService) {}

  @Post('connect-and-query')
  async connectAndExecute(@Body() config: DatabaseConfigDto) {
    const result = await this.sqlService.executeGeneralQuery(config, false);

    if (result.success) {
      return {
        success: true,
        message: 'Query executed successfully!',
        data: result.data,
        columns: result.columns,
        rowsAffected: result.result?.rowsAffected[0] || 0,
      };
    } else {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('columns')
  async getColumns(@Body() config: DatabaseConfigDto) {
    const result = await this.sqlService.executeGeneralQuery(config, false);

    if (result.success && result.columns) {
      return {
        success: true,
        message: 'Columns fetched successfully!',
        columns: result.columns,
      };
    } else {
      throw new HttpException(
        result.message || 'No columns found.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('aggregate')
  async executeAggregate(@Body() config: AggregateConfigDto) {
    // console.log(config);
    const result = await this.sqlService.executeGeneralQuery(config, true);

    if (result.success) {
      return {
        success: true,
        message: 'Aggregate query executed successfully!',
        data: result.data,
        columns: result.columns,
        rowsAffected: result.result?.rowsAffected[0] || 0,
      };
    } else {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
  }
}
