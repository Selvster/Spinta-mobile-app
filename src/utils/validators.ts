import { z } from 'zod';

// ============================================
// LOGIN
// ============================================

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ============================================
// COACH REGISTRATION
// ============================================

export const coachRegistrationSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    full_name: z.string().min(2, 'Full name is required'),
    birth_date: z.string().optional(),
    gender: z.string().optional(),
    club: z.object({
      club_name: z.string().min(2, 'Club name is required'),
      country: z.string().optional(),
      age_group: z.string().optional(),
      stadium: z.string().optional(),
      logo_url: z.string().optional(),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type CoachRegistrationFormData = z.infer<typeof coachRegistrationSchema>;

// ============================================
// PLAYER REGISTRATION
// ============================================

export const verifyInviteSchema = z.object({
  invite_code: z.string().min(1, 'Invite code is required'),
});

export type VerifyInviteFormData = z.infer<typeof verifyInviteSchema>;

export const playerRegistrationSchema = z
  .object({
    invite_code: z.string().min(1, 'Invite code is required'),
    player_name: z.string().min(2, 'Player name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    birth_date: z.string().min(1, 'Date of birth is required'),
    height: z.number().min(100, 'Height must be at least 100cm').max(250, 'Height must be at most 250cm'),
    profile_image_url: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type PlayerRegistrationFormData = z.infer<typeof playerRegistrationSchema>;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Convert DD/MM/YYYY format to YYYY-MM-DD (ISO format)
 */
export const convertDateToISO = (dateStr: string): string => {
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return dateStr;
};

/**
 * Convert YYYY-MM-DD (ISO format) to DD/MM/YYYY format
 */
export const convertDateFromISO = (dateStr: string): string => {
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }
  return dateStr;
};
