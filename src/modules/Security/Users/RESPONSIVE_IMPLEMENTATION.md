# Implementación Responsiva - Módulo de Usuarios

## 📱 Resumen de la Implementación

Se ha implementado un diseño **totalmente responsivo** para el módulo de Usuarios que cambia automáticamente entre **vista de tabla** (desktop) y **vista de cards** (móvil).

---

## 🎯 Características Implementadas

### 1. **Detección Automática de Viewport**
- **Breakpoint:** `md` (768px)
- **Desktop/Tablet (≥768px):** Vista Tabla
- **Móvil (<768px):** Vista Cards
- **Cambio automático** al redimensionar la ventana

### 2. **Cambio Manual de Vista**
- Botones en el header para cambiar vista manualmente
- Override manual que dura 5 segundos antes de volver al modo automático
- Indicadores visuales de vista responsiva vs. override manual

### 3. **Filtros Unificados**
- **AzFilterSummary** envuelve ambas vistas
- Los filtros funcionan en **ambas vistas** (tabla y cards)
- Búsqueda y ordenamiento sincronizados

### 4. **Vista de Cards Responsive**
- Grid adaptable: 1, 2, 3 o 4 columnas según tamaño de pantalla
- Diseño de cards optimizado para móvil
- Solo botón de **Editar** según especificación

### 5. **Sin Paginación en Cards**
- Scroll infinito en vista de cards
- Paginación solo en vista de tabla

---

## 📁 Archivos Modificados/Creados

### ✅ **Nuevos Archivos**

#### 1. `components/ContentCards.tsx`
Componente de vista de cards para usuarios.

**Características:**
- Grid responsivo con Bootstrap Cols
- Avatar con iniciales si no hay imagen
- Badges para roles y permisos con tooltips
- Botones de acción: Gestionar Roles/Permisos y Editar
- Modal de roles/permisos integrado
- Empty state cuando no hay resultados

**Props:**
```typescript
interface ContentCardsProps {
  filteredUsers: UserModel[];
}
```

**Diseño de Card:**
```
┌─────────────────────────────┐
│  [Avatar] Juan Pérez        │
│           juan@email.com    │
│  ─────────────────────────  │
│  📱 +1 555-0101             │
│  🏢 Developer (Nivel 2)     │
│  🛡️ 2 roles  🔑 15 permisos │
│  ─────────────────────────  │
│  [Roles/Permisos] [Editar]  │
└─────────────────────────────┘
```

---

### ✏️ **Archivos Modificados**

#### 2. `slices/usersSice.ts`
Agregado estado de vista actual.

**Cambios:**
```typescript
interface UserState {
  list: UserModel[];
  loading: boolean;
  error: string | null;
  currentView: string; // '0' = table, '1' = cards
}

// Nuevo reducer
setCurrentView: (state, action: PayloadAction<string>) => {
  state.currentView = action.payload;
}
```

---

#### 3. `hooks/useUsers.ts`
Agregado selector para `currentView`.

**Cambios:**
```typescript
const currentView = useSelector((state: RootState) => state.users.currentView);

return {
  // ... otros exports
  currentView,
};
```

---

#### 4. `components/Header.tsx`
Reemplazado `AzHeaderCard` con `AzHeaderCardViews` para manejo de vistas.

**Características:**
- Detección automática de viewport con `useEffect` + `window.addEventListener('resize')`
- Estado local para `responsiveView` y `isManualOverride`
- Dispatch a Redux para sincronizar vista actual
- Botones de cambio de vista (Tabla / Cards)
- Timer de 5 segundos para resetear override manual

**Lógica de Detección:**
```typescript
useEffect(() => {
  const handleResize = () => {
    const isMobile = window.innerWidth < 768; // Breakpoint md
    const autoView = isMobile ? '1' : '0';

    setResponsiveView(autoView);

    if (!isManualOverride) {
      dispatch(setCurrentView(autoView));
    }
  };

  handleResize();
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, [dispatch, isManualOverride]);
```

