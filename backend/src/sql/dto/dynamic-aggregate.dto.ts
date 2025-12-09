import {
  IsString,
  IsInt,
  IsOptional,
  Min,
  IsArray,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsSelectOnly } from './validators/select-only.validator';

export class ColumnSelectionDto {
  @IsString()
  column: string;

  @IsOptional()
  @IsString()
  func?: 'SUM' | 'AVG' | 'MIN' | 'MAX' | 'COUNT';

  @IsOptional()
  @IsString()
  alias?: string;
}

export class AggregateConfigDto {
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
