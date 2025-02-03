import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

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
  @Length(6, 18)
  password: string;

  /**
   * username.
   */
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(3, 15)
  username: string;
}
