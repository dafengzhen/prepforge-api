import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ICustomConfig } from '../../common/interface/custom-config';

/**
 * UpdateCustomConfigUserDto.
 *
 * @author dafengzhen
 */
export class UpdateCustomConfigUserDto implements ICustomConfig {
  /**
   * any.
   */
  [key: string]: any;

  /**
   * type.
   */
  @ApiHideProperty()
  @ApiPropertyOptional({ default: 'user', type: String })
  type = 'user' as const;
}
