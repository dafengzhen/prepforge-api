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
  @ApiProperty({ default: 'tab', type: String })
  type = 'tab' as const;
}
