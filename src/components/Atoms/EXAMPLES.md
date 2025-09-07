# Atoms Components - Ejemplos Prácticos

Esta guía contiene ejemplos reales de uso de los componentes Atoms optimizados.

## 🔧 Configuración Inicial

```javascript
// Importación de componentes principales
import { 
  Button, Input, Avatar, Typography, Checkbox, Badge, Icon,
  H1, H2, P, Small, TextPrimary, TextSuccess 
} from '@/components/Atoms';

// Importación de utilidades responsivas
import { 
  useScreenSize, 
  useResponsiveProps 
} from '@/components/Atoms/ResponsiveUtils';
```

## 📱 Ejemplos por Componente

### 1. Button - Casos de Uso Reales

#### Formulario de Login
```javascript
const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const screenSize = useScreenSize();

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginUser();
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <div className="d-flex gap-2 flex-column flex-md-row">
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          fontWeight="normal"
          fullWidth={screenSize === 'xs'}
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>
        
        <Button
          type="button"
          variant="outline-secondary"
          fontWeight="normal"
          fullWidth={screenSize === 'xs'}
          onClick={() => navigate('/register')}
        >
          Registrarse
        </Button>
      </div>
    </form>
  );
};
```

#### Barra de Acciones de Tabla
```javascript
const TableActions = ({ selectedItems, onEdit, onDelete, onAdd }) => {
  const hasSelection = selectedItems.length > 0;

  return (
    <div className="d-flex gap-2 align-items-center">
      <Button
        variant="primary"
        size="sm"
        icon={<i className="mdi mdi-plus" />}
        onClick={onAdd}
        fontWeight="normal"
      >
        Agregar
      </Button>

      {hasSelection && (
        <>
          <Button
            variant="outline-info"
            size="sm"
            icon={<i className="mdi mdi-pencil" />}
            onClick={() => onEdit(selectedItems[0])}
            disabled={selectedItems.length !== 1}
            fontWeight="normal"
          >
            Editar
          </Button>

          <Button
            variant="outline-danger"
            size="sm"
            icon={<i className="mdi mdi-delete" />}
            onClick={() => onDelete(selectedItems)}
            fontWeight="normal"
          >
            Eliminar ({selectedItems.length})
          </Button>
        </>
      )}
    </div>
  );
};
```

### 2. Input - Formularios Avanzados

#### Formulario de Usuario Responsivo
```javascript
const UserForm = ({ user, onSave }) => {
  const [formData, setFormData] = useState(user || {});
  const [errors, setErrors] = useState({});
  const screenSize = useScreenSize();

  const handleChange = useCallback((field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  }, [errors]);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  return (
    <form className="row">
      <div className={screenSize === 'xs' ? 'col-12' : 'col-md-6'}>
        <Input
          label="Nombre completo"
          placeholder="Ej: Juan Pérez"
          value={formData.name || ''}
          onChange={handleChange('name')}
          error={errors.name}
          required
          size={screenSize === 'xs' ? 'sm' : 'md'}
        />
      </div>

      <div className={screenSize === 'xs' ? 'col-12' : 'col-md-6'}>
        <Input
          label="Email"
          type="email"
          placeholder="usuario@ejemplo.com"
          value={formData.email || ''}
          onChange={handleChange('email')}
          error={errors.email}
          icon={<i className="mdi mdi-email" />}
          required
          size={screenSize === 'xs' ? 'sm' : 'md'}
        />
      </div>

      <div className={screenSize === 'xs' ? 'col-12' : 'col-md-6'}>
        <Input
          label="Teléfono"
          type="tel"
          placeholder="+1 (555) 123-4567"
          value={formData.phone || ''}
          onChange={handleChange('phone')}
          error={errors.phone}
          icon={<i className="mdi mdi-phone" />}
          helperText="Incluye el código de país"
          size={screenSize === 'xs' ? 'sm' : 'md'}
        />
      </div>

      <div className={screenSize === 'xs' ? 'col-12' : 'col-md-6'}>
        <Input
          label="Departamento"
          value={formData.department || ''}
          onChange={handleChange('department')}
          disabled={!user?.isAdmin}
          helperText={!user?.isAdmin ? "Solo administradores pueden cambiar esto" : ""}
          size={screenSize === 'xs' ? 'sm' : 'md'}
        />
      </div>
    </form>
  );
};
```

