import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class Verify2FADto {
  @ApiProperty({ example: 'usuario@email.com', description: 'Correo electrónico del usuario' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', description: 'Código de verificación 2FA' })
  @IsString()
  @Length(6, 10)
  code: string;
} 