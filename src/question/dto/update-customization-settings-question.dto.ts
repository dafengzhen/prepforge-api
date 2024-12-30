import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IBaseUpdateCustomizationSettings } from '../../interfaces/base-update-customization-settings';

/**
 * UpdateCustomizationSettingsQuestionDto.
 *
 * @author dafengzhen
 */
export class UpdateCustomizationSettingsQuestionDto implements IBaseUpdateCustomizationSettings {
  @ApiHideProperty()
  @ApiPropertyOptional({ default: 'question', type: String })
  type = 'question' as const;
}
