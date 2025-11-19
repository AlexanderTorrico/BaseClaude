/**
 * Reglas de validación centralizadas para Compañía
 * Modificar estos valores para cambiar las validaciones en toda la aplicación
 */
export const CompanyValidationRules = {
  logo: {
    maxSize: 5 * 1024 * 1024, // 5MB
    acceptedFormats: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    messages: {
      maxSize: 'El logo debe ser menor a 5MB',
      invalidFormat: 'El logo debe ser JPG, PNG, GIF o WEBP',
    },
  },
  name: {
    minLength: 2,
    maxLength: 100,
    messages: {
      required: 'El nombre de la compañía es requerido',
      minLength: 'El nombre debe tener al menos 2 caracteres',
      maxLength: 'El nombre no puede exceder 100 caracteres',
    },
  },
  detail: {
    messages: {
      required: 'El rubro es requerido',
      invalid: 'El rubro seleccionado no es válido',
    },
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    messages: {
      required: 'El email es requerido',
      invalid: 'El email no es válido',
    },
  },
  phone: {
    countryCode: {
      minLength: 1,
      maxLength: 4,
      messages: {
        required: 'El código de país es requerido',
        invalid: 'Código de país inválido',
      },
    },
    number: {
      minLength: 6,
      maxLength: 15,
      messages: {
        required: 'El número de teléfono es requerido',
        invalid: 'Número de teléfono inválido',
      },
    },
  },
  openingDate: {
    messages: {
      required: 'La fecha de apertura es requerida',
      invalid: 'La fecha de apertura no es válida',
    },
  },
  companySize: {
    options: ['1', '2-9', '10-49', '50-199', '200-499', '500+'],
    messages: {
      required: 'El tamaño de la empresa es requerido',
    },
  },
  timeZone: {
    messages: {
      required: 'La zona horaria es requerida',
    },
  },
  language: {
    options: ['es', 'en', 'pt', 'de', 'fr'],
    messages: {
      required: 'El idioma es requerido',
    },
  },
};

/**
 * Reglas de validación para Sucursales
 */
export const BranchValidationRules = {
  name: {
    minLength: 2,
    maxLength: 100,
    messages: {
      required: 'El nombre de la sucursal es requerido',
      minLength: 'El nombre debe tener al menos 2 caracteres',
      maxLength: 'El nombre no puede exceder 100 caracteres',
    },
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    messages: {
      invalid: 'El email no es válido',
    },
  },
  phone: {
    minLength: 6,
    maxLength: 20,
    messages: {
      required: 'El teléfono es requerido',
      invalid: 'El teléfono debe tener entre 6 y 20 caracteres',
    },
  },
  address: {
    minLength: 5,
    maxLength: 255,
    messages: {
      required: 'La dirección es requerida',
      minLength: 'La dirección debe tener al menos 5 caracteres',
      maxLength: 'La dirección no puede exceder 255 caracteres',
    },
  },
  coordinates: {
    lat: {
      min: -90,
      max: 90,
      messages: {
        invalid: 'La latitud debe estar entre -90 y 90',
      },
    },
    lng: {
      min: -180,
      max: 180,
      messages: {
        invalid: 'La longitud debe estar entre -180 y 180',
      },
    },
  },
};
