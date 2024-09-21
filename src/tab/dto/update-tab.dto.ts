import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * UpdateTabDto.
 *
 * @author dafengzhen
 */
export class UpdateTabDto {
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
