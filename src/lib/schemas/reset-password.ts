import z from 'zod';

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .max(32, { message: 'Password cannot exceed 32 characters' })
      .refine((password) => /[A-Z]/.test(password), {
        message: 'Password must contain at least one uppercase letter',
      })
      .refine((password) => /[a-z]/.test(password), {
        message: 'Password must contain at least one lowercase letter',
      })
      .refine((password) => /[0-9]/.test(password), {
        message: 'Password must contain at least one number',
      })
      .refine((password) => /[!@#$%^&*]/.test(password), {
        message: 'Password must contain at least one special character (!@#$%^&*)',
      }),
    confirmPassword: z.string(),

    token: z.string().min(1, 'Token is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    error: 'Passwords do not match',
  });

export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
