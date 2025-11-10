# Generador de Módulos y Páginas

Script unificado para generar la estructura completa de módulos o páginas con arquitectura modular.

## Comandos Disponibles

### Generar Módulo
Crea la estructura en `src/modules/`
```bash
npm run cp:module NombreModulo
```

Ejemplos:
```bash
npm run cp:module Product
npm run cp:module Security/Users
```

### Generar Página
Crea la estructura en `src/pages/`
```bash
npm run cp:page NombrePagina
```

Ejemplos:
```bash
npm run cp:page Dashboard
npm run cp:page Auth/Login
```

## Estructura Generada

Ambos comandos generan la misma estructura:

```
{NombreModulo}/
├── __tests__/
│   ├── fixtures/
│   │   └── mock{Nombre}.ts
│   ├── unit/
│   │   ├── {nombre}Adapter.test.ts
│   │   └── {nombre}Slice.test.ts
│   └── integration/
│       ├── use{Nombre}.test.ts
│       └── use{Nombre}Fetch.test.ts
├── adapters/
│   └── {nombre}Adapter.ts
├── components/
│   (vacía - para que la IA genere componentes)
├── config/
│   └── table{Nombre}Columns.tsx
├── data/
│   └── mock{Nombre}WithRoles.ts
├── hooks/
│   ├── use{Nombre}.ts
│   └── use{Nombre}Fetch.ts
├── models/
│   └── {Nombre}Model.ts
├── services/
│   ├── I{Nombre}Service.ts
│   ├── {Nombre}ApiService.ts
│   └── {Nombre}MockService.ts
├── slices/
│   └── {nombre}Slice.ts
└── index.tsx
```

## Características

- ✅ **Código limpio** - Sin comentarios innecesarios
- ✅ **TypeScript** - Totalmente tipado
- ✅ **Tests incluidos** - Fixtures, unit y integration tests
- ✅ **Patrón DI** - Service Interface + API + Mock
- ✅ **Redux Toolkit** - Slice con acciones CRUD
- ✅ **Hooks separados** - Sync (useModule) y Async (useModuleFetch)
- ✅ **Convención camelCase** - Archivos en camelCase (useUsers.ts, userSlice.ts)

## Flujo de Trabajo

1. Ejecutar comando para generar estructura base
2. La IA expande el código según necesidades específicas
3. Implementar componentes en la carpeta `components/`
4. Agregar más métodos a los servicios según se requiera

## Archivo Unificado

Todo el sistema usa un único archivo: `create.js`
- Actualizar este archivo actualiza ambos comandos
- Usa el parámetro `--type` para determinar la carpeta destino
