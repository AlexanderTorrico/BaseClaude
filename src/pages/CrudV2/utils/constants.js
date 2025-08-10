export const opcionesFormulario = {
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

export const opcionesColumnaBusqueda = [
  { value: 'all', label: 'Todas las columnas', icon: 'mdi-view-column' },
  { value: 'nombre', label: 'Nombre', icon: 'mdi-account' },
  { value: 'email', label: 'Email', icon: 'mdi-email' },
  { value: 'telefono', label: 'Teléfono', icon: 'mdi-phone' },
  { value: 'rol', label: 'Rol', icon: 'mdi-shield-account' },
  { value: 'departamento', label: 'Departamento', icon: 'mdi-office-building' },
  { value: 'estado', label: 'Estado', icon: 'mdi-check-circle' },
  { value: 'ciudad', label: 'Ciudad', icon: 'mdi-map-marker' },
  { value: 'empresa', label: 'Empresa', icon: 'mdi-domain' }
];

export const opcionesOrdenamiento = [
  { value: 'nombre', label: 'Nombre', icon: 'mdi-account' },
  { value: 'email', label: 'Email', icon: 'mdi-email' },
  { value: 'rol', label: 'Rol', icon: 'mdi-shield-account' },
  { value: 'departamento', label: 'Departamento', icon: 'mdi-office-building' },
  { value: 'estado', label: 'Estado', icon: 'mdi-check-circle' },
  { value: 'salario', label: 'Salario', icon: 'mdi-currency-eur' },
  { value: 'experiencia', label: 'Experiencia', icon: 'mdi-clock-outline' },
  { value: 'rendimiento', label: 'Rendimiento', icon: 'mdi-trending-up' },
  { value: 'ciudad', label: 'Ciudad', icon: 'mdi-map-marker' },
  { value: 'empresa', label: 'Empresa', icon: 'mdi-domain' }
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