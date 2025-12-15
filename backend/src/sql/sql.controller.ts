import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Logger,
  Query,
  Ip,
} from '@nestjs/common';
import { SqlService } from './sql.service';
import { DatabaseConfigDto } from './dto/database-config.dto';

@Controller('sql')
export class SqlController {
  private readonly logger = new Logger(SqlController.name);
  constructor(private readonly sqlService: SqlService) {}

  @Post('columns')
  async getColumns(@Body() config: DatabaseConfigDto) {
    this.logger.log('GET COLUMNS request received');
    const result = await this.sqlService.executeGeneralQuery(config);

    if (result.success) {
      this.logger.log(`Columns fetched: ${result.columns?.length} columns`);
      return result.columns ?? [];
    }

    this.logger.error(`Get columns failed: ${result.message}`);
    throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
  }

  @Post('connect-and-query')
  async connectAndExecute(@Body() config: DatabaseConfigDto) {
    this.logger.log('EXECUTE QUERY request received');
    const result = await this.sqlService.executeGeneralQuery(config);

    if (result.success) {
      this.logger.log(
        `Query executed successfully: ${result.data?.length} rows`,
      );
      return {
        data: result.data ?? [],
        columns: result.columns ?? [],
        rowsAffected: result.result?.rowsAffected[0] ?? 0,
      };
    }

    this.logger.error(`Execute query failed: ${result.message}`);
    throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
  }

  @Get('codeid')
  async getCodeID(@Query('CodeID') codeId: string, @Ip() ip: string) {
    if (!codeId) {
      throw new HttpException('CodeID is required', HttpStatus.BAD_REQUEST);
    }

    const cleanIP = ip.startsWith('::ffff:') ? ip.replace('::ffff:', '') : ip;
    return this.sqlService.getCodeID(codeId, cleanIP);
  }
}
