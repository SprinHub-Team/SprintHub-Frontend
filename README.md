# SprintHub-Frontend

Frontend de **SprintHub** — plataforma de gestión de proyectos tipo Trello/Jira con tableros kanban, columnas, tarjetas arrastrables (@dnd-kit) y colaboración en tiempo real (Socket.IO), organizada por features.

> Repositorio: https://github.com/SprinHub-Team/SprintHub-Frontend
> Equipo: SprinHub-Team
> Licencia: privada

---

## Tabla de contenidos

1. [Stack tecnológico](#stack-tecnológico)
2. [Requisitos previos](#requisitos-previos)
3. [Instalación y arranque](#instalación-y-arranque)
4. [Variables de entorno](#variables-de-entorno)
5. [Arquitectura (feature-based)](#arquitectura-feature-based)
6. [Estructura de carpetas](#estructura-de-carpetas)
7. [Routing (react-router-dom)](#routing-react-router-dom)
8. [Componentes UI compartidos](#componentes-ui-compartidos)
9. [Features (8 módulos)](#features-8-módulos)
10. [lib (infraestructura compartida)](#lib-infraestructura-compartida)
11. [Estado global (Zustand)](#estado-global-zustand)
12. [Sockets (events con acks tipados)](#sockets-events-con-acks-tipados)
13. [Estilos (CSS Modules + design tokens)](#estilos-css-modules--design-tokens)
14. [Scripts disponibles](#scripts-disponibles)
15. [Rutas de la app](#rutas-de-la-app)
16. [Flujo de autenticación](#flujo-de-autenticación)
17. [Despliegue a producción](#despliegue-a-producción)

---

## Stack tecnológico

| Capa | Tecnología | Versión | Uso |
|---|---|---|---|
| Framework | React | ^19.0.0 | UI con hooks modernos |
| Lenguaje | TypeScript | ^5.x | Tipado estático estricto |
| Bundler | Vite | ^6.3.5 | Dev server + build producción |
| Routing | react-router-dom | ^7.18.4 | BrowserRouter + guards declarativos |
| Styling | CSS Modules + design tokens | — | Estilo aislado por componente, sin Tailwind |
| Estado | Zustand | ^5.0.6 | Stores por feature (sin Redux) |
| HTTP | Axios | ^1.20.0 | Cliente con interceptor JWT |
| Tiempo real | socket.io-client | ^4.8.4 | Sockets con auth JWT y acks tipados |
| Validación | Zod | ^4.0.2 | Schemas de formularios y DTOs |
| Drag & Drop | @dnd-kit/core + sortable + utilities | ^6.3.1 / ^10.0.0 / ^3.2.2 | Tablero kanban con DndContext |
| Iconos | lucide-react | ^0.525.0 | Iconos SVG |
| Utils CSS | clsx | ^2.1.1 | Composición de clases |
| Lint | eslint + eslint-plugin-react-hooks + typescript-eslint | ^9 | Calidad de código |

---

## Requisitos previos

- **Node.js** v20+ (verifica con `node -v`)
- **npm** (instalado con Node)
- **Git** con acceso al repo
- **Backend de SprintHub** corriendo (rama Class; ver [SprintHub-Backend](https://github.com/SprinHub-Team/SprintHub-Backend))
- **Cuenta Cloudinary** (las imágenes de perfil, grupos y avatares se suben por multipart al backend)

---

## Instalación y arranque

```bash
# 1. Clonar el repo EN LA RAMA EDUAR (importante)
git clone -b Eduar https://github.com/SprinHub-Team/SprintHub-Frontend.git
cd SprintHub-Frontend

# 2. Instalar dependencias
npm install

# 3. (Opcional) Crear .env con las URLs del backend
#    Ver "Variables de entorno". Sin .env se usan los valores por defecto.

# 4. Levantar dev server
npm run dev
# → http://localhost:3000

# 5. Verificar tipos y lint
npm run typecheck
npm run lint

# 6. Build de producción + preview
npm run build
npm start
```

---

## Variables de entorno

Crea un archivo `.env` en la raíz (todas opcionales; hay valores por defecto):

```bash
# API REST del backend de SprintHub
VITE_API_URL=http://localhost:5000

# URL del servidor Socket.IO
VITE_SOCKET_URL=http://localhost:5000
```

Estas variables se validan en arranque con Zod (`src/config/envSchema.ts`): si una URL
es inválida la app falla temprano y con un mensaje claro, en vez de romperse en
medio de una petición.

> Nota: las variables con prefijo `VITE_` se exponen al cliente. Nunca pongas
> secretos en ellas.

---

## Arquitectura (feature-based)

El frontend está organizado por **features** (vertical slicing): cada dominio de
negocio es autónomo y contiene todas sus capas internas. Las dependencias solo
van de fuera hacia dentro:

```
app → features → components/ui · lib · config · styles
```

Ninguna capa compartida importa de una feature (salvo `lib/socket`, que tipa sus
eventos con los DTOs de features: la única excepción documentada).

## Estructura de carpetas

```
src/
├── app/                          # Composición y rutas de la app
│   ├── App.tsx                   # Root: restaura sesión + BrowserRouter
│   ├── routes.ts                 # ROUTES: única fuente de verdad de caminos
│   ├── AppRoutes.tsx             # Tabla de rutas (Routes/Route + guards)
│   ├── ProtectedRoute.tsx        # Guard: exige sesión, recuerda state.from
│   ├── PublicRoute.tsx           # Guard: redirige autenticados al dashboard
│   ├── NotFoundPage.tsx          # Vista 404 (ruta comodín *)
│   └── providers/
│       └── AppProviders.tsx      # ErrorBoundary + ToastProvider
├── components/
│   └── ui/                       # 14 componentes UI compartidos
├── features/                     # 8 features (ver más abajo)
│   ├── auth/
│   ├── home/
│   ├── dashboard/
│   ├── groups/
│   ├── boards/
│   ├── columns/
│   ├── cards/
│   └── profile/
├── lib/                          # Infraestructura compartida
│   ├── api/                      # apiClient (axios + JWT) · tokenStore · ApiError · errorHandler
│   ├── socket/                   # socketClient · socketEvents · socketService
│   ├── uploads/                  # fileValidation (reglas de archivos)
│   ├── utils.ts                  # cn() y helpers puros
│   └── zodFormErrors.ts          # issues de Zod → errores por campo
├── config/
│   ├── env.ts                    # env validado con Zod
│   └── envSchema.ts
└── styles/
    ├── tokens.css                # Design tokens (colores, espaciados, radios)
    └── globals.css               # Reset + utilidades base
```

### Estructura interna de cada feature

Cada feature que lo necesita sigue el patrón (las carpetas opcionales se omiten
si no aplican):

```
features/<feature>/
├── pages/        # Vistas montadas por el router
├── components/   # Componentes del dominio (+ CSS Modules)
├── hooks/        # Hooks custom (useXxx, useXxxMutations)
├── services/     # Llamadas HTTP/Socket del dominio
├── store/        # Zustand store del dominio
├── schemas/      # Zod: formSchema (formularios) + dtoSchema (respuestas)
├── types/        # types.ts (dominio) + dto.ts (contrato backend)
└── index.ts      # Barrel: exports públicos de la feature
```

---

## Routing (react-router-dom)

El enrutamiento usa **react-router-dom v7** con `<BrowserRouter>` y sigue el
patrón de guards como layout routes:

- **`routes.ts`** — `ROUTES`, la única fuente de verdad de los caminos. Nadie
  escribe strings sueltos: `import { ROUTES } from '@/app/routes'`.
- **`AppRoutes.tsx`** — la tabla declarativa: rutas públicas agrupadas bajo
  `<PublicRoute />`, privadas bajo `<ProtectedRoute />` y `path="*"` → 404.
- **`ProtectedRoute.tsx`** — si no hay sesión redirige a `/login` guardando la
  ruta original en `state.from`; si la sesión se está restaurando muestra el
  loader. Renderiza las hijas con `<Outlet />`.
- **`PublicRoute.tsx`** — si ya hay sesión redirige a `/dashboard`.
- **`useAuth()`** (`features/auth/hooks`) — traduce el estado del store a
  `isAuthenticated` / `isChecking` / `user`; es lo único que consumen los guards.
- **Navegación** — `useNavigate()` para navegación imperativa (handlers) y
  `readReturnPath()` (`routes.ts`) para volver a `state.from` tras el login.
- **`ScrollToTop`** (`App.tsx`) — restaura el scroll al cambiar de ruta.

Para añadir una página: declara su path en `ROUTES`, cuelga su `<Route>` en el
grupo público o privado de `AppRoutes` y exporta la página desde el barrel de su
feature. Nada más.

---

## Componentes UI compartidos

Ubicación: `src/components/ui/` — 14 componentes reutilizables, cada uno en su
carpeta con su CSS Module:

| Componente | Uso |
|---|---|
| **Alert** | Mensajes de aviso (info, warning, danger, success) |
| **Badge** | Etiquetas pequeñas (estados, prioridades) |
| **Button** | Botón con variantes (primary, secondary, ghost, danger) + loading |
| **EmptyState** | Estado vacío (icono + título + descripción + acción) |
| **ErrorState** | Estado de error con reintento |
| **FileDropzone** | Zona de arrastre de archivos con validación de tipo |
| **FullScreenLoader** | Loader a pantalla completa (restauración de sesión) |
| **Input** | Campo de texto controlado con label y error |
| **LoadingState** | Estado de carga en línea |
| **Modal** | Diálogo con portal |
| **ModalForm** | Layout de formularios dentro de modales |
| **Spinner** | Indicador de carga standalone |
| **TextArea** | Campo multilínea controlado |
| **Toast** | Notificaciones flotantes (ToastProvider + useToast) |

---

## Features (8 módulos)

| Feature | Responsabilidad | Capas |
|---|---|---|
| **auth** | Sesión: login, registro, restauración, logout | pages · components · hooks · services · store · schemas · types |
| **home** | Landing pública (hero, features, CTA) | pages · components |
| **dashboard** | Shell autenticado: sidebar + área principal | pages · components · store |
| **groups** | Grupos de trabajo y miembros (roles admin/collaborator) | todas |
| **boards** | Tableros por grupo + suscripción realtime | todas |
| **columns** | Columnas kanban y sus mutaciones | components · hooks · schemas · types |
| **cards** | Tarjetas, drag & drop, detalles, asignados | components · hooks · schemas · types |
| **profile** | Perfil propio: edición de datos y avatar | todas (sin store) |

Cada feature expone su API pública vía `index.ts` (barrel): páginas, hooks,
stores y tipos. Los detalles internos no se importan cruzando features salvo
casos justificados (boards ↔ columns ↔ cards comparten el tablero).

---

## lib (infraestructura compartida)

Todo lo transversal vive en `src/lib/`, separado de los servicios de negocio
(que viven dentro de cada feature):

- **`lib/api/`** — `apiClient` (axios con `baseURL /api`, timeout 15s,
  interceptor que inyecta `Authorization: Bearer` y detector de 401 con
  observadores), `tokenStore` (token en memoria), `ApiError` + `errorHandler`
  (traduce respuestas de error a objetos tipados).
- **`lib/socket/`** — `socketClient` (conexión singleton con auth JWT,
  reconexión y estados), `socketEvents` (diccionario de eventos + payloads
  tipados), `socketService` (API de alto nivel: joins, emits con ack y
  suscripciones a broadcasts).
- **`lib/uploads/fileValidation.ts`** — reglas de archivos permitidos
  (imágenes y audio) compartidas por los dropzones.
- **`lib/utils.ts`** — `cn()` para componer clases.
- **`lib/zodFormErrors.ts`** — convierte issues de Zod en errores por campo
  para los formularios.

---

## Estado global (Zustand)

Un store por dominio, sin store global único:

| Store | Feature | Contenido |
|---|---|---|
| `useAuthStore` | auth | status (`checking`/`authenticated`/`guest`), sesión, login/register/logout |
| `useDashboardStore` | dashboard | grupo/tablero seleccionado, sidebar móvil, modales |
| `useGroupsStore` | groups | grupos + miembros, caché de carga |
| `useActiveBoardStore` | boards | tablero activo (columnas + tarjetas) y estado realtime |

Los componentes se suscriben con selectores (`useXxxStore((s) => s.campo)`) para
re-renderizar solo cuando cambia lo que les importa.

---

## Sockets (events con acks tipados)

Emitidos por el cliente (con ack `{ ok: true } | { ok: false; error }`):

| Evento | Payload |
|---|---|
| `board:join` / `board:leave` | boardId |
| `column:create` | `{ name, boardId }` |
| `column:update` | `{ columnId, name }` |
| `column:delete` | columnId |
| `card:create` | `{ title, description?, columnId, assignedTo?, priority? }` |
| `card:update` | `{ cardId, title?, description?, columnId, assignedTo?, priority? }` |
| `card:delete` | cardId |

Broadcasts escuchados: `column:created/updated/deleted`, `card:created/updated/deleted`.
Los reducers de `features/boards/services/boardEvents.ts` aplican los broadcasts
al store del tablero con deduplicación (el emisor ya recibió su resultado vía ack).

---

## Estilos (CSS Modules + design tokens)

- **`styles/tokens.css`** — variables CSS de diseño (colores, espaciados,
  radios, tipografía) con derivados vía `color-mix()`.
- **`styles/globals.css`** — reset, tipografía base y utilidades compartidas
  (`.icon-md`, `.fullscreen-loader`, …).
- **`*.module.css`** — cada componente estila en su propio CSS Module; las
  clases se hashean, así que nunca colisionan entre componentes.

No hay Tailwind ni framework CSS: la apariencia completa vive en esos tres niveles.

---

## Scripts disponibles

| Comando | Qué hace |
|---|---|
| `npm run dev` | Dev server en `http://localhost:3000` con HMR |
| `npm run build` | `tsc --noEmit` + build de producción a `dist/` |
| `npm start` | Sirve el build (`vite preview`) en `:3000` |
| `npm run lint` | ESLint sobre `src/` |
| `npm run typecheck` | Solo verificación de tipos |

---

## Rutas de la app

| Camino | Vista | Guard |
|---|---|---|
| `/` | Landing (`HomePage`) | Público |
| `/login` | Login (`LoginPage`) | Público |
| `/register` | Registro (`RegisterPage`) | Público |
| `/dashboard` | Shell autenticado (`DashboardPage`) | Privado |
| `/profile` | Perfil propio (`ProfilePage`) | Privado |
| `*` | 404 (`NotFoundPage`) | — |

---

## Flujo de autenticación

1. `App.tsx` llama `restoreSession()`: lee la sesión de `sessionStorage` y, si
   existe, el estado pasa a `authenticated` (si no, a `guest`).
2. Un usuario invitado que abre `/dashboard` tropieza con `ProtectedRoute`,
   que redirige a `/login` guardando la ruta original en `state.from`.
3. `LoginForm` valida con Zod y llama al store; el store pega al backend,
   guarda la sesión (`sessionStorage` + `tokenStore`) y enciende el socket.
4. Tras un login correcto se navega a `readReturnPath(...)`: la ruta guardada
   en `state.from` si la hubo, o el dashboard.
5. Cualquier 401 de la API dispara `logout()` vía `onUnauthorized`, el guard
   detecta el estado `guest` y devuelve al login — sin código de limpieza
   esparcido por los componentes.

---

## Despliegue a producción

`npm run build` genera `dist/`. Al usar `BrowserRouter`, el hosting debe servir
`index.html` para cualquier camino desconocido (SPA fallback):

- **Vercel / Netlify**: ya lo hacen por defecto para SPAs.
- **Nginx**: `try_files $uri /index.html;`.
- **GitHub Pages u hosting estático puro sin rewrites**: usa `HashRouter`
  (importado desde `react-router-dom`) en `App.tsx` como alternativa — las URLs
  llevan `#` pero no requieren configuración del servidor.