#### Búsqueda con Debounce
```javascript
const SearchInput = ({ onSearch, placeholder = "Buscar..." }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchTerm.trim()) {
        setIsSearching(true);
        await onSearch(searchTerm);
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, onSearch]);

  return (
    <div className="position-relative">
      <Input
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        icon={
          isSearching ? (
            <div className="spinner-border spinner-border-sm" />
          ) : (
            <i className="mdi mdi-search" />
          )
        }
        iconPosition="left"
      />
    </div>
  );
};
```

### 3. Avatar - Casos Avanzados

#### Lista de Usuarios con Estados
```javascript
const UserList = ({ users }) => {
  const screenSize = useScreenSize();
  const avatarSize = screenSize === 'xs' ? 'sm' : 'md';

  return (
    <div className="list-group">
      {users.map(user => (
        <div key={user.id} className="list-group-item d-flex align-items-center">
          <Avatar
            src={user.avatar}
            name={user.name}
            size={avatarSize}
            status={user.status}
            showStatus
            onClick={() => viewProfile(user.id)}
            className="me-3"
          />
          
          <div className="flex-grow-1">
            <Typography variant="strong" className="d-block">
              {user.name}
            </Typography>
            <Small color="muted">{user.email}</Small>
          </div>

          <Badge status={user.accountStatus} />
        </div>
      ))}
    </div>
  );
};
```

#### Avatar con Upload
```javascript
const AvatarUpload = ({ currentAvatar, onUpload }) => {
  const [preview, setPreview] = useState(currentAvatar);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    try {
      const uploadedUrl = await onUpload(file);
      setPreview(uploadedUrl);
    } catch (error) {
      setPreview(currentAvatar); // Revert on error
    } finally {
      setUploading(false);
    }
  }, [currentAvatar, onUpload]);

  return (
    <div className="text-center">
      <div className="position-relative d-inline-block">
        <Avatar
          src={preview}
          name="Usuario"
          size="xl"
          className="mb-2"
        />
        {uploading && (
          <div className="position-absolute top-50 start-50 translate-middle">
            <div className="spinner-border spinner-border-sm" />
          </div>
        )}
      </div>

      <div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="d-none"
          id="avatar-upload"
          disabled={uploading}
        />
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => document.getElementById('avatar-upload').click()}
          disabled={uploading}
          icon={<i className="mdi mdi-camera" />}
          fontWeight="normal"
        >
          Cambiar Foto
        </Button>
      </div>
    </div>
  );
};
```

### 4. Typography - Contenido Dinámico

#### Artículo Responsivo
```javascript
const Article = ({ title, content, author, publishedAt }) => {
  const screenSize = useScreenSize();

  return (
    <article className="container">
      <header className="mb-4">
        <Typography
          variant={screenSize === 'xs' ? 'h3' : 'h1'}
          weight="bold"
          className="mb-3"
        >
          {title}
        </Typography>
        
        <div className="d-flex align-items-center text-muted">
          <Small>Por {author}</Small>
          <span className="mx-2">•</span>
          <Small>{new Date(publishedAt).toLocaleDateString()}</Small>
        </div>
      </header>

      <div className="article-content">
        {content.split('\n\n').map((paragraph, index) => (
          <Typography
            key={index}
            variant="p"
            className="mb-3"
            size={screenSize === 'xs' ? 'sm' : 'md'}
          >
            {paragraph}
          </Typography>
        ))}
      </div>
    </article>
  );
};
```

#### Sistema de Comentarios
```javascript
const Comment = ({ comment, level = 0 }) => {
  const [showReplies, setShowReplies] = useState(false);
  const screenSize = useScreenSize();

  const marginLeft = level > 0 ? `${level * (screenSize === 'xs' ? 15 : 25)}px` : '0';

  return (
    <div style={{ marginLeft }} className="mb-3">
      <div className="d-flex">
        <Avatar
          name={comment.author}
          size={screenSize === 'xs' ? 'sm' : 'md'}
          className="me-2"
        />
        
        <div className="flex-grow-1">
          <div className="bg-light p-3 rounded">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <Typography variant="strong" size="sm">
                {comment.author}
              </Typography>
              <Small color="muted">
                {formatDistanceToNow(new Date(comment.createdAt))} ago
              </Small>
            </div>
            
            <Typography variant="p" size="sm">
              {comment.content}
            </Typography>
          </div>

          <div className="mt-2">
            <Button
              variant="link"
              size="xs"
              onClick={() => setShowReplies(!showReplies)}
              fontWeight="normal"
              className="p-0 text-decoration-none"
            >
              {comment.replies?.length || 0} respuestas
            </Button>
          </div>

          {showReplies && comment.replies?.map(reply => (
            <Comment
              key={reply.id}
              comment={reply}
              level={level + 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
```

