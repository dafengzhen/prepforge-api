import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ICustomConfig } from '../../common/interface/custom-config';

/**
 * UpdateCustomConfigQuestionDto.
 *
 * @author dafengzhen
 */
export class UpdateCustomConfigQuestionDto implements ICustomConfig {
  /**
   * any.
   */
  [key: string]: any;

  /**
   * type.
   */
  @ApiHideProperty()
  @ApiPropertyOptional({ default: 'question', type: String })
  type = 'question' as const;
}
