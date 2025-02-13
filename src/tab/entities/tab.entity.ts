import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { Base } from '../../common/entities/base.entity';
import { Question } from '../../question/entities/question.entity';
import { Tag } from '../../tag/entities/tag.entity';
import { User } from '../../user/entities/user.entity';
import { CustomConfig } from './custom-config';

/**
 * Tab.
 *
 * @author dafengzhen
 */
@Entity()
export class Tab extends Base {
  /**
   * customConfig.
   */
  @ApiProperty({ default: { type: 'tab' }, type: () => CustomConfig })
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
  @OneToMany(() => Question, (question) => question.tab, { cascade: true })
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
  @OneToMany(() => Tag, (tag) => tag.tab, { cascade: true })
  tags: Tag[];

  /**
   * user.
   */
  @ApiPropertyOptional({ type: () => User })
  @ManyToOne(() => User, (user) => user.tabs, { onDelete: 'CASCADE' })
  user: User;
}
