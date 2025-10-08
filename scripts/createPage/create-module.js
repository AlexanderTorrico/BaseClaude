import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================================
// CONFIGURACIÓN
// ==========================================

const config = [
  {
    folder: 'controllers',
    template: 'controller.template.js',
    fileName: 'Controller.ts'
  },
  {
    folder: 'models',
    template: 'model.template.js',
    fileName: 'Model.ts'
  },
  {
    folder: 'services',
    template: 'service.template.js',
    fileName: 'Service.ts'
  },
  {
    folder: 'hooks',
    template: 'hook.template.js',
    fileName: '.ts',
    prefix: 'Use'
  },
  {
    folder: 'slices',
    template: 'slice.template.js',
    fileName: 'Slice.ts'
  }
];

// ==========================================
// OBTENER ARGUMENTOS
// ==========================================

// Soporta:
// npm run create_page:module Request
// npm run create_page:module --name=Request
// npm run create_page:module SuperFolder/Request
let moduleName = process.argv[2];

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

// Extraer nombre del módulo (último segmento de la ruta)
const moduleNameOnly = moduleName.split('/').pop();

// ==========================================
// CARGAR TEMPLATES
// ==========================================

const loadTemplate = async (templateName) => {
  const templatePath = path.join(__dirname, 'templates', templateName);
  try {
    const templateModule = await import(`file://${templatePath}`);
    return templateModule.default;
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
      // Crear subcarpeta
      const folderPath = path.join(basePath, item.folder);
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(`✅ Carpeta creada: ${folderPath}`);

      // Cargar template
      const templateFn = await loadTemplate(item.template);
      const content = templateFn(moduleNameOnly);

      // Generar nombre de archivo
      const prefix = item.prefix || '';
      const fileName = prefix + moduleNameOnly + item.fileName;
      const filePath = path.join(folderPath, fileName);

      // Crear archivo
      fs.writeFileSync(filePath, content);
      console.log(`✅ Archivo creado: ${filePath}`);
    }

    // Crear index.tsx (caso especial - en raíz del módulo)
    const indexTemplate = await loadTemplate('index.template.js');
    const indexContent = indexTemplate(moduleNameOnly);
    const indexPath = path.join(basePath, 'index.tsx');
    fs.writeFileSync(indexPath, indexContent);
    console.log(`✅ Archivo creado: ${indexPath}`);

    console.log('\n🎉 ¡Módulo creado exitosamente!');
    console.log(`📁 Ubicación: src/modules/${moduleName}`);

  } catch (error) {
    console.error('❌ Error al crear el módulo:', error.message);
    process.exit(1);
  }
};

// Ejecutar
createModule();
