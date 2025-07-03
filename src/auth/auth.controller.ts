import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Enable2FADto } from './dto/enable-2fa.dto';
import { Verify2FADto } from './dto/verify-2fa.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o usuario ya registrado.' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(
      registerDto.name,
      registerDto.email,
      registerDto.password,
      registerDto.phone
    );
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión con email y contraseña' })
  @ApiResponse({ status: 201, description: 'Inicio de sesión exitoso.' })
  @ApiResponse({ status: 400, description: 'Credenciales incorrectas o datos inválidos.' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Get('github')
  @ApiOperation({ summary: 'Iniciar sesión con GitHub (OAuth)' })
  @ApiQuery({ name: 'redirectTo', required: false, description: 'URL a la que redirigir tras autenticación' })
  @ApiResponse({ status: 200, description: 'URL de redirección a GitHub.' })
  async loginWithGithub(@Query('redirectTo') redirectTo?: string) {
    return this.authService.loginWithGithub(redirectTo);
  }

  @Post('2fa/enable')
  @ApiOperation({ summary: 'Activar 2FA por correo electrónico' })
  @ApiResponse({ status: 201, description: 'Código 2FA generado y enviado al correo.' })
  @ApiResponse({ status: 400, description: 'Error al activar 2FA.' })
  async enable2FA(@Body() dto: Enable2FADto) {
    return this.authService.enable2FA(dto.email);
  }

  @Post('2fa/verify')
  @ApiOperation({ summary: 'Verificar código 2FA y activar 2FA para el usuario' })
  @ApiResponse({ status: 201, description: '2FA activado correctamente.' })
  @ApiResponse({ status: 400, description: 'Código incorrecto o expirado.' })
  async verify2FA(@Body() dto: Verify2FADto) {
    return this.authService.verify2FA(dto.email, dto.code);
  }
}
