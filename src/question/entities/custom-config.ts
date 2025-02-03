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
  @ApiProperty({ default: 'question', type: String })
  type = 'question' as const;
}
