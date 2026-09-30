export type UserProfile = {
  id: string;
  name: string;
  email: string;
  document: string;
  profilePicture: string;
};

export type UpdateProfileInput = {
  name?: string;
  email?: string;
  document?: string;
  password?: string;
  file?: File | null;
};
