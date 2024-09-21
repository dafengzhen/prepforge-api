import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * UpdateTagDto.
 *
 * @author dafengzhen
 */
export class UpdateTagDto {
  /**
   * name.
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  /**
   * sort.
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  sort?: number;
}
