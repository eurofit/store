export const formatCardNumber = (value: string): string => {
  const digitsOnly = value.replace(/\D/g, '');
  return digitsOnly.slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1' + ' ');
};

export const formatExpiry = (value: string): string => {
  const digitsOnly = value.replace(/\D/g, '');
  if (digitsOnly.length >= 2) {
    return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}`;
  }
  return digitsOnly;
};

export const formatCvc = (value: string): string => {
  return value.replace(/\D/g, '').slice(0, 4);
};

export const hideCardNumber = (cardNumber: string): string => {
  return cardNumber.slice(0, -4).replace(/\d/g, '*') + cardNumber.slice(-4);
};
