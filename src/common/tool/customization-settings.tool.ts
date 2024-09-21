import { CustomizationSettings as CustomizationSettingsUser } from '../../user/entities/customization-settings';
import { CustomizationSettings as CustomizationSettingsTab } from '../../tab/entities/customization-settings';
import { CustomizationSettings as CustomizationSettingsTag } from '../../tag/entities/customization-settings';
import { CustomizationSettings as CustomizationSettingsQuestion } from '../../question/entities/customization-settings';
import { UpdateCustomizationSettingsUserDto } from '../../user/dto/update-customization-settings-user.dto';
import { UpdateCustomizationSettingsTabDto } from '../../tab/dto/update-customization-settings-tab.dto';
import { UpdateCustomizationSettingsTagDto } from '../../tag/dto/update-customization-settings-tag.dto';
import { UpdateCustomizationSettingsQuestionDto } from '../../question/dto/update-customization-settings-question.dto';

type CustomizationSettings =
  | CustomizationSettingsUser
  | CustomizationSettingsTab
  | CustomizationSettingsTag
  | CustomizationSettingsQuestion;

type UpdateCustomizationSettingsDto =
  | UpdateCustomizationSettingsUserDto
  | UpdateCustomizationSettingsTabDto
  | UpdateCustomizationSettingsTagDto
  | UpdateCustomizationSettingsQuestionDto;

const settingsMap: Record<
  'user' | 'tab' | 'tag' | 'question',
  new () => CustomizationSettings
> = {
  user: CustomizationSettingsUser,
  tab: CustomizationSettingsTab,
  tag: CustomizationSettingsTag,
  question: CustomizationSettingsQuestion,
};

export const updateCustomizationSettings = (
  type: 'user' | 'tab' | 'tag' | 'question',
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
