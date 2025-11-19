import { UserValidationRules } from './userValidationRules';

export const validateAvatar = (file: File | null): { valid: boolean; error?: string } => {
  if (!file) return { valid: true };

  if (file.size > UserValidationRules.avatar.maxSize) {
    return { valid: false, error: UserValidationRules.avatar.messages.maxSize };
  }

  if (!UserValidationRules.avatar.acceptedFormats.includes(file.type)) {
    return { valid: false, error: UserValidationRules.avatar.messages.invalidFormat };
  }

  return { valid: true };
};
