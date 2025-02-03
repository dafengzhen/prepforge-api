import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ICustomConfig } from '../../common/interface/custom-config';

/**
 * UpdateCustomConfigTagDto.
 *
 * @author dafengzhen
 */
export class UpdateCustomConfigTagDto implements ICustomConfig {
  /**
   * any.
   */
  [key: string]: any;

  /**
   * type.
   */
  @ApiHideProperty()
  @ApiPropertyOptional({ default: 'tag', type: String })
  type = 'tag' as const;
}
