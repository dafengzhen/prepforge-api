import { Base } from '../../common/entities/base.entity';
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Tag } from '../../tag/entities/tag.entity';
import { Tab } from '../../tab/entities/tab.entity';
import { CustomizationSettings } from './customization-settings';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Question.
 *
 * @author dafengzhen
 */
@Entity()
export class Question extends Base {
  /**
   * question.
   */
  @ApiProperty()
  @Index({ fulltext: true, parser: 'ngram' })
  @Column({ type: 'text' })
  question: string;

  /**
   * answer.
   */
  @ApiProperty()
  @Index({ fulltext: true, parser: 'ngram' })
  @Column({ type: 'text' })
  answer: string;

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
  @ManyToOne(() => Tab, (tab) => tab.questions, { onDelete: 'CASCADE' })
  tab: Tab;

  /**
   * tag.
   */
  @ApiPropertyOptional({ type: () => Tag })
  @ManyToOne(() => Tag, (tag) => tag.questions, { onDelete: 'CASCADE' })
  tag: Tag;

  /**
   * user.
   */
  @ApiPropertyOptional({ type: () => User })
  @ManyToOne(() => User, (user) => user.questions, { onDelete: 'CASCADE' })
  user: User;

  /**
   * customizationSettings.
   */
  @ApiPropertyOptional({
    type: () => CustomizationSettings,
    default: { type: 'question' },
  })
  @Column({ type: 'json' })
  customizationSettings: CustomizationSettings = new CustomizationSettings();
}
