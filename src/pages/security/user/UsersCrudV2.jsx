import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Badge,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
  InputGroup,
  InputGroupText,
  Form,
  FormGroup,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Progress,
} from "reactstrap";
import { toast } from "react-toastify";
import TableContainer from "../../../components/Common/TableContainer";
import DeleteModal from "../../../components/Common/DeleteModal";

const CustomSelect = ({ value, onChange, options, placeholder, icon }) => {
  return (
    <UncontrolledDropdown>
      <DropdownToggle 
        tag="button" 
        className="btn btn-light w-100 d-flex justify-content-between align-items-center"
        style={{ 
          textAlign: 'left',
          border: '1px solid #ced4da',
          borderRadius: '0.375rem',
          padding: '0.5rem 0.75rem',
          fontSize: '0.875rem',
          fontWeight: 'normal',
          color: value === 'all' || !value ? '#6c757d' : '#495057'
        }}
      >
        <span className="d-flex align-items-center">
          {icon && <i className={`${icon} me-2`}></i>}
          {value === 'all' || !value ? placeholder : options.find(opt => opt.value === value)?.label}
        </span>
        <i className="mdi mdi-chevron-down"></i>
      </DropdownToggle>
      <DropdownMenu className="w-100" style={{ minWidth: '100%' }}>
        {options.map((option, index) => (
          <DropdownItem 
            key={index}
            onClick={() => onChange(option.value)}
            className={value === option.value ? 'active' : ''}
          >
            {option.icon && <i className={`${option.icon} me-2`}></i>}
            {option.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

// Componente de filtro para columnas con estado interno para evitar pérdida de focus
const ColumnFilter = React.memo(({ column, value, onChange, placeholder = "Filtrar..." }) => {
  const [internalValue, setInternalValue] = useState(value || '');
  const debounceRef = useRef(null);
  
  // Sincronizar valor interno cuando cambia el valor externo
  useEffect(() => {
    setInternalValue(value || '');
  }, [value]);

  const handleInputChange = useCallback((e) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    
    // Debounce para evitar demasiadas llamadas
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // Si el campo está vacío, aplicar inmediatamente para mejor UX
    if (!newValue || newValue.trim() === '') {
      onChange(column, newValue);
    } else {
      debounceRef.current = setTimeout(() => {
        onChange(column, newValue);
      }, 300);
    }
  }, [column, onChange]);

  const handleClear = useCallback(() => {
    setInternalValue('');
    // Limpiar inmediatamente sin debounce para mejor UX
    onChange(column, '');
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
  }, [column, onChange]);

  // Cleanup del debounce al desmontar
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className="column-filter-container" style={{ marginTop: '8px' }}>
      <InputGroup size="sm">
        <Input
          type="text"
          placeholder={placeholder}
          value={internalValue}
          onChange={handleInputChange}
          style={{ 
            fontSize: '12px', 
            border: '1px solid #dee2e6',
            borderRadius: '4px'
          }}
        />
        {internalValue && (
          <InputGroupText 
            className="pe-2"
            style={{ 
              cursor: 'pointer',
              border: '1px solid #dee2e6',
              borderLeft: 'none',
              background: '#f8f9fa'
            }}
            onClick={handleClear}
          >
            <i className="mdi mdi-close" style={{ fontSize: '12px' }}></i>
          </InputGroupText>
        )}
      </InputGroup>
    </div>
  );
});

ColumnFilter.displayName = 'ColumnFilter';

// Componente para el header con ordenamiento (fuera del componente principal)
const SortableHeader = React.memo(({ column, children, canSort = true, sorting, onSort, columnFilters, onFilterChange }) => {
  const getSortIcon = () => {
    if (sorting.column !== column) return 'mdi-sort';
    if (sorting.direction === 'asc') return 'mdi-sort-ascending';
    if (sorting.direction === 'desc') return 'mdi-sort-descending';
    return 'mdi-sort';
  };

  const getSortIconColor = () => {
    return sorting.column === column ? 'text-primary' : 'text-muted';
  };

  const handleClick = useCallback(() => {
    if (canSort) {
      onSort(column);
    }
  }, [canSort, column, onSort]);

  return (
    <div>
      <div 
        className={`d-flex align-items-center justify-content-between fw-medium ${canSort ? 'sortable-header' : ''}`}
        onClick={handleClick}
        style={{ cursor: canSort ? 'pointer' : 'default', userSelect: 'none' }}
        title={canSort ? 'Clic para ordenar' : ''}
      >
        <span>{children}</span>
        {canSort && (
          <i 
            className={`mdi ${getSortIcon()} ms-1 ${getSortIconColor()}`}
            style={{ fontSize: '14px' }}
          ></i>
        )}
      </div>
      <ColumnFilter 
        column={column} 
        value={columnFilters[column]} 
        onChange={onFilterChange}
        placeholder={`Filtrar ${children.toLowerCase()}...`}
      />
    </div>
  );
});

SortableHeader.displayName = 'SortableHeader';

const generateUsers = () => {
  const nombres = ["Ana García", "Carlos López", "María Rodríguez", "Juan Martínez", "Carmen Sánchez", "Antonio González", "Lucía Fernández", "Miguel Jiménez", "Elena Pérez", "David Ruiz"];
  const roles = ["Administrador", "Editor", "Moderador", "Usuario", "Supervisor", "Analista", "Desarrollador", "Diseñador"];
  const departamentos = ["Administración", "Recursos Humanos", "Ventas", "Marketing", "IT", "Finanzas", "Operaciones", "Soporte"];
  const estados = ["Activo", "Inactivo", "Pendiente", "Suspendido"];
  const ciudades = ["Madrid", "Barcelona", "Valencia", "Sevilla", "Bilbao", "Málaga", "Zaragoza", "Palma"];
  const empresas = ["TechSoft", "InnovaCorp", "DataSystems", "CloudWorks", "WebSolutions"];

  return Array.from({ length: 20 }, (_, index) => ({
    id: index + 1,
    nombre: nombres[index % nombres.length],
    email: nombres[index % nombres.length].toLowerCase().replace(' ', '.') + '@empresa.com',
    telefono: `+34 ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100}`,
    rol: roles[Math.floor(Math.random() * roles.length)],
    departamento: departamentos[Math.floor(Math.random() * departamentos.length)],
    estado: estados[Math.floor(Math.random() * estados.length)],
    fechaRegistro: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString('es-ES'),
    salario: Math.floor(Math.random() * 60000) + 25000,
    ciudad: ciudades[Math.floor(Math.random() * ciudades.length)],
    empresa: empresas[Math.floor(Math.random() * empresas.length)],
    rendimiento: Math.floor(Math.random() * 40) + 60,
    proyectos: Math.floor(Math.random() * 15) + 1,
    experiencia: Math.floor(Math.random() * 15) + 1,
    ultimaActividad: `Hace ${Math.floor(Math.random() * 48) + 1}h`,
  }));
};

const UsersCrudV2 = () => {
  const [usuarios, setUsuarios] = useState(generateUsers());
  const [modoVista, setModoVista] = useState('cards');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [usuariosSeleccionados, setUsuariosSeleccionados] = useState([]);
  const [esEdicion, setEsEdicion] = useState(false);
  const [columnFilters, setColumnFilters] = useState({});
  const [sorting, setSorting] = useState({ column: null, direction: null }); // null, 'asc', 'desc'
  const [datosFormulario, setDatosFormulario] = useState({
    nombre: "",
    email: "",
    telefono: "",
    rol: "Usuario",
    departamento: "Administración",
    estado: "Activo",
    ciudad: "Madrid",
    empresa: "TechSoft",
    salario: 30000,
    experiencia: 1
  });

  // Opciones para los formularios (crear/editar usuario)
  const opcionesFormulario = {
    rol: [
      { value: 'Administrador', label: 'Administrador', icon: 'mdi-shield-account' },
      { value: 'Editor', label: 'Editor', icon: 'mdi-pencil' },
      { value: 'Moderador', label: 'Moderador', icon: 'mdi-account-check' },
      { value: 'Usuario', label: 'Usuario', icon: 'mdi-account' },
      { value: 'Supervisor', label: 'Supervisor', icon: 'mdi-account-supervisor' },
      { value: 'Analista', label: 'Analista', icon: 'mdi-chart-line' },
      { value: 'Desarrollador', label: 'Desarrollador', icon: 'mdi-code-tags' },
      { value: 'Diseñador', label: 'Diseñador', icon: 'mdi-palette' }
    ],
    departamento: [
      { value: 'Administración', label: 'Administración', icon: 'mdi-account-tie' },
      { value: 'Recursos Humanos', label: 'Recursos Humanos', icon: 'mdi-account-group' },
      { value: 'Ventas', label: 'Ventas', icon: 'mdi-currency-usd' },
      { value: 'Marketing', label: 'Marketing', icon: 'mdi-bullhorn' },
      { value: 'IT', label: 'IT', icon: 'mdi-code-tags' },
      { value: 'Finanzas', label: 'Finanzas', icon: 'mdi-calculator' }
    ],
    estado: [
      { value: 'Activo', label: 'Activo', icon: 'mdi-check-circle' },
      { value: 'Inactivo', label: 'Inactivo', icon: 'mdi-close-circle' },
      { value: 'Pendiente', label: 'Pendiente', icon: 'mdi-clock-outline' },
      { value: 'Suspendido', label: 'Suspendido', icon: 'mdi-alert-circle' }
    ]
  };


  const usuariosFiltrados = useMemo(() => {
    let resultado = usuarios;

    // Filtrar solo los filtros que tienen valores válidos
    const activeFilters = Object.entries(columnFilters).filter(([column, filterValue]) => 
      filterValue && filterValue.trim() !== ''
    );

    // Aplicar filtros de columna
    if (activeFilters.length > 0) {
      resultado = resultado.filter(usuario => {
        return activeFilters.every(([column, filterValue]) => {
          const cellValue = usuario[column];
          if (cellValue === null || cellValue === undefined) return false;
          
          return cellValue.toString().toLowerCase().includes(filterValue.toLowerCase());
        });
      });
    }

    // Aplicar ordenamiento
    if (sorting.column && sorting.direction) {
      resultado = [...resultado].sort((a, b) => {
        const aValue = a[sorting.column];
        const bValue = b[sorting.column];
        
        // Manejar valores nulos o undefined
        if (aValue === null || aValue === undefined) return sorting.direction === 'asc' ? -1 : 1;
        if (bValue === null || bValue === undefined) return sorting.direction === 'asc' ? 1 : -1;
        
        // Comparar números
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sorting.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        // Comparar strings
        const aStr = aValue.toString().toLowerCase();
        const bStr = bValue.toString().toLowerCase();
        
        if (aStr < bStr) return sorting.direction === 'asc' ? -1 : 1;
        if (aStr > bStr) return sorting.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return resultado;
  }, [usuarios, columnFilters, sorting]);

  const manejarAgregarUsuario = () => {
    setEsEdicion(false);
    setDatosFormulario({
      nombre: "",
      email: "",
      telefono: "",
      rol: "Usuario",
      departamento: "Administración",
      estado: "Activo",
      ciudad: "Madrid",
      empresa: "TechSoft",
      salario: 30000,
      experiencia: 1
    });
    setModalAbierto(true);
  };

  const manejarEditarUsuario = (usuario) => {
    setEsEdicion(true);
    setUsuarioSeleccionado(usuario);
    setDatosFormulario({
      nombre: usuario.nombre,
      email: usuario.email,
      telefono: usuario.telefono,
      rol: usuario.rol,
      departamento: usuario.departamento,
      estado: usuario.estado,
      ciudad: usuario.ciudad,
      empresa: usuario.empresa,
      salario: usuario.salario,
      experiencia: usuario.experiencia
    });
    setModalAbierto(true);
  };

  const manejarEliminarUsuario = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalEliminar(true);
  };

  const manejarGuardarUsuario = () => {
    if (!datosFormulario.nombre || !datosFormulario.email) {
      toast.error("Por favor completa los campos obligatorios");
      return;
    }

    if (esEdicion) {
      setUsuarios(usuarios.map(usuario => 
        usuario.id === usuarioSeleccionado.id 
          ? { ...usuario, ...datosFormulario }
          : usuario
      ));
      toast.success("Usuario actualizado correctamente");
    } else {
      const nuevoUsuario = {
        id: Math.max(...usuarios.map(u => u.id)) + 1,
        ...datosFormulario,
        fechaRegistro: new Date().toLocaleDateString('es-ES'),
        rendimiento: Math.floor(Math.random() * 40) + 60,
        proyectos: 0,
        ultimaActividad: "Ahora",
      };
      setUsuarios([nuevoUsuario, ...usuarios]);
      toast.success("Usuario creado correctamente");
    }
    
    setModalAbierto(false);
  };

  const confirmarEliminar = () => {
    setUsuarios(usuarios.filter(usuario => usuario.id !== usuarioSeleccionado.id));
    setModalEliminar(false);
    toast.success("Usuario eliminado correctamente");
  };

  const manejarEliminarMasivo = () => {
    if (usuariosSeleccionados.length === 0) {
      toast.warning("Selecciona usuarios para eliminar");
      return;
    }
    setUsuarios(usuarios.filter(usuario => !usuariosSeleccionados.includes(usuario.id)));
    setUsuariosSeleccionados([]);
    toast.success(`${usuariosSeleccionados.length} usuarios eliminados`);
  };

  const obtenerBadgeEstado = (estado) => {
    const coloresEstado = {
      "Activo": { color: "success", icon: "mdi-check-circle" },
      "Inactivo": { color: "secondary", icon: "mdi-close-circle" },
      "Pendiente": { color: "warning", icon: "mdi-clock-outline" },
      "Suspendido": { color: "danger", icon: "mdi-alert-circle" }
    };
    const infoEstado = coloresEstado[estado];
    return (
      <Badge color={infoEstado.color} className="d-inline-flex align-items-center">
        <i className={`mdi ${infoEstado.icon} me-1`}></i>
        {estado}
      </Badge>
    );
  };

  const obtenerColorRendimiento = (rendimiento) => {
    if (rendimiento >= 90) return "success";
    if (rendimiento >= 70) return "info";
    if (rendimiento >= 50) return "warning";
    return "danger";
  };

  const handleColumnFilter = useCallback((column, value) => {
    setColumnFilters(prev => {
      const newFilters = { ...prev };
      
      // Si el valor está vacío, eliminar el filtro completamente
      if (!value || value.trim() === '') {
        delete newFilters[column];
      } else {
        newFilters[column] = value;
      }
      
      return newFilters;
    });
  }, []);

  const clearColumnFilter = useCallback((column) => {
    setColumnFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[column];
      return newFilters;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setColumnFilters({});
  }, []);

  // Funciones de ordenamiento
  const handleSort = useCallback((column) => {
    setSorting(prevSorting => {
      if (prevSorting.column === column) {
        // Si ya está ordenando por esta columna, cambiar dirección o quitar ordenamiento
        if (prevSorting.direction === 'asc') {
          return { column, direction: 'desc' };
        } else if (prevSorting.direction === 'desc') {
          return { column: null, direction: null }; // Quitar ordenamiento
        }
      } else {
        // Nueva columna, empezar con ascendente
        return { column, direction: 'asc' };
      }
      return prevSorting;
    });
  }, []);

  const clearSorting = useCallback(() => {
    setSorting({ column: null, direction: null });
  }, []);

  const clearAll = useCallback(() => {
    clearAllFilters();
    clearSorting();
  }, [clearAllFilters, clearSorting]);

  // Función helper para obtener solo los filtros activos (no vacíos)
  const getActiveFilters = useCallback(() => {
    return Object.entries(columnFilters).filter(([column, filterValue]) => 
      filterValue && filterValue.trim() !== ''
    );
  }, [columnFilters]);


  const VistaCards = () => (
    <Row>
      {usuariosFiltrados.map(usuario => (
        <Col xl={4} lg={6} md={6} sm={12} key={usuario.id} className="mb-4">
          <Card className="user-card h-100 shadow-sm border-0">
            <CardBody className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="d-flex align-items-center">
                  <div className="avatar-md rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3">
                    {usuario.nombre.charAt(0)}
                  </div>
                  <div>
                    <h6 className="mb-1 font-weight-bold">{usuario.nombre}</h6>
                    <p className="text-muted mb-0 small">{usuario.rol}</p>
                  </div>
                </div>
                
                <UncontrolledDropdown>
                  <DropdownToggle tag="button" className="btn btn-light btn-sm">
                    <i className="mdi mdi-dots-vertical"></i>
                  </DropdownToggle>
                  <DropdownMenu end>
                    <DropdownItem onClick={() => manejarEditarUsuario(usuario)}>
                      <i className="mdi mdi-pencil me-2"></i>Editar
                    </DropdownItem>
                    <DropdownItem onClick={() => manejarEliminarUsuario(usuario)}>
                      <i className="mdi mdi-delete me-2"></i>Eliminar
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem>
                      <i className="mdi mdi-eye me-2"></i>Ver perfil
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3">
                {obtenerBadgeEstado(usuario.estado)}
                <span className="badge bg-light text-dark">{usuario.departamento}</span>
              </div>

              <div className="mb-3">
                <p className="mb-1 small text-muted">
                  <i className="mdi mdi-email-outline me-2"></i>
                  {usuario.email}
                </p>
                <p className="mb-1 small text-muted">
                  <i className="mdi mdi-phone me-2"></i>
                  {usuario.telefono}
                </p>
                <p className="mb-0 small text-muted">
                  <i className="mdi mdi-map-marker me-2"></i>
                  {usuario.ciudad}
                </p>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <small className="text-muted">Rendimiento</small>
                  <small className="font-weight-bold">{usuario.rendimiento}%</small>
                </div>
                <Progress 
                  value={usuario.rendimiento} 
                  color={obtenerColorRendimiento(usuario.rendimiento)}
                  className="progress-sm"
                />
              </div>

              <div className="row g-2 mt-3 pt-3 border-top">
                <div className="col-4 text-center">
                  <h6 className="mb-0">{usuario.proyectos}</h6>
                  <small className="text-muted">Proyectos</small>
                </div>
                <div className="col-4 text-center">
                  <h6 className="mb-0">{usuario.experiencia}</h6>
                  <small className="text-muted">Años exp.</small>
                </div>
                <div className="col-4 text-center">
                  <h6 className="mb-0">€{(usuario.salario / 1000).toFixed(0)}K</h6>
                  <small className="text-muted">Salario</small>
                </div>
              </div>

              <div className="mt-3 pt-3 border-top">
                <small className="text-muted">
                  <i className="mdi mdi-clock-outline me-1"></i>
                  {usuario.ultimaActividad}
                </small>
              </div>
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  );

  // Crear headers estáticos para evitar re-renders
  const staticHeaders = useMemo(() => ({
    nombre: (sorting, columnFilters, handleSort, handleColumnFilter) => (
      <SortableHeader 
        column="nombre" 
        sorting={sorting} 
        onSort={handleSort} 
        columnFilters={columnFilters} 
        onFilterChange={handleColumnFilter}
      >
        Usuario
      </SortableHeader>
    ),
    rol: (sorting, columnFilters, handleSort, handleColumnFilter) => (
      <SortableHeader 
        column="rol" 
        sorting={sorting} 
        onSort={handleSort} 
        columnFilters={columnFilters} 
        onFilterChange={handleColumnFilter}
      >
        Rol
      </SortableHeader>
    ),
    departamento: (sorting, columnFilters, handleSort, handleColumnFilter) => (
      <SortableHeader 
        column="departamento" 
        sorting={sorting} 
        onSort={handleSort} 
        columnFilters={columnFilters} 
        onFilterChange={handleColumnFilter}
      >
        Departamento
      </SortableHeader>
    ),
    estado: (sorting, columnFilters, handleSort, handleColumnFilter) => (
      <SortableHeader 
        column="estado" 
        sorting={sorting} 
        onSort={handleSort} 
        columnFilters={columnFilters} 
        onFilterChange={handleColumnFilter}
      >
        Estado
      </SortableHeader>
    ),
    telefono: (sorting, columnFilters, handleSort, handleColumnFilter) => (
      <SortableHeader 
        column="telefono" 
        canSort={false} 
        sorting={sorting} 
        onSort={handleSort} 
        columnFilters={columnFilters} 
        onFilterChange={handleColumnFilter}
      >
        Teléfono
      </SortableHeader>
    ),
    salario: (sorting, columnFilters, handleSort, handleColumnFilter) => (
      <SortableHeader 
        column="salario" 
        sorting={sorting} 
        onSort={handleSort} 
        columnFilters={columnFilters} 
        onFilterChange={handleColumnFilter}
      >
        Salario
      </SortableHeader>
    )
  }), []);

  const columnas = useMemo(() => [
    {
      header: (
        <Input
          type="checkbox"
          onChange={(e) => {
            if (e.target.checked) {
              setUsuariosSeleccionados(usuariosFiltrados.map(u => u.id));
            } else {
              setUsuariosSeleccionados([]);
            }
          }}
        />
      ),
      accessorKey: "select",
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ row }) => (
        <Input
          type="checkbox"
          checked={usuariosSeleccionados.includes(row.original.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setUsuariosSeleccionados([...usuariosSeleccionados, row.original.id]);
            } else {
              setUsuariosSeleccionados(usuariosSeleccionados.filter(id => id !== row.original.id));
            }
          }}
        />
      ),
    },
    {
      header: staticHeaders.nombre(sorting, columnFilters, handleSort, handleColumnFilter),
      accessorKey: "nombre",
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ row }) => (
        <div className="d-flex align-items-center">
          <div className="avatar-xs rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3">
            {row.original.nombre.charAt(0)}
          </div>
          <div>
            <h6 className="mb-0">{row.original.nombre}</h6>
            <p className="text-muted mb-0 small">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: staticHeaders.rol(sorting, columnFilters, handleSort, handleColumnFilter),
      accessorKey: "rol",
      enableSorting: false,
      enableColumnFilter: false,
    },
    {
      header: staticHeaders.departamento(sorting, columnFilters, handleSort, handleColumnFilter),
      accessorKey: "departamento",
      enableSorting: false,
      enableColumnFilter: false,
    },
    {
      header: staticHeaders.estado(sorting, columnFilters, handleSort, handleColumnFilter),
      accessorKey: "estado",
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ getValue }) => obtenerBadgeEstado(getValue()),
    },
    {
      header: staticHeaders.telefono(sorting, columnFilters, handleSort, handleColumnFilter),
      accessorKey: "telefono",
      enableSorting: false,
      enableColumnFilter: false,
    },
    {
      header: staticHeaders.salario(sorting, columnFilters, handleSort, handleColumnFilter),
      accessorKey: "salario",
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ getValue }) => `€${getValue().toLocaleString()}`,
    },
    {
      header: "Acciones",
      accessorKey: "actions",
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ row }) => (
        <div className="d-flex gap-2">
          <Button
            color="primary"
            size="sm"
            onClick={() => manejarEditarUsuario(row.original)}
          >
            <i className="mdi mdi-pencil"></i>
          </Button>
          <Button
            color="danger"
            size="sm"
            onClick={() => manejarEliminarUsuario(row.original)}
          >
            <i className="mdi mdi-delete"></i>
          </Button>
        </div>
      ),
    },
  ], [usuariosSeleccionados, usuariosFiltrados, columnFilters, handleColumnFilter, sorting, handleSort]);

  return (
    <React.Fragment>
        <Card className="border-0 shadow-sm mb-4">
          <CardBody>
            <Row className="align-items-center">
              <Col lg={6} md={12}>
                <h4 className="mb-0">Gestión de Usuarios V2</h4>
                <p className="text-muted mb-md-0 mb-3">
                  Sistema moderno de administración de usuarios con filtros de columna
                  {(getActiveFilters().length > 0 || (sorting.column && sorting.direction)) && (
                    <span className="ms-2">
                      <Badge color="info" style={{ fontSize: '0.65rem' }}>
                        <i className="mdi mdi-filter-check me-1"></i>
                        {usuariosFiltrados.length} de {usuarios.length} resultados
                      </Badge>
                    </span>
                  )}
                </p>
              </Col>
              <Col lg={6} md={12} className="text-lg-end text-center">
                <div className="d-flex flex-wrap gap-2 justify-content-lg-end justify-content-center">
                  {getActiveFilters().length > 0 && (
                    <Button 
                      color="outline-secondary" 
                      onClick={clearAllFilters} 
                      size="sm"
                      title="Limpiar todos los filtros"
                    >
                      <i className="mdi mdi-filter-remove me-1"></i>
                      <span className="d-none d-sm-inline">Limpiar Filtros</span>
                      <span className="d-sm-none">Limpiar</span>
                    </Button>
                  )}
                  
                  {sorting.column && sorting.direction && (
                    <Button 
                      color="outline-info" 
                      onClick={clearSorting} 
                      size="sm"
                      title="Quitar ordenamiento"
                    >
                      <i className="mdi mdi-sort-variant-remove me-1"></i>
                      <span className="d-none d-sm-inline">Quitar Orden</span>
                      <span className="d-sm-none">Orden</span>
                    </Button>
                  )}

                  <Button color="primary" onClick={manejarAgregarUsuario} size="sm">
                    <i className="mdi mdi-plus me-1"></i>
                    <span className="d-none d-sm-inline">Nuevo Usuario</span>
                    <span className="d-sm-none">Nuevo</span>
                  </Button>
                  
                  {usuariosSeleccionados.length > 0 && (
                    <Button color="danger" outline onClick={manejarEliminarMasivo} size="sm">
                      <i className="mdi mdi-delete me-1"></i>
                      <span className="d-none d-sm-inline">Eliminar ({usuariosSeleccionados.length})</span>
                      <span className="d-sm-none">({usuariosSeleccionados.length})</span>
                    </Button>
                  )}

                  <div className="btn-group" role="group">
                    <Button 
                      color={modoVista === 'cards' ? 'primary' : 'light'}
                      onClick={() => setModoVista('cards')}
                      size="sm"
                      title="Vista de tarjetas"
                    >
                      <i className="mdi mdi-view-grid"></i>
                    </Button>
                    <Button 
                      color={modoVista === 'table' ? 'primary' : 'light'}
                      onClick={() => setModoVista('table')}
                      size="sm"
                      title="Vista de tabla"
                    >
                      <i className="mdi mdi-view-list"></i>
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Resumen de filtros y ordenamiento activos */}
            {(getActiveFilters().length > 0 || (sorting.column && sorting.direction)) && (
              <Row className="mt-3">
                <Col xs={12}>
                  <div className="active-filters-container p-3 bg-light rounded">
                    <div className="d-flex align-items-start flex-wrap">
                      <span className="text-muted small me-2 fw-medium mb-2">
                        <i className="mdi mdi-filter-check me-1"></i>
                        <span className="d-none d-sm-inline">Filtros y ordenamiento activos:</span>
                        <span className="d-sm-none">Filtros:</span>
                      </span>
                      
                      {/* Mostrar ordenamiento activo */}
                      {sorting.column && sorting.direction && (
                        <Badge 
                          color="white" 
                          className="border border-info me-2 mb-2 d-flex align-items-center shadow-sm"
                          style={{ fontSize: '0.75rem', padding: '0.5rem 0.75rem' }}
                        >
                          <i className={`mdi ${sorting.direction === 'asc' ? 'mdi-sort-ascending' : 'mdi-sort-descending'} me-2 text-info`}></i>
                          <span className="fw-medium text-dark text-capitalize">{sorting.column}</span>
                          <span className="text-muted mx-1">{sorting.direction === 'asc' ? 'ascendente' : 'descendente'}</span>
                          <Button
                            color="link"
                            size="sm"
                            className="p-0 ms-2 text-danger"
                            onClick={clearSorting}
                            style={{ fontSize: '0.7rem' }}
                            title="Quitar ordenamiento"
                          >
                            <i className="mdi mdi-close"></i>
                          </Button>
                        </Badge>
                      )}
                      
                      {/* Mostrar solo filtros de columna activos (no vacíos) */}
                      {getActiveFilters().map(([column, value]) => (
                        <Badge 
                          key={column}
                          color="white" 
                          className="border border-primary me-2 mb-2 d-flex align-items-center shadow-sm"
                          style={{ fontSize: '0.75rem', padding: '0.5rem 0.75rem' }}
                        >
                          <i className="mdi mdi-filter me-2 text-primary"></i>
                          <span className="fw-medium text-dark text-capitalize">{column}</span>
                          <span className="text-muted mx-1">contiene</span>
                          <span className="text-primary fw-medium">"{value}"</span>
                          <Button
                            color="link"
                            size="sm"
                            className="p-0 ms-2 text-danger"
                            onClick={() => clearColumnFilter(column)}
                            style={{ fontSize: '0.7rem' }}
                            title="Eliminar filtro"
                          >
                            <i className="mdi mdi-close"></i>
                          </Button>
                        </Badge>
                      ))}
                      
                      <Button 
                        color="link" 
                        size="sm" 
                        className="p-0 text-danger fw-medium"
                        onClick={clearAll}
                        title="Limpiar todo"
                      >
                        <i className="mdi mdi-close-circle me-1"></i>
                        Limpiar todo
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            )}

          </CardBody>
        </Card>

        {modoVista === 'cards' ? (
          <VistaCards />
        ) : (
          <Card className="border-0 shadow-sm">
            <CardBody>
              <TableContainer
                columns={columnas}
                data={usuariosFiltrados}
                isGlobalFilter={false}
                isPagination={true}
                isCustomPageSize={false}
                SearchPlaceholder="Filtrar..."
                divClassName="table-responsive table-card mb-1"
                tableClass="align-middle table-nowrap"
                theadClass="table-light text-muted"
                paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                pagination="pagination"
              />
            </CardBody>
          </Card>
        )}

        {/* Modal para agregar/editar usuario */}
        <Modal 
          isOpen={modalAbierto} 
          toggle={() => setModalAbierto(!modalAbierto)} 
          size="lg"
          centered
          className="modal-responsive"
        >
          <ModalHeader toggle={() => setModalAbierto(false)} className="border-bottom">
            <div>
              <h5 className="mb-0">{esEdicion ? "Editar Usuario" : "Nuevo Usuario"}</h5>
              <p className="text-muted mb-0">Complete la información del usuario</p>
            </div>
          </ModalHeader>
          <ModalBody className="p-4">
            <Form>
              <Row>
                <Col xs={12} className="mb-3">
                  <FormGroup>
                    <Label htmlFor="nombre">Nombre Completo *</Label>
                    <Input
                      type="text"
                      id="nombre"
                      value={datosFormulario.nombre}
                      onChange={(e) => setDatosFormulario({...datosFormulario, nombre: e.target.value})}
                      placeholder="Ingresa el nombre completo"
                    />
                  </FormGroup>
                </Col>
                <Col xs={12} className="mb-3">
                  <FormGroup>
                    <Label htmlFor="email">Correo Electrónico *</Label>
                    <Input
                      type="email"
                      id="email"
                      value={datosFormulario.email}
                      onChange={(e) => setDatosFormulario({...datosFormulario, email: e.target.value})}
                      placeholder="correo@empresa.com"
                    />
                  </FormGroup>
                </Col>
                <Col md={6} xs={12} className="mb-3">
                  <FormGroup>
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      type="text"
                      id="telefono"
                      value={datosFormulario.telefono}
                      onChange={(e) => setDatosFormulario({...datosFormulario, telefono: e.target.value})}
                      placeholder="+34 123 456 789"
                    />
                  </FormGroup>
                </Col>
                <Col md={6} xs={12} className="mb-3">
                  <FormGroup>
                    <Label htmlFor="ciudad">Ciudad</Label>
                    <Input
                      type="text"
                      id="ciudad"
                      value={datosFormulario.ciudad}
                      onChange={(e) => setDatosFormulario({...datosFormulario, ciudad: e.target.value})}
                      placeholder="Madrid"
                    />
                  </FormGroup>
                </Col>
                <Col md={6} xs={12} className="mb-3">
                  <FormGroup>
                    <Label htmlFor="rol">Rol</Label>
                    <CustomSelect
                      value={datosFormulario.rol}
                      onChange={(value) => setDatosFormulario({...datosFormulario, rol: value})}
                      options={opcionesFormulario.rol}
                      placeholder="Selecciona un rol"
                    />
                  </FormGroup>
                </Col>
                <Col md={6} xs={12} className="mb-3">
                  <FormGroup>
                    <Label htmlFor="departamento">Departamento</Label>
                    <CustomSelect
                      value={datosFormulario.departamento}
                      onChange={(value) => setDatosFormulario({...datosFormulario, departamento: value})}
                      options={opcionesFormulario.departamento}
                      placeholder="Selecciona un departamento"
                    />
                  </FormGroup>
                </Col>
                <Col md={6} xs={12} className="mb-3">
                  <FormGroup>
                    <Label htmlFor="estado">Estado</Label>
                    <CustomSelect
                      value={datosFormulario.estado}
                      onChange={(value) => setDatosFormulario({...datosFormulario, estado: value})}
                      options={opcionesFormulario.estado}
                      placeholder="Selecciona un estado"
                    />
                  </FormGroup>
                </Col>
                <Col md={6} xs={12} className="mb-3">
                  <FormGroup>
                    <Label htmlFor="empresa">Empresa</Label>
                    <Input
                      type="text"
                      id="empresa"
                      value={datosFormulario.empresa}
                      onChange={(e) => setDatosFormulario({...datosFormulario, empresa: e.target.value})}
                      placeholder="TechSoft"
                    />
                  </FormGroup>
                </Col>
                <Col md={6} xs={12} className="mb-3">
                  <FormGroup>
                    <Label htmlFor="salario">Salario (€)</Label>
                    <Input
                      type="number"
                      id="salario"
                      value={datosFormulario.salario}
                      onChange={(e) => setDatosFormulario({...datosFormulario, salario: parseInt(e.target.value)})}
                    />
                  </FormGroup>
                </Col>
                <Col md={6} xs={12} className="mb-3">
                  <FormGroup>
                    <Label htmlFor="experiencia">Años de experiencia</Label>
                    <Input
                      type="number"
                      id="experiencia"
                      value={datosFormulario.experiencia}
                      onChange={(e) => setDatosFormulario({...datosFormulario, experiencia: parseInt(e.target.value)})}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </ModalBody>
          <ModalFooter className="border-top">
            <div className="d-flex flex-column flex-sm-row gap-2 w-100 justify-content-end">
              <Button color="light" onClick={() => setModalAbierto(false)} className="order-2 order-sm-1">
                Cancelar
              </Button>
              <Button color="primary" onClick={manejarGuardarUsuario} className="order-1 order-sm-2">
                <i className="mdi mdi-check me-1"></i>
                <span className="d-none d-sm-inline">{esEdicion ? "Actualizar Usuario" : "Crear Usuario"}</span>
                <span className="d-sm-none">{esEdicion ? "Actualizar" : "Crear"}</span>
              </Button>
            </div>
          </ModalFooter>
        </Modal>


        <DeleteModal
          show={modalEliminar}
          onDeleteClick={confirmarEliminar}
          onCloseClick={() => setModalEliminar(false)}
        />

      <style jsx>{`
        .user-card {
          transition: all 0.3s ease;
          border-radius: 12px !important;
        }
        
        .user-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
        
        .progress-sm {
          height: 8px;
        }
        
        .avatar-xs {
          width: 32px;
          height: 32px;
          font-size: 12px;
        }
        
        .avatar-md {
          width: 48px;
          height: 48px;
          font-size: 16px;
        }

        .input-group-text {
          transition: all 0.2s ease;
        }
        
        .input-group-text:hover {
          background-color: #e9ecef !important;
          border-color: #ced4da !important;
        }

        .column-filter-container .input-group {
          min-width: 120px;
        }
        
        .column-filter-container .form-control {
          transition: all 0.2s ease;
        }
        
        .column-filter-container .form-control:focus {
          border-color: #007bff;
          box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25);
        }

        .active-filters-container {
          border-left: 4px solid #007bff;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
        }

        .active-filters-container .badge {
          transition: all 0.2s ease;
        }

        .active-filters-container .badge:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0,123,255,0.3);
        }
        
        .table th {
          vertical-align: top !important;
          padding-bottom: 1rem !important;
        }
        
        .sortable-header {
          transition: all 0.2s ease;
          border-radius: 4px;
          padding: 4px 8px;
          margin: -4px -8px;
        }
        
        .sortable-header:hover {
          background-color: rgba(0, 123, 255, 0.1);
          color: #007bff;
        }
        
        .sortable-header:active {
          background-color: rgba(0, 123, 255, 0.15);
        }

        /* Responsive improvements */
        @media (max-width: 768px) {
          .user-card {
            margin-bottom: 1rem !important;
          }
          
          .search-panel {
            padding: 0 !important;
          }

          .active-filters-container {
            padding: 1rem !important;
          }

          .modal-responsive .modal-dialog {
            margin: 0.5rem;
          }

          .table-responsive {
            font-size: 0.875rem;
          }
        }

        @media (max-width: 576px) {
          .user-card .card-body {
            padding: 1.5rem !important;
          }
          
          .btn-group {
            width: 100%;
          }
          
          .btn-group .btn {
            flex: 1;
          }

          .active-filters-container .badge {
            font-size: 0.7rem !important;
            margin-bottom: 0.5rem;
          }
        }
      `}</style>
    </React.Fragment>
  );
};

export default UsersCrudV2;