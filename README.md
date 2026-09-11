# SprintHub Frontend

Frontend de **SprintHub**, una plataforma de gestión y seguimiento de proyectos diseñada para facilitar el trabajo colaborativo mediante una experiencia clara, contextual e intuitiva.

La aplicación busca reducir la curva de aprendizaje asociada a las herramientas de gestión de proyectos, proporcionando una interfaz donde las acciones y funcionalidades se presentan de acuerdo con el contexto de trabajo del usuario.

El frontend se encuentra desacoplado del backend y consume sus servicios mediante una API REST.

## Características

* Interfaz orientada a la gestión colaborativa.
* Visualización y organización de proyectos.
* Gestión y seguimiento de tareas.
* Experiencia contextual para facilitar la navegación.
* Integración con el backend mediante API REST.
* Arquitectura desacoplada.
* Componentes reutilizables.
* Tipado estático con TypeScript.
* Desarrollo basado en React.
* Configuración y ejecución mediante Vite.

## Enfoque de experiencia

SprintHub está diseñado alrededor de tres principios principales:

### Claridad

La información relevante debe ser fácil de identificar y comprender, evitando interfaces sobrecargadas o procesos innecesariamente complejos.

### Contexto

Las acciones disponibles deben estar relacionadas con el estado y contenido actual del usuario, reduciendo la necesidad de navegar entre diferentes secciones para completar una tarea.

### Colaboración

La interfaz está orientada a facilitar la coordinación entre integrantes de un equipo, proporcionando una visión compartida del trabajo y su progreso.

## Arquitectura

El frontend mantiene una arquitectura desacoplada del backend.

```text
React Application
       │
       ▼
   Components
       │
       ▼
    Services
       │
       ▼
     REST API
       │
       ▼
SprintHub Backend
```

Esta separación permite desarrollar la interfaz y la lógica del servidor de manera independiente.

## Stack tecnológico

| Tecnología | Uso                                     |
| ---------- | --------------------------------------- |
| React      | Construcción de la interfaz             |
| TypeScript | Lenguaje principal                      |
| Vite       | Herramienta de desarrollo y compilación |
| HTML5      | Estructura                              |
| CSS        | Presentación y estilos                  |
| REST API   | Comunicación con el backend             |

## Estructura general

```text
src/
├── components/
├── pages/
├── services/
├── ...
public/
```

La estructura puede ampliarse conforme se incorporen nuevos módulos y funcionalidades.

## Instalación

### Requisitos

* Node.js
* npm

### Clonar el repositorio

```bash
git clone https://github.com/SprinHub-Team/SprintHub-Frontend.git
cd SprintHub-Frontend
```

### Instalar dependencias

```bash
npm install
```

### Variables de entorno

Crear un archivo `.env` en la raíz del proyecto con la configuración necesaria para establecer la conexión con el backend.

```env
VITE_API_URL=http://localhost:3000
```

El valor debe apuntar a la URL donde se encuentre disponible la API de SprintHub.

### Ejecutar en desarrollo

```bash
npm run dev
```

Vite iniciará el servidor de desarrollo y permitirá acceder a la aplicación desde el navegador.

### Compilar para producción

```bash
npm run build
```

### Vista previa de producción

```bash
npm run preview
```

## Integración con el Backend

El frontend consume los servicios proporcionados por **SprintHub Backend** mediante solicitudes HTTP.

```text
┌──────────────────────┐
│   SprintHub Frontend │
│       React/TS       │
└──────────┬───────────┘
           │
        REST API
           │
┌──────────▼───────────┐
│   SprintHub Backend  │
│     Node/Express     │
└──────────┬───────────┘
           │
        MongoDB
```

La comunicación desacoplada permite modificar o extender cualquiera de las dos aplicaciones sin depender directamente de la implementación interna de la otra.

## Principios de desarrollo

El frontend busca mantener:

* Componentes reutilizables.
* Separación de responsabilidades.
* Tipado estricto mediante TypeScript.
* Interfaces consistentes.
* Bajo acoplamiento entre componentes.
* Separación entre presentación y acceso a datos.
* Experiencias de usuario orientadas al contexto.
* Código mantenible y escalable.

## Estado del proyecto

El proyecto se encuentra en desarrollo activo. La estructura, funcionalidades y componentes pueden evolucionar conforme avance el desarrollo de SprintHub.

## Equipo

**SprintHub Team**

Repositorio:

https://github.com/SprinHub-Team/SprintHub-Frontend
