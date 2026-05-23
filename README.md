# 🌸 Anime App v2.0 — Proyecto Final

App móvil de animes con **Login**, **Categorías personalizadas**, **Docker** y **SonarQube**.

---

## 📁 Estructura del proyecto

```
animes/
├── backend/
│   ├── index.js                ← API Express + Supabase
│   ├── package.json
│   ├── Dockerfile              ← Contenedor Docker
│   └── .env.example
├── frontend/
│   ├── app/
│   │   ├── login.tsx           ← Pantalla Login
│   │   ├── register.tsx        ← Pantalla Registro
│   │   ├── (tabs)/
│   │   │   ├── saint-seiya.tsx
│   │   │   ├── hunter-x-hunter.tsx
│   │   │   ├── one-piece.tsx
│   │   │   ├── categorias.tsx  ← Mis Categorías (NUEVO)
│   │   │   └── index.tsx       ← Resumen
│   │   └── categoria/
│   │       └── [id].tsx        ← Detalle de categoría (NUEVO)
│   ├── context/
│   │   ├── AnimeContext.tsx
│   │   └── AuthContext.tsx     ← Sesión de usuario (NUEVO)
│   └── lib/
│       └── supabase.ts         ← Cliente Supabase (NUEVO)
├── docker-compose.yml          ← Backend + SonarQube
├── sonar-project.properties    ← Config SonarQube
└── supabase-migration.sql      ← Tablas a crear en Supabase
```

---

## 1️⃣ CONFIGURAR SUPABASE

### A) Crear las tablas
1. Ve a tu proyecto en [supabase.com](https://supabase.com)
2. Abre **SQL Editor**
3. Pega y ejecuta el contenido de `supabase-migration.sql`

### B) Habilitar Auth por Email
1. Ve a **Authentication → Providers**
2. Asegúrate de que **Email** esté habilitado
3. En **Authentication → Email Templates** puedes personalizar el correo de confirmación

### C) Obtener las claves
- **SUPABASE_URL**: Settings → API → Project URL
- **SUPABASE_KEY** (backend): Settings → API → `service_role` key *(mantener secreta)*
- **SUPABASE_ANON_KEY** (frontend): Settings → API → `anon public` key

---

## 2️⃣ CORRER CON DOCKER (local)

```bash
# 1. Copia y llena el .env del backend
cp backend/.env.example backend/.env
# Edita backend/.env con tus credenciales de Supabase

# 2. Levanta backend + SonarQube
docker-compose up --build -d

# El backend queda en:   http://localhost:3000
# SonarQube queda en:    http://localhost:9000
# Swagger docs en:       http://localhost:3000/api/docs
```

---

## 3️⃣ ANALIZAR CON SONARQUBE

```bash
# 1. Espera que SonarQube esté listo (puede tardar ~1 min)
# Abre http://localhost:9000 → usuario: admin / contraseña: admin

# 2. Crea un proyecto local en SonarQube
#    - Name: anime-backend
#    - Genera un token y copialo

# 3. Corre el análisis (necesitas sonar-scanner instalado)
sonar-scanner -Dsonar.token=TU_TOKEN_AQUI

# O con Docker sin instalar sonar-scanner:
docker run --rm --network host \
  -v "$(pwd):/usr/src" \
  sonarsource/sonar-scanner-cli \
  -Dsonar.token=TU_TOKEN_AQUI
```

---

## 4️⃣ CORRER EL FRONTEND

```bash
cd frontend

# 1. Copia y llena el .env
cp .env.example .env
# Edita .env con tus claves de Supabase

# 2. Instala dependencias
npm install

# 3. Corre la app
npx expo start
```

> ⚠️ Si usas emulador Android, en `.env` cambia la URL del backend a `http://10.0.2.2:3000`

---

## 5️⃣ GENERAR APK

```bash
# Instala EAS CLI
npm install -g eas-cli

# Inicia sesión en Expo
eas login

# Configura (solo primera vez)
eas build:configure

# Genera el APK
cd frontend
eas build -p android --profile preview
```

El APK se descarga desde expo.dev y lo instalas en tu teléfono activando **"Instalar desde fuentes desconocidas"**.

---

## 6️⃣ DEPLOY EN LA NUBE

### Backend (Railway)
1. Crea cuenta en [railway.app](https://railway.app)
2. New Project → Deploy from GitHub repo
3. Selecciona la carpeta `/backend`
4. Agrega las variables de entorno (SUPABASE_URL, SUPABASE_KEY)
5. Copia la URL generada y úsala como `SERVER_URL` y en el frontend

### Frontend Web (Netlify/Vercel)
```bash
cd frontend
npx expo export --platform web
# Sube la carpeta /dist a Netlify o Vercel
```

---

## 🔑 Variables de entorno

| Archivo | Variable | Descripción |
|---------|----------|-------------|
| `backend/.env` | `SUPABASE_URL` | URL de tu proyecto Supabase |
| `backend/.env` | `SUPABASE_KEY` | Service role key (secreta) |
| `backend/.env` | `SERVER_URL` | URL pública del backend |
| `frontend/.env` | `EXPO_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase |
| `frontend/.env` | `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Anon key (pública) |
| `frontend/.env` | `EXPO_PUBLIC_API_URL` | URL del backend |

---

## 🌸 Funcionalidades

- **Login / Registro** con Supabase Auth (sesión por usuario)
- **Saint Seiya, Hunter x Hunter, One Piece** — búsqueda de personajes
- **Resumen** — historial de personajes consultados
- **Mis Categorías** — crear, editar y eliminar categorías personalizadas
- **Animes en categoría** — agregar animes con género, descripción, estado y calificación
- **Tema rosado** 🌸 en toda la app
