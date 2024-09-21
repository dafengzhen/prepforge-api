import { IBaseUpdateCustomizationSettings } from '../../interfaces/base-update-customization-settings';
import { ApiProperty } from '@nestjs/swagger';

/**
 * CustomizationSettings.
 *
 * @author dafengzhen
 */
export class CustomizationSettings implements IBaseUpdateCustomizationSettings {
  /**
   * type.
   */
  @ApiProperty({ type: String, default: 'question' })
  type = 'question' as const;
}
