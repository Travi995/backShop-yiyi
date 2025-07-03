import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'usuario@email.com', description: 'Correo electrónico del usuario' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123*', minLength: 8, maxLength: 32, description: 'Contraseña del usuario' })
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;
} 