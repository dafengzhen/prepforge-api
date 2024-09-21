import { IBaseUpdateCustomizationSettings } from '../../interfaces/base-update-customization-settings';
import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * UpdateCustomizationSettingsTabDto.
 *
 * @author dafengzhen
 */
export class UpdateCustomizationSettingsTabDto
  implements IBaseUpdateCustomizationSettings
{
  @ApiHideProperty()
  @ApiPropertyOptional({ type: String, default: 'tab' })
  type = 'tab' as const;
}
