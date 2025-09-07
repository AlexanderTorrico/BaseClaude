# Atoms Components Documentation

Sistema de componentes atómicos optimizados para **Skote React Dashboard**. Estos componentes están diseñados siguiendo el patrón **Atomic Design** y optimizados para rendimiento, responsividad y reutilización.

## 📋 Tabla de Contenidos

- [🚀 Características Principales](#-características-principales)
- [📱 Sistema Responsivo](#-sistema-responsivo)
- [⚡ Optimizaciones de Rendimiento](#-optimizaciones-de-rendimiento)
- [🔧 Componentes](#-componentes)
  - [Button](#button)
  - [Input](#input)
  - [Avatar](#avatar)
  - [Typography](#typography)
  - [Checkbox](#checkbox)
  - [Badge](#badge)
  - [Icon](#icon)
- [🎨 Utilidades](#-utilidades)
- [📖 Guías de Uso](#-guías-de-uso)

## 🚀 Características Principales

### ✨ **Totalmente Optimizados**
- **React.memo** para prevenir re-renders innecesarios
- **useMemo** para cálculos pesados
- **useCallback** para event handlers estables
- Comparaciones inteligentes de props

### 📱 **Completamente Responsivos**
- Breakpoints estándar Bootstrap 5
- Hooks para detección de pantalla
- Utilidades para props responsivas
- Optimizaciones específicas para móviles

### 🎯 **Altamente Reutilizables**
- Props flexibles y configurables
- Sistema de variantes consistente
- Soporte para temas dark/light
- Clases CSS modulares

### 🔒 **Type Safety**
- PropTypes completos
- Validación en tiempo de desarrollo
- Documentación JSDoc integrada

## 📱 Sistema Responsivo

### Breakpoints Disponibles
```javascript
const BREAKPOINTS = {
  xs: 0,     // Móvil pequeño
  sm: 576,   // Móvil grande
  md: 768,   // Tablet
  lg: 992,   // Desktop
  xl: 1200,  // Desktop grande
  xxl: 1400  // Desktop extra grande
}
```

### Hooks Responsivos
```javascript
import { useScreenSize, useResponsiveProps } from './ResponsiveUtils';

// Detectar tamaño de pantalla
const screenSize = useScreenSize(); // 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

// Props responsivas
const responsiveProps = useResponsiveProps(props, defaultProps);
```

## ⚡ Optimizaciones de Rendimiento

### React.memo Inteligente
Todos los componentes usan **React.memo** con comparaciones optimizadas:

```javascript
const MemoizedButton = React.memo(Button, (prevProps, nextProps) => {
  const criticalProps = ['variant', 'size', 'disabled', 'children'];
  return criticalProps.every(prop => prevProps[prop] === nextProps[prop]);
});
```

### useMemo para Cálculos
```javascript
// Clases CSS memoizadas
const buttonClasses = useMemo(() => {
  return [baseClasses, variantClasses[variant], sizeClasses[size]]
    .filter(Boolean).join(' ');
}, [variant, size, disabled]);
```

### useCallback para Handlers
```javascript
// Event handlers estables
const handleClick = useCallback((e) => {
  if (!disabled && onClick) onClick(e);
}, [disabled, onClick]);
```

## 🔧 Componentes

### Button

Botón altamente personalizable con efectos hover, múltiples variantes y soporte para íconos.

#### Props Principales
```javascript
<Button
  variant="primary"        // Color del botón
  size="sm"               // Tamaño: xs, sm, md, lg, xl
  fontWeight="normal"     // Peso del texto: light, normal, medium, bold
  disabled={false}        // Estado deshabilitado
  loading={false}         // Estado de carga con spinner
  icon={<Icon />}         // Ícono opcional
  iconPosition="left"     // Posición del ícono: left, right
  fullWidth={false}       // Ocupar todo el ancho
  onClick={handleClick}   // Handler de click
>
  Texto del Botón
</Button>
```

#### Variantes Disponibles
- `primary`, `secondary`, `success`, `danger`, `warning`, `info`, `light`, `dark`
- `outline-primary`, `outline-secondary`, `outline-danger`, `outline-success`

#### Ejemplos de Uso
```javascript
// Botón básico
<Button>Click me</Button>

// Botón con ícono
<Button variant="primary" icon={<i className="mdi mdi-plus" />}>
  Agregar
</Button>

// Botón de carga
<Button loading variant="success">
  Guardando...
</Button>

// Botón deshabilitado
<Button disabled variant="danger">
  Eliminar
</Button>
```

### Input

Campo de entrada con múltiples variantes, validación y soporte para íconos.

#### Props Principales
```javascript
<Input
  type="text"             // Tipo HTML: text, email, password, etc.
  label="Nombre"          // Etiqueta del campo
  placeholder="Ingrese..."// Placeholder
  value={value}           // Valor controlado
  onChange={onChange}     // Handler de cambio
  error="Error message"   // Mensaje de error
  helperText="Ayuda"      // Texto de ayuda
  disabled={false}        // Estado deshabilitado
  readonly={false}        // Solo lectura
  required={false}        // Campo requerido
  size="md"              // Tamaño: xs, sm, md, lg, xl
  variant="default"       // Estilo: default, filled, underlined
  icon={<Icon />}         // Ícono opcional
  iconPosition="left"     // Posición del ícono
/>
```

#### Ejemplos de Uso
```javascript
// Input básico
<Input label="Email" type="email" placeholder="usuario@ejemplo.com" />

// Input con error
<Input 
  label="Password" 
  type="password" 
  error="Contraseña muy débil"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>

// Input con ícono
<Input 
  label="Búsqueda"
  icon={<i className="mdi mdi-search" />}
  placeholder="Buscar usuarios..."
/>
```

### Avatar

Componente para imágenes de perfil con soporte para iniciales, estados y múltiples formas.

#### Props Principales
```javascript
<Avatar
  src="/avatar.jpg"       // URL de la imagen
  alt="Usuario"           // Texto alternativo
  name="Juan Pérez"       // Nombre para generar iniciales
  initial="JP"            // Iniciales personalizadas
  size="md"              // Tamaño: xs, sm, md, lg, xl, 2xl
  shape="circle"          // Forma: circle, square, rounded
  variant="primary"       // Color de fondo para iniciales
  status="online"         // Estado: online, offline, busy, away
  showStatus={true}       // Mostrar indicador de estado
  onClick={handleClick}   // Handler de click
/>
```

#### Ejemplos de Uso
```javascript
// Avatar con imagen
<Avatar src="/user.jpg" alt="Usuario" />

// Avatar con iniciales
<Avatar name="Juan Pérez" variant="primary" />

// Avatar con estado
<Avatar 
  name="Ana García" 
  status="online" 
  showStatus 
  size="lg"
/>

// Avatar clickeable
<Avatar 
  name="Admin" 
  variant="success"
  onClick={() => console.log('Avatar clicked')}
/>
```

### Typography

Sistema tipográfico unificado con control completo de estilo y responsividad.

#### Props Principales
```javascript
<Typography
  variant="h1"            // Elemento: h1-h6, p, span, small, etc.
  size="md"              // Tamaño: xs, sm, md, lg, xl, 2xl, 3xl
  weight="normal"         // Peso: light, normal, medium, bold
  color="primary"         // Color del texto
  align="left"           // Alineación: left, center, right, justify
  transform="none"        // Transformación: uppercase, lowercase, capitalize
  decoration="none"       // Decoración: underline, line-through, none
  truncate={false}       // Truncar con ellipsis
  className="custom"      // Clases adicionales
>
  Contenido del texto
</Typography>
```

#### Ejemplos de Uso
```javascript
// Títulos
<Typography variant="h1">Título Principal</Typography>
<Typography variant="h2" weight="bold" color="primary">
  Subtítulo Destacado
</Typography>

// Texto con estilo
<Typography variant="p" size="lg" color="muted">
  Descripción importante
</Typography>

// Texto truncado
<Typography variant="p" truncate className="w-50">
  Este texto muy largo se truncará automáticamente...
</Typography>
```

### Shortcuts de Typography
Para escritura rápida, disponibles como componentes individuales:

```javascript
import { H1, H2, P, Small, TextPrimary } from './Atoms';

<H1>Título Rápido</H1>
<P>Párrafo normal</P>
<Small color="muted">Texto pequeño</Small>
<TextPrimary>Texto en color primary</TextPrimary>
```

### Checkbox

Casilla de verificación con soporte para estados indeterminados y múltiples estilos.

#### Props Principales
```javascript
<Checkbox
  label="Acepto términos"  // Etiqueta
  checked={isChecked}      // Estado marcado
  onChange={handleChange}  // Handler de cambio
  indeterminate={false}    // Estado indeterminado
  disabled={false}         // Deshabilitado
  readOnly={false}         // Solo lectura
  size="md"               // Tamaño: xs, sm, md, lg, xl
  variant="primary"        // Color: primary, secondary, success, etc.
  description="Texto"      // Descripción adicional
  error="Error"           // Mensaje de error
/>
```

#### Ejemplos de Uso
```javascript
// Checkbox básico
<Checkbox 
  label="Recordarme" 
  checked={remember}
  onChange={(e) => setRemember(e.target.checked)}
/>

// Checkbox con descripción
<Checkbox 
  label="Recibir notificaciones"
  description="Te enviaremos emails sobre actualizaciones"
  variant="success"
/>

// Checkbox indeterminado (para "Seleccionar todos")
<Checkbox 
  label="Seleccionar todos"
  indeterminate={someSelected}
  checked={allSelected}
/>
```

### Badge

Etiquetas y estados visuales para mostrar información contextual.

#### Props Principales
```javascript
<Badge
  variant="primary"        // Color: primary, secondary, success, etc.
  status="active"         // Estado predefinido: active, inactive, etc.
  size="md"              // Tamaño: xs, sm, md, lg, xl
  pill={false}           // Forma de píldora redondeada
  dot={false}            // Solo punto indicador
>
  Contenido
</Badge>
```

#### Estados Predefinidos
- `active` → Verde (Activo)
- `inactive` → Gris (Inactivo)
- `suspended` → Rojo (Suspendido)
- `pending` → Amarillo (Pendiente)
- `completed` → Azul (Completado)
- `draft` → Gris claro (Borrador)

#### Ejemplos de Uso
```javascript
// Badge básico
<Badge variant="primary">Nuevo</Badge>

// Badge de estado
<Badge status="active" />

// Badge tipo punto
<Badge dot status="online" />

// Badge píldora
<Badge pill variant="success">Completado</Badge>
```

### Icon

Componente para íconos con soporte para múltiples librerías y tamaños.

#### Props Principales
```javascript
<Icon
  name="user"             // Nombre del ícono
  size="md"              // Tamaño: xs, sm, md, lg, xl, 2xl
  color="primary"         // Color del ícono
/>

// O usar TextIcon para íconos con texto
<TextIcon 
  name="Juan Pérez"       // Genera iniciales simplificadas
  size="md"
  color="primary"
/>
```

## 🎨 Utilidades

### ResponsiveUtils

Conjunto de utilidades para manejar responsividad:

```javascript
import { 
  useScreenSize, 
  useResponsiveProps,
  generateResponsiveClasses,
  RESPONSIVE_UTILITIES 
} from './ResponsiveUtils';

// Detectar pantalla
const screenSize = useScreenSize();

// Props responsivas
const props = useResponsiveProps(componentProps, defaults);

// Generar clases responsivas
const classes = generateResponsiveClasses('btn', {
  xs: 'sm',
  md: 'md',
  lg: 'lg'
});
```

## 📖 Guías de Uso

### Mejores Prácticas

1. **Usa React.memo cuando sea apropiado**
   ```javascript
   const MyComponent = React.memo(() => {
     return <Button>Static Button</Button>;
   });
   ```

2. **Aprovecha las optimizaciones**
   ```javascript
   // ✅ Bien - evento estable
   const handleClick = useCallback(() => {
     doSomething();
   }, []);

   // ❌ Mal - nueva función en cada render
   <Button onClick={() => doSomething()}>
   ```

3. **Usa props responsivas**
   ```javascript
   // Botón que cambia tamaño según pantalla
   <Button 
     size={screenSize === 'xs' ? 'sm' : 'md'}
     fullWidth={screenSize === 'xs'}
   >
     Responsive Button
   </Button>
   ```

### Patrones Comunes

#### Formularios Optimizados
```javascript
const OptimizedForm = () => {
  const [formData, setFormData] = useState({});
  
  const handleChange = useCallback((field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  }, []);

  return (
    <form>
      <Input 
        label="Email"
        value={formData.email || ''}
        onChange={handleChange('email')}
      />
      <Button type="submit">
        Enviar
      </Button>
    </form>
  );
};
```

#### Lista de Usuarios Responsiva
```javascript
const UserList = ({ users }) => {
  const screenSize = useScreenSize();
  const isMobile = screenSize === 'xs' || screenSize === 'sm';

  return (
    <div className={isMobile ? 'list-view' : 'grid-view'}>
      {users.map(user => (
        <div key={user.id} className="user-item">
          <Avatar 
            src={user.avatar}
            name={user.name}
            size={isMobile ? 'sm' : 'md'}
            showStatus
            status={user.status}
          />
          <Typography 
            variant={isMobile ? 'small' : 'p'}
            truncate
          >
            {user.name}
          </Typography>
          <Badge status={user.accountStatus} />
        </div>
      ))}
    </div>
  );
};
```

### Troubleshooting

#### Problemas Comunes

1. **Re-renders excesivos**
   - Verifica que estés usando `useCallback` para handlers
   - Asegúrate de que las dependencias de `useMemo` sean correctas

2. **Estilos no aplicados**
   - Verifica el orden de importación de CSS
   - Confirma que las clases Bootstrap estén cargadas

3. **Props responsivas no funcionan**
   - Asegúrate de usar los hooks correctos
   - Verifica que `window` esté disponible (SSR)

#### Performance Tips

1. **Lazy loading de imágenes**
   ```javascript
   <Avatar 
     src={useLazyImage(user.avatar, '/default-avatar.png')}
     name={user.name}
   />
   ```

2. **Virtualización para listas grandes**
   ```javascript
   // Para listas de 100+ elementos
   const VirtualizedUserList = () => {
     return (
       <VirtualList
         itemCount={users.length}
         itemSize={60}
         renderItem={({ index }) => (
           <UserItem user={users[index]} />
         )}
       />
     );
   };
   ```

---

## 🚀 Contribuir

Si encuentras bugs o tienes sugerencias de mejora:

1. Revisa la documentación JSDoc en cada componente
2. Verifica que las optimizaciones estén funcionando
3. Asegúrate de que los componentes sean accesibles
4. Mantén la consistencia con el sistema de diseño

**¡Los componentes Atoms están listos para crear interfaces increíbles!** 🎉