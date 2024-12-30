import { ApiProperty } from '@nestjs/swagger';

/**
 * TokenVo.
 *
 * @author dafengzhen
 */
export class TokenVo {
  /**
   * expDays
   */
  @ApiProperty({ default: 31 })
  expDays: number;

  /**
   * id.
   */
  @ApiProperty()
  id: number;

  /**
   * token.
   */
  @ApiProperty()
  token: string;

  /**
   * username.
   */
  @ApiProperty()
  username: string;

  constructor(vo: TokenVo) {
    Object.assign(this, vo);
  }
}
