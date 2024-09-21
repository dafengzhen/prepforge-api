import { IBaseUpdateCustomizationSettings } from '../../interfaces/base-update-customization-settings';
import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * UpdateCustomizationSettingsTagDto.
 *
 * @author dafengzhen
 */
export class UpdateCustomizationSettingsTagDto
  implements IBaseUpdateCustomizationSettings
{
  @ApiHideProperty()
  @ApiPropertyOptional({ type: String, default: 'tag' })
  type = 'tag' as const;
}
