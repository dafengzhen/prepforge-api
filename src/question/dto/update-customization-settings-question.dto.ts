import { IBaseUpdateCustomizationSettings } from '../../interfaces/base-update-customization-settings';
import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * UpdateCustomizationSettingsQuestionDto.
 *
 * @author dafengzhen
 */
export class UpdateCustomizationSettingsQuestionDto
  implements IBaseUpdateCustomizationSettings
{
  @ApiHideProperty()
  @ApiPropertyOptional({ type: String, default: 'question' })
  type = 'question' as const;
}
