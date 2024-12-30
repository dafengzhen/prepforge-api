import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';

import { Base } from '../../common/entities/base.entity';
import { Question } from '../../question/entities/question.entity';
import { Tab } from '../../tab/entities/tab.entity';
import { Tag } from '../../tag/entities/tag.entity';
import { CustomizationSettings } from './customization-settings';

/**
 * User.
 *
 * @author dafengzhen
 */
@Entity()
export class User extends Base {
  /**
   * customizationSettings.
   */
  @ApiProperty({ default: { type: 'user' }, type: () => CustomizationSettings })
  @Column({ type: 'json' })
  customizationSettings: CustomizationSettings = new CustomizationSettings();

  /**
   * password.
   */
  @ApiHideProperty()
  @Column()
  @Exclude()
  @IsNotEmpty()
  password: string;

  /**
   * questions.
   */
  @ApiPropertyOptional({ type: () => Question })
  @OneToMany(() => Question, (question) => question.user)
  questions: Question[];

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
   * username.
   */
  @ApiProperty()
  @Column({ unique: true })
  @IsNotEmpty()
  username: string;
}
