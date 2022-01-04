import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  readonly password: string;

  @IsOptional()
  @IsEmail()
  readonly email: string;
}
