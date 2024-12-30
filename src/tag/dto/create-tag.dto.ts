import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

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
  @IsArray()
  @IsOptional()
  @Type(() => String)
  names?: string[];

  /**
   * tabId.
   */
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  tabId?: number;
}
