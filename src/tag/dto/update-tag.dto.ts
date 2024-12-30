import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

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
  @IsNumber()
  @IsOptional()
  sort?: number;
}
