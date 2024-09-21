import { IsArray, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * CreateTabDto.
 *
 * @author dafengzhen
 */
export class CreateTabDto {
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
  @IsArray()
  @Type(() => String)
  names?: string[];
}
