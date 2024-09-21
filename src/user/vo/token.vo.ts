import { ApiProperty } from '@nestjs/swagger';

/**
 * TokenVo.
 *
 * @author dafengzhen
 */
export class TokenVo {
  /**
   * id.
   */
  @ApiProperty()
  id: number;

  /**
   * username.
   */
  @ApiProperty()
  username: string;

  /**
   * token.
   */
  @ApiProperty()
  token: string;

  /**
   * expDays
   */
  @ApiProperty({ default: 31 })
  expDays: number;

  constructor(vo: TokenVo) {
    Object.assign(this, vo);
  }
}
