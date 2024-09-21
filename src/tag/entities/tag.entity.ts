import { Base } from '../../common/entities/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Question } from '../../question/entities/question.entity';
import { Tab } from '../../tab/entities/tab.entity';
import { CustomizationSettings } from './customization-settings';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Tag.
 *
 * @author dafengzhen
 */
@Entity()
export class Tag extends Base {
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
   * tab.
   */
  @ApiPropertyOptional({ type: () => Tab })
  @ManyToOne(() => Tab, (tab) => tab.tags, { onDelete: 'CASCADE' })
  tab: Tab;

  /**
   * user.
   */
  @ApiPropertyOptional({ type: () => User })
  @ManyToOne(() => User, (user) => user.tags, { onDelete: 'CASCADE' })
  user: User;

  /**
   * questions.
   */
  @ApiPropertyOptional({ type: () => Question })
  @OneToMany(() => Question, (question) => question.tag)
  questions: Question[];

  /**
   * customizationSettings.
   */
  @ApiPropertyOptional({
    type: () => CustomizationSettings,
    default: { type: 'tag' },
  })
  @Column({ type: 'json' })
  customizationSettings: CustomizationSettings = new CustomizationSettings();
}
