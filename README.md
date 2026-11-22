# Sistema de Gestión de Turnos Médicos

Frontend del Trabajo Práctico Integrador de **Desarrollo de Software 2026**, UTN Facultad Regional Tucumán.

La aplicación permite a los pacientes consultar profesionales y gestionar sus turnos médicos, mientras que los administradores pueden gestionar especialidades, médicos y disponibilidades horarias. El sistema está desarrollado con React y se comunica con una API REST implementada en ASP.NET Core.

## Integrantes

| Apellido y nombre | Legajo | Comisión |
|---|---:|:---:|
| Grima, Nahir Solange | 60346 | 3K3 |
| Martinez, Sayra Nazarena | 60445 | 3K3 |
| Perry Fabersani, Mateo Nicolás | 60680 | 3K3 |
| Scro, Iara | 60315 | 3K3 |

## Ejecución local

### 1. Iniciar el backend

Se necesita .NET SDK 10 y SQL Server LocalDB o una instancia compatible de SQL Server.

Desde la carpeta raíz del repositorio del backend, restaurar las dependencias:

```bash
dotnet restore Dsw2026Tpi.slnx
```

La configuración de desarrollo utiliza SQL Server LocalDB y una base de datos llamada `Dsw2026Tpi`. Se encuentra definida en:

`Dsw2026Tpi.Api/appsettings.Development.json`

Si se utiliza otra instancia de SQL Server, se debe modificar la cadena de conexión `DefaultConnection`.

Instalar Entity Framework Core CLI si todavía no está disponible:

```bash
dotnet tool install --global dotnet-ef --version 10.0.9
```

Aplicar las migraciones de la base de datos:

```bash
dotnet ef database update --project Dsw2026Tpi.Data --startup-project Dsw2026Tpi.Api --context Dsw2026TpiDbContext
```

```bash
dotnet ef database update --project Dsw2026Tpi.Data --startup-project Dsw2026Tpi.Api --context AuthenticationDbContext
```

Iniciar la API:

```bash
dotnet run --project Dsw2026Tpi.Api --launch-profile https
```

