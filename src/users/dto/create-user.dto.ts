import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
} from 'class-validator';

export class CreateUserDto {
  @IsDefined()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  firstName: string;

  @IsDefined()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  lastName: string;
  
  @IsDefined()
  @IsEmail()
  email: string;
  
  @IsDefined()
  @IsString()
  @MinLength(4)
  password: string;
}