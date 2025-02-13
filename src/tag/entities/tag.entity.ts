import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { Base } from '../../common/entities/base.entity';
import { Question } from '../../question/entities/question.entity';
import { Tab } from '../../tab/entities/tab.entity';
import { User } from '../../user/entities/user.entity';
import { CustomConfig } from './custom-config';

/**
 * Tag.
 *
 * @author dafengzhen
 */
@Entity()
export class Tag extends Base {
  /**
   * customConfig.
   */
  @ApiPropertyOptional({
    default: { type: 'tag' },
    type: () => CustomConfig,
  })
  @Column({ type: 'json' })
  customConfig: CustomConfig = new CustomConfig();

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
  @OneToMany(() => Question, (question) => question.tag, { cascade: true })
  questions: Question[];

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
}
