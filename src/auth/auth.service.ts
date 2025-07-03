import { Injectable, BadRequestException, InternalServerErrorException, HttpException } from '@nestjs/common';
import { SupabaseService } from '../common/supabase/supabase.service';
import { randomInt } from 'crypto';

@Injectable()
export class AuthService {
	constructor(private readonly supabaseService: SupabaseService) { }

	private handleError(error: any, contexto: string): never {
		let statusCode = 500;
		let errorType = 'Internal Server Error';
		let message = 'Error interno del servidor';
		let details = error?.message || error?.toString();

		// Errores de Supabase
		if (error?.status || error?.code) {
			statusCode = error.status || 400;
			switch (error.status || error.code) {
				case 400:
				case '400':
					errorType = 'Bad Request';
					if (error.message?.includes('already registered')) {
						message = 'El usuario ya está registrado con este email';
					} else if (error.message?.includes('Password should be at least')) {
						message = 'La contraseña debe tener al menos 6 caracteres';
					} else if (error.message?.includes('Invalid email')) {
						message = 'El formato del email no es válido';
					} else {
						message = 'Datos de entrada inválidos';
					}
					break;
				case 401:
				case '401':
					errorType = 'Unauthorized';
					message = 'Credenciales incorrectas';
					break;
				case 422:
				case '422':
					errorType = 'Unprocessable Entity';
					message = 'Los datos proporcionados no son válidos';
					break;
				case 429:
				case '429':
				case 'over_email_send_rate_limit':
					errorType = 'Too Many Requests';
					message = 'Demasiadas solicitudes. Intenta de nuevo más tarde';
					break;
				case 500:
				case '500':
					errorType = 'Internal Server Error';
					message = 'Error interno del servidor de autenticación';
					break;
				default:
					errorType = 'Bad Request';
					message = `Error en la autenticación: ${error.message || 'Error desconocido'}`;
					break;
			}
		} else if (error instanceof HttpException) {
			statusCode = error.getStatus();
			errorType = error.name;
			message = error.message;
			details = error.getResponse();
		}

		throw new HttpException({
			statusCode,
			error: errorType,
			message,
			details,
			contexto
		}, statusCode);
	}

	async register(name: string, email: string, password: string, phone?: string) {
		try {
			// Registro en Supabase Auth
			const { data, error } = await this.supabaseService.getClient().auth.signUp({
				email,
				password,
			});
			if (error) {
				console.error('Supabase Auth error:', error);
				this.handleError(error, 'el registro');
			}
			// Insertar datos adicionales en la tabla users
			if (!data.user?.id) {
				throw new HttpException({
					statusCode: 400,
					error: 'Bad Request',
					message: 'No se pudo obtener el id del usuario desde Supabase Auth',
					details: data,
					contexto: 'el registro de datos adicionales'
				}, 400);
			}
			const { error: insertError } = await this.supabaseService.getClient()
				.from('users')
				.upsert({
					id: data.user?.id,
					name,
					phone,
					email,
					password
				});
			if (insertError) {
				console.error('Supabase users table error:', insertError);
				this.handleError(insertError, 'el registro de datos adicionales');
			}
			return {
				success: true,
				message: 'Usuario registrado exitosamente. Revisa tu email para confirmar la cuenta.',
				data: {
					user: { ...data.user, name, phone },
					session: data.session
				}
			};
		} catch (error) {
			console.error('Catch error en register:', error);
			this.handleError(error, 'el registro');
		}
	}

	async login(email: string, password: string) {
		try {
			const { data, error } = await this.supabaseService.getClient().auth.signInWithPassword({
				email,
				password,
			});
			if (error) {
				this.handleError(error, 'el login');
			}
			return {
				success: true,
				message: 'Inicio de sesión exitoso.',
				data: {
					user: data.user,
					session: data.session
				}
			};
		} catch (error) {
			this.handleError(error, 'el login');
		}
	}

	async loginWithGithub(redirectTo?: string) {
		try {
			const { data, error } = await this.supabaseService.getClient().auth.signInWithOAuth({
				provider: 'github',
				options: redirectTo ? { redirectTo } : undefined,
			});
			if (error) {
				this.handleError(error, 'el login con GitHub');
			}
			return {
				success: true,
				message: 'Redirigiendo a GitHub para autenticación.',
				data: {
					url: data.url
				}
			};
		} catch (error) {
			this.handleError(error, 'el login con GitHub');
		}
	}

	async enable2FA(email: string) {
		try {
			// Generar código 2FA de 6 dígitos
			const code = String(randomInt(100000, 999999));
			const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos
			// Guardar el código y expiración en la tabla users
			const { error } = await this.supabaseService.getClient()
				.from('users')
				.update({ two_fa_code: code, two_fa_expires_at: expiresAt })
				.eq('email', email);
			if (error) {
				this.handleError(error, 'la activación de 2FA');
			}
			// Aquí deberías enviar el código por correo (puedes integrar un servicio SMTP o SendGrid)
			// Por ahora, solo lo devolvemos para pruebas
			return {
				success: true,
				message: 'Código 2FA generado y enviado al correo electrónico.',
				code, // Quitar en producción
				expiresAt,
			};
		} catch (error) {
			this.handleError(error, 'la activación de 2FA');
		}
	}

	async verify2FA(email: string, code: string) {
		try {
			// Buscar usuario y verificar código y expiración
			const { data, error } = await this.supabaseService.getClient()
				.from('users')
				.select('two_fa_code, two_fa_expires_at')
				.eq('email', email)
				.single();
			if (error) {
				this.handleError(error, 'la verificación de 2FA');
			}
			if (!data || !data.two_fa_code || !data.two_fa_expires_at) {
				throw new BadRequestException('No se ha solicitado un código 2FA para este usuario.');
			}
			if (data.two_fa_code !== code) {
				throw new BadRequestException('El código 2FA es incorrecto.');
			}
			if (new Date(data.two_fa_expires_at) < new Date()) {
				throw new BadRequestException('El código 2FA ha expirado.');
			}
			// Activar 2FA y limpiar código
			const { error: updateError } = await this.supabaseService.getClient()
				.from('users')
				.update({ two_fa_enabled: true, two_fa_code: null, two_fa_expires_at: null })
				.eq('email', email);
			if (updateError) {
				this.handleError(updateError, 'la activación final de 2FA');
			}
			return {
				success: true,
				message: '2FA activado correctamente para este usuario.'
			};
		} catch (error) {
			this.handleError(error, 'la verificación de 2FA');
		}
	}
}
