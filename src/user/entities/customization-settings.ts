import { ApiProperty } from '@nestjs/swagger';

import { IBaseUpdateCustomizationSettings } from '../../interfaces/base-update-customization-settings';

/**
 * CustomizationSettings.
 *
 * @author dafengzhen
 */
export class CustomizationSettings implements IBaseUpdateCustomizationSettings {
  /**
   * type.
   */
  @ApiProperty({ default: 'user', type: String })
  type = 'user' as const;
}
