import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * QuestionDetails.
 *
 * @author dafengzhen
 */
class QuestionDetailDto {
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
}

/**
 * CreateQuestionDto.
 *
 * @author dafengzhen
 */
export class CreateQuestionDto {
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
   * questions.
   */
  @ApiPropertyOptional({
    type: [QuestionDetailDto],
  })
  @IsOptional()
  @IsArray()
  @Type(() => QuestionDetailDto)
  questions?: QuestionDetailDto[];

  /**
   * tabId.
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  tabId?: number;

  /**
   * tagId.
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  tagId?: number;
}