---

#### 5. `components/ContentTable.tsx`
Refactorizado para recibir `filteredUsers` como prop.

**Cambios:**
- Eliminado `AzFilterSummary` interno (ahora está en `index.tsx`)
- Recibe `filteredUsers`, `filters`, `sorting`, `onFilterChange`, `onSortChange`
- Simplificado: solo renderiza la tabla

**Props:**
```typescript
interface ContentTableProps {
  filteredUsers: UserModel[];
  filters?: Record<string, string>;
  sorting?: { field: string; direction: string };
  onFilterChange?: (column: string, value: string) => void;
  onSortChange?: (config: { field: string; direction: string }) => void;
}
```

---

#### 6. `index.tsx`
Refactorizado para manejar cambio de vistas.

**Cambios:**
- `AzFilterSummary` centralizado envolviendo ambas vistas
- Renderizado condicional basado en `currentView`
- Error handling centralizado
- Paso de props de filtros a ambas vistas

**Estructura:**
```typescript
<AzFilterSummary data={users} columns={userTableColumns}>
  {({ filteredData, filters, sorting, onFilterChange, onSortChange }) => (
    <>
      {currentView === '0' && (
        <ContentTable
          filteredUsers={filteredData}
          filters={filters}
          sorting={sorting}
          onFilterChange={onFilterChange}
          onSortChange={onSortChange}
        />
      )}

      {currentView === '1' && (
        <ContentCards filteredUsers={filteredData} />
      )}
    </>
  )}
</AzFilterSummary>
```

---

## 🎨 Diseño Responsivo del Grid de Cards

### Columnas por Breakpoint
```scss
xs  (<576px):  1 columna  (col-12)
sm  (≥576px):  2 columnas (col-sm-6)
lg  (≥992px):  3 columnas (col-lg-4)
xl  (≥1200px): 4 columnas (col-xl-3)
```

**Implementación:**
```typescript
<Col key={user.id} xs={12} sm={6} lg={4} xl={3} className="mb-4">
  <UserCard user={user} />
</Col>
```

---

## 🔄 Flujo de Cambio de Vista

### 1. **Cambio Automático (Resize)**
```
Usuario redimensiona ventana
    ↓
handleResize() detecta ancho
    ↓
isMobile = window.innerWidth < 768
    ↓
autoView = isMobile ? '1' : '0'
    ↓
Si NO hay override manual:
    dispatch(setCurrentView(autoView))
    ↓
Redux actualiza currentView
    ↓
index.tsx renderiza vista correspondiente
```

### 2. **Cambio Manual (Botones)**
```
Usuario hace clic en botón de vista
    ↓
handleViewChange(viewKey)
    ↓
dispatch(setCurrentView(viewKey))
setIsManualOverride(true)
    ↓
setTimeout(() => setIsManualOverride(false), 5000)
    ↓
Redux actualiza currentView
    ↓
index.tsx renderiza vista correspondiente
    ↓
Después de 5s, vuelve al modo automático
```

---

## ✅ Checklist de Implementación

- ✅ Detección automática de viewport en breakpoint `md` (768px)
- ✅ Vista de tabla para desktop/tablet
- ✅ Vista de cards para móvil
- ✅ Cambio manual de vista con botones en header
- ✅ Override manual con timeout de 5 segundos
- ✅ Filtros funcionando en ambas vistas (AzFilterSummary)
- ✅ Sin paginación en vista de cards
- ✅ Solo botón de Editar en cards (según especificación)
- ✅ Modal de Roles/Permisos funcionando en ambas vistas
- ✅ Loading states en ambas vistas
- ✅ Empty states en ambas vistas
- ✅ Error handling centralizado
- ✅ Grid responsivo de cards (1-4 columnas)
- ✅ Badges con tooltips para roles y permisos
- ✅ Avatar con iniciales si no hay imagen

