# Módulo de Compañía - UI Completa

## Resumen

Módulo completamente funcional para gestionar la información de la compañía y sus sucursales, construido siguiendo la arquitectura del proyecto.

## Estructura Implementada

```
Company/
├── index.tsx                           # Componente principal
├── components/
│   ├── CompanyLayout.tsx              # Layout con tabs
│   ├── CompanyInfoCard.tsx            # Card de información de la compañía
│   ├── CompanyFormModal.tsx           # Modal para editar compañía
│   ├── BranchesHeader.tsx             # Header de sucursales
│   ├── BranchesTable.tsx              # Tabla de sucursales con AzTable
│   ├── BranchFormModal.tsx            # Modal para crear/editar sucursales
│   └── BranchMapPicker.tsx            # Selector de ubicación con Google Maps
├── config/
│   └── tableBranchColumns.tsx         # Configuración de columnas
├── models/
│   └── CompanyModel.ts                # Interfaces TypeScript
├── data/
│   └── mockCompany.ts                 # Datos mock
├── services/
│   ├── ICompanyService.ts             # Interface del servicio
│   └── CompanyMockService.ts          # Implementación mock
├── adapters/
│   └── companyAdapter.ts              # Adaptadores API → Model
├── slices/
│   └── companySlice.ts                # Redux slice
└── hooks/
    ├── useCompany.ts                  # Hook sync
    └── useCompanyFetch.ts             # Hook async
```

## Funcionalidades Implementadas

### ✅ Información de la Compañía
- Vista completa de datos de la compañía
- Secciones: Información general, Descripción, Colores, Redes Sociales, Sitios Web
- Modal de edición con validación (Formik + Yup)
- Upload de logo (URL con preview)
- Campos: nombre, email, teléfono, tamaño, idioma, zona horaria, etc.

### ✅ Gestión de Sucursales
- Tabla con AzTable (sorting, filtering, pagination)
- CRUD completo: crear, editar, eliminar
- Modal con tabs: Información General | Ubicación
- Google Maps integration:
  - Mapa interactivo
  - Marcador arrastrable
  - Búsqueda de direcciones (Autocomplete)
  - Actualización automática de coordenadas
- Campos: nombre, dirección, teléfono, email, horarios, estado, etc.

### ✅ Redux & State Management
- Estado centralizado para compañía y sucursales
- Actions: setCompany, updateCompanyData, addBranch, updateBranch, removeBranch
- Selector hooks para acceso optimizado
- Loading states

### ✅ Mock Services
- Servicio mock completamente funcional
- Simula delays de red (500-800ms)
- Persistencia en memoria durante la sesión
- CRUD operations para compañía y sucursales

### ✅ Responsive Design
- Bootstrap 5 + Reactstrap
- Grid system responsive
- Tabs navigation
- Mobile-friendly modals

## Configuración Requerida

### 1. Google Maps API Key

**IMPORTANTE:** Para que el mapa funcione, debes configurar tu Google Maps API Key.

**Archivo:** `components/BranchMapPicker.tsx`

```typescript
// Línea 31-32
const GOOGLE_MAPS_API_KEY = 'TU_API_KEY_AQUI';
```

