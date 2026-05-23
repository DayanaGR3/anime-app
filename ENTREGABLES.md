# 📱 Anime App - Documento de Entregables

## 📋 Información del Proyecto

| Campo | Valor |
|-------|-------|
| **Nombre** | Anime App |
| **Versión** | 2.0.0 |
| **Repositorio** | https://github.com/DayanaGR3/anime-app |

---

## 🌐 URLs de Producción

### Backend (API REST)
| Recurso | URL |
|---------|-----|
| **API Base** | https://anime-api-backend-b8tk.onrender.com |
| **Health Check** | https://anime-api-backend-b8tk.onrender.com/health |
| **Swagger Docs** | https://anime-api-backend-b8tk.onrender.com/api/docs |

### Frontend Web
| Recurso | URL |
|---------|-----|
| **Aplicación Web** | https://gregarious-sunburst-2e118b.netlify.app |
| **Login** | https://gregarious-sunburst-2e118b.netlify.app/login |

### Aplicación Móvil (Android)
| Recurso | URL |
|---------|-----|
| **APK Download** | https://expo.dev/artifacts/eas/cPpCy4TC8tTfkMteH3AbXK.apk |
| **Expo Build Dashboard** | https://expo.dev/accounts/dayanagr3/projects/anime-app/builds |

---

## 🔍 SonarQube - Análisis de Calidad

| Campo | Valor |
|-------|-------|
| **URL Local** | http://localhost:9000 |
| **Dashboard del Proyecto** | http://localhost:9000/dashboard?id=anime-backend |
| **Project Key** | `anime-backend` |

### Cómo ejecutar SonarQube localmente:
```bash
# Desde la raíz del proyecto
docker-compose up -d sonarqube

# Esperar ~2 minutos y acceder a http://localhost:9000
# Usuario: admin | Contraseña: admin (cambiar en primer login)

# Ejecutar análisis
sonar-scanner
```

---

## 🐳 Docker - Servicios Contenerizados

### Comandos para levantar servicios:
```bash
# Levantar todos los servicios (backend + SonarQube)
docker-compose up -d

# Ver servicios corriendo
docker ps

# Ver logs del backend
docker logs anime-backend

# Detener servicios
docker-compose down
```

### Puertos:
| Servicio | Puerto |
|----------|--------|
| Backend | 3000 |
| SonarQube | 9000 |

---

## 🗄️ Base de Datos (Supabase)

| Campo | Valor |
|-------|-------|
| **URL** | https://hkhhbtelddhzewwttyfr.supabase.co |
| **Dashboard** | https://supabase.com/dashboard/project/hkhhbtelddhzewwttyfr |

---

## 📱 Instalación del APK

### Pasos:
1. Descargar el APK desde el link proporcionado
2. Transferir al dispositivo Android (USB, email, o descarga directa)
3. En el dispositivo: **Configuración → Seguridad → Instalar apps desconocidas** → Habilitar
4. Abrir el archivo APK e instalar
5. Abrir la aplicación "Anime App"

---

## 📁 Estructura del Proyecto

```
anime-app/
├── backend/                 # API REST (Node.js + Express)
│   ├── index.js            # Servidor principal
│   ├── Dockerfile          # Configuración Docker
│   ├── package.json        # Dependencias
│   └── .env                # Variables de entorno
├── frontend/               # App móvil/web (Expo + React Native)
│   ├── app/                # Pantallas (Expo Router)
│   ├── components/         # Componentes reutilizables
│   ├── context/            # Contextos de React
│   ├── lib/                # Configuración Supabase
│   ├── app.json            # Configuración Expo
│   └── eas.json            # Configuración EAS Build
├── docker-compose.yml      # Orquestación de contenedores
├── sonar-project.properties # Configuración SonarQube
└── README.md               # Documentación general
```

---

## ✅ Checklist de Requisitos Cumplidos

- [x] **SonarQube** para verificar calidad y seguridad del backend
- [x] **Docker** para contenerización de microservicios
- [x] **Backend desplegado en la nube** (Render)
- [x] **Documentación Swagger** disponible
- [x] **Frontend web desplegado en la nube** (Netlify)
- [x] **APK generado** para instalación en teléfono

---

## 👤 Credenciales de Prueba

Para probar la aplicación, puedes registrar un nuevo usuario o usar las credenciales existentes en Supabase.

---

*Documento generado el 23 de Mayo de 2026*
