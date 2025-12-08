import {
  IsString,
  IsInt,
  IsOptional,
  Min,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class AggregateSelectionDto {
  @IsString()
  column: string; // Tên cột từ /columns

  @IsString()
  func: 'SUM' | 'AVG' | 'MIN' | 'MAX'; // Whitelist functions
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
  table: string; // Tên table cho FROM

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AggregateSelectionDto)
  selections: AggregateSelectionDto[]; // [{ column: 'PostalCode', func: 'SUM' }]

  @IsOptional()
  @IsInt()
  @Min(1)
  topN?: number; // TOP N optional
}
