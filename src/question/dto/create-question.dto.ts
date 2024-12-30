import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * QuestionDetails.
 *
 * @author dafengzhen
 */
class QuestionDetailDto {
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
}

/**
 * CreateQuestionDto.
 *
 * @author dafengzhen
 */
export class CreateQuestionDto {
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
   * questions.
   */
  @ApiPropertyOptional({
    type: [QuestionDetailDto],
  })
  @IsArray()
  @IsOptional()
  @Type(() => QuestionDetailDto)
  questions?: QuestionDetailDto[];

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
