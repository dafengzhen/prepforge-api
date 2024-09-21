import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * UpdateQuestionDto.
 *
 * @author dafengzhen
 */
export class UpdateQuestionDto {
  /**
   * question.
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  question?: string;

  /**
   * answer.
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  answer?: string;

  /**
   * sort.
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  sort?: number;
}
