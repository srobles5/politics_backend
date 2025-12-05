# APA Backend API

Backend API desarrollado con **Node.js + TypeScript + Express + PostgreSQL** para la gestión de Líderes y Votantes.

## 📋 Características

- ✅ CRUD completo de Líderes
- ✅ CRUD completo de Votantes
- ✅ Two Factor Authentication (2FA)
- ✅ Deep Linking para creación de votantes
- ✅ Validación de datos con Zod
- ✅ Rate limiting para seguridad
- ✅ Logging y manejo de errores
- ✅ Migraciones de base de datos

## 🚀 Instalación

### Prerrequisitos

- Node.js (v18 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

### Pasos de instalación

1. **Navegar a la carpeta Backend:**
   ```bash
   cd Backend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   ```
   
   Editar `.env` con tus credenciales:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/apa_db
   PORT=3000
   NODE_ENV=development
   ```

4. **Crear la base de datos:**
   ```bash
   createdb apa_db
   ```

5. **Ejecutar migraciones:**
   ```bash
   npm run migrate
   ```

6. **Iniciar el servidor:**
   ```bash
   npm run dev
   ```

## 📁 Estructura del Proyecto

```
Backend/
├── src/
│   ├── modules/           # Módulos de la aplicación
│   │   ├── leaders/      # Módulo de líderes
│   │   ├── voters/       # Módulo de votantes
│   │   └── twofactor/    # Módulo de Two Factor
│   ├── db/               # Base de datos
│   │   ├── models/       # Modelos de datos
│   │   └── migrations/   # Migraciones SQL
│   ├── config/           # Configuración
│   ├── middlewares/      # Middlewares globales
│   ├── utils/            # Utilidades
│   └── types/            # Tipos TypeScript
├── dist/                 # Código compilado
├── package.json
├── tsconfig.json
└── README.md
```

## 🔌 Endpoints API

### Líderes

- `POST /api/leaders` - Crear líder
- `GET /api/leaders` - Listar líderes (con ordenamiento: `?sortBy=nombre&sortOrder=asc`)
- `GET /api/leaders/:id` - Obtener líder por ID
- `PUT /api/leaders/:id` - Actualizar líder
- `DELETE /api/leaders/:id` - Eliminar líder
- `GET /api/leaders/:leaderId/link` - Obtener deep link para crear votante

### Votantes

- `POST /api/voters` - Crear votante
- `GET /api/voters/leader/:leaderId` - Listar votantes por líder
- `GET /api/voters/:id` - Obtener votante por ID
- `PUT /api/voters/:id` - Actualizar votante
- `DELETE /api/voters/:id` - Eliminar votante

### Two Factor

- `POST /api/twofactor/request` - Solicitar código 2FA
- `POST /api/twofactor/validate` - Validar código 2FA

### Seed (Datos de Prueba)

- `POST /api/seed/seed` - Generar datos de prueba
  ```json
  {
    "leaderCount": 5,      // Número de líderes (1-100)
    "votersPerLeader": 8  // Número de votantes por líder (0-50)
  }
  ```
- `POST /api/seed/clear` - Limpiar todos los datos de la base de datos
- `GET /api/seed/stats` - Obtener estadísticas de la base de datos

## 📝 Ejemplos de Uso

### Crear un líder

```bash
curl -X POST http://localhost:3000/api/leaders \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "celular": "3123456789"
  }'
```

### Listar líderes ordenados por nombre

```bash
curl "http://localhost:3000/api/leaders?sortBy=nombre&sortOrder=asc"
```

### Crear un votante

```bash
curl -X POST http://localhost:3000/api/voters \
  -H "Content-Type: application/json" \
  -d '{
    "leaderId": "uuid-del-lider",
    "municipio": "Medellín",
    "barrio": "El Poblado",
    "nombres": "María",
    "apellidos": "García",
    "cedula": "1234567890",
    "email": "maria@example.com",
    "celular": "3123456789",
    "fechaNacimiento": "1990-01-15",
    "funcionCargo": "Coordinador",
    "profesion": "Ingeniero"
  }'
```

### Solicitar código 2FA

```bash
curl -X POST http://localhost:3000/api/twofactor/request
```

### Validar código 2FA

```bash
curl -X POST http://localhost:3000/api/twofactor/validate \
  -H "Content-Type: application/json" \
  -d '{
    "code": "123456"
  }'
```

### Generar datos de prueba

```bash
# Generar 10 líderes con 15 votantes cada uno
curl -X POST http://localhost:3000/api/seed/seed \
  -H "Content-Type: application/json" \
  -d '{
    "leaderCount": 10,
    "votersPerLeader": 15
  }'
```

### Limpiar base de datos

```bash
curl -X POST http://localhost:3000/api/seed/clear
```

### Obtener estadísticas

```bash
curl http://localhost:3000/api/seed/stats
```

## 🔒 Seguridad

- Rate limiting en endpoints de Two Factor (5 intentos por 15 minutos)
- Validación de datos con Zod
- CORS configurado
- Manejo seguro de errores

## 🛠️ Scripts Disponibles

- `npm run dev` - Inicia el servidor en modo desarrollo con hot reload
- `npm run build` - Compila TypeScript a JavaScript
- `npm start` - Inicia el servidor en modo producción
- `npm run migrate` - Ejecuta las migraciones de base de datos
- `npm run seed:generate [leaderCount] [votersPerLeader]` - Genera datos de prueba
  - Ejemplo: `npm run seed:generate 10 15` (10 líderes, 15 votantes cada uno)
  - Por defecto: `npm run seed:generate` (5 líderes, 8 votantes cada uno)
- `npm run seed:clear` - Limpia todos los datos de la base de datos
- `npm run typecheck` - Verifica tipos TypeScript sin compilar

## 🌱 Generar Datos de Prueba

### Desde la Terminal

```bash
# Generar 5 líderes con 8 votantes cada uno (valores por defecto)
npm run seed:generate

# Generar 10 líderes con 8 votantes cada uno
npm run seed:generate 10

# Generar 10 líderes con 15 votantes cada uno
npm run seed:generate 10 15

# Limpiar todos los datos
npm run seed:clear
```

### Desde la API

```bash
# Generar datos de prueba
curl -X POST http://localhost:3000/api/seed/seed \
  -H "Content-Type: application/json" \
  -d '{
    "leaderCount": 10,
    "votersPerLeader": 15
  }'

# Limpiar base de datos
curl -X POST http://localhost:3000/api/seed/clear

# Obtener estadísticas
curl http://localhost:3000/api/seed/stats
```

## 📦 Tecnologías

- **Node.js** - Runtime
- **TypeScript** - Lenguaje
- **Express** - Framework web
- **PostgreSQL** - Base de datos
- **Zod** - Validación de esquemas
- **Morgan** - Logging HTTP
- **express-rate-limit** - Rate limiting

## 🔌 Conectar con Frontend

El frontend puede conectarse a este backend configurando la variable de entorno:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

O en producción:

```env
EXPO_PUBLIC_API_URL=https://tu-backend.com/api
```

## 📄 Licencia

Este proyecto es privado.

