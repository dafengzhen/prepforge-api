import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

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
  @IsArray()
  @IsOptional()
  @Type(() => String)
  names?: string[];
}
