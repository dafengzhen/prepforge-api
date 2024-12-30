import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { Base } from '../../common/entities/base.entity';
import { Question } from '../../question/entities/question.entity';
import { Tag } from '../../tag/entities/tag.entity';
import { User } from '../../user/entities/user.entity';
import { CustomizationSettings } from './customization-settings';

/**
 * Tab.
 *
 * @author dafengzhen
 */
@Entity()
export class Tab extends Base {
  /**
   * customizationSettings.
   */
  @ApiProperty({ default: { type: 'tab' }, type: () => CustomizationSettings })
  @Column({ type: 'json' })
  customizationSettings: CustomizationSettings = new CustomizationSettings();

  /**
   * name.
   */
  @ApiProperty()
  @Column()
  name: string;

  /**
   * questions.
   */
  @ApiPropertyOptional({ type: () => Question })
  @OneToMany(() => Question, (question) => question.tab)
  questions: Question[];

  /**
   * sort.
   */
  @ApiProperty()
  @Column({ default: 0 })
  sort: number;

  /**
   * tags.
   */
  @ApiPropertyOptional({ type: () => Tag })
  @OneToMany(() => Tag, (tag) => tag.tab)
  tags: Tag[];

  /**
   * user.
   */
  @ApiPropertyOptional({ type: () => User })
  @ManyToOne(() => User, (user) => user.tabs, { onDelete: 'CASCADE' })
  user: User;
}
