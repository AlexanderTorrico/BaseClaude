import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = [
  {
    folder: 'models',
    template: 'model.template.js',
    fileName: 'Model.ts'
  },
  {
    folder: 'data',
    template: 'model.template.js',
    fileName: 'WithRoles.ts',
    prefix: 'mock'
  },
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
  {
    folder: 'adapters',
    template: 'adapter.template.js',
    fileName: 'Adapter.ts',
    useLowerCase: true
  },
  {
    folder: 'hooks',
    template: 'hook.template.js',
    multiple: true,
    files: [
      { fileName: '.ts', prefix: 'use', generator: 'generateUseHook' },
      { fileName: 'Fetch.ts', prefix: 'use', generator: 'generateUseFetchHook' }
    ]
  },
  {
    folder: 'slices',
    template: 'slice.template.js',
    fileName: 'Slice.ts',
    useLowerCase: true
  },
  {
    folder: 'config',
    template: 'config.template.js',
    fileName: 'Columns.tsx',
    prefix: 'table'
  },
  {
    folder: 'components',
    skipFile: true
  },
  {
    folder: 'validations',
    skipFile: true
  },
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

const args = process.argv.slice(2);
let targetFolder = 'modules';
let moduleName = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--type' && args[i + 1]) {
    targetFolder = args[i + 1];
    i++;
  } else if (args[i].startsWith('--name=')) {
    moduleName = args[i].split('=')[1];
  } else if (!moduleName) {
    moduleName = args[i];
  }
}

if (!moduleName || moduleName.trim() === '') {
  console.error('❌ Error: Debes proporcionar el nombre del módulo');
  console.log('Uso: npm run cp:module Request');
  console.log('O:   npm run cp:page Request');
  process.exit(1);
}

const moduleNameOnly = moduleName.split('/').pop();

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

const create = async () => {
  try {
    const basePath = path.join(process.cwd(), 'src', targetFolder, moduleName);

    fs.mkdirSync(basePath, { recursive: true });
    console.log(`✅ Carpeta creada: ${basePath}`);

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

    const indexTemplate = await loadTemplate('index.template.js');
    const indexContent = indexTemplate(moduleNameOnly);
    const indexPath = path.join(basePath, 'index.tsx');
    fs.writeFileSync(indexPath, indexContent);
    console.log(`✅ Archivo creado: ${indexPath}`);

    const entityType = targetFolder === 'modules' ? 'Módulo' : 'Página';
    console.log(`\n🎉 ¡${entityType} creado exitosamente!`);
    console.log(`📁 Ubicación: src/${targetFolder}/${moduleName}`);
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
    console.log(`   ├── validations/`);
    console.log(`   └── index.tsx`);

  } catch (error) {
    console.error('❌ Error al crear:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

create();
