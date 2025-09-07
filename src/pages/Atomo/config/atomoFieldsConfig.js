export const atomoFields = {
  id: {
    type: 'text',
    required: true,
    label: 'ID',
    placeholder: 'ID único del átomo'
  },
  simbolo: {
    type: 'text',
    required: true,
    label: 'Símbolo',
    placeholder: 'Ej: H, He, Li',
    maxLength: 3
  },
  nombre: {
    type: 'text',
    required: true,
    label: 'Nombre',
    placeholder: 'Nombre del elemento'
  },
  numeroAtomico: {
    type: 'number',
    required: true,
    label: 'Número Atómico',
    placeholder: 'Número de protones',
    min: 1,
    max: 118
  },
  pesoAtomico: {
    type: 'number',
    required: true,
    label: 'Peso Atómico',
    placeholder: 'Peso atómico en u.m.a.',
    step: 0.001
  },
  grupo: {
    type: 'select',
    required: true,
    label: 'Grupo',
    options: [
      { value: 1, label: 'Grupo 1 - Metales Alcalinos' },
      { value: 2, label: 'Grupo 2 - Metales Alcalinotérreos' },
      { value: 3, label: 'Grupo 3 - Metales de Transición' },
      { value: 4, label: 'Grupo 4 - Metales de Transición' },
      { value: 5, label: 'Grupo 5 - Metales de Transición' },
      { value: 6, label: 'Grupo 6 - Metales de Transición' },
      { value: 7, label: 'Grupo 7 - Metales de Transición' },
      { value: 8, label: 'Grupo 8 - Metales de Transición' },
      { value: 9, label: 'Grupo 9 - Metales de Transición' },
      { value: 10, label: 'Grupo 10 - Metales de Transición' },
      { value: 11, label: 'Grupo 11 - Metales de Transición' },
      { value: 12, label: 'Grupo 12 - Metales de Transición' },
      { value: 13, label: 'Grupo 13 - Metales Post-transición' },
      { value: 14, label: 'Grupo 14 - Metaloides' },
      { value: 15, label: 'Grupo 15 - No Metales' },
      { value: 16, label: 'Grupo 16 - Calcógenos' },
      { value: 17, label: 'Grupo 17 - Halógenos' },
      { value: 18, label: 'Grupo 18 - Gases Nobles' }
    ]
  },
  periodo: {
    type: 'select',
    required: true,
    label: 'Periodo',
    options: [
      { value: 1, label: 'Periodo 1' },
      { value: 2, label: 'Periodo 2' },
      { value: 3, label: 'Periodo 3' },
      { value: 4, label: 'Periodo 4' },
      { value: 5, label: 'Periodo 5' },
      { value: 6, label: 'Periodo 6' },
      { value: 7, label: 'Periodo 7' }
    ]
  },
  configuracionElectronica: {
    type: 'text',
    required: false,
    label: 'Configuración Electrónica',
    placeholder: 'Ej: 1s² 2s² 2p⁶'
  },
  estado: {
    type: 'select',
    required: true,
    label: 'Estado a 20°C',
    options: [
      { value: 'solido', label: 'Sólido' },
      { value: 'liquido', label: 'Líquido' },
      { value: 'gas', label: 'Gas' },
      { value: 'sintetico', label: 'Sintético' }
    ]
  },
  tipo: {
    type: 'select',
    required: true,
    label: 'Tipo',
    options: [
      { value: 'metal', label: 'Metal' },
      { value: 'noMetal', label: 'No Metal' },
      { value: 'metaloide', label: 'Metaloide' },
      { value: 'gasNoble', label: 'Gas Noble' },
      { value: 'transicion', label: 'Metal de Transición' },
      { value: 'alcalino', label: 'Metal Alcalino' },
      { value: 'alcalinoterreo', label: 'Metal Alcalinotérreo' }
    ]
  },
  puntoFusion: {
    type: 'number',
    required: false,
    label: 'Punto de Fusión (°C)',
    placeholder: 'Temperatura de fusión'
  },
  puntoEbullicion: {
    type: 'number',
    required: false,
    label: 'Punto de Ebullición (°C)',
    placeholder: 'Temperatura de ebullición'
  },
  densidad: {
    type: 'number',
    required: false,
    label: 'Densidad (g/cm³)',
    placeholder: 'Densidad del elemento',
    step: 0.001
  },
  descubierto: {
    type: 'number',
    required: false,
    label: 'Año de Descubrimiento',
    placeholder: 'Año en que fue descubierto',
    min: 1600,
    max: new Date().getFullYear()
  },
  descubridor: {
    type: 'text',
    required: false,
    label: 'Descubridor',
    placeholder: 'Nombre del descubridor'
  }
};