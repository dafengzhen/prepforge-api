import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

/**
 * Base,
 *
 * @author dafengzhen
 */
export abstract class Base {
  /**
   * createDate.
   */
  @ApiProperty()
  @CreateDateColumn()
  createDate: string;

  /**
   * deleteDate.
   */
  @ApiHideProperty()
  @DeleteDateColumn()
  @Exclude()
  deleteDate: string;

  /**
   * id.
   */
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * updateDate.
   */
  @ApiPropertyOptional()
  @UpdateDateColumn()
  updateDate: string;

  /**
   * version.
   */
  @ApiHideProperty()
  @Exclude()
  @VersionColumn()
  version: number;
}
