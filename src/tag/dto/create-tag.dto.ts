import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * CreateTagDto.
 *
 * @author dafengzhen
 */
export class CreateTagDto {
  /**
   * name.
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  /**
   * names.
   */
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => String)
  @IsArray()
  names?: string[];

  /**
   * tabId.
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  tabId?: number;
}
