# SprintHub-Frontend

Frontend de **SprintHub** — plataforma de gestión de proyectos tipo Trello/Jira con boards, columnas, tarjetas arrastrables (@dnd-kit) y comentarios en tiempo real (Socket.io).

> Repositorio: https://github.com/SprinHub-Team/SprintHub-Frontend
> Equipo: SprinHub-Team
> Versión: 1.0.0
> Licencia: privada

---

## Tabla de contenidos

1. [Stack tecnológico](#stack-tecnológico)
2. [Requisitos previos](#requisitos-previos)
3. [Instalación y arranque](#instalación-y-arranque)
4. [Variables de entorno](#variables-de-entorno)
5. [Arquitectura (feature-based)](#arquitectura-feature-based)
6. [Estructura de carpetas](#estructura-de-carpetas)
7. [Componentes UI globales](#componentes-ui-globales)
8. [Features (12 módulos)](#features-12-módulos)
9. [Services (API + Uploads + Socket)](#services-api--uploads--socket)
10. [Routing (hash routing propio)](#routing-hash-routing-propio)
11. [Estado global (Zustand)](#estado-global-zustand)
12. [Drag & Drop (@dnd-kit)](#drag--drop--dnd-kit)
13. [Socket events (14 emit + 11 broadcast)](#socket-events-14-emit--11-broadcast)
14. [boardEvents.ts (funciones puras)](#boardeventsts-funciones-puras)
15. [Scripts disponibles](#scripts-disponibles)
16. [Rutas de la app](#rutas-de-la-app)
17. [Flujo de autenticación](#flujo-de-autenticación)
18. [Despliegue a producción](#despliegue-a-producción)

---

## Stack tecnológico

| Capa | Tecnología | Versión | Uso |
|---|---|---|---|
| Framework | React | ^19.0.0 | UI con hooks modernos |
| Lenguaje | TypeScript | ^5.x | Tipado estático |
| Bundler | Vite | ^6.3.5 | Dev server + build producción |
| Plugin React | @vitejs/plugin-react | ^4.5.0 | Fast Refresh |
| Styling | Tailwind CSS + @tailwindcss/vite | ^4 | Utility-first |
| Estado | Zustand | ^5.0.6 | Stores por feature (sin Redux) |
| HTTP | Axios | ^1.20.0 | Cliente con interceptor JWT |
| Tiempo real | socket.io-client | ^4.8.4 | Sockets con auth JWT |
| Validación | Zod | ^4.0.2 | Schemas de formularios y DTOs |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable + @dnd-kit/utilities | ^6.3.1 + ^10.0.0 + ^3.2.2 | BoardWorkspace con DndContext |
| Iconos | lucide-react | ^0.525.0 | Iconos SVG |
| Utils CSS | clsx + tailwind-merge | ^2.1.1 + ^3.3.1 | Composición de clases |
| ESLint | eslint + eslint-plugin-react-hooks + eslint-plugin-react-refresh + typescript-eslint | ^9 / ^5.2 / ^0.5 / ^8.69 | Linting |
| Lint | eslint | ^9 | Code quality |
| Tipos | @types/react, @types/react-dom, @types/node | ^19 / ^19 / ^22 | Tipos de Node |

---

## Requisitos previos

- **Node.js** v20+ (verifica con `node -v`)
- **npm** (instalado con Node) o **pnpm**
- **Git** con acceso al repo
- **Backend de SprintHub** corriendo (ver [SprintHub-Backend](https://github.com/SprinHub-Team/SprintHub-Backend))
- **Cuenta Cloudinary** (para subida de archivos en el frontend con FileDropzone)

---

## Instalación y arranque

```bash
# 1. Clonar el repo EN LA RAMA EDUAR (importante)
git clone -b Eduar https://github.com/SprinHub-Team/SprintHub-Frontend.git
cd SprintHub-Frontend

# 2. Instalar dependencias
npm install

# 3. Crear archivo de entorno
cp .env.example .env
# Editar .env con las URLs del backend (ver Variables de entorno)

# 4. Levantar dev server
npm run dev
# → http://localhost:3000 (vite --port 3000 --host)

# 5. Verificar tipos
npm run typecheck

# 6. Verificar lint
npm run lint

# 7. Build de producción
npm run build

# 8. Preview del build
npm start  # vite preview --port 3000 --host
```

El servidor de desarrollo levanta en **http://localhost:3000** (configurado con `--port 3000 --host` para ser accesible en la red local).

> ⚠️ **IMPORTANTE**: este proyecto NO usa React Router DOM. Implementa su propio hash routing en `src/app/router/routes.ts`. No instales `react-router-dom`.

---

## Variables de entorno

Crea un archivo `.env` en la raíz:

```bash
# API REST del backend de SprintHub
VITE_API_URL=http://localhost:3001/api

# URL del servidor Socket.io
VITE_SOCKET_URL=http://localhost:3001

# Cloudinary (para subida directa desde el cliente en algunas features)
VITE_CLOUDINARY_CLOUD_NAME=<tu-cloud-name>
VITE_CLOUDINARY_UPLOAD_PRESET=<tu-upload-preset>
```

> Nota: variables con prefijo `VITE_` son expuestas al cliente. Nunca pongas secretos en estas variables.

---

## Arquitectura (feature-based)

El frontend está organizado por **features** (vertical slicing). Cada feature es autónoma y contiene todas sus capas internas:

```
src/
├── app/                              # Setup de la app
│   ├── App.tsx                       # Root component
│   ├── providers/
│   │   └── AppProviders.tsx          # Providers globales (Toast, etc.)
│   └── router/
│       ├── AppRoutes.tsx             # Switch principal con hash routing
│       ├── ProtectedRoute.tsx        # Wrapper para rutas privadas
│       ├── PublicRoute.tsx           # Wrapper para rutas públicas
│       ├── routes.ts                 # APP_ROUTES + navigateTo + readCurrentRoute
│       └── useAppRoute.ts            # Hook: lee la ruta actual del hash
├── components/
│   └── ui/                           # 12 componentes globales (ver más abajo)
├── features/                         # 9 features (ver más abajo)
│   ├── auth/
│   ├── home/
│   ├── dashboard/
│   ├── groups/
│   ├── profile/
│   ├── boards/
│   ├── columns/
│   ├── cards/
│   └── comments/
├── services/
│   ├── api/                          # Axios client + tokenStore + ApiError
│   ├── uploads/                      # fileBinary + fileValidation
│   └── socket/                       # socketClient + socketService + socketEvents
├── lib/                              # Helpers generales (utils)
├── config/
│   └── schemas/                       # Schemas compartidos
├── styles/                           # CSS global + Tailwind
└── types/
    ├── api/
    └── common/
```

### Estructura interna de cada feature

Cada feature sigue el patrón:

```
features/<feature-name>/
├── components/                       # Componentes React
├── hooks/                            # Hooks custom (useXxx, useXxxMutations)
├── pages/                            # Páginas (con hash routing)
├── schemas/                          # Zod schemas (formSchema + dtoSchema)
├── services/                         # Servicio HTTP/Socket específico
├── store/                            # Zustand store específico
├── types/                            # types.ts + dto.ts
└── index.ts                          # Barrel exports
```

---

## Componentes UI globales

Ubicación: `src/components/ui/`

12 componentes reutilizables, cada uno en su propia carpeta:

| Componente | Carpeta | Uso |
|---|---|---|
| **Alert** | `Alert/` | Mensajes de aviso (info, warning, error, success) |
| **Badge** | `Badge/` | Etiquetas pequeñas (estados, prioridades) |
| **Button** | `Button/` | Botón con variantes (primary, secondary, ghost, danger) |
| **EmptyState** | `EmptyState/` | Estado vacío (sin datos) |
| **ErrorState** | `ErrorState/` | Estado de error con CTA |
| **FileDropzone** | `FileDropzone/` | Zona de arrastre para archivos (con validación file-type) |
| **Input** | `Input/` | Campo de texto form-controlled |
| **LoadingState** | `LoadingState/` | Estado de carga (spinner + mensaje) |
| **Modal** | `Modal/` | Diálogo con Portal + focus trap |
| **Spinner** | `Spinner/` | Indicador de carga standalone |
| **TextArea** | `TextArea/` | Textarea multi-línea |
| **Toast** | `Toast/` | Notificaciones temporales (via AppProviders) |

### API típica de un componente

```tsx
import { Button } from '@/components/ui/Button/Button';

<Button variant="primary" size="md" onClick={handleClick}>
  Crear grupo
</Button>
```

---

## Features (12 módulos)

### 1. auth/

**Páginas**: `LoginPage.tsx`, `RegisterPage.tsx`
**Otros**: types (auth.types, user.types), schemas (loginSchema, registerSchema, sessionSchema, userReferenceSchema), services (authService, sessionStorage), store (useAuthStore), hooks (useLogin, useRegister), components (AuthFormLayout, LoginForm, RegisterForm)

**Funcionalidad**:
- Login y registro con validación Zod
- Persiste token en `sessionStorage` (via `sessionStorage.ts`)
- `useAuthStore` Zustand store con `{ user, token, isAuthenticated, login(), logout() }`
- AuthFormLayout reutilizable para Login y Register

### 2. home/

**Página**: `HomePage.tsx`
**Componentes**: `HeroSection.tsx`, `FeatureSection.tsx`, `HowItWorkSection.tsx`, `HomeCtaSection.tsx`

**Funcionalidad**: Landing pública con secciones informativas y CTA a /login o /register.

### 3. dashboard/

**Página**: `DashboardPage.tsx`
**Componentes**: `DashboardSidebar.tsx`, `DashboardMainArea.tsx`
**Store**: `useDashboardStore.ts`

**Funcionalidad**: Vista principal del usuario autenticado. Muestra resumen de grupos y boards del usuario. DashboardSidebar para navegación lateral.

### 4. groups/

**Páginas**: (implícitas en DashboardPage o GroupDetailPage)
**Componentes**: `CreateGroupModal.tsx`, `GroupEditModal.tsx`, `GroupMembersModal.tsx`, `WorkspaceGroupItem.tsx`
**Otros**: types (group.types, group.dto), schemas (groupDtoSchema, groupSchema), services (groupService), store (useGroupsStore), hooks (useGroups, useGroupMutations, useCreateGroup, useUpdateGroup, useAddGroupMember)

**Funcionalidad**:
- CRUD de grupos
- Gestión de miembros (invitar por email, asignar rol admin/collaborator, eliminar)
- GroupMembersModal para administrar miembros
- WorkspaceGroupItem como card visual en el dashboard

### 5. profile/

**Página**: `ProfilePage.tsx`
**Componentes**: `ProfileView.tsx`
**Otros**: types (profile.types), schemas (profileFormSchema, profileDtoSchema), services (profileService), hooks (useProfile)

**Funcionalidad**:
- Edición de nombre, documento y foto de perfil
- Subida de foto vía FileDropzone → Cloudinary
- ProfileView como vista de detalle

### 6. boards/

**Componentes**: `BoardWorkspace.tsx`, `BoardListItem.tsx`, `GroupBoardList.tsx`, `CreateBoardModal.tsx`
**Otros**: types (board.types, board.dto), schemas (boardDtoSchema, boardFormSchema), services (boardService, boardEvents), store (useActiveBoardStore), hooks (useActiveBoard, useBoards, useBoardMutations)

**Funcionalidad**:
- BoardWorkspace: contenedor principal del tablero con DndContext
- useActiveBoard + useRealtimeStatus: estado del board y conexión socket
- boardEvents.ts: funciones puras que aplican eventos socket al estado del board
- CreateBoardModal para crear tableros en un grupo

### 7. columns/

**Componentes**: `BoardColumn.tsx`, `CreateColumnForm.tsx`
**Otros**: types (column.types, column.dto), schemas (columnDtoSchema, columnFormSchema), hooks (useColumnMutations)

**Funcionalidad**:
- BoardColumn: renderiza una columna con sus tarjetas + botón "Añadir tarjeta"
- CreateColumnForm: formulario inline para crear columna
- useColumnMutations: mutaciones optimistas con useBoardMutations

### 8. cards/

**Componentes**: `DraggableCard.tsx`, `CardItem.tsx`, `CardDetailsModal.tsx`, `CreateCardModal.tsx`, `CardFilesSection.tsx`
**Otros**: types (card.types, card.dto), schemas (cardDtoSchema, cardFormSchema), hooks (useCardMutations)

**Funcionalidad**:
- DraggableCard: tarjeta arrastrable con @dnd-kit/sortable
- CardItem: vista previa estática (para DragOverlay)
- CardDetailsModal: modal con edición completa (título, descripción, assignedTo, dueDate, priority, files)
- CardFilesSection: subida y listado de archivos adjuntos (vía Cloudinary)
- useCardMutations: mutaciones optimistas + `move(cardId, toColumnId, newIndex)`

### 9. comments/

**Componentes**: `CommentList.tsx`, `CommentForm.tsx`
**Otros**: types (comment.types, comment.dto), schemas (commentDtoSchema, commentFormSchema), hooks (useCommentMutations)

**Funcionalidad**:
- CommentList + CommentForm anidados dentro de CardDetailsModal
- Comentarios en tiempo real via socketService

---

## Services (API + Uploads + Socket)

### services/api/

| Archivo | Uso |
|---|---|
| `client.ts` | Instancia Axios con baseURL, interceptor para inyectar `Authorization: Bearer <token>` y manejar 401 |
| `tokenStore.ts` | Lee/escribe el token JWT en `sessionStorage` |
| `errors/ApiError.ts` | Clase custom de error con `code`, `message`, `status` |
| `errors/errorHandler.ts` | Wrapper que captura errores Axios y los normaliza a `ApiError` |
| `types/ApiResponse.ts` | Tipo genérico `ApiResponse<T> = { data: T; success: boolean }` |

### services/uploads/

| Archivo | Uso |
|---|---|
| `fileBinary.ts` | Convierte File a base64 / binary para subida |
| `fileValidation.ts` | Valida tipo mime y tamaño antes de subir (con file-type) |

### services/socket/

| Archivo | Uso |
|---|---|
| `socketClient.ts` | Singleton del socket con `socket.auth = { token }` |
| `socketEvents.ts` | Define `SOCKET_EMIT_EVENTS` (14) y `SOCKET_BROADCAST_EVENTS` (11) + tipos de payloads |
| `socketService.ts` | API de alto nivel: `connectSocket()`, `disconnectSocket()`, `joinBoard(boardId)`, `createColumn(payload)`, `onColumnCreated(cb)`, etc. |

---

## Routing (hash routing propio)

El frontend **NO usa react-router-dom**. Implementa su propio hash routing en `src/app/router/`.

### routes.ts

```typescript
export const APP_ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  profile: '/profile',
} as const;

export type AppRoutePath = (typeof APP_ROUTES)[keyof typeof APP_ROUTES];

const ROUTE_PATHS: readonly string[] = Object.values(APP_ROUTES);

export function navigateTo(path: AppRoutePath): void {
  if (typeof window === 'undefined') return;
  window.location.hash = `#${path}`;
}

export function readCurrentRoute(): AppRoutePath {
  if (typeof window === 'undefined') return APP_ROUTES.home;
  const hash = window.location.hash.replace(/^#/, '');
  return (ROUTE_PATHS.includes(hash) ? hash : APP_ROUTES.home) as AppRoutePath;
}
```

### useAppRoute.ts

Hook que escucha cambios en `window.location.hash` y devuelve la ruta actual:

```typescript
import { useState, useEffect } from 'react';
import { readCurrentRoute, APP_ROUTES } from './routes';

export function useAppRoute() {
  const [route, setRoute] = useState<AppRoutePath>(readCurrentRoute());

  useEffect(() => {
    const onHashChange = () => setRoute(readCurrentRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return route;
}
```

### AppRoutes.tsx

Switch principal con wrappers:

```tsx
import { useAppRoute } from './useAppRoute';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { HomePage } from '@/features/home';
import { LoginPage, RegisterPage } from '@/features/auth';
import { DashboardPage } from '@/features/dashboard';
import { ProfilePage } from '@/features/profile';

export function AppRoutes() {
  const route = useAppRoute();

  switch (route) {
    case APP_ROUTES.login:
      return <PublicRoute><LoginPage /></PublicRoute>;
    case APP_ROUTES.register:
      return <PublicRoute><RegisterPage /></PublicRoute>;
    case APP_ROUTES.dashboard:
      return <ProtectedRoute><DashboardPage /></ProtectedRoute>;
    case APP_ROUTES.profile:
      return <ProtectedRoute><ProfilePage /></ProtectedRoute>;
    case APP_ROUTES.home:
    default:
      return <HomePage />;
  }
}
```

### ProtectedRoute / PublicRoute

- `ProtectedRoute`: si no hay token en `useAuthStore`, redirige a `/login` (via `navigateTo(APP_ROUTES.login)`)
- `PublicRoute`: si hay token, redirige a `/dashboard`

---

## Estado global (Zustand)

4 stores Zustand, uno por feature que lo necesita:

| Store | Archivo | Estado | Acciones |
|---|---|---|---|
| **useAuthStore** | `features/auth/store/useAuthStore.ts` | `{ user, token, isAuthenticated }` | `login(token, user)`, `logout()` |
| **useGroupsStore** | `features/groups/store/useGroupsStore.ts` | `{ groups[], selectedGroupId, status }` | `setGroups()`, `addMember()`, `removeGroup()` |
| **useActiveBoardStore** | `features/boards/store/useActiveBoardStore.ts` | `{ board: BoardDetails, status, error, realtimeStatus }` | `loadBoard(id)`, `applyEvent(event)`, `clearBoard()` |
| **useDashboardStore** | `features/dashboard/store/useDashboardStore.ts` | `{ sidebarOpen, selectedSection }` | `toggleSidebar()`, `selectSection()` |

### Ejemplo de store

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthSession } from '../types/auth.types';
import { tokenStore } from '../services/api/tokenStore';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (session: AuthSession) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (session) => {
        tokenStore.set(session.token);
        set({ user: session.user, token: session.token, isAuthenticated: true });
      },
      logout: () => {
        tokenStore.clear();
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    { name: 'sprinthub-auth' }
  )
);
```

---

## Drag & Drop (@dnd-kit)

El frontend usa `@dnd-kit/core` + `@dnd-kit/sortable` para implementar el drag-and-drop de tarjetas en el BoardWorkspace.

### BoardWorkspace.tsx (extracto)

```tsx
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { CardItem } from '@/features/cards/components/CardItem';
import { useCardMutations } from '@/features/cards/hooks/useCardMutations';
import { parseKanbanCardDragId, parseKanbanColumnDropId } from '@/features/cards/components/DraggableCard';
import { useActiveBoard, useRealtimeStatus } from '../hooks/useActiveBoard';

export function BoardWorkspace({ boardId, members }: BoardWorkspaceProps) {
  const { board, status, error } = useActiveBoard(boardId);
  const realtimeStatus = useRealtimeStatus();
  const [openCardId, setOpenCardId] = useState<string | null>(null);
  const [draggingCard, setDraggingCard] = useState<Card | null>(null);
  const { movingCardId, move } = useCardMutations();

  // Sensor con activación por distancia (evita clicks accidentales)
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 6 },
  });
  const sensors = useSensors(pointerSensor);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const cardId = parseKanbanCardDragId(String(event.active.id));
    if (!cardId || !board) return setDraggingCard(null);
    const card = board.columns.flatMap(c => c.cards).find(c => c.id === cardId);
    setDraggingCard(card ?? null);
  }, [board]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const cardId = parseKanbanCardDragId(String(event.active.id));
    const targetColumnId = parseKanbanColumnDropId(String(event.over?.id ?? ''));
    if (!cardId || !targetColumnId) return setDraggingCard(null);
    move({ cardId, targetColumnId });
    setDraggingCard(null);
  }, [move]);

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      {/* columns with DraggableCards */}
      <DragOverlay>{draggingCard && <CardItem card={draggingCard} />}</DragOverlay>
    </DndContext>
  );
}
```

### IDs de drag (parseKanbanCardDragId / parseKanbanColumnDropId)

`@dnd-kit` usa IDs string únicos. SprintHub codifica el tipo en el ID:

- Card: `card:<cardId>` → `parseKanbanCardDragId(id)` extrae el `cardId`
- Column (drop target): `column:<columnId>` → `parseKanbanColumnDropId(id)` extrae el `columnId`

---

## Socket events (14 emit + 11 broadcast)

Definidos en `src/services/socket/socketEvents.ts`:

### Emit events (cliente → server)

```typescript
export const SOCKET_EMIT_EVENTS = {
  boardJoin: 'board:join',
  boardLeave: 'board:leave',

  columnCreate: 'column:create',
  columnUpdate: 'column:update',
  columnDelete: 'column:delete',

  cardCreate: 'card:create',
  cardUpdate: 'card:update',
  cardDelete: 'card:delete',
  cardFileAdd: 'card:fileAdd',
  cardFileRemove: 'card:fileRemove',

  commentCreate: 'comment:create',
  commentUpdate: 'comment:update',
  commentDelete: 'comment:delete',
} as const;
```

### Broadcast events (server → clientes conectados al board)

```typescript
export const SOCKET_BROADCAST_EVENTS = {
  columnCreated: 'column:created',
  columnUpdated: 'column:updated',
  columnDeleted: 'column:deleted',

  cardCreated: 'card:created',
  cardUpdated: 'card:updated',
  cardDeleted: 'card:deleted',
  cardFileAdded: 'card:fileAdded',
  cardFileRemoved: 'card:fileRemoved',

  commentCreated: 'comment:created',
  commentUpdated: 'comment:updated',
  commentDeleted: 'comment:deleted',
} as const;
```

### Tipos de payloads

Cada evento tiene su tipo TS derivado:

```typescript
export type CreateCardPayload = { columnId: string; title: string; description?: string; assignedTo?: string; dueDate?: string; priority?: CardPriority; };
export type CardCreatedPayload = { card: CardDto };
export type ColumnCreatedPayload = { column: ColumnDto };
export type CommentCreatedPayload = { comment: CommentDto };
// ... etc
```

### Conexión con auth JWT

`socketClient.ts`:

```typescript
import { io, type Socket } from 'socket.io-client';
import { tokenStore } from '../api/tokenStore';

let socket: Socket | null = null;

export function connectSocket(): Socket {
  if (socket) return socket;
  const token = tokenStore.get();
  if (!token) throw new Error('No token to connect socket');

  socket = io(import.meta.env.VITE_SOCKET_URL, {
    auth: { token },        // ⚠️ Enviado al backend como socket.handshake.auth.token
    transports: ['websocket'],
  });

  socket.on('connect', () => console.log('[Socket] connected', socket?.id));
  socket.on('disconnect', () => console.log('[Socket] disconnected'));
  socket.on('connect_error', (err) => console.error('[Socket] error', err.message));

  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
```

---

## boardEvents.ts (funciones puras)

Ubicación: `src/features/boards/services/boardEvents.ts`

Funciones puras que aplican eventos socket al estado `BoardDetails`. Estas funciones NO mutan, devuelven un nuevo estado.

```typescript
import type { BoardDetails } from '../types/board.types';
import type { Card } from '@/features/cards/types/card.types';
import type { BoardColumn } from '@/features/columns/types/column.types';
import type { Comment } from '@/features/comments/types/comment.types';

export function applyColumnCreated(board: BoardDetails, column: BoardColumn): BoardDetails {
  if (board.columns.some(c => c.id === column.id)) return board;
  return { ...board, columns: [...board.columns, column] };
}

export function applyColumnUpdated(board: BoardDetails, column: BoardColumn): BoardDetails {
  if (!board.columns.some(c => c.id === column.id)) return board;
  return {
    ...board,
    columns: board.columns.map(c => (c.id === column.id ? column : c)),
  };
}

export function applyColumnDeleted(board: BoardDetails, columnId: string): BoardDetails {
  return { ...board, columns: board.columns.filter(c => c.id !== columnId) };
}

export function applyCardCreated(board: BoardDetails, card: Card): BoardDetails {
  return {
    ...board,
    columns: board.columns.map(column => {
      if (column.id !== card.columnId) return column;
      if (column.cards.some(c => c.id === card.id)) return column;
      return { ...column, cards: [...column.cards, card] };
    }),
  };
}

export function applyCardUpdated(board: BoardDetails, card: Card): BoardDetails { /* ... */ }
export function applyCardDeleted(board: BoardDetails, cardId: string): BoardDetails { /* ... */ }
export function applyCardFileAdded(board: BoardDetails, cardId: string, file: CardFile): BoardDetails { /* ... */ }
export function applyCardFileRemoved(board: BoardDetails, cardId: string, fileId: string): BoardDetails { /* ... */ }
export function applyCommentCreated(board: BoardDetails, comment: Comment): BoardDetails { /* ... */ }
export function applyCommentUpdated(board: BoardDetails, comment: Comment): BoardDetails { /* ... */ }
export function applyCommentDeleted(board: BoardDetails, commentId: string): BoardDetails { /* ... */ }
```

### Integración con useActiveBoardStore

Cuando el socketService recibe un broadcast, ejecuta la función `applyXxx` correspondiente y actualiza el store:

```typescript
// Dentro de socketService.ts
socket.on(SOCKET_BROADCAST_EVENTS.columnCreated, (payload: ColumnCreatedPayload) => {
  const validated = columnDtoSchema.parse(payload.column);
  useActiveBoardStore.getState().applyColumnCreated(validated);
});
```

---

## Scripts disponibles

```json
{
  "scripts": {
    "dev": "vite --port 3000 --host",
    "build": "tsc --noEmit && vite build",
    "start": "vite preview --port 3000 --host",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  }
}
```

| Script | Uso |
|---|---|
| `npm run dev` | Arranca dev server en http://localhost:3000 con hot reload (acepta conexiones externas con --host) |
| `npm run build` | Verifica tipos (tsc --noEmit) + build de producción en `dist/` |
| `npm start` | Sirve el build de producción con vite preview en http://localhost:3000 |
| `npm run lint` | ESLint sobre todo el código |
| `npm run typecheck` | Solo verificación de tipos (sin emit) |

---

## Rutas de la app

| Ruta (hash) | Componente | Tipo | Descripción |
|---|---|---|---|
| `/#/` | HomePage | Pública | Landing con hero y features |
| `/#/login` | LoginPage | Pública | Formulario de login |
| `/#/register` | RegisterPage | Pública | Formulario de registro |
| `/#/dashboard` | DashboardPage | Protegida | Resumen de grupos y boards del usuario |
| `/#/profile` | ProfilePage | Protegida | Edición de perfil y foto |

### Navegación

```typescript
import { navigateTo, APP_ROUTES } from '@/app/router/routes';

// En cualquier componente:
navigateTo(APP_ROUTES.dashboard);  // Redirige a /#/dashboard
```

---

## Flujo de autenticación

```
┌────────────┐   POST /api/auth/register          ┌──────────────┐
│ RegisterPage│ ──────────────────────────────►   │              │
│  (Zod       │   { name, email, document,         │  Backend     │
│   validación)│    password }                     │  (SprintHub  │
│             │                                   │   -Backend)   │
│             │   ◄────────────────────────────── │              │
│             │   { token: JWT, user: {...} }     │              │
└─────────────┘                                   └──────────────┘
        │
        │ useLogin hook ejecuta:
        │   1. authService.login() → POST /api/auth/login
        │   2. Recibe { token, user }
        │   3. useAuthStore.login({ token, user })
        │   4. tokenStore.set(token) → sessionStorage
        │   5. navigateTo(APP_ROUTES.dashboard)
        ▼
┌────────────┐
│ DashboardPage│  ← Protegido por ProtectedRoute
│  Lee de     │     (si !isAuthenticated → redirect to /login)
│  useAuthStore│
└────────────┘
```

### Persistencia de sesión

- **Token**: guardado en `sessionStorage` (no sobrevive a cierre de pestaña)
- **User object**: guardado en `useAuthStore` con `persist` middleware → localStorage
- En recarga: `useAuthStore` se rehidrata desde localStorage; si no hay token, `ProtectedRoute` redirige

---

## Despliegue a producción

### Opción 1: Vercel (recomendado para SPAs)

1. Fork del repo (rama Eduar) a tu cuenta
2. En Vercel: New Project → Importar el repo
3. Configurar:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
   - **Environment Variables**: ver [Variables de entorno](#variables-de-entorno)
4. Deploy

### Variables de entorno en producción (Vercel)

```bash
VITE_API_URL=https://sprinthub-api.onrender.com/api
VITE_SOCKET_URL=https://sprinthub-api.onrender.com
VITE_CLOUDINARY_CLOUD_NAME=<tu-cloud-name>
VITE_CLOUDINARY_UPLOAD_PRESET=<tu-upload-preset>
```

### SPA fallback para hash routing

Como usamos hash routing (`#/dashboard`), **NO** necesitamos configurar SPA fallback en Vercel. El servidor siempre sirve `index.html` y el cliente decide la ruta del hash.

### Opción 2: Netlify

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Build

```bash
npm run build
# Genera dist/ con:
#   index.html
#   assets/
#     index-<hash>.js
#     index-<hash>.css
```

Verifica el build con:

```bash
npm start  # vite preview --port 3000 --host
# → http://localhost:3000
```

---

## ESLint y convenciones

### Reglas principales (eslint.config.js)

- `eslint-plugin-react-hooks` (rules of hooks)
- `eslint-plugin-react-refresh` (Fast Refresh compatibility)
- `typescript-eslint` (strict typing)

### Antes de commitear

```bash
npm run lint        # Lint check
npm run typecheck   # Type check
```

---

## Convenciones de código

- ✅ Tipos estrictos (no `any` sin justificación en comentario)
- ✅ Feature-based architecture (cada feature es autónoma)
- ✅ Cada feature exporta desde `index.ts` (barrel)
- ✅ Hooks custom nombrados `useXxx` o `useXxxMutations`
- ✅ Stores Zustand nombrados `useXxxStore`
- ✅ Schemas Zod con sufijo `Schema` (formSchema, dtoSchema)
- ✅ Componentes en PascalCase (BoardWorkspace.tsx, DraggableCard.tsx)
- ✅ Import paths con `@/` alias (configurado en tsconfig + vite.config.ts)

---

## Equipo

**SprinHub-Team**: https://github.com/SprinHub-Team

Rama activa del curso: **Eduar** — clonar con `git clone -b Eduar`.

---

## Licencia

Privada — ver [LICENSE](LICENSE) si existe.
