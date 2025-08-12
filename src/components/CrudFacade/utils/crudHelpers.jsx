export const generateId = () => Date.now() + Math.random();

export const formatCurrency = (value) => `€${value?.toLocaleString()}`;

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('es-ES');
};

export const getBadgeColor = (value, colorMap) => {
  return colorMap[value] || 'secondary';
};

export const validateFormData = (formData, fields) => {
  const errors = {};
  
  Object.entries(fields).forEach(([key, field]) => {
    if (field.required && (!formData[key] || formData[key] === '')) {
      errors[key] = `${field.label} es requerido`;
    }
    
    if (field.type === 'email' && formData[key] && !isValidEmail(formData[key])) {
      errors[key] = 'Email no válido';
    }
  });
  
  return errors;
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};