import { ApiProperty } from '@nestjs/swagger';

import { ICustomConfig } from '../../common/interface/custom-config';

/**
 * CustomConfig.
 *
 * @author dafengzhen
 */
export class CustomConfig implements ICustomConfig {
  /**
   * type.
   */
  @ApiProperty({ default: 'tab', type: String })
  type = 'tab' as const;
}
