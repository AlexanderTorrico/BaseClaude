import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================================
// CONFIGURACIÓN
// ==========================================

const config = [
  // Models
  {
    folder: 'models',
    template: 'model.template.js',
    fileName: 'Model.ts'
  },
  // Data (mock data)
  {
    folder: 'data',
    template: 'model.template.js',
    fileName: 'WithRoles.ts',
    prefix: 'mock'
  },
  // Services (3 archivos: Interface + ApiService + MockService)
  {
    folder: 'services',
    template: 'service.template.js',
    multiple: true,
    files: [
      { fileName: 'Service.ts', prefix: 'I', generator: 'generateServiceInterface' },
      { fileName: 'ApiService.ts', prefix: '', generator: 'generateApiService' },
      { fileName: 'MockService.ts', prefix: '', generator: 'generateMockService' }
    ]
  },
  // Adapters
  {
    folder: 'adapters',
    template: 'adapter.template.js',
    fileName: 'Adapter.ts',
    useLowerCase: true
  },
  // Hooks (2 archivos: use{Module}.ts + use{Module}Fetch.ts)
  {
    folder: 'hooks',
    template: 'hook.template.js',
    multiple: true,
    files: [
      { fileName: '.ts', prefix: 'use', generator: 'generateUseHook' },
      { fileName: 'Fetch.ts', prefix: 'use', generator: 'generateUseFetchHook' }
    ]
  },
  // Slices
  {
    folder: 'slices',
    template: 'slice.template.js',
    fileName: 'Slice.ts',
    useLowerCase: true
  },
  // Config (tableColumns)
  {
    folder: 'config',
    template: 'config.template.js',
    fileName: 'Columns.tsx',
    prefix: 'table'
  },
  // Components (carpeta vacía)
  {
    folder: 'components',
    skipFile: true
  },
  // Tests (fixtures + unit + integration)
  {
    folder: '__tests__',
    template: 'test.template.js',
    multiple: true,
    nestedFolders: true,
    files: [
      { subFolder: 'fixtures', fileName: '.ts', prefix: 'mock', generator: 'generateFixture' },
      { subFolder: 'unit', fileName: 'Adapter.test.ts', useLowerCase: true, generator: 'generateAdapterTest' },
      { subFolder: 'unit', fileName: 'Slice.test.ts', useLowerCase: true, generator: 'generateSliceTest' },
      { subFolder: 'integration', fileName: '.test.ts', prefix: 'use', generator: 'generateHookTest' },
      { subFolder: 'integration', fileName: 'Fetch.test.ts', prefix: 'use', generator: 'generateFetchTest' }
    ]
  }
];

// ==========================================
// OBTENER ARGUMENTOS
// ==========================================

let moduleName = process.argv[2];

if (moduleName && moduleName.startsWith('--name=')) {
  moduleName = moduleName.split('=')[1];
}

if (!moduleName || moduleName.trim() === '') {
  console.error('❌ Error: Debes proporcionar el nombre del módulo');
  console.log('Uso: npm run create_page:module Request');
  console.log('O:   npm run create_page:module --name=Request');
  console.log('O:   npm run create_page:module Security/Users');
  process.exit(1);
}

// Extraer nombre del módulo (último segmento de la ruta)
const moduleNameOnly = moduleName.split('/').pop();

// ==========================================
// CARGAR TEMPLATES
// ==========================================

const loadTemplate = async (templateName) => {
  const templatePath = path.join(__dirname, 'templates', templateName);
  try {
    const templateModule = await import(`file://${templatePath}`);
    return templateModule.default || templateModule;
  } catch (error) {
    console.error(`❌ Error al cargar template ${templateName}:`, error.message);
    process.exit(1);
  }
};

// ==========================================
// CREAR MÓDULO
// ==========================================

const createModule = async () => {
  try {
    const basePath = path.join(process.cwd(), 'src', 'modules', moduleName);

    // Crear carpeta principal
    fs.mkdirSync(basePath, { recursive: true });
    console.log(`✅ Carpeta creada: ${basePath}`);

    // Procesar cada item del config
    for (const item of config) {
      if (item.skipFile) {
        const folderPath = path.join(basePath, item.folder);
        fs.mkdirSync(folderPath, { recursive: true });
        console.log(`✅ Carpeta creada: ${folderPath}`);
        continue;
      }

      if (item.multiple) {
        const template = await loadTemplate(item.template);

        for (const file of item.files) {
          const folderPath = file.subFolder
            ? path.join(basePath, item.folder, file.subFolder)
            : path.join(basePath, item.folder);

          fs.mkdirSync(folderPath, { recursive: true });

          const generator = template[file.generator];
          if (!generator) {
            console.error(`❌ Error: Generador ${file.generator} no encontrado en ${item.template}`);
            continue;
          }
          const content = generator(moduleNameOnly);

          const prefix = file.prefix || '';
          const modulePart = file.useLowerCase ? moduleNameOnly.toLowerCase() : moduleNameOnly;
          const fileName = prefix + modulePart + file.fileName;
          const filePath = path.join(folderPath, fileName);

          fs.writeFileSync(filePath, content);
          console.log(`✅ Archivo creado: ${filePath}`);
        }
      } else {
        const folderPath = path.join(basePath, item.folder);
        fs.mkdirSync(folderPath, { recursive: true });
        console.log(`✅ Carpeta creada: ${folderPath}`);

        const templateFn = await loadTemplate(item.template);
        const content = templateFn(moduleNameOnly);

        const prefix = item.prefix || '';
        const modulePart = item.useLowerCase ? moduleNameOnly.toLowerCase() : moduleNameOnly;
        const fileName = prefix + modulePart + item.fileName;
        const filePath = path.join(folderPath, fileName);

        fs.writeFileSync(filePath, content);
        console.log(`✅ Archivo creado: ${filePath}`);
      }
    }

    // Crear index.tsx (caso especial - en raíz del módulo)
    const indexTemplate = await loadTemplate('index.template.js');
    const indexContent = indexTemplate(moduleNameOnly);
    const indexPath = path.join(basePath, 'index.tsx');
    fs.writeFileSync(indexPath, indexContent);
    console.log(`✅ Archivo creado: ${indexPath}`);

    console.log('\n🎉 ¡Módulo creado exitosamente!');
    console.log(`📁 Ubicación: src/modules/${moduleName}`);
    console.log('\n📋 Estructura generada:');
    console.log(`   ├── __tests__/ (fixtures, unit, integration)`);
    console.log(`   ├── adapters/ (${moduleNameOnly.toLowerCase()}Adapter.ts)`);
    console.log(`   ├── components/`);
    console.log(`   ├── config/ (table${moduleNameOnly}Columns.tsx)`);
    console.log(`   ├── data/ (mock${moduleNameOnly}WithRoles.ts)`);
    console.log(`   ├── hooks/ (use${moduleNameOnly}.ts, use${moduleNameOnly}Fetch.ts)`);
    console.log(`   ├── models/ (${moduleNameOnly}Model.ts)`);
    console.log(`   ├── services/ (I${moduleNameOnly}Service.ts, ${moduleNameOnly}ApiService.ts, ${moduleNameOnly}MockService.ts)`);
    console.log(`   ├── slices/ (${moduleNameOnly.toLowerCase()}Slice.ts)`);
    console.log(`   └── index.tsx`);

  } catch (error) {
    console.error('❌ Error al crear el módulo:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

// Ejecutar
createModule();