Con la configuración de desarrollo, se puede comprobar que la API está en ejecución abriendo [Swagger](https://localhost:5001/swagger). El backend debe seguir ejecutándose mientras se utiliza el frontend.

### 2. Registrar un administrador

Para ingresar al panel administrativo se necesita un usuario administrador registrado en el backend.

Se puede registrar desde Swagger utilizando el endpoint:

`POST /api/auth/admin/register`

Ejemplo del cuerpo de la solicitud:

```json
{
  "email": "admin@medportal.com",
  "password": "ContraseñaDeEjemplo1!"
}
```

Las credenciales deben corresponder al usuario registrado en la base de datos local.

### 3. Instalar las dependencias del frontend

Se necesita Git, Node.js y npm. La versión de Vite del proyecto admite Node.js 20 desde la versión 20.19.0 dentro de esa serie, o Node.js 22.12.0 en adelante.

Desde la carpeta raíz del frontend, instalar las versiones de dependencias registradas en `package-lock.json`:

```bash
npm ci
```

El repositorio incluye `.env.example` con una referencia para configurar la dirección del backend en otros entornos.

En desarrollo no es necesario configurar una variable adicional, ya que Vite reenvía las solicitudes que comienzan con `/api` hacia:

`https://localhost:5001`

Esta configuración se encuentra en `vite.config.js`.

Si la API se ejecuta en otra dirección, se debe modificar el destino del proxy en ese archivo. Para otros entornos se puede configurar `VITE_API_URL` tomando como referencia `.env.example`.

### 4. Abrir la aplicación

Desde la carpeta raíz del frontend, ejecutar:

```bash
npm run dev -- --port 5173 --strictPort
```

La aplicación queda disponible en:

`http://localhost:5173`

El servidor de desarrollo abre inicialmente el acceso al portal del paciente.

| Portal | Acceso local | Credenciales |
|---|---|---|
| Paciente | [Ingresar como paciente](http://localhost:5173/patients/login) | Correo electrónico y DNI. |
| Administrador | [Ingresar como administrador](http://localhost:5173/admin/login) | Correo electrónico y contraseña de un administrador registrado en el backend. |

La configuración CORS del backend debe permitir el origen utilizado por el frontend cuando las solicitudes se realizan directamente desde el navegador. En desarrollo, Vite utiliza un proxy para las solicitudes `/api`.

## Funcionalidades

### Portal del paciente

- **Inicio de sesión:** permite ingresar al portal utilizando correo electrónico y DNI. El backend contempla el registro del paciente durante el primer acceso.
- **Búsqueda de médicos:** permite visualizar profesionales y seleccionar uno para consultar su disponibilidad.
- **Disponibilidad horaria:** presenta una interfaz de selección de días y horarios para consultar las opciones disponibles.
- **Mis turnos:** permite consultar los turnos asociados al paciente.
- **Cancelación de turnos:** permite solicitar la cancelación de un turno mediante una confirmación y actualizar el listado cuando la API confirma la operación.

### Portal del administrador

- **Tablero de administración:** presenta el acceso principal a las funcionalidades administrativas.
- **Gestión de especialidades:** permite consultar especialidades registradas, buscar por nombre, visualizar resultados paginados, registrar nuevas especialidades, modificar sus datos y solicitar su eliminación.
- **Gestión de médicos:** permite consultar profesionales, registrar nuevos médicos, editar información y solicitar su eliminación.
- **Disponibilidad horaria:** permite consultar y gestionar las franjas horarias de atención de los profesionales.
- **Búsqueda de turnos:** permite consultar turnos y aplicar filtros por especialidad, médico, DNI del paciente y fecha.
- **Autenticación:** controla el acceso al panel administrativo según el rol del usuario.

## Organización del código

### Frontend

El frontend está organizado por funcionalidades dentro de `src`, separando los componentes reutilizables de las funcionalidades específicas del sistema.

La estructura principal es:

```text
src/
├── assets/
├── components/
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── templates/
├── features/
│   ├── appointments/
│   ├── auth/
│   ├── dashboard/
│   ├── doctors/
│   ├── patients/
│   └── specialities/
├── hooks/
├── routes/
├── services/
└── utils/
```

Dentro de `components` se encuentran los elementos reutilizables de la interfaz:

- `atoms`: componentes básicos, como Button, Icon, TextInput, Select y Badge.
- `molecules`: combinaciones de componentes básicos, como FormField, Pagination y NavItem.
- `organisms`: componentes de interfaz más completos, como Sidebar, Topbar y las barras de navegación.
- `templates`: estructuras generales de páginas, como AdminLayout, PatientLayout y AdminLoginTemplate.

Dentro de cada módulo de `features`:

- `pages` contiene las pantallas de cada funcionalidad.
- `components` contiene los elementos reutilizables específicos del módulo.
- `services` contiene las funciones encargadas de comunicarse con la API.
- `hooks` contiene lógica reutilizable relacionada con el estado y el comportamiento.
- `context` permite compartir información mediante el contexto de React.
- `utils` contiene funciones auxiliares propias de cada funcionalidad.

Los módulos principales son `auth`, `patients`, `appointments`, `doctors`, `specialities` y `dashboard`.

Además, `routes` define la navegación de la aplicación y `services` contiene configuraciones y servicios generales, como la instancia de Axios que incorpora el token JWT a las solicitudes protegidas.

Los formularios utilizan React Hook Form y los estilos se implementan con Tailwind CSS.

## Comandos disponibles

Ejecutar desde la raíz del frontend:

| Comando | Función |
|---|---|
| `npm ci` | Instala las dependencias registradas en `package-lock.json`. |
| `npm run dev` | Inicia el servidor de desarrollo de Vite. |
| `npm run test` | Ejecuta las pruebas automatizadas con Vitest. |
| `npm run test:watch` | Ejecuta las pruebas en modo observación. |
| `npm run lint` | Analiza el código mediante ESLint. |
| `npm run build` | Genera la versión de producción en `dist/`. |
| `npm run preview` | Sirve localmente la compilación generada con `build`. |


**Desarrollo de Software 2026 — UTN Facultad Regional Tucumán**  
**Comisión 3K3**
