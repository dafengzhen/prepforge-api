import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

/**
 * Base,
 *
 * @author dafengzhen
 */
export abstract class Base {
  /**
   * id.
   */
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * createDate.
   */
  @ApiProperty()
  @CreateDateColumn()
  createDate: string;

  /**
   * updateDate.
   */
  @ApiPropertyOptional()
  @UpdateDateColumn()
  updateDate: string;

  /**
   * deleteDate.
   */
  @ApiHideProperty()
  @Exclude()
  @DeleteDateColumn()
  deleteDate: string;

  /**
   * version.
   */
  @ApiHideProperty()
  @Exclude()
  @VersionColumn()
  version: number;
}
