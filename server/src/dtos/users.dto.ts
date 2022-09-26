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
export class  UpdateUserDto {
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
export class  SetFollowerUserDto {
  @IsEmail()
  public email: string;
}
export class  SetFollowingUserDto {
  @IsEmail()
  public email: string;
}
