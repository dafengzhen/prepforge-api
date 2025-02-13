import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { Base } from '../../common/entities/base.entity';
import { Tab } from '../../tab/entities/tab.entity';
import { Tag } from '../../tag/entities/tag.entity';
import { User } from '../../user/entities/user.entity';
import { CustomConfig } from './custom-config';

/**
 * Question.
 *
 * @author dafengzhen
 */
@Entity()
export class Question extends Base {
  /**
   * answer.
   */
  @ApiProperty()
  @Column({ type: 'text' })
  @Index({ fulltext: true, parser: 'ngram' })
  answer: string;

  /**
   * customConfig.
   */
  @ApiPropertyOptional({
    default: { type: 'question' },
    type: () => CustomConfig,
  })
  @Column({ type: 'json' })
  customConfig: CustomConfig = new CustomConfig();

  /**
   * question.
   */
  @ApiProperty()
  @Column({ type: 'text' })
  @Index({ fulltext: true, parser: 'ngram' })
  question: string;

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
}
