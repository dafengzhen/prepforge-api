import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * UpdateQuestionDto.
 *
 * @author dafengzhen
 */
export class UpdateQuestionDto {
  /**
   * answer.
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  answer?: string;

  /**
   * question.
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  question?: string;

  /**
   * sort.
   */
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  sort?: number;

  /**
   * tabId.
   */
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  tabId?: number;

  /**
   * tagId.
   */
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  tagId?: number;
}
