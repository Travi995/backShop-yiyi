import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class Enable2FADto {
  @ApiProperty({ example: 'usuario@email.com', description: 'Correo electrónico del usuario' })
  @IsEmail()
  email: string;
} 