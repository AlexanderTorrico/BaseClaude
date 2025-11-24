export const TableLayoutValidationRules = {
  zone: {
    name: {
      minLength: 2,
      maxLength: 50,
      messages: {
        required: 'El nombre de la zona es requerido',
        minLength: 'El nombre debe tener al menos 2 caracteres',
        maxLength: 'El nombre no puede exceder 50 caracteres',
      },
    },
  },
  table: {
    number: {
      minLength: 1,
      maxLength: 20,
      messages: {
        required: 'El número/nombre de la mesa es requerido',
        minLength: 'El número debe tener al menos 1 caracter',
        maxLength: 'El número no puede exceder 20 caracteres',
      },
    },
    capacity: {
      min: 1,
      max: 20,
      messages: {
        required: 'La capacidad es requerida',
        min: 'La capacidad debe ser al menos 1',
        max: 'La capacidad no puede exceder 20',
      },
    },
    zone: {
      messages: {
        required: 'Debes seleccionar una zona',
      },
    },
  },
};
