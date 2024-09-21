import { Column, Entity, OneToMany } from 'typeorm';
import { Base } from '../../common/entities/base.entity';
import { IsNotEmpty } from 'class-validator';
import { Exclude } from 'class-transformer';
import { CustomizationSettings } from './customization-settings';
import { Tab } from '../../tab/entities/tab.entity';
import { Tag } from '../../tag/entities/tag.entity';
import { Question } from '../../question/entities/question.entity';
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

/**
 * User.
 *
 * @author dafengzhen
 */
@Entity()
export class User extends Base {
  /**
   * username.
   */
  @ApiProperty()
  @IsNotEmpty()
  @Column({ unique: true })
  username: string;

  /**
   * password.
   */
  @ApiHideProperty()
  @IsNotEmpty()
  @Exclude()
  @Column()
  password: string;

  /**
   * tags.
   */
  @ApiPropertyOptional({ type: () => Tab })
  @OneToMany(() => Tab, (tab) => tab.user)
  tabs: Tab[];

  /**
   * tags.
   */
  @ApiPropertyOptional({ type: () => Tag })
  @OneToMany(() => Tag, (tag) => tag.user)
  tags: Tag[];

  /**
   * questions.
   */
  @ApiPropertyOptional({ type: () => Question })
  @OneToMany(() => Question, (question) => question.user)
  questions: Question[];

  /**
   * customizationSettings.
   */
  @ApiProperty({ type: () => CustomizationSettings, default: { type: 'user' } })
  @Column({ type: 'json' })
  customizationSettings: CustomizationSettings = new CustomizationSettings();
}