**Obtener API Key:**
1. Ve a [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
2. Crea un proyecto o selecciona uno existente
3. Habilita las siguientes APIs:
   - Maps JavaScript API
   - Places API
4. Crea credenciales (API Key)
5. Restringe el API Key por dominio (recomendado)
6. Copia y pega en `GOOGLE_MAPS_API_KEY`

### 2. Verificar Dependencias

Asegúrate de tener instaladas:

```json
{
  "@react-google-maps/api": "^2.19.3",
  "formik": "^2.4.5",
  "yup": "^1.3.3",
  "react-toastify": "^10.0.4",
  "reactstrap": "^9.2.2"
}
```

Si falta alguna:
```bash
npm install @react-google-maps/api formik yup react-toastify reactstrap
```

## Uso del Módulo

### Navegación
El módulo está disponible en la ruta configurada para Security/Company.

### Tabs
1. **Información General**: Visualiza y edita datos de la compañía
2. **Sucursales**: Gestiona las sucursales (tabla con CRUD)

### Flujo de Trabajo

**Editar Compañía:**
1. Click en botón "Editar" en la tarjeta de información
2. Modal se abre con formulario pre-llenado
3. Modificar campos necesarios
4. "Guardar Cambios"

**Agregar Sucursal:**
1. Tab "Sucursales"
2. Click "Nueva Sucursal"
3. Llenar formulario (tab Información General)
4. Ir a tab Ubicación
5. Buscar dirección o hacer click en el mapa
6. "Crear Sucursal"

**Editar Sucursal:**
1. Click en icono de lápiz en la tabla
2. Modal se abre con datos pre-llenados
3. Modificar campos necesarios
4. "Guardar Cambios"

**Eliminar Sucursal:**
1. Click en icono de papelera
2. Confirmar eliminación

## Datos Mock

### Compañía
- 1 compañía: "Aziende Solutions"
- Incluye: logo, contactos, redes sociales, sitios web

### Sucursales
- 4 sucursales pre-cargadas:
  - Sucursal Centro (Activa)
  - Sucursal Norte (Activa)
  - Sucursal Sur (Activa)
  - Sucursal Este (Inactiva)
- Coordenadas reales de Santa Cruz, Bolivia

## Integración con API Real

Para conectar con tu backend:

1. **Crear ApiService:**
   ```typescript
   // services/CompanyApiService.ts
   export class CompanyApiService implements ICompanyService {
     async getCompany(setLoading?: SetStateFn): Promise<ApiResponse<CompanyModel>> {
       // Implementar llamada HTTP
     }
     // ... resto de métodos
   }
   ```

2. **Actualizar index.tsx:**
   ```typescript
   // Cambiar de:
   const companyService = useMemo(() => new CompanyMockService(), []);

   // A:
   const companyService = useMemo(() => new CompanyApiService(), []);
   ```

3. **Endpoints esperados:**
   - `GET /api/company` - Obtener compañía
   - `PUT /api/company` - Actualizar compañía
   - `GET /api/branches` - Obtener sucursales
   - `POST /api/branches` - Crear sucursal
   - `PUT /api/branches/:id` - Actualizar sucursal
   - `DELETE /api/branches/:id` - Eliminar sucursal

## Validaciones

### Compañía
- Nombre: requerido, mín 3 caracteres
- Email: requerido, formato válido
- Teléfono: requerido
- Descripciones: requeridas, mín 20 caracteres
- Fecha de apertura: requerida
- Logo: URL válida (opcional)

### Sucursal
- Nombre: requerido, mín 3 caracteres
- Dirección: requerida, mín 5 caracteres
- Teléfono: requerido
- Email: formato válido (opcional)
- Coordenadas: rango válido (-90 a 90 lat, -180 a 180 lng)

## Estilos

- **Tema de colores:** Warning (amarillo/naranja)
- **Iconos:** Material Design Icons (mdi-*)
- **Layout:** Bootstrap Grid System
- **Componentes:** Reactstrap
- **Sin CSS custom:** Todo con clases de Bootstrap 5

## Notificaciones

Usando `react-toastify`:
- Éxito: Al guardar/crear/eliminar correctamente
- Error: Al fallar operaciones
- Posición: top-right (por defecto)

## TypeScript

Tipado estricto en todos los archivos:
- Interfaces para modelos
- Props types en componentes
- Return types en funciones
- No `any` types

## Arquitectura Seguida

✅ Patrón de módulo del proyecto
✅ Redux con createSlice
✅ Hooks separados: sync (useCompany) + async (useCompanyFetch)
✅ Services con interfaces
✅ Adapters para transformación de datos
✅ Mock services para desarrollo
✅ Componentes funcionales con TypeScript
✅ Formik + Yup para formularios
✅ Reactstrap para UI
✅ Material Design Icons

## Próximos Pasos

1. **Configurar Google Maps API Key** (prioritario)
2. Crear CompanyApiService para integración real
3. Añadir más validaciones según reglas de negocio
4. Implementar permisos por rol
5. Añadir filtros avanzados en tabla de sucursales
6. Export a PDF/Excel (opcional)
7. Dashboard con métricas (opcional)

## Troubleshooting

### El mapa no se muestra
- Verifica que hayas configurado `GOOGLE_MAPS_API_KEY`
- Asegúrate de habilitar Maps JavaScript API y Places API
- Revisa la consola del browser por errores de API key

### Error de imports
- Verifica paths absolutos con `@/`
- Asegura que las dependencias estén instaladas

### Redux no actualiza
- Verifica que el slice esté registrado en el store
- Revisa que los dispatches estén siendo llamados

### TypeScript errors
- Ejecuta `npm run type-check` (si está configurado)
- Revisa que todas las interfaces estén importadas

## Contacto

Para dudas o mejoras, revisar la documentación del proyecto principal.

---

**Desarrollado siguiendo las especificaciones del proyecto Aziende Platform**
