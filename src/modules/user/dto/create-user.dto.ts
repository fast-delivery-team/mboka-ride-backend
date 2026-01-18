import { IsBoolean, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  email: string;

  @IsString()
  password: string;
  
  @IsBoolean()
  isEmailVerified: boolean
}
