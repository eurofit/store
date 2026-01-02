export const USER_ROLES = [
  {
    label: 'Admin',
    value: 'admin',
  },
  {
    label: 'Customer',
    value: 'customer',
  },
] as const;

export type UserRole = (typeof USER_ROLES)[number]['value'];
