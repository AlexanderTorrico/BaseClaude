# Módulo de Gestión de RRHH - Work Stations

## 📋 Descripción

Módulo para la gestión de puestos de trabajo (Work Stations) con estructura jerárquica tipo organigrama vertical, incluyendo gestión de requisitos por puesto.

## 🎯 Características Implementadas

### 1. **Organigrama Vertical** ✅
- Visualización en árbol jerárquico vertical (no horizontal)
- Colores distintivos por nivel
- Navegación interactiva
- Selección de puestos para ver detalles

### 2. **Estructura Jerárquica** ✅
- Niveles basados en `dependency_id`
- Nivel 0 = Raíz (Directivo)
- Niveles 1-4 = Gerencial, Jefatura, Coordinación, Operativo
- Validación de dependencias circulares

### 3. **Gestión de Requisitos** ✅
- Panel lateral (Offcanvas) al seleccionar puesto
- Categorías: Educación, Experiencia, Competencias, Habilidades Técnicas, Certificaciones
- Indicador de requerido/opcional
- CRUD completo

### 4. **Filtros** ✅
- Filtro por nivel (dependency_id implícito)
- Botones dinámicos según niveles existentes

### 5. **3 Vistas** ✅
- Organigrama (árbol vertical)
- Lista jerárquica con indentación
- Tabla (responsivo para móvil)

### 6. **Diseño Responsivo** ✅
- Sistema de cambio automático tabla/cards en móvil
- Similar al módulo de Users

---

## 📁 Estructura del Módulo

```
src/modules/RRHH/WorkStations/
├── index.tsx                           # Página principal (abstracta)
├── data/                               # Mock data
│   ├── mockWorkStations.ts            # 20 puestos de trabajo
│   ├── mockRequirements.ts            # 39 requisitos
│   └── mockEmployees.ts               # 12 empleados
├── models/                            # TypeScript models
│   ├── WorkStationModel.ts
│   ├── WorkStationResponseModel.ts
│   ├── RequirementModel.ts
│   └── RequirementResponseModel.ts
├── config/
│   ├── levelColors.ts                 # Colores por nivel
│   └── tableColumns.tsx               # (pendiente)
├── utils/
│   ├── treeHelpers.ts                 # (pendiente)
│   └── levelHelpers.ts                # (pendiente)
├── services/
│   └── workStationServices.ts         # (pendiente)
├── adapters/
│   ├── workStationAdapter.ts          # (pendiente)
│   └── requirementAdapter.ts          # (pendiente)
├── controllers/
│   └── WorkStationController.ts       # (pendiente)
├── slices/
│   └── workStationsSlice.ts           # (pendiente)
├── hooks/
│   └── useWorkStations.ts             # (pendiente)
├── components/
│   ├── Header.tsx                     # (pendiente)
│   ├── OrganizationChartView.tsx      # (pendiente)
│   ├── WorkStationNode.tsx            # (pendiente)
│   └── ... (otros componentes)
└── styles/
    └── organizationChart.scss          # (pendiente)
```

---

## 🎨 Colores por Nivel

