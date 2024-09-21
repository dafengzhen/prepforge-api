import { Base } from '../../common/entities/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Question } from '../../question/entities/question.entity';
import { Tag } from '../../tag/entities/tag.entity';
import { CustomizationSettings } from './customization-settings';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Tab.
 *
 * @author dafengzhen
 */
@Entity()
export class Tab extends Base {
  /**
   * name.
   */
  @ApiProperty()
  @Column()
  name: string;

  /**
   * sort.
   */
  @ApiProperty()
  @Column({ default: 0 })
  sort: number;

  /**
   * user.
   */
  @ApiPropertyOptional({ type: () => User })
  @ManyToOne(() => User, (user) => user.tabs, { onDelete: 'CASCADE' })
  user: User;

  /**
   * tags.
   */
  @ApiPropertyOptional({ type: () => Tag })
  @OneToMany(() => Tag, (tag) => tag.tab)
  tags: Tag[];

  /**
   * questions.
   */
  @ApiPropertyOptional({ type: () => Question })
  @OneToMany(() => Question, (question) => question.tab)
  questions: Question[];

  /**
   * customizationSettings.
   */
  @ApiProperty({ type: () => CustomizationSettings, default: { type: 'tab' } })
  @Column({ type: 'json' })
  customizationSettings: CustomizationSettings = new CustomizationSettings();
}
