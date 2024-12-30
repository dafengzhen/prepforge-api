import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IBaseUpdateCustomizationSettings } from '../../interfaces/base-update-customization-settings';

/**
 * UpdateCustomizationSettingsUserDto.
 *
 * @author dafengzhen
 */
export class UpdateCustomizationSettingsUserDto implements IBaseUpdateCustomizationSettings {
  @ApiHideProperty()
  @ApiPropertyOptional({ default: 'user', type: String })
  type = 'user' as const;
}
