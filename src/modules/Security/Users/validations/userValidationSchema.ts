import * as Yup from 'yup';
import { UserValidationRules } from './userValidationRules';

export const userRegistrationSchema = Yup.object().shape({
  name: Yup.string()
    .required(UserValidationRules.name.messages.required)
    .min(UserValidationRules.name.minLength, UserValidationRules.name.messages.minLength)
    .max(UserValidationRules.name.maxLength, UserValidationRules.name.messages.maxLength)
    .matches(UserValidationRules.name.pattern, UserValidationRules.name.messages.pattern),

  lastName: Yup.string()
    .required(UserValidationRules.lastName.messages.required)
    .min(UserValidationRules.lastName.minLength, UserValidationRules.lastName.messages.minLength)
    .max(UserValidationRules.lastName.maxLength, UserValidationRules.lastName.messages.maxLength)
    .matches(UserValidationRules.lastName.pattern, UserValidationRules.lastName.messages.pattern),

  email: Yup.string()
    .required(UserValidationRules.email.messages.required)
    .matches(UserValidationRules.email.pattern, UserValidationRules.email.messages.invalid),

  phone: Yup.string()
    .required(UserValidationRules.phone.messages.required)
    .min(UserValidationRules.phone.minLength, UserValidationRules.phone.messages.minLength)
    .max(UserValidationRules.phone.maxLength, UserValidationRules.phone.messages.maxLength)
    .matches(UserValidationRules.phone.pattern, UserValidationRules.phone.messages.pattern),

  password: Yup.string()
    .required(UserValidationRules.password.messages.required)
    .min(UserValidationRules.password.minLength, UserValidationRules.password.messages.minLength)
    .max(UserValidationRules.password.maxLength, UserValidationRules.password.messages.maxLength),

  repeatPassword: Yup.string()
    .required('Debe confirmar la contraseña')
    .oneOf([Yup.ref('password')], 'Las contraseñas deben coincidir'),

  workStationId: Yup.number()
    .required(UserValidationRules.workStation.messages.required)
    .positive(UserValidationRules.workStation.messages.invalid),

  avatar: Yup.mixed().nullable().optional(),
});

export const userEditSchema = Yup.object().shape({
  name: Yup.string()
    .required(UserValidationRules.name.messages.required)
    .min(UserValidationRules.name.minLength, UserValidationRules.name.messages.minLength)
    .max(UserValidationRules.name.maxLength, UserValidationRules.name.messages.maxLength)
    .matches(UserValidationRules.name.pattern, UserValidationRules.name.messages.pattern),

  lastName: Yup.string()
    .required(UserValidationRules.lastName.messages.required)
    .min(UserValidationRules.lastName.minLength, UserValidationRules.lastName.messages.minLength)
    .max(UserValidationRules.lastName.maxLength, UserValidationRules.lastName.messages.maxLength)
    .matches(UserValidationRules.lastName.pattern, UserValidationRules.lastName.messages.pattern),

  email: Yup.string()
    .required(UserValidationRules.email.messages.required)
    .matches(UserValidationRules.email.pattern, UserValidationRules.email.messages.invalid),

  phone: Yup.string()
    .required(UserValidationRules.phone.messages.required)
    .min(UserValidationRules.phone.minLength, UserValidationRules.phone.messages.minLength)
    .max(UserValidationRules.phone.maxLength, UserValidationRules.phone.messages.maxLength)
    .matches(UserValidationRules.phone.pattern, UserValidationRules.phone.messages.pattern),

  password: Yup.string()
    .min(UserValidationRules.password.minLength, UserValidationRules.password.messages.minLength)
    .max(UserValidationRules.password.maxLength, UserValidationRules.password.messages.maxLength)
    .optional(),

  repeatPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Las contraseñas deben coincidir')
    .when('password', {
      is: (password: string) => password && password.length > 0,
      then: (schema) => schema.required('Debe confirmar la contraseña'),
      otherwise: (schema) => schema.optional(),
    }),

  workStationId: Yup.number()
    .required(UserValidationRules.workStation.messages.required)
    .positive(UserValidationRules.workStation.messages.invalid),

  avatar: Yup.mixed().nullable().optional(),
});
