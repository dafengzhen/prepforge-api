import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

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
  @IsNumber()
  @IsOptional()
  sort?: number;
}
