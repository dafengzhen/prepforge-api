import { MigrationInterface, QueryRunner } from 'typeorm';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * init prepforge.
 *
 * @author dafengzhen
 */
export class Prepforge1726481659881 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const query = readFileSync(
      join(__dirname, '../resource/ddl/v1_1__init.sql'),
      {
        encoding: 'utf8',
      },
    );

    await queryRunner.query(query);
  }

  public async down(): Promise<void> {
    console.log(
      'There is nothing to restore, if necessary consider deleting the database and starting over',
    );
  }
}
