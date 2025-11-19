export const UserValidationRules = {
  avatar: {
    maxSize: 5 * 1024 * 1024,
    acceptedFormats: ['image/jpeg', 'image/png', 'image/gif'],
    messages: {
      maxSize: 'El avatar debe ser menor a 5MB',
      invalidFormat: 'El avatar debe ser JPG, PNG o GIF',
    },
  },
  name: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
    messages: {
      required: 'El nombre es requerido',
      minLength: 'El nombre debe tener al menos 2 caracteres',
      maxLength: 'El nombre no puede exceder 50 caracteres',
      pattern: 'El nombre solo puede contener letras y espacios',
    },
  },
  lastName: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
    messages: {
      required: 'El apellido es requerido',
      minLength: 'El apellido debe tener al menos 2 caracteres',
      maxLength: 'El apellido no puede exceder 50 caracteres',
      pattern: 'El apellido solo puede contener letras y espacios',
    },
  },
  email: {
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    messages: {
      required: 'El email es requerido',
      invalid: 'El email no es válido',
    },
  },
  phone: {
    minLength: 7,
    maxLength: 15,
    pattern: /^[0-9+\-\s()]+$/,
    messages: {
      required: 'El teléfono es requerido',
      minLength: 'El teléfono debe tener al menos 7 caracteres',
      maxLength: 'El teléfono no puede exceder 15 caracteres',
      pattern: 'El teléfono solo puede contener números, espacios, +, -, ( )',
    },
  },
  password: {
    minLength: 6,
    maxLength: 50,
    messages: {
      required: 'La contraseña es requerida',
      minLength: 'La contraseña debe tener al menos 6 caracteres',
      maxLength: 'La contraseña no puede exceder 50 caracteres',
    },
  },
  workStation: {
    messages: {
      required: 'El puesto de trabajo es requerido',
      invalid: 'El puesto de trabajo seleccionado no es válido',
    },
  },
};
