import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IBaseUpdateCustomizationSettings } from '../../interfaces/base-update-customization-settings';

/**
 * UpdateCustomizationSettingsTabDto.
 *
 * @author dafengzhen
 */
export class UpdateCustomizationSettingsTabDto implements IBaseUpdateCustomizationSettings {
  @ApiHideProperty()
  @ApiPropertyOptional({ default: 'tab', type: String })
  type = 'tab' as const;
}
