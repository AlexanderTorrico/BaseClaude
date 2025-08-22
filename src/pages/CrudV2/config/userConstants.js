export const opcionesFormulario = {
  rol: [
    { value: 'Administrador', label: 'Administrador', icon: 'mdi mdi-shield-account' },
    { value: 'Editor', label: 'Editor', icon: 'mdi mdi-pencil' },
    { value: 'Moderador', label: 'Moderador', icon: 'mdi mdi-account-check' },
    { value: 'Usuario', label: 'Usuario', icon: 'mdi mdi-account' },
    { value: 'Supervisor', label: 'Supervisor', icon: 'mdi mdi-account-supervisor' },
    { value: 'Analista', label: 'Analista', icon: 'mdi mdi-chart-line' },
    { value: 'Desarrollador', label: 'Desarrollador', icon: 'mdi mdi-code-tags' },
    { value: 'Diseñador', label: 'Diseñador', icon: 'mdi mdi-palette' }
  ],
  departamento: [
    { value: 'Administración', label: 'Administración', icon: 'mdi mdi-account-tie' },
    { value: 'Recursos Humanos', label: 'Recursos Humanos', icon: 'mdi mdi-account-group' },
    { value: 'Ventas', label: 'Ventas', icon: 'mdi mdi-currency-usd' },
    { value: 'Marketing', label: 'Marketing', icon: 'mdi mdi-bullhorn' },
    { value: 'IT', label: 'IT', icon: 'mdi mdi-code-tags' },
    { value: 'Finanzas', label: 'Finanzas', icon: 'mdi mdi-calculator' }
  ],
  estado: [
    { value: 'Activo', label: 'Activo', icon: 'mdi mdi-check-circle' },
    { value: 'Inactivo', label: 'Inactivo', icon: 'mdi mdi-close-circle' },
    { value: 'Pendiente', label: 'Pendiente', icon: 'mdi mdi-clock-outline' },
    { value: 'Suspendido', label: 'Suspendido', icon: 'mdi mdi-alert-circle' }
  ]
};

export const opcionesColumnaBusqueda = [
  { value: 'all', label: 'Todas las columnas', icon: 'mdi mdi-view-column' },
  { value: 'nombre', label: 'Nombre', icon: 'mdi mdi-account' },
  { value: 'email', label: 'Email', icon: 'mdi mdi-email' },
  { value: 'telefono', label: 'Teléfono', icon: 'mdi mdi-phone' },
  { value: 'rol', label: 'Rol', icon: 'mdi mdi-shield-account' },
  { value: 'departamento', label: 'Departamento', icon: 'mdi mdi-office-building' },
  { value: 'estado', label: 'Estado', icon: 'mdi mdi-check-circle' },
  { value: 'ciudad', label: 'Ciudad', icon: 'mdi mdi-map-marker' },
  { value: 'empresa', label: 'Empresa', icon: 'mdi mdi-domain' }
];

export const opcionesOrdenamiento = [
  { value: 'nombre', label: 'Nombre', icon: 'mdi mdi-account' },
  { value: 'email', label: 'Email', icon: 'mdi mdi-email' },
  { value: 'rol', label: 'Rol', icon: 'mdi mdi-shield-account' },
  { value: 'departamento', label: 'Departamento', icon: 'mdi mdi-office-building' },
  { value: 'estado', label: 'Estado', icon: 'mdi mdi-check-circle' },
  { value: 'salario', label: 'Salario', icon: 'mdi mdi-currency-eur' },
  { value: 'experiencia', label: 'Experiencia', icon: 'mdi mdi-clock-outline' },
  { value: 'rendimiento', label: 'Rendimiento', icon: 'mdi mdi-trending-up' },
  { value: 'ciudad', label: 'Ciudad', icon: 'mdi mdi-map-marker' },
  { value: 'empresa', label: 'Empresa', icon: 'mdi mdi-domain' }
];

export const defaultFormData = {
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
};