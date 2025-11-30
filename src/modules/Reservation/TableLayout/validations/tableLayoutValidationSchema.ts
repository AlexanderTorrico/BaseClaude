import * as Yup from 'yup';
import { TableLayoutValidationRules } from './tableLayoutValidationRules';

export const createZoneSchema = Yup.object().shape({
  name: Yup.string()
    .required(TableLayoutValidationRules.zone.name.messages.required)
    .min(
      TableLayoutValidationRules.zone.name.minLength,
      TableLayoutValidationRules.zone.name.messages.minLength
    )
    .max(
      TableLayoutValidationRules.zone.name.maxLength,
      TableLayoutValidationRules.zone.name.messages.maxLength
    )
    .trim(),
});

export const createTableSchema = Yup.object().shape({
  number: Yup.string()
    .required(TableLayoutValidationRules.table.number.messages.required)
    .min(
      TableLayoutValidationRules.table.number.minLength,
      TableLayoutValidationRules.table.number.messages.minLength
    )
    .max(
      TableLayoutValidationRules.table.number.maxLength,
      TableLayoutValidationRules.table.number.messages.maxLength
    )
    .trim(),

  capacity: Yup.number()
    .required(TableLayoutValidationRules.table.capacity.messages.required)
    .min(
      TableLayoutValidationRules.table.capacity.min,
      TableLayoutValidationRules.table.capacity.messages.min
    )
    .max(
      TableLayoutValidationRules.table.capacity.max,
      TableLayoutValidationRules.table.capacity.messages.max
    )
    .integer('La capacidad debe ser un número entero'),

  booZoneId: Yup.number()
    .required(TableLayoutValidationRules.table.zone.messages.required)
    .min(1, TableLayoutValidationRules.table.zone.messages.required),

  shape: Yup.string()
    .required('La forma es requerida')
    .oneOf(['square', 'circle', 'rectangle'], 'Forma inválida'),

  automaticReservationLevel: Yup.number()
    .required('El nivel de reserva es requerido')
    .min(0, 'Nivel inválido')
    .max(2, 'Nivel inválido')
    .integer('El nivel debe ser un número entero'),
});
