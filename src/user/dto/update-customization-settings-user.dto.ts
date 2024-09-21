import { IBaseUpdateCustomizationSettings } from '../../interfaces/base-update-customization-settings';
import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * UpdateCustomizationSettingsUserDto.
 *
 * @author dafengzhen
 */
export class UpdateCustomizationSettingsUserDto
  implements IBaseUpdateCustomizationSettings
{
  @ApiHideProperty()
  @ApiPropertyOptional({ type: String, default: 'user' })
  type = 'user' as const;
}
