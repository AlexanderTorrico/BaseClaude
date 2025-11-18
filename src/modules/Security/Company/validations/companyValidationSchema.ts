import * as Yup from 'yup';
import { CompanyValidationRules, BranchValidationRules } from './companyValidationRules';

/**
 * Schema de validación para crear/editar Compañía
 */
export const companyFormSchema = Yup.object().shape({
  name: Yup.string()
    .required(CompanyValidationRules.name.messages.required)
    .min(CompanyValidationRules.name.minLength, CompanyValidationRules.name.messages.minLength)
    .max(CompanyValidationRules.name.maxLength, CompanyValidationRules.name.messages.maxLength),

  detail: Yup.number()
    .required(CompanyValidationRules.detail.messages.required)
    .positive(CompanyValidationRules.detail.messages.invalid),

  email: Yup.string()
    .required(CompanyValidationRules.email.messages.required)
    .matches(CompanyValidationRules.email.pattern, CompanyValidationRules.email.messages.invalid),

  phoneCountryCode: Yup.string()
    .required(CompanyValidationRules.phone.countryCode.messages.required)
    .min(CompanyValidationRules.phone.countryCode.minLength, CompanyValidationRules.phone.countryCode.messages.invalid)
    .max(CompanyValidationRules.phone.countryCode.maxLength, CompanyValidationRules.phone.countryCode.messages.invalid),

  phoneNumber: Yup.string()
    .required(CompanyValidationRules.phone.number.messages.required)
    .min(CompanyValidationRules.phone.number.minLength, CompanyValidationRules.phone.number.messages.invalid)
    .max(CompanyValidationRules.phone.number.maxLength, CompanyValidationRules.phone.number.messages.invalid),

  openingDateCompany: Yup.date()
    .required(CompanyValidationRules.openingDate.messages.required)
    .typeError(CompanyValidationRules.openingDate.messages.invalid),

  companySize: Yup.string()
    .required(CompanyValidationRules.companySize.messages.required)
    .oneOf(CompanyValidationRules.companySize.options),

  timeZone: Yup.string()
    .required(CompanyValidationRules.timeZone.messages.required),

  language: Yup.string()
    .required(CompanyValidationRules.language.messages.required)
    .oneOf(CompanyValidationRules.language.options),

  logo: Yup.mixed().nullable().optional(),
});

/**
 * Schema de validación para crear/editar Sucursal
 */
export const branchFormSchema = Yup.object().shape({
  name: Yup.string()
    .required(BranchValidationRules.name.messages.required)
    .min(BranchValidationRules.name.minLength, BranchValidationRules.name.messages.minLength)
    .max(BranchValidationRules.name.maxLength, BranchValidationRules.name.messages.maxLength),

  email: Yup.string()
    .matches(BranchValidationRules.email.pattern, BranchValidationRules.email.messages.invalid)
    .optional()
    .nullable(),

  phone: Yup.string()
    .required(BranchValidationRules.phone.messages.required)
    .min(BranchValidationRules.phone.minLength, BranchValidationRules.phone.messages.invalid)
    .max(BranchValidationRules.phone.maxLength, BranchValidationRules.phone.messages.invalid),

  address: Yup.string()
    .required(BranchValidationRules.address.messages.required)
    .min(BranchValidationRules.address.minLength, BranchValidationRules.address.messages.minLength)
    .max(BranchValidationRules.address.maxLength, BranchValidationRules.address.messages.maxLength),

  lat: Yup.number()
    .min(BranchValidationRules.coordinates.lat.min, BranchValidationRules.coordinates.lat.messages.invalid)
    .max(BranchValidationRules.coordinates.lat.max, BranchValidationRules.coordinates.lat.messages.invalid)
    .nullable(),

  lng: Yup.number()
    .min(BranchValidationRules.coordinates.lng.min, BranchValidationRules.coordinates.lng.messages.invalid)
    .max(BranchValidationRules.coordinates.lng.max, BranchValidationRules.coordinates.lng.messages.invalid)
    .nullable(),
});