| Nivel | Nombre | Color | Uso |
|-------|---------|-------|-----|
| 0 | Directivo | Púrpura (#667eea) | Director General, CEO |
| 1 | Gerencial | Rosa (#f093fb) | Gerentes |
| 2 | Jefatura | Azul (#4facfe) | Jefes de área |
| 3 | Coordinación | Verde (#43e97b) | Coordinadores |
| 4 | Operativo | Amarillo (#feca57) | Personal operativo |
| 5 | Asistente | Rosa suave (#ff6b9d) | Asistentes |

---

## 🗂️ Mock Data

### Puestos de Trabajo (20 puestos)

Estructura jerárquica completa:

```
Director General (id=1, level=0, dependency_id=0)
├─ Gerente General (id=2, level=1, dependency_id=1)
│  ├─ Jefe de Ventas (id=5, level=2, dependency_id=2)
│  │  ├─ Coordinador Ventas Norte (id=11, level=3, dependency_id=5)
│  │  │  ├─ Vendedor Senior (id=16, level=4, dependency_id=11)
│  │  │  └─ Vendedor Junior (id=17, level=4, dependency_id=11)
│  │  └─ Coordinador Ventas Sur (id=12, level=3, dependency_id=5)
│  ├─ Jefe de Marketing (id=6, level=2, dependency_id=2)
│  │  ├─ Coordinador Marketing Digital (id=13, level=3, dependency_id=6)
│  │  │  └─ Especialista Redes Sociales (id=18, level=4, dependency_id=13)
│  │  └─ Coordinador de Contenidos (id=14, level=3, dependency_id=6)
│  └─ Jefe de Operaciones (id=7, level=2, dependency_id=2)
│     └─ Coordinador de Logística (id=15, level=3, dependency_id=7)
├─ Gerente Financiero (id=3, level=1, dependency_id=1)
│  ├─ Contador General (id=8, level=2, dependency_id=3)
│  │  └─ Analista Contable (id=19, level=4, dependency_id=8)
│  └─ Jefe de Tesorería (id=9, level=2, dependency_id=3)
└─ Gerente de RRHH (id=4, level=1, dependency_id=1)
   └─ Jefe de Reclutamiento (id=10, level=2, dependency_id=4)
      └─ Asistente de Reclutamiento (id=20, level=4, dependency_id=10)
```

### Requisitos (39 requisitos)

Distribuidos por categorías:
- **Educación:** Licenciaturas, Maestrías, Certificaciones
- **Experiencia:** Años de experiencia en el cargo
- **Competencias:** Habilidades blandas (liderazgo, comunicación)
- **Habilidades Técnicas:** Software, herramientas, CRM, ERP
- **Certificaciones:** CPA, MBA, etc.

---

## 🚀 Instalación de Dependencias

**IMPORTANTE:** El módulo requiere instalar la librería para el organigrama:

```bash
npm install react-organizational-chart
```

---

## 🔄 Flujo de Datos

```
1. Usuario abre módulo
   ↓
2. useWorkStations() hook ejecuta useEffect
   ↓
3. fetchWorkStations() llama al Controller
   ↓
4. Controller llama al Service (mock)
   ↓
5. Service retorna mockWorkStations.ts
   ↓
6. Adapter mapea snake_case → camelCase
   ↓
7. Controller enriquece con employeeCount, requirementCount
   ↓
8. Controller hace dispatch(setWorkStations(enriched))
   ↓
9. Redux actualiza estado
   ↓
10. Hook construye árbol con buildWorkStationTree()
   ↓
11. Componente renderiza según currentView:
    - '0' → OrganizationChartView (árbol vertical)
    - '1' → WorkStationListView (lista jerárquica)
    - '2' → WorkStationTableView (tabla responsiva)
```

---

## 📊 Estado de Implementación

### ✅ Completado
- [x] Estructura de carpetas
- [x] Mock data (3 archivos)
- [x] Modelos TypeScript (4 archivos)
- [x] Configuración de colores por nivel

### ⏳ Pendiente
- [ ] Utilidades (treeHelpers, levelHelpers)
- [ ] Servicios HTTP (mock)
- [ ] Adapters
- [ ] Controller
- [ ] Redux Slice
- [ ] Hook personalizado
- [ ] Componentes UI (9 archivos)
- [ ] Estilos CSS
- [ ] Registro en Redux store
- [ ] Agregar ruta en routes

---

## 📝 Próximos Pasos

1. **Completar archivos utils/** (treeHelpers.ts, levelHelpers.ts)
2. **Crear services y adapters**
3. **Implementar Controller**
4. **Crear Redux Slice**
5. **Implementar Hook**
6. **Crear componentes UI**
7. **Agregar estilos**
8. **Registrar en Redux store**
9. **Probar funcionalidad completa**

---

## 🎯 Funcionalidades Clave a Implementar

### buildWorkStationTree() - utils/treeHelpers.ts
Función que construye el árbol jerárquico a partir de la lista plana:

```typescript
export const buildWorkStationTree = (
  workStations: WorkStationModel[]
): WorkStationModel[] => {
  // 1. Crear mapa para acceso rápido
  // 2. Encontrar raíces (dependency_id = 0)
  // 3. Construir relaciones padre-hijo recursivamente
  return roots;
};
```

### Validación de Dependencias Circulares
Evita que un puesto dependa de sí mismo o de sus descendientes.

### Cálculo Automático de Niveles
Calcula el nivel basándose en el dependency_id.

---

## 💡 Notas de Desarrollo

### Arquitectura Mantenida
El módulo sigue la misma arquitectura del módulo `Security/Users`:
- index.tsx abstracto
- Componentes en `components/`
- Hook personalizado
- Controller con ControllerResponse
- Redux slice estándar
- Adapters para mapeo API ↔ UI

### Type Safety
- Todos los modelos están tipados
- Uso de interfaces separadas para API vs UI
- Props bien definidas en todos los componentes

### Mock Data Realista
- 20 puestos de trabajo en 5 niveles
- 39 requisitos distribuidos
- 12 empleados asignados
- Estructura jerárquica completa

---

## 📚 Referencias

- Componente: `react-organizational-chart`
- Patrón de arquitectura: `src/modules/Security/Users/`
- Documentación principal: `PROJECT_GUIDE.md`
- Guía de testing: `TESTING.md`

---

**Creado:** 2025-01-10
**Estado:** En desarrollo (Fase 1 completada - Base y Mock Data)
**Próxima actualización:** Fase 2 - Lógica de negocio