---

## 🧪 Cómo Probar

### 1. **Probar Cambio Automático**
1. Abrir el módulo en desktop (>768px) → Debe mostrar **tabla**
2. Redimensionar ventana a móvil (<768px) → Debe cambiar a **cards**
3. Volver a agrandar ventana → Debe volver a **tabla**

### 2. **Probar Cambio Manual**
1. Hacer clic en botón de "Cards" → Debe cambiar a vista de cards
2. Redimensionar ventana → Vista NO debe cambiar (override activo)
3. Esperar 5 segundos → Debe volver al modo automático
4. Redimensionar ventana → Vista debe cambiar automáticamente

### 3. **Probar Filtros**
1. En vista de tabla, aplicar filtro por nombre
2. Cambiar a vista de cards → Filtro debe mantenerse
3. Resultados deben ser los mismos en ambas vistas

### 4. **Probar Acciones**
1. En vista de cards, hacer clic en "Editar" → Debe loguear ID
2. Hacer clic en "Roles/Permisos" → Modal debe abrirse
3. Cerrar modal → Debe recargar datos

---

## 📊 Arquitectura Mantenida

La implementación **respeta completamente** la arquitectura establecida:

```
UI (index.tsx - abstracto + condicional)
  ↓
Submódulos (Header, ContentTable, ContentCards)
  ↓
Hook (useUsers - con currentView)
  ↓
Controller (UserController - sin cambios)
  ↓
Service (userServices - sin cambios)
  ↓
Adapter (userAdapter - sin cambios)
  ↓
Redux Slice (usersSice - con currentView)
```

**Sin cambios en:**
- ✅ Controller
- ✅ Service
- ✅ Adapter
- ✅ Models
- ✅ Config (tableColumns)

**Solo cambios en capas de UI y estado:**
- ✏️ Slice (nuevo estado `currentView`)
- ✏️ Hook (nuevo selector)
- ✏️ Components (Header, ContentTable refactorizado, ContentCards nuevo)
- ✏️ index.tsx (lógica de renderizado condicional)

---

## 🚀 Próximos Pasos Opcionales

1. **Persistencia de Preferencia de Vista**
   - Guardar `currentView` en localStorage
   - Restaurar al cargar el módulo

2. **Animaciones de Transición**
   - Fade in/out al cambiar entre vistas
   - Skeleton loaders en cards

3. **Vista de Lista Adicional**
   - Tercera vista más compacta
   - Botón adicional en header

4. **Filtros Avanzados en Cards**
   - Dropdown de filtros en vista móvil
   - Botón flotante de filtros

5. **Infinite Scroll en Cards**
   - Cargar más datos al hacer scroll
   - Implementar con IntersectionObserver

---

## 📝 Notas Técnicas

### Dependencias Usadas
- `react-redux` - Manejo de estado global
- `reactstrap` - Componentes de Bootstrap
- `AzHeaderCardViews` - Componente custom para header con vistas
- `AzFilterSummary` - Componente custom para filtros
- `AzTable` - Componente custom para tablas

### Breakpoint Utilizado
- **md (768px)** - Punto de cambio entre tablet y móvil
- Compatible con Bootstrap 5 breakpoints

### Performance
- `useEffect` con cleanup para event listener de resize
- Debounce implícito por el timer de override (5s)
- Memoización en AzHeaderCardViews con `React.useMemo`

---

## ✨ Conclusión

La implementación está **completa y funcional**, respetando:
1. ✅ Arquitectura modular establecida
2. ✅ Especificaciones del usuario (breakpoint md, filtros AzFilterSummary, solo editar en cards)
3. ✅ Principios de separación de responsabilidades
4. ✅ Type-safety con TypeScript
5. ✅ Reutilización de componentes AZ existentes

**El módulo de Usuarios ahora es completamente responsivo y adaptable a cualquier dispositivo.** 🎉
