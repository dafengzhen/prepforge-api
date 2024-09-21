import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * LoginDto.
 *
 * @author dafengzhen
 */
export class LoginDto {
  /**
   * username.
   */
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;

  /**
   * password.
   */
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}
