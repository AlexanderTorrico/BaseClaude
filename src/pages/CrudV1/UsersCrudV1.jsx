import React, { useState, useMemo } from "react";
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
import TableContainer from "../../components/Common/TableContainer";
import DeleteModal from "../../components/Common/DeleteModal";
import AdvancedSearch from "../../components/Common/AdvancedSearch";

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

const UsersCrudV1 = () => {
  const [usuarios, setUsuarios] = useState(generateUsers());
  const [modoVista, setModoVista] = useState('cards');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [modalBusquedaAvanzada, setModalBusquedaAvanzada] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [usuariosSeleccionados, setUsuariosSeleccionados] = useState([]);
  const [esEdicion, setEsEdicion] = useState(false);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [busquedaAvanzada, setBusquedaAvanzada] = useState({});
  const [panelBusquedaAbierto, setPanelBusquedaAbierto] = useState(true);
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

  // Campos para búsqueda avanzada dinámica
  const camposBusquedaAvanzada = [
    { value: 'nombre', label: 'Nombre', type: 'text', icon: 'mdi-account' },
    { value: 'email', label: 'Correo Electrónico', type: 'text', icon: 'mdi-email' },
    { value: 'telefono', label: 'Teléfono', type: 'text', icon: 'mdi-phone' },
    { value: 'rol', label: 'Rol', type: 'text', icon: 'mdi-account-tie' },
    { value: 'departamento', label: 'Departamento', type: 'text', icon: 'mdi-domain' },
    { value: 'estado', label: 'Estado', type: 'text', icon: 'mdi-account-check' },
    { value: 'ciudad', label: 'Ciudad', type: 'text', icon: 'mdi-map-marker' },
    { value: 'empresa', label: 'Empresa', type: 'text', icon: 'mdi-office-building' },
    { value: 'salario', label: 'Salario', type: 'number', icon: 'mdi-currency-eur' },
    { value: 'experiencia', label: 'Años de Experiencia', type: 'number', icon: 'mdi-calendar' },
    { value: 'rendimiento', label: 'Rendimiento (%)', type: 'number', icon: 'mdi-chart-line' },
    { value: 'proyectos', label: 'Proyectos', type: 'number', icon: 'mdi-folder-multiple' },
    { value: 'fechaRegistro', label: 'Fecha de Registro', type: 'text', icon: 'mdi-calendar-plus' }
  ];

  const usuariosFiltrados = useMemo(() => {
    let resultado = usuarios;

    // Búsqueda simple por nombre
    if (terminoBusqueda) {
      resultado = resultado.filter(usuario =>
        usuario.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase())
      );
    }

    // Búsqueda avanzada dinámica
    if (Object.keys(busquedaAvanzada).length > 0) {
      resultado = resultado.filter(usuario => {
        return Object.entries(busquedaAvanzada).every(([field, config]) => {
          const fieldValue = usuario[field];
          const searchValue = config.value;
          const operator = config.operator;

          if (!fieldValue && !['isEmpty', 'isNotEmpty'].includes(operator)) {
            return false;
          }

          switch (operator) {
            case 'contains':
              return fieldValue.toString().toLowerCase().includes(searchValue.toLowerCase());
            case 'equals':
              return fieldValue.toString().toLowerCase() === searchValue.toLowerCase();
            case 'startsWith':
              return fieldValue.toString().toLowerCase().startsWith(searchValue.toLowerCase());
            case 'endsWith':
              return fieldValue.toString().toLowerCase().endsWith(searchValue.toLowerCase());
            case 'notEquals':
              return fieldValue.toString().toLowerCase() !== searchValue.toLowerCase();
            case 'isEmpty':
              return !fieldValue || fieldValue.toString().trim() === '';
            case 'isNotEmpty':
              return fieldValue && fieldValue.toString().trim() !== '';
            case 'greaterThan':
              return parseFloat(fieldValue) > parseFloat(searchValue);
            case 'lessThan':
              return parseFloat(fieldValue) < parseFloat(searchValue);
            case 'greaterThanOrEqual':
              return parseFloat(fieldValue) >= parseFloat(searchValue);
            case 'lessThanOrEqual':
              return parseFloat(fieldValue) <= parseFloat(searchValue);
            default:
              return true;
          }
        });
      });
    }

    return resultado;
  }, [usuarios, terminoBusqueda, busquedaAvanzada]);

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

  const manejarBusquedaAvanzada = (criteriosBusqueda) => {
    setBusquedaAvanzada(criteriosBusqueda);
  };

  const limpiarBusquedaAvanzada = () => {
    setBusquedaAvanzada({});
  };

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
      header: "Usuario",
      accessorKey: "nombre",
      enableSorting: true,
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
      header: "Rol",
      accessorKey: "rol",
      enableSorting: true,
    },
    {
      header: "Departamento",
      accessorKey: "departamento",
      enableSorting: true,
    },
    {
      header: "Estado",
      accessorKey: "estado",
      enableSorting: true,
      cell: ({ getValue }) => obtenerBadgeEstado(getValue()),
    },
    {
      header: "Teléfono",
      accessorKey: "telefono",
      enableSorting: false,
    },
    {
      header: "Salario",
      accessorKey: "salario",
      enableSorting: true,
      cell: ({ getValue }) => `€${getValue().toLocaleString()}`,
    },
    {
      header: "Acciones",
      accessorKey: "actions",
      enableSorting: false,
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
  ], [usuariosSeleccionados, usuariosFiltrados]);

  return (
    <React.Fragment>
        <Card className="border-0 shadow-sm mb-4">
          <CardBody>
            <Row className="align-items-center">
              <Col lg={6} md={12}>
                <h4 className="mb-0">Gestión de Usuarios V1</h4>
                <p className="text-muted mb-md-0 mb-3">
                  Sistema moderno de administración de usuarios
                  {(terminoBusqueda || Object.keys(busquedaAvanzada).length > 0) && (
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
                  <Button 
                    color={panelBusquedaAbierto ? 'primary' : 'outline-primary'} 
                    onClick={() => setPanelBusquedaAbierto(!panelBusquedaAbierto)} 
                    className="position-relative"
                    size="sm"
                    title="Configurar búsquedas"
                  >
                    <i className={`mdi ${panelBusquedaAbierto ? 'mdi-tune' : 'mdi-tune-variant'} me-1`}></i>
                    <span className="d-none d-sm-inline">{panelBusquedaAbierto ? 'Ocultar' : 'Búsquedas'}</span>
                    <span className="d-sm-none">Filtros</span>
                    {(terminoBusqueda || Object.keys(busquedaAvanzada).length > 0) && !panelBusquedaAbierto && (
                      <Badge color="danger" className="ms-1 position-absolute top-0 start-100 translate-middle p-1 rounded-circle">
                        <span className="visually-hidden">Filtros activos</span>
                      </Badge>
                    )}
                  </Button>

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

            {/* Panel de búsqueda colapsable */}
            <div className={`search-panel ${panelBusquedaAbierto ? 'open' : 'closed'}`}>
              <Row className="mt-4">
                <Col lg={5} md={7} className="mb-3 mb-lg-0">
                  <div className="position-relative" style={{ maxWidth: '400px' }}>
                    <InputGroup size="sm">
                      <Input
                        type="text"
                        placeholder="Buscar por nombre..."
                        value={terminoBusqueda}
                        onChange={(e) => setTerminoBusqueda(e.target.value)}
                      />
                      <InputGroupText 
                        onClick={() => setTerminoBusqueda('')}
                        className="d-flex align-items-center justify-content-center"
                        style={{ cursor: 'pointer' }}
                      >
                        <i className="mdi mdi-close text-muted"></i>
                      </InputGroupText>
                    </InputGroup>
                    {terminoBusqueda && (
                      <small className="text-muted mt-1 d-block">
                        <i className="mdi mdi-magnify me-1"></i>
                        Búsqueda activa por nombre
                      </small>
                    )}
                  </div>
                </Col>
                <Col lg={7} md={5} className="d-flex justify-content-lg-end justify-content-center align-items-start">
                  <Button 
                    color="outline-primary"
                    onClick={() => setModalBusquedaAvanzada(true)}
                    className="position-relative"
                    size="sm"
                  >
                    <i className="mdi mdi-filter-variant me-1"></i>
                    <span className="d-none d-sm-inline">Búsqueda Avanzada</span>
                    <span className="d-sm-none">Avanzada</span>
                    {Object.keys(busquedaAvanzada).length > 0 && (
                      <Badge color="primary" className="ms-2" style={{ fontSize: '0.7rem' }}>
                        {Object.keys(busquedaAvanzada).length}
                      </Badge>
                    )}
                  </Button>
                </Col>
              </Row>

              {/* Filtros avanzados aplicados */}
              {Object.keys(busquedaAvanzada).length > 0 && (
                <Row className="mt-3">
                  <Col xs={12}>
                    <div className="active-filters-container p-3 bg-light rounded">
                      <div className="d-flex align-items-start flex-wrap">
                        <span className="text-muted small me-2 fw-medium mb-2">
                          <i className="mdi mdi-filter-check me-1"></i>
                          <span className="d-none d-sm-inline">Filtros aplicados:</span>
                          <span className="d-sm-none">Filtros:</span>
                        </span>
                        {Object.entries(busquedaAvanzada).map(([field, config]) => {
                          const fieldConfig = camposBusquedaAvanzada.find(f => f.value === field);
                          const operatorLabels = {
                            'contains': 'contiene',
                            'equals': 'igual a',
                            'startsWith': 'comienza con',
                            'endsWith': 'termina con',
                            'notEquals': 'no igual a',
                            'isEmpty': 'está vacío',
                            'isNotEmpty': 'no está vacío',
                            'greaterThan': 'mayor que',
                            'lessThan': 'menor que',
                            'greaterThanOrEqual': 'mayor o igual que',
                            'lessThanOrEqual': 'menor o igual que'
                          };
                          
                          return (
                            <Badge 
                              key={field}
                              color="white" 
                              className="border border-primary me-2 mb-2 d-flex align-items-center shadow-sm"
                              style={{ fontSize: '0.75rem', padding: '0.5rem 0.75rem' }}
                            >
                              <i className={`${fieldConfig?.icon || 'mdi-text-box-outline'} me-2 text-primary`}></i>
                              <span className="fw-medium text-dark">{fieldConfig?.label || field}</span>
                              <span className="text-muted mx-1">{operatorLabels[config.operator] || config.operator}</span>
                              {!['isEmpty', 'isNotEmpty'].includes(config.operator) && (
                                <span className="text-primary fw-medium">"{config.value}"</span>
                              )}
                              <Button
                                color="link"
                                size="sm"
                                className="p-0 ms-2 text-danger"
                                onClick={() => {
                                  const newFilters = { ...busquedaAvanzada };
                                  delete newFilters[field];
                                  setBusquedaAvanzada(newFilters);
                                }}
                                style={{ fontSize: '0.7rem' }}
                                title="Eliminar filtro"
                              >
                                <i className="mdi mdi-close"></i>
                              </Button>
                            </Badge>
                          );
                        })}
                        <Button 
                          color="link" 
                          size="sm" 
                          className="p-0 text-danger fw-medium"
                          onClick={limpiarBusquedaAvanzada}
                          title="Limpiar todos los filtros"
                        >
                          <i className="mdi mdi-close-circle me-1"></i>
                          Limpiar todos
                        </Button>
                      </div>
                    </div>
                  </Col>
                </Row>
              )}
            </div>

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
                isCustomPageSize={true}
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

        {/* Búsqueda avanzada dinámica */}
        <AdvancedSearch
          isOpen={modalBusquedaAvanzada}
          toggle={() => setModalBusquedaAvanzada(false)}
          fields={camposBusquedaAvanzada}
          onSearch={manejarBusquedaAvanzada}
          onClear={limpiarBusquedaAvanzada}
          initialValues={busquedaAvanzada}
        />

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

        .search-panel {
          transition: all 0.3s ease-in-out;
          overflow: hidden;
        }

        .search-panel.open {
          max-height: 500px;
          opacity: 1;
        }

        .search-panel.closed {
          max-height: 0;
          opacity: 0;
          margin-top: 0 !important;
        }

        .active-filters-container {
          border-left: 4px solid #007bff;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
        }

        .search-panel .badge {
          transition: all 0.2s ease;
        }

        .search-panel .badge:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0,123,255,0.3);
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

export default UsersCrudV1;