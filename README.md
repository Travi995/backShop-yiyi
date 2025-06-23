# BackShop API

Backend desarrollado con NestJS y conectado a Supabase para el proyecto BackShop.

## 🚀 Tecnologías

- **NestJS** - Framework de Node.js para aplicaciones escalables
- **TypeScript** - Lenguaje de programación tipado
- **Supabase** - Base de datos PostgreSQL en la nube
- **Swagger** - Documentación automática de la API
- **class-validator** - Validación de DTOs
- **class-transformer** - Transformación de objetos
- **dotenv** - Gestión de variables de entorno

## 📋 Prerrequisitos

- Node.js (v18 o superior)
- npm o yarn
- Cuenta en Supabase

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Travi995/backShop-yiyi.git
   cd backShop-yiyi
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   Crear archivo `.env` en la raíz del proyecto:
   ```env
   SUPABASE_URL=https://cyvhkjwefqpenmvjkiqk.supabase.co
   SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5dmhrandlZnFwZW5tdmpraXFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2ODI0MzEsImV4cCI6MjA2NjI1ODQzMX0.pAvCXp7UYNlw-VoC-u96idHXkAreav60pb3gykS-IsE
   PORT=3000
   ```

## 🏃‍♂️ Ejecución

### Desarrollo
```bash
npm run start:dev
```

### Producción
```bash
npm run build
npm run start:prod
```

## 📁 Estructura del Proyecto

```
src/
├── common/
│   └── supabase/
│       └── supabase.service.ts    # Servicio de conexión a Supabase
├── app.module.ts                  # Módulo principal
└── main.ts                        # Punto de entrada de la aplicación
```

## 🔧 Configuración

### Prefijo de API
Todas las rutas de la API tienen el prefijo: `api/v0`

### Validación Global
- **whitelist**: true - Solo permite propiedades definidas en DTOs
- **forbidNonWhitelisted**: true - Rechaza propiedades no permitidas
- **transform**: true - Transforma automáticamente tipos de datos

## 📚 API y Documentación

### Swagger UI
La documentación interactiva de la API está disponible en:
```
http://localhost:3000/api
```

### Características de Swagger
- **Documentación automática** de todos los endpoints
- **Interfaz interactiva** para probar endpoints
- **Esquemas de DTOs** generados automáticamente
- **Ejemplos de requests y responses**
- **Autenticación integrada** (cuando se implemente)

### Configuración de Swagger
```typescript
const config = new DocumentBuilder()
  .setTitle('BackShop API')
  .setDescription('API para el proyecto BackShop con NestJS y Supabase')
  .setVersion('1.0')
  .addTag('backShop')
  .build();
```

### URLs de la API
- **Base URL**: `http://localhost:3000/api/v0`
- **Documentación**: `http://localhost:3000/api`
- **Health Check**: `http://localhost:3000/api/v0/health` (cuando se implemente)

### Ejemplo de uso de la API
```bash
# Obtener documentación
curl http://localhost:3000/api

# Endpoints de la API (cuando se implementen)
curl http://localhost:3000/api/v0/users
curl http://localhost:3000/api/v0/products
```

## 🗄️ Base de Datos

### Supabase
- **URL**: https://cyvhkjwefqpenmvjkiqk.supabase.co
- **Servicio**: `src/common/supabase/supabase.service.ts`

### Uso del Servicio
```typescript
import { SupabaseService } from './common/supabase/supabase.service';

constructor(private readonly supabaseService: SupabaseService) {}

// Ejemplo de consulta
const { data, error } = await this.supabaseService.getClient()
  .from('tabla')
  .select('*');
```

## 🔒 Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `SUPABASE_URL` | URL del proyecto Supabase | `https://xxx.supabase.co` |
| `SUPABASE_KEY` | Clave pública de Supabase | `eyJhbGciOiJIUzI1NiIs...` |
| `PORT` | Puerto del servidor | `3000` |

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Cobertura de tests
npm run test:cov
```

## 📦 Scripts Disponibles

```bash
npm run start          # Iniciar en modo producción
npm run start:dev      # Iniciar en modo desarrollo
npm run start:debug    # Iniciar en modo debug
npm run build          # Compilar el proyecto
npm run test           # Ejecutar tests
npm run test:watch     # Ejecutar tests en modo watch
npm run test:cov       # Ejecutar tests con cobertura
npm run test:e2e       # Ejecutar tests e2e
```

## 🔄 Control de Versiones

El proyecto utiliza GitFlow:
- `master` - Rama principal (producción)
- `develop` - Rama de desarrollo
- `feature/*` - Ramas de características
- `release/*` - Ramas de lanzamiento
- `hotfix/*` - Ramas de correcciones urgentes

## 📝 Próximas Características

- [ ] Autenticación con Supabase Auth
- [ ] CRUD completo de entidades
- [ ] Middleware de logging
- [ ] Tests unitarios y e2e
- [ ] Dockerización
- [ ] CI/CD pipeline
- [ ] Health check endpoint
- [ ] Rate limiting
- [ ] CORS configuration

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

## 👨‍💻 Autor

**Travi995** - [GitHub](https://github.com/Travi995)
