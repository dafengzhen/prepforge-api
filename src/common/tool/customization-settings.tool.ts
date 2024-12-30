import type { UpdateCustomizationSettingsQuestionDto } from '../../question/dto/update-customization-settings-question.dto';
import type { UpdateCustomizationSettingsTabDto } from '../../tab/dto/update-customization-settings-tab.dto';
import type { UpdateCustomizationSettingsTagDto } from '../../tag/dto/update-customization-settings-tag.dto';
import type { UpdateCustomizationSettingsUserDto } from '../../user/dto/update-customization-settings-user.dto';

import { CustomizationSettings as CustomizationSettingsQuestion } from '../../question/entities/customization-settings';
import { CustomizationSettings as CustomizationSettingsTab } from '../../tab/entities/customization-settings';
import { CustomizationSettings as CustomizationSettingsTag } from '../../tag/entities/customization-settings';
import { CustomizationSettings as CustomizationSettingsUser } from '../../user/entities/customization-settings';

type CustomizationSettings =
  | CustomizationSettingsQuestion
  | CustomizationSettingsTab
  | CustomizationSettingsTag
  | CustomizationSettingsUser;

type UpdateCustomizationSettingsDto =
  | UpdateCustomizationSettingsQuestionDto
  | UpdateCustomizationSettingsTabDto
  | UpdateCustomizationSettingsTagDto
  | UpdateCustomizationSettingsUserDto;

const settingsMap: Record<'question' | 'tab' | 'tag' | 'user', new () => CustomizationSettings> = {
  question: CustomizationSettingsQuestion,
  tab: CustomizationSettingsTab,
  tag: CustomizationSettingsTag,
  user: CustomizationSettingsUser,
};

export const updateCustomizationSettings = (
  type: 'question' | 'tab' | 'tag' | 'user',
  currentSettings: CustomizationSettings,
  updateDto: UpdateCustomizationSettingsDto,
): CustomizationSettings => {
  const settings = currentSettings ?? new settingsMap[type]();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { type: _omitType, ...restUpdateDto } = updateDto;

  return {
    ...settings,
    ...restUpdateDto,
  };
};
