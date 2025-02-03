import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ICustomConfig } from '../../common/interface/custom-config';

/**
 * UpdateCustomConfigTabDto.
 *
 * @author dafengzhen
 */
export class UpdateCustomConfigTabDto implements ICustomConfig {
  /**
   * any.
   */
  [key: string]: any;

  /**
   * type.
   */
  @ApiHideProperty()
  @ApiPropertyOptional({ default: 'tab', type: String })
  type = 'tab' as const;
}
