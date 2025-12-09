import { IsArray, IsInt, IsObject, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { IsSelectOnly } from './validators/select-only.validator';
import { Type } from 'class-transformer';

class ColumnSelectionDto {
  @IsString()
  column: string;

  @IsOptional()
  @IsString()
  func?: 'SUM' | 'AVG' | 'MIN' | 'MAX' | 'COUNT';

  @IsOptional()
  @IsString()
  alias?: string;
}

export class DatabaseConfigDto {
  @IsString()
  host: string;

  @IsInt()
  @Min(1)
  port: number;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  database: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  requestTimeout?: number = 15000;

  @IsString()
  @IsSelectOnly()
  query: string; 

  @IsOptional()
  @IsObject()
  params?: { [key: string]: any };

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ColumnSelectionDto)
  selections?: ColumnSelectionDto[];

  @IsOptional()
  @IsInt()
  @Min(1)
  topN?: number;
}
