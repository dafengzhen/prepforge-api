import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * LoginDto.
 *
 * @author dafengzhen
 */
export class LoginDto {
  /**
   * password.
   */
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

  /**
   * username.
   */
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;
}
