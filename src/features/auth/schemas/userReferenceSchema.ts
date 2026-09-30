import { z } from 'zod';

export const userReferenceSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  profilePicture: z.string(),
});
