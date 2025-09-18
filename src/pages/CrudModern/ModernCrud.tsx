import React, { useState, useMemo, ChangeEvent } from "react";
import {
  Container,
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
import { User } from "@/models";
import TableContainer from "../../components/Common/TableContainer";
import DeleteModal from "../../components/Common/DeleteModal";
import SearchBar from "../../components/Common/SearchBar";
import QuickFilters from "../../components/Common/QuickFilters";
import AdvancedSearch from "../../components/Common/AdvancedSearch";
import useSearch from "../../hooks/useSearch";

// Interfaces for types
interface SelectOption {
  value: string;
  label: string;
  icon?: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder: string;
  icon?: string;
}

interface ModernUser extends Omit<User, 'status'> {
  department: string;
  phone: string;
  joinDate: string;
  salary: number;
  performance: number;
  projects: number;
  location: string;
  avatar: string;
  skills: string[];
  lastActive: string;
  tasksCompleted: number;
  status: 'Activo' | 'Inactivo' | 'Pendiente' | 'Vacaciones';
}

interface ModernUserFormData {
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'Activo' | 'Inactivo' | 'Pendiente' | 'Vacaciones';
  phone: string;
  location: string;
  salary: number;
}

// Componente Select Personalizado con estilo dropdown
const CustomSelect: React.FC<CustomSelectProps> = ({ value, onChange, options, placeholder, icon }) => {
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

// Datos mejorados con más campos para el diseño moderno
const generateModernUsers = (): ModernUser[] => {
  const names = ["Sophia Chen", "Marcus Johnson", "Isabella Rodriguez", "Ethan Kim", "Olivia Thompson", "Alexander Davis", "Ava Martinez", "Gabriel Wilson", "Emma Garcia", "Noah Anderson"];
  const roles = ["Product Manager", "Senior Developer", "UI/UX Designer", "Data Analyst", "Marketing Specialist", "DevOps Engineer", "QA Engineer", "Business Analyst"];
  const departments = ["Producto", "Ingeniería", "Diseño", "Marketing", "Ventas", "RRHH", "Finanzas", "Operaciones"];
  const statuses = ["Activo", "Inactivo", "Pendiente", "Vacaciones"];
  const skills = ["React", "Node.js", "Python", "Figma", "SQL", "AWS", "Docker", "TypeScript", "MongoDB", "GraphQL"];
  const locations = ["Madrid, España", "Barcelona, España", "Valencia, España", "Sevilla, España", "Bilbao, España", "Málaga, España"];
  const profileImages = ["avatar-1.jpg", "avatar-2.jpg", "avatar-3.jpg", "avatar-4.jpg", "avatar-5.jpg", "avatar-6.jpg", "avatar-7.jpg", "avatar-8.jpg"];

  return Array.from({ length: 24 }, (_, index) => ({
    id: index + 1,
    name: names[index % names.length],
    email: names[index % names.length].toLowerCase().replace(' ', '.') + '@empresa.com',
    role: roles[Math.floor(Math.random() * roles.length)],
    department: departments[Math.floor(Math.random() * departments.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    phone: `+34 ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100}`,
    joinDate: new Date(2019 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString('es-ES'),
    salary: Math.floor(Math.random() * 50000) + 30000,
    performance: Math.floor(Math.random() * 40) + 60,
    projects: Math.floor(Math.random() * 10) + 1,
    location: locations[Math.floor(Math.random() * locations.length)],
    avatar: profileImages[index % profileImages.length],
    skills: skills.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 4) + 2),
    lastActive: `Hace ${Math.floor(Math.random() * 48) + 1}h`,
    tasksCompleted: Math.floor(Math.random() * 50) + 10,
  }));
};

const ModernCrud: React.FC = () => {
  const [users, setUsers] = useState<ModernUser[]>(generateModernUsers());
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [slideoverOpen, setSlideoverOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ModernUser | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<ModernUser[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(
    JSON.parse(localStorage.getItem('recentUserSearches') || '[]')
  );
  const [formData, setFormData] = useState<ModernUserFormData>({
    name: "",
    email: "",
    role: "Senior Developer",
    department: "Ingeniería",
    status: "Activo",
    phone: "",
    location: "Madrid, España",
    salary: 35000,
  });

  // Opciones para los selects personalizados
  const statusOptions = [
    { value: 'all', label: 'Todos los estados', icon: 'mdi-format-list-bulleted' },
    { value: 'Activo', label: 'Activo', icon: 'mdi-check-circle' },
    { value: 'Inactivo', label: 'Inactivo', icon: 'mdi-close-circle' },
    { value: 'Pendiente', label: 'Pendiente', icon: 'mdi-clock-outline' },
    { value: 'Vacaciones', label: 'Vacaciones', icon: 'mdi-beach' }
  ];

  const departmentOptions = [
    { value: 'all', label: 'Todos los departamentos', icon: 'mdi-domain' },
    { value: 'Ingeniería', label: 'Ingeniería', icon: 'mdi-code-tags' },
    { value: 'Diseño', label: 'Diseño', icon: 'mdi-palette' },
    { value: 'Marketing', label: 'Marketing', icon: 'mdi-bullhorn' },
    { value: 'Ventas', label: 'Ventas', icon: 'mdi-currency-usd' },
    { value: 'RRHH', label: 'RRHH', icon: 'mdi-account-group' },
    { value: 'Finanzas', label: 'Finanzas', icon: 'mdi-calculator' }
  ];

  const roleOptions = [
    { value: 'Product Manager', label: 'Product Manager', icon: 'mdi-account-tie' },
    { value: 'Senior Developer', label: 'Senior Developer', icon: 'mdi-code-tags' },
    { value: 'UI/UX Designer', label: 'UI/UX Designer', icon: 'mdi-palette' },
    { value: 'Data Analyst', label: 'Data Analyst', icon: 'mdi-chart-line' },
    { value: 'Marketing Specialist', label: 'Marketing Specialist', icon: 'mdi-bullhorn' },
    { value: 'DevOps Engineer', label: 'DevOps Engineer', icon: 'mdi-server' }
  ];

  const formStatusOptions = [
    { value: 'Activo', label: 'Activo', icon: 'mdi-check-circle' },
    { value: 'Inactivo', label: 'Inactivo', icon: 'mdi-close-circle' },
    { value: 'Pendiente', label: 'Pendiente', icon: 'mdi-clock-outline' },
    { value: 'Vacaciones', label: 'Vacaciones', icon: 'mdi-beach' }
  ];

  const formDepartmentOptions = [
    { value: 'Ingeniería', label: 'Ingeniería', icon: 'mdi-code-tags' },
    { value: 'Diseño', label: 'Diseño', icon: 'mdi-palette' },
    { value: 'Marketing', label: 'Marketing', icon: 'mdi-bullhorn' },
    { value: 'Ventas', label: 'Ventas', icon: 'mdi-currency-usd' },
    { value: 'RRHH', label: 'RRHH', icon: 'mdi-account-group' },
    { value: 'Finanzas', label: 'Finanzas', icon: 'mdi-calculator' }
  ];

  // Configuración del hook de búsqueda
  const searchConfig = {
    searchableFields: ['name', 'email', 'role', 'department', 'phone', 'location'],
    defaultFilters: {},
    searchDelay: 300,
    caseSensitive: false
  };

  const {
    searchTerm,
    filters,
    advancedSearch,
    filteredData,
    searchStats,
    handleSearch,
    addFilter,
    removeFilter,
    clearFilters,
    updateAdvancedSearch
  } = useSearch(users, searchConfig);

  // Configuración de filtros rápidos
  const quickFiltersConfig = {
    status: {
      label: 'Estado',
      icon: 'mdi-account-check',
      activeColor: 'success',
      options: statusOptions
    },
    department: {
      label: 'Departamento', 
      icon: 'mdi-domain',
      activeColor: 'info',
      options: departmentOptions
    },
    performance: {
      label: 'Rendimiento',
      icon: 'mdi-chart-line',
      activeColor: 'warning',
      options: [
        { value: 'all', label: 'Todos los niveles', icon: 'mdi-format-list-bulleted' },
        { value: 'high', label: 'Alto (90%+)', icon: 'mdi-trending-up' },
        { value: 'medium', label: 'Medio (70-89%)', icon: 'mdi-trending-neutral' },
        { value: 'low', label: 'Bajo (50-69%)', icon: 'mdi-trending-down' }
      ]
    }
  };

  // Campos para búsqueda avanzada
  const advancedSearchFields = [
    { value: 'name', label: 'Nombre', type: 'text', icon: 'mdi-account' },
    { value: 'email', label: 'Correo', type: 'text', icon: 'mdi-email' },
    { value: 'role', label: 'Puesto', type: 'text', icon: 'mdi-account-tie' },
    { value: 'department', label: 'Departamento', type: 'text', icon: 'mdi-domain' },
    { value: 'salary', label: 'Salario', type: 'number', icon: 'mdi-currency-eur' },
    { value: 'performance', label: 'Rendimiento', type: 'number', icon: 'mdi-chart-line' },
    { value: 'projects', label: 'Proyectos', type: 'number', icon: 'mdi-folder-multiple' },
    { value: 'joinDate', label: 'Fecha Ingreso', type: 'text', icon: 'mdi-calendar' }
  ];

  // Sugerencias para el SearchBar
  const searchSuggestions = useMemo(() => {
    const suggestions = new Set();
    users.forEach(user => {
      suggestions.add(user.name);
      suggestions.add(user.role);
      suggestions.add(user.department);
      suggestions.add(user.email.split('@')[0]);
    });
    return Array.from(suggestions).slice(0, 10);
  }, [users]);

  // Filtro adicional para rendimiento
  const finalFilteredUsers = useMemo(() => {
    let result = filteredData;
    
    if (filters.performance && filters.performance !== 'all') {
      result = result.filter(user => {
        switch (filters.performance) {
          case 'high': return user.performance >= 90;
          case 'medium': return user.performance >= 70 && user.performance < 90;
          case 'low': return user.performance >= 50 && user.performance < 70;
          default: return true;
        }
      });
    }
    
    return result;
  }, [filteredData, filters]);

  const handleAddUser = (): void => {
    setIsEdit(false);
    setFormData({
      name: "",
      email: "",
      role: "Senior Developer",
      department: "Ingeniería",
      status: "Activo",
      phone: "",
      location: "Madrid, España",
      salary: 35000,
    });
    setSlideoverOpen(true);
  };

  const handleEditUser = (user: ModernUser): void => {
    setIsEdit(true);
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      status: user.status,
      phone: user.phone,
      location: user.location,
      salary: user.salary,
    });
    setSlideoverOpen(true);
  };

  const handleDeleteUser = (user: ModernUser): void => {
    setSelectedUser(user);
    setDeleteModal(true);
  };

  const handleSaveUser = (): void => {
    if (!formData.name || !formData.email) {
      toast.error("Por favor completa los campos obligatorios");
      return;
    }

    if (isEdit) {
      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, ...formData }
          : user
      ));
      toast.success("Usuario actualizado correctamente");
    } else {
      const newUser = {
        id: Math.max(...users.map(u => u.id)) + 1,
        ...formData,
        joinDate: new Date().toLocaleDateString('es-ES'),
        performance: Math.floor(Math.random() * 40) + 60,
        projects: 0,
        avatar: `avatar-${Math.floor(Math.random() * 8) + 1}.jpg`,
        skills: ["React", "JavaScript"],
        lastActive: "Ahora",
        tasksCompleted: 0,
      };
      setUsers([newUser, ...users]);
      toast.success("Usuario creado correctamente");
    }
    
    setSlideoverOpen(false);
  };

  const confirmDelete = (): void => {
    setUsers(users.filter(user => user.id !== selectedUser.id));
    setDeleteModal(false);
    toast.success("Usuario eliminado correctamente");
  };

  const handleSearchSubmit = (searchValue: string): void => {
    if (searchValue && !recentSearches.includes(searchValue)) {
      const newRecent = [searchValue, ...recentSearches.slice(0, 4)];
      setRecentSearches(newRecent);
      localStorage.setItem('recentUserSearches', JSON.stringify(newRecent));
    }
  };

  const handleQuickFilterChange = (filterKey: string, value: string): void => {
    if (value === 'all' || value === null) {
      removeFilter(filterKey);
    } else {
      addFilter(filterKey, value);
    }
  };

  const handleAdvancedSearch = (searchObject: any): void => {
    updateAdvancedSearch(searchObject);
  };

  const handleBulkDelete = (): void => {
    if (selectedUsers.length === 0) {
      toast.warning("Selecciona usuarios para eliminar");
      return;
    }
    setUsers(users.filter(user => !selectedUsers.includes(user.id)));
    setSelectedUsers([]);
    toast.success(`${selectedUsers.length} usuarios eliminados`);
  };

  const getStatusBadge = (status: 'Activo' | 'Inactivo' | 'Pendiente' | 'Vacaciones') => {
    const statusColors = {
      "Activo": { color: "success", icon: "mdi-check-circle" },
      "Inactivo": { color: "danger", icon: "mdi-close-circle" },
      "Pendiente": { color: "warning", icon: "mdi-clock-outline" },
      "Vacaciones": { color: "info", icon: "mdi-beach" }
    };
    const statusInfo = statusColors[status];
    return (
      <Badge color={statusInfo.color} className="d-inline-flex align-items-center">
        <i className={`mdi ${statusInfo.icon} me-1`}></i>
        {status}
      </Badge>
    );
  };

  const getPerformanceColor = (performance: number): string => {
    if (performance >= 90) return "success";
    if (performance >= 70) return "info";
    if (performance >= 50) return "warning";
    return "danger";
  };

  // Vista de tarjetas moderna
  const CardsView: React.FC = () => (
    <Row>
      {finalFilteredUsers.map(user => (
        <Col lg={4} md={6} key={user.id} className="mb-4">
          <Card className="user-card h-100 shadow-sm border-0">
            <CardBody className="p-4">
              {/* Header con avatar y acciones */}
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="d-flex align-items-center">
                  <div className="avatar-md rounded-circle bg-light d-flex align-items-center justify-content-center me-3">
                    <img 
                      src={`/images/users/${user.avatar}`} 
                      alt={user.name}
                      className="rounded-circle"
                      width="48"
                      height="48"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="d-none avatar-md rounded-circle bg-primary text-white d-flex align-items-center justify-content-center">
                      {user.name.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <h6 className="mb-1 font-weight-bold">{user.name}</h6>
                    <p className="text-muted mb-0 small">{user.role}</p>
                  </div>
                </div>
                
                <UncontrolledDropdown>
                  <DropdownToggle tag="button" className="btn btn-light btn-sm">
                    <i className="mdi mdi-dots-vertical"></i>
                  </DropdownToggle>
                  <DropdownMenu end>
                    <DropdownItem onClick={() => handleEditUser(user)}>
                      <i className="mdi mdi-pencil me-2"></i>Editar
                    </DropdownItem>
                    <DropdownItem onClick={() => handleDeleteUser(user)}>
                      <i className="mdi mdi-delete me-2"></i>Eliminar
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem>
                      <i className="mdi mdi-eye me-2"></i>Ver perfil
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>

              {/* Estado y departamento */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                {getStatusBadge(user.status)}
                <span className="badge bg-light text-dark">{user.department}</span>
              </div>

              {/* Información de contacto */}
              <div className="mb-3">
                <p className="mb-1 small text-muted">
                  <i className="mdi mdi-email-outline me-2"></i>
                  {user.email}
                </p>
                <p className="mb-1 small text-muted">
                  <i className="mdi mdi-phone me-2"></i>
                  {user.phone}
                </p>
                <p className="mb-0 small text-muted">
                  <i className="mdi mdi-map-marker me-2"></i>
                  {user.location}
                </p>
              </div>

              {/* Performance indicator */}
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <small className="text-muted">Rendimiento</small>
                  <small className="font-weight-bold">{user.performance}%</small>
                </div>
                <Progress 
                  value={user.performance} 
                  color={getPerformanceColor(user.performance)}
                  className="progress-sm"
                />
              </div>

              {/* Skills */}
              <div className="mb-3">
                <small className="text-muted d-block mb-2">Habilidades</small>
                <div className="d-flex flex-wrap gap-1">
                  {user.skills.slice(0, 3).map(skill => (
                    <Badge key={skill} color="primary" className="badge-soft-primary">
                      {skill}
                    </Badge>
                  ))}
                  {user.skills.length > 3 && (
                    <Badge color="light">+{user.skills.length - 3}</Badge>
                  )}
                </div>
              </div>

              {/* Estadísticas */}
              <div className="row g-2 mt-3 pt-3 border-top">
                <div className="col-4 text-center">
                  <h6 className="mb-0">{user.projects}</h6>
                  <small className="text-muted">Proyectos</small>
                </div>
                <div className="col-4 text-center">
                  <h6 className="mb-0">{user.tasksCompleted}</h6>
                  <small className="text-muted">Tareas</small>
                </div>
                <div className="col-4 text-center">
                  <h6 className="mb-0">€{(user.salary / 1000).toFixed(0)}K</h6>
                  <small className="text-muted">Salario</small>
                </div>
              </div>

              {/* Última actividad */}
              <div className="mt-3 pt-3 border-top">
                <small className="text-muted">
                  <i className="mdi mdi-clock-outline me-1"></i>
                  {user.lastActive}
                </small>
              </div>
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  );

  // Columnas para la vista de tabla
  const columns = useMemo(() => [
    {
      header: (
        <Input
          type="checkbox"
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedUsers(finalFilteredUsers.map(u => u.id));
            } else {
              setSelectedUsers([]);
            }
          }}
        />
      ),
      accessorKey: "select",
      enableSorting: false,
      cell: ({ row }) => (
        <Input
          type="checkbox"
          checked={selectedUsers.includes(row.original.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedUsers([...selectedUsers, row.original.id]);
            } else {
              setSelectedUsers(selectedUsers.filter(id => id !== row.original.id));
            }
          }}
        />
      ),
    },
    {
      header: "Usuario",
      accessorKey: "name",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="d-flex align-items-center">
          <div className="avatar-xs rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3">
            {row.original.name.charAt(0)}
          </div>
          <div>
            <h6 className="mb-0">{row.original.name}</h6>
            <p className="text-muted mb-0 small">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Rol",
      accessorKey: "role",
      enableSorting: true,
    },
    {
      header: "Departamento",
      accessorKey: "department",
      enableSorting: true,
    },
    {
      header: "Estado",
      accessorKey: "status",
      enableSorting: true,
      cell: ({ getValue }) => getStatusBadge(getValue()),
    },
    {
      header: "Rendimiento",
      accessorKey: "performance",
      enableSorting: true,
      cell: ({ getValue }) => (
        <div className="d-flex align-items-center">
          <Progress 
            value={getValue()} 
            color={getPerformanceColor(getValue())}
            className="me-2 flex-grow-1"
            style={{ height: '8px' }}
          />
          <small>{getValue()}%</small>
        </div>
      ),
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
            onClick={() => handleEditUser(row.original)}
          >
            <i className="mdi mdi-pencil"></i>
          </Button>
          <Button
            color="danger"
            size="sm"
            onClick={() => handleDeleteUser(row.original)}
          >
            <i className="mdi mdi-delete"></i>
          </Button>
        </div>
      ),
    },
  ], [selectedUsers, finalFilteredUsers]);

  return (
    <React.Fragment>
      <Container fluid>
        {/* Header con filtros y acciones */}
        <Card className="border-0 shadow-sm mb-4">
          <CardBody>
            <Row className="align-items-center">
              <Col md={6}>
                <h4 className="mb-0">Gestión de Usuarios</h4>
                <p className="text-muted mb-0">Administra tu equipo de trabajo</p>
              </Col>
              <Col md={6} className="text-end">
                <Button color="primary" onClick={handleAddUser} className="me-2">
                  <i className="mdi mdi-plus me-1"></i>
                  Nuevo Usuario
                </Button>
                
                {selectedUsers.length > 0 && (
                  <Button color="danger" outline onClick={handleBulkDelete} className="me-2">
                    <i className="mdi mdi-delete me-1"></i>
                    Eliminar ({selectedUsers.length})
                  </Button>
                )}

                <div className="btn-group">
                  <Button 
                    color={viewMode === 'cards' ? 'primary' : 'light'}
                    onClick={() => setViewMode('cards')}
                  >
                    <i className="mdi mdi-view-grid"></i>
                  </Button>
                  <Button 
                    color={viewMode === 'table' ? 'primary' : 'light'}
                    onClick={() => setViewMode('table')}
                  >
                    <i className="mdi mdi-view-list"></i>
                  </Button>
                </div>
              </Col>
            </Row>

            {/* Sistema de búsqueda moderno */}
            <Row className="mt-4">
              <Col md={6}>
                <SearchBar
                  value={searchTerm}
                  onChange={handleSearch}
                  onClear={clearFilters}
                  placeholder="Buscar por nombre, email, puesto..."
                  suggestions={searchSuggestions}
                  recentSearches={recentSearches}
                  onSuggestionSelect={handleSearchSubmit}
                  onRecentSearchSelect={handleSearchSubmit}
                  loading={false}
                  size="md"
                  className="mb-3"
                />
              </Col>
              <Col md={6} className="d-flex justify-content-end align-items-start">
                <Button 
                  color="outline-primary"
                  onClick={() => setAdvancedSearchOpen(true)}
                  className="me-2"
                >
                  <i className="mdi mdi-filter-variant me-1"></i>
                  Búsqueda Avanzada
                  {Object.keys(advancedSearch).length > 0 && (
                    <Badge color="primary" className="ms-2">
                      {Object.keys(advancedSearch).length}
                    </Badge>
                  )}
                </Button>
                <div className="text-muted small d-flex align-items-center">
                  <i className="mdi mdi-information-outline me-1"></i>
                  {searchStats.filtered} de {searchStats.total}
                </div>
              </Col>
            </Row>

            {/* Filtros rápidos */}
            <Row className="mt-3">
              <Col xs={12}>
                <QuickFilters
                  filters={quickFiltersConfig}
                  activeFilters={filters}
                  onFilterChange={handleQuickFilterChange}
                  onClearAll={clearFilters}
                  showFilterCount={true}
                  maxVisibleFilters={3}
                  className="mb-3"
                />
              </Col>
            </Row>
          </CardBody>
        </Card>

        {/* Contenido principal */}
        {viewMode === 'cards' ? (
          <CardsView />
        ) : (
          <Card className="border-0 shadow-sm">
            <CardBody>
              <TableContainer
                columns={columns}
                data={finalFilteredUsers}
                isGlobalFilter={false}
                isPagination={true}
                isCustomPageSize={true}
                divClassName="table-responsive table-card mb-1"
                tableClass="align-middle table-nowrap"
                theadClass="table-light text-muted"
                paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                pagination="pagination"
              />
            </CardBody>
          </Card>
        )}

        {/* Modal de búsqueda avanzada */}
        <AdvancedSearch
          isOpen={advancedSearchOpen}
          toggle={() => setAdvancedSearchOpen(false)}
          fields={advancedSearchFields}
          onSearch={handleAdvancedSearch}
          onClear={() => updateAdvancedSearch({})}
          initialValues={advancedSearch}
        />

        {/* Slideover Modal para agregar/editar */}
        <Modal 
          isOpen={slideoverOpen} 
          toggle={() => setSlideoverOpen(!slideoverOpen)} 
          size="lg"
          className="modal-slideover"
        >
          <ModalHeader toggle={() => setSlideoverOpen(false)} className="border-bottom">
            <div>
              <h5 className="mb-0">{isEdit ? "Editar Usuario" : "Nuevo Usuario"}</h5>
              <p className="text-muted mb-0">Complete la información del usuario</p>
            </div>
          </ModalHeader>
          <ModalBody className="p-4">
            <Form>
              <Row>
                <Col md={12} className="mb-3">
                  <FormGroup>
                    <Label htmlFor="name">Nombre Completo *</Label>
                    <Input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, name: e.target.value})}
                      placeholder="Ingresa el nombre completo"
                      className="form-control-lg"
                    />
                  </FormGroup>
                </Col>
                <Col md={12} className="mb-3">
                  <FormGroup>
                    <Label htmlFor="email">Correo Electrónico *</Label>
                    <Input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, email: e.target.value})}
                      placeholder="correo@empresa.com"
                      className="form-control-lg"
                    />
                  </FormGroup>
                </Col>
                <Col md={6} className="mb-3">
                  <FormGroup>
                    <Label htmlFor="role">Puesto</Label>
                    <CustomSelect
                      value={formData.role}
                      onChange={(value: string) => setFormData({...formData, role: value})}
                      options={roleOptions}
                      placeholder="Selecciona un puesto"
                    />
                  </FormGroup>
                </Col>
                <Col md={6} className="mb-3">
                  <FormGroup>
                    <Label htmlFor="department">Departamento</Label>
                    <CustomSelect
                      value={formData.department}
                      onChange={(value: string) => setFormData({...formData, department: value})}
                      options={formDepartmentOptions}
                      placeholder="Selecciona un departamento"
                    />
                  </FormGroup>
                </Col>
                <Col md={6} className="mb-3">
                  <FormGroup>
                    <Label htmlFor="status">Estado</Label>
                    <CustomSelect
                      value={formData.status}
                      onChange={(value: string) => setFormData({...formData, status: value as 'Activo' | 'Inactivo' | 'Pendiente' | 'Vacaciones'})}
                      options={formStatusOptions}
                      placeholder="Selecciona un estado"
                    />
                  </FormGroup>
                </Col>
                <Col md={6} className="mb-3">
                  <FormGroup>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      type="text"
                      id="phone"
                      value={formData.phone}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+34 123 456 789"
                      className="form-control-lg"
                    />
                  </FormGroup>
                </Col>
                <Col md={8} className="mb-3">
                  <FormGroup>
                    <Label htmlFor="location">Ubicación</Label>
                    <Input
                      type="text"
                      id="location"
                      value={formData.location}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, location: e.target.value})}
                      placeholder="Madrid, España"
                      className="form-control-lg"
                    />
                  </FormGroup>
                </Col>
                <Col md={4} className="mb-3">
                  <FormGroup>
                    <Label htmlFor="salary">Salario (€)</Label>
                    <Input
                      type="number"
                      id="salary"
                      value={formData.salary}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, salary: parseInt(e.target.value)})}
                      className="form-control-lg"
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </ModalBody>
          <ModalFooter className="border-top">
            <Button color="light" onClick={() => setSlideoverOpen(false)} className="me-2">
              Cancelar
            </Button>
            <Button color="primary" onClick={handleSaveUser} size="lg">
              <i className="mdi mdi-check me-1"></i>
              {isEdit ? "Actualizar Usuario" : "Crear Usuario"}
            </Button>
          </ModalFooter>
        </Modal>

        {/* Modal de confirmación para eliminar */}
        <DeleteModal
          show={deleteModal}
          onDeleteClick={confirmDelete}
          onCloseClick={() => setDeleteModal(false)}
        />
      </Container>

      {/* Estilos personalizados */}
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
        
        .badge-soft-primary {
          background-color: rgba(74, 109, 255, 0.1);
          color: #4a6dff;
          border: 1px solid rgba(74, 109, 255, 0.2);
        }
        
        .modal-slideover .modal-dialog {
          margin-left: auto;
          margin-right: 0;
          height: 100vh;
          max-width: 600px;
          width: 100%;
        }
        
        .modal-slideover .modal-content {
          height: 100vh;
          border-radius: 0;
          border: none;
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
      `}</style>
    </React.Fragment>
  );
};

export default ModernCrud;