### 5. Checkbox - Formularios Complejos

#### Lista de Permisos
```javascript
const PermissionManager = ({ permissions, userPermissions, onPermissionChange }) => {
  const [checkedPermissions, setCheckedPermissions] = useState(new Set(userPermissions));

  const handlePermissionToggle = useCallback((permissionId) => {
    setCheckedPermissions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(permissionId)) {
        newSet.delete(permissionId);
      } else {
        newSet.add(permissionId);
      }
      onPermissionChange(Array.from(newSet));
      return newSet;
    });
  }, [onPermissionChange]);

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {});

  return (
    <div className="permission-manager">
      {Object.entries(groupedPermissions).map(([category, perms]) => (
        <div key={category} className="mb-4">
          <Typography variant="h6" className="mb-3">
            {category}
          </Typography>
          
          <div className="row">
            {perms.map(permission => (
              <div key={permission.id} className="col-md-6 col-lg-4">
                <Checkbox
                  label={permission.name}
                  description={permission.description}
                  checked={checkedPermissions.has(permission.id)}
                  onChange={() => handlePermissionToggle(permission.id)}
                  variant="primary"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
```

#### Tabla con Selección Múltiple
```javascript
const DataTable = ({ data, onSelectionChange }) => {
  const [selectedIds, setSelectedIds] = useState(new Set());

  const allSelected = data.length > 0 && selectedIds.size === data.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < data.length;

  const handleSelectAll = useCallback((checked) => {
    if (checked) {
      const allIds = new Set(data.map(item => item.id));
      setSelectedIds(allIds);
      onSelectionChange(Array.from(allIds));
    } else {
      setSelectedIds(new Set());
      onSelectionChange([]);
    }
  }, [data, onSelectionChange]);

  const handleSelectItem = useCallback((id) => (checked) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      onSelectionChange(Array.from(newSet));
      return newSet;
    });
  }, [onSelectionChange]);

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th style={{ width: '50px' }}>
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected}
                onChange={(e) => handleSelectAll(e.target.checked)}
                aria-label="Seleccionar todos"
              />
            </th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>
                <Checkbox
                  checked={selectedIds.has(item.id)}
                  onChange={handleSelectItem(item.id)}
                  aria-label={`Seleccionar ${item.name}`}
                />
              </td>
              <td>
                <div className="d-flex align-items-center">
                  <Avatar
                    src={item.avatar}
                    name={item.name}
                    size="sm"
                    className="me-2"
                  />
                  {item.name}
                </div>
              </td>
              <td>{item.email}</td>
              <td>
                <Badge status={item.status} />
              </td>
              <td>
                <Button
                  variant="outline-info"
                  size="xs"
                  icon={<i className="mdi mdi-pencil" />}
                  fontWeight="normal"
                  onClick={() => editItem(item.id)}
                >
                  Editar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

### 6. Badge - Indicadores de Estado

#### Dashboard de Métricas
```javascript
const MetricsDashboard = ({ metrics }) => {
  const getMetricVariant = (type, value, threshold) => {
    switch (type) {
      case 'success_rate':
        return value >= threshold ? 'success' : value >= threshold * 0.8 ? 'warning' : 'danger';
      case 'response_time':
        return value <= threshold ? 'success' : value <= threshold * 1.5 ? 'warning' : 'danger';
      default:
        return 'primary';
    }
  };

  return (
    <div className="row">
      {metrics.map(metric => (
        <div key={metric.id} className="col-md-6 col-lg-3 mb-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <Typography variant="h6" className="card-title">
                  {metric.name}
                </Typography>
                <Badge
                  variant={getMetricVariant(metric.type, metric.value, metric.threshold)}
                  size="sm"
                >
                  {metric.trend > 0 ? '↗' : metric.trend < 0 ? '↘' : '→'}
                </Badge>
              </div>

              <Typography variant="h4" weight="bold" color="primary">
                {metric.displayValue}
              </Typography>

              <div className="d-flex justify-content-between align-items-center mt-2">
                <Small color="muted">vs. mes anterior</Small>
                <Badge
                  variant={metric.trend > 0 ? 'success' : metric.trend < 0 ? 'danger' : 'secondary'}
                  size="xs"
                >
                  {metric.trendPercent > 0 ? '+' : ''}{metric.trendPercent}%
                </Badge>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
```

## 🔄 Patrones de Optimización

### 1. Componente Lista Virtualizada
```javascript
const VirtualizedList = ({ items, renderItem, itemHeight = 60 }) => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 });
  const containerRef = useRef(null);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const scrollTop = containerRef.current.scrollTop;
    const containerHeight = containerRef.current.clientHeight;

    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(start + Math.ceil(containerHeight / itemHeight) + 1, items.length);

    setVisibleRange({ start, end });
  }, [itemHeight, items.length]);

  const visibleItems = items.slice(visibleRange.start, visibleRange.end);

  return (
    <div
      ref={containerRef}
      style={{ height: '400px', overflowY: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: visibleRange.start * itemHeight }} />
      {visibleItems.map((item, index) => (
        <div key={item.id} style={{ height: itemHeight }}>
          {renderItem(item, visibleRange.start + index)}
        </div>
      ))}
      <div style={{ height: (items.length - visibleRange.end) * itemHeight }} />
    </div>
  );
};
```

### 2. Hook Personalizado para Formularios
```javascript
const useOptimizedForm = (initialData = {}, validation = {}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (touched[field] && validation[field]) {
      const error = validation[field](value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  }, [touched, validation]);

  const handleBlur = useCallback((field) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    if (validation[field]) {
      const error = validation[field](formData[field]);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  }, [formData, validation]);

  const isValid = useMemo(() => {
    return Object.values(errors).every(error => !error);
  }, [errors]);

  return {
    formData,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    setFormData,
    setErrors
  };
};
```

### 3. Componente de Notificaciones Toast
```javascript
const ToastNotification = ({ notifications, onDismiss }) => {
  const screenSize = useScreenSize();
  const isMobile = screenSize === 'xs' || screenSize === 'sm';

  return (
    <div className={`toast-container position-fixed ${isMobile ? 'top-0 end-0 start-0 p-3' : 'top-0 end-0 p-3'}`}>
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`toast show ${isMobile ? 'w-100' : ''}`}
          role="alert"
        >
          <div className="toast-header">
            <Badge
              variant={notification.type}
              size="xs"
              className="me-2"
            />
            <Typography variant="strong" className="me-auto">
              {notification.title}
            </Typography>
            <Button
              variant="link"
              size="xs"
              onClick={() => onDismiss(notification.id)}
              className="btn-close"
              aria-label="Close"
            />
          </div>
          <div className="toast-body">
            <Typography variant="small">
              {notification.message}
            </Typography>
          </div>
        </div>
      ))}
    </div>
  );
};
```

## 🎯 Best Practices Avanzadas

### 1. Lazy Loading de Componentes
```javascript
// Lazy load componentes pesados
const HeavyChart = React.lazy(() => import('./HeavyChart'));

const Dashboard = () => {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <Button onClick={() => setShowChart(true)} fontWeight="normal">
        Mostrar Gráfico
      </Button>
      
      {showChart && (
        <Suspense fallback={<div className="spinner-border" />}>
          <HeavyChart />
        </Suspense>
      )}
    </div>
  );
};
```

### 2. Debounce para Búsquedas
```javascript
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
```

### 3. Intersection Observer para Lazy Loading
```javascript
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => observer.disconnect();
  }, [options]);

  return [targetRef, isIntersecting];
};
```

## ✨ Conclusión

Estos ejemplos demuestran cómo usar los componentes Atoms optimizados en aplicaciones reales. La clave está en:

1. **Aprovechar las optimizaciones** - `useMemo`, `useCallback`, `React.memo`
2. **Usar responsividad** - Adaptar a diferentes pantallas
3. **Mantener accesibilidad** - ARIA labels, roles, keyboard navigation
4. **Seguir patrones consistentes** - Reutilizar lógica común

¡Los componentes están listos para crear aplicaciones increíbles! 🚀