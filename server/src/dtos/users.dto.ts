import { IsEmail, IsString, IsNumber } from 'class-validator';

export class  CreateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;

  @IsString()
  public full_name: string
  
  @IsString()
  public avatar_url: string

  @IsString()
  public bio: string

  @IsNumber()
  public gender: number
}
