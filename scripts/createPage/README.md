# Create Module Script

Script para generar automáticamente la estructura de módulos con todas las carpetas y archivos necesarios.

## 📁 Estructura generada

```
src/modules/{ModuleName}/
├── controllers/
│   └── {ModuleName}Controller.ts
├── models/
│   └── {ModuleName}Model.ts
├── services/
│   └── {ModuleName}Service.ts
├── hooks/
│   └── use{ModuleName}.ts
├── slices/
│   └── {ModuleName}Slice.ts
└── index.tsx
```

## 🚀 Uso

### Formato simple
```bash
npm run create_page:module Request
```

### Con flag --name
```bash
npm run create_page:module --name=Request
```

### Carpetas anidadas
```bash
npm run create_page:module Security/Users
npm run create_page:module Dashboard/Analytics/Reports
```

## 🎨 Personalizar Templates

Los templates se encuentran en `scripts/createPage/templates/`

### Archivos disponibles:
- `controller.template.js` - Plantilla para controllers
- `model.template.js` - Plantilla para models
- `service.template.js` - Plantilla para services
- `hook.template.js` - Plantilla para hooks
- `slice.template.js` - Plantilla para Redux slices
- `index.template.js` - Plantilla para componente principal

### Modificar un template:

```javascript
// templates/controller.template.js
export default (moduleName) => `export class ${moduleName}Controller {
  // Tu código personalizado aquí

  static async getData() {
    // Implementación
  }
}
`;
```

### Variables disponibles:
- `moduleName` - Nombre del módulo en PascalCase (ej: "Request", "UserProfile")
- `moduleName.toLowerCase()` - Nombre en minúsculas (ej: "request", "userprofile")

## ⚙️ Configuración

Para agregar nuevas carpetas o cambiar la estructura, edita el array `config` en `create-module.js`:

```javascript
const config = [
  {
    folder: 'controllers',      // Nombre de la subcarpeta
    template: 'controller.template.js',  // Archivo template a usar
    fileName: 'Controller.ts'   // Sufijo del archivo generado
  },
  {
    folder: 'hooks',
    template: 'hook.template.js',
    fileName: '.ts',
    prefix: 'use'               // Opcional: prefijo para el archivo
  }
];
```

## 📝 Ejemplos

### Crear módulo simple
```bash
npm run create_page:module Products
```
Crea: `src/modules/Products/`

### Crear módulo anidado
```bash
npm run create_page:module Admin/Settings
```
Crea: `src/modules/Admin/Settings/`

### Múltiples niveles
```bash
npm run create_page:module Dashboard/Reports/Sales
```
Crea: `src/modules/Dashboard/Reports/Sales/`

## 🔧 Notas técnicas

- Las carpetas se crean automáticamente con `recursive: true`
- Si la carpeta padre no existe, se crea automáticamente
- Los nombres de archivo usan PascalCase del último segmento de la ruta
- Los templates usan ES modules con funciones exportadas
