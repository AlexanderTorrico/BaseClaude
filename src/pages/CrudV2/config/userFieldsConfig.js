import { opcionesFormulario } from './userConstants';

/**
 * Configuración de campos para el CRUD de usuarios
 * Define el esquema, tipos, validaciones y comportamiento de cada campo
 */
export const userFields = {
  nombre: {
    label: 'Nombre Completo',
    type: 'text',
    required: true,
    sortable: true,
    filterable: true,
    defaultValue: ''
  },
  email: {
    label: 'Correo Electrónico',
    type: 'email',
    required: true,
    sortable: true,
    filterable: true,
    defaultValue: ''
  },
  telefono: {
    label: 'Teléfono',
    type: 'text',
    required: false,
    sortable: false,
    filterable: true,
    defaultValue: ''
  },
  rol: {
    label: 'Rol',
    type: 'select',
    required: true,
    sortable: true,
    filterable: true,
    options: opcionesFormulario.rol,
    defaultValue: 'Usuario'
  },
  departamento: {
    label: 'Departamento',
    type: 'select',
    required: true,
    sortable: true,
    filterable: true,
    options: opcionesFormulario.departamento,
    defaultValue: 'Administración'
  },
  estado: {
    label: 'Estado',
    type: 'select',
    required: true,
    sortable: true,
    filterable: true,
    options: opcionesFormulario.estado,
    defaultValue: 'Activo'
  },
  ciudad: {
    label: 'Ciudad',
    type: 'text',
    required: false,
    sortable: true,
    filterable: true,
    defaultValue: 'Madrid'
  },
  empresa: {
    label: 'Empresa',
    type: 'text',
    required: false,
    sortable: true,
    filterable: true,
    defaultValue: 'TechSoft'
  },
  salario: {
    label: 'Salario',
    type: 'number',
    required: false,
    sortable: true,
    filterable: true,
    format: 'currency',
    defaultValue: 30000
  },
  experiencia: {
    label: 'Años de Experiencia',
    type: 'number',
    required: false,
    sortable: true,
    filterable: true,
    defaultValue: 1
  }
};