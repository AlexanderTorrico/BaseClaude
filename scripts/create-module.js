import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Obtener argumentos - soporta ambos formatos:
// npm run create_page:module Request
// npm run create_page:module --name=Request
let moduleName = process.argv[2];

// Si viene con --name=, extraer el valor
if (moduleName && moduleName.startsWith('--name=')) {
  moduleName = moduleName.split('=')[1];
}

if (!moduleName || moduleName.trim() === '') {
  console.error('❌ Error: Debes proporcionar el nombre del módulo');
  console.log('Uso: npm run create_page:module Request');
  console.log('O:   npm run create_page:module --name=Request');
  console.log('O:   npm run create_page:module SuperFolder/Request');
  process.exit(1);
}

// Extraer nombre del módulo de la ruta (último segmento)
// Ejemplos:
//   "Request" -> Request
//   "SuperFolder/Request" -> Request
//   "Folder/SubFolder/Module" -> Module
const moduleNameOnly = moduleName.split('/').pop();

// Definir ruta base (soporta rutas anidadas)
const basePath = path.join(process.cwd(), 'src', 'modules', moduleName);

// Crear estructura de carpetas
const folders = [
  'controllers',
  'models',
  'services',
  'hooks',
  'slices'
];

try {
  // Crear carpeta principal
  fs.mkdirSync(basePath, { recursive: true });
  console.log(`✅ Carpeta creada: ${basePath}`);

  // Crear subcarpetas
  folders.forEach(folder => {
    const folderPath = path.join(basePath, folder);
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`✅ Carpeta creada: ${folderPath}`);
  });

  // Plantillas de archivos (usar moduleNameOnly para los nombres)
  const indexTemplate = `export default function ${moduleNameOnly}() {
  return (
    <div>
      <h1>Hola mundo</h1>
    </div>
  );
}
`;

  const controllerTemplate = `export class ${moduleNameOnly}Controller {
  // TODO: Implementar lógica del controlador
}
`;

  const modelTemplate = `export class ${moduleNameOnly}Model {
  // TODO: Definir modelo
}
`;

  const serviceTemplate = `export class ${moduleNameOnly}Service {
  // TODO: Implementar servicios
}
`;

  const hookTemplate = `export const use${moduleNameOnly} = () => {
  // TODO: Implementar hook
};
`;

  const sliceTemplate = `import { createSlice } from '@reduxjs/toolkit';

const ${moduleNameOnly.toLowerCase()}Slice = createSlice({
  name: '${moduleNameOnly.toLowerCase()}',
  initialState: {},
  reducers: {
    // TODO: Definir reducers
  }
});

export default ${moduleNameOnly.toLowerCase()}Slice.reducer;
`;

  // Crear archivos
  const files = [
    { path: path.join(basePath, 'index.tsx'), content: indexTemplate },
    { path: path.join(basePath, 'controllers', `${moduleNameOnly}Controller.ts`), content: controllerTemplate },
    { path: path.join(basePath, 'models', `${moduleNameOnly}Model.ts`), content: modelTemplate },
    { path: path.join(basePath, 'services', `${moduleNameOnly}Service.ts`), content: serviceTemplate },
    { path: path.join(basePath, 'hooks', `use${moduleNameOnly}.ts`), content: hookTemplate },
    { path: path.join(basePath, 'slices', `${moduleNameOnly}Slice.ts`), content: sliceTemplate }
  ];

  files.forEach(file => {
    fs.writeFileSync(file.path, file.content);
    console.log(`✅ Archivo creado: ${file.path}`);
  });

  console.log('\n🎉 ¡Módulo creado exitosamente!');
  console.log(`📁 Ubicación: src/modules/${moduleName}`);

} catch (error) {
  console.error('❌ Error al crear el módulo:', error.message);
  process.exit(1);
}