import { z } from 'zod';

export const userProfileDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  document: z.string(),
  profilePicture: z.string(),
});

export type UserProfileDto = z.infer<typeof userProfileDtoSchema>;
