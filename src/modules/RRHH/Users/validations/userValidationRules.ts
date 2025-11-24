/**
 * Reglas de validación reutilizables para usuarios
 * Estas reglas pueden usarse en Yup, validaciones manuales, o tests
 */

export const UserValidationRules = {
  // Reglas de nombre
  name: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
    messages: {
      required: 'El nombre es requerido',
      minLength: 'El nombre debe tener al menos 2 caracteres',
      maxLength: 'El nombre no puede exceder 50 caracteres',
      pattern: 'El nombre solo puede contener letras y espacios',
    }
  },

  // Reglas de apellido
  lastName: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
    messages: {
      required: 'El apellido es requerido',
      minLength: 'El apellido debe tener al menos 2 caracteres',
      maxLength: 'El apellido no puede exceder 50 caracteres',
      pattern: 'El apellido solo puede contener letras y espacios',
    }
  },

  // Reglas de email
  email: {
    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    messages: {
      required: 'El email es requerido',
      invalid: 'El formato del email no es válido',
    }
  },

  // Reglas de teléfono
  phone: {
    minLength: 8,
    maxLength: 15,
    pattern: /^[0-9+\-\s()]+$/,
    messages: {
      required: 'El teléfono es requerido',
      minLength: 'El teléfono debe tener al menos 8 caracteres',
      maxLength: 'El teléfono no puede exceder 15 caracteres',
      pattern: 'El teléfono solo puede contener números, +, -, (), y espacios',
    }
  },

  // Reglas de contraseña
  password: {
    minLength: 8,
    maxLength: 50,
    messages: {
      required: 'La contraseña es requerida',
      minLength: 'La contraseña debe tener al menos 8 caracteres',
      maxLength: 'La contraseña no puede exceder 50 caracteres',
    }
  },

  // Reglas de avatar
  avatar: {
    maxSize: 5 * 1024 * 1024, // 5MB
    acceptedFormats: ['image/jpeg', 'image/png', 'image/gif'],
    messages: {
      maxSize: 'El avatar debe ser menor a 5MB',
      invalidFormat: 'El avatar debe ser JPG, PNG o GIF',
    }
  },

  // Reglas de puesto de trabajo
  workStation: {
    minLength: 2,
    maxLength: 100,
    messages: {
      required: 'El nombre del puesto de trabajo es requerido',
      minLength: 'El nombre del puesto debe tener al menos 2 caracteres',
      maxLength: 'El nombre del puesto no puede exceder 100 caracteres',
    }
  },
};
