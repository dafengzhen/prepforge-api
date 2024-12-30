import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IBaseUpdateCustomizationSettings } from '../../interfaces/base-update-customization-settings';

/**
 * UpdateCustomizationSettingsTagDto.
 *
 * @author dafengzhen
 */
export class UpdateCustomizationSettingsTagDto implements IBaseUpdateCustomizationSettings {
  @ApiHideProperty()
  @ApiPropertyOptional({ default: 'tag', type: String })
  type = 'tag' as const;
}
