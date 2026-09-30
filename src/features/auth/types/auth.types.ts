export type AuthSession = {
  token: string;
  user: SessionUser;
};

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  document: string;
  password: string;
  file?: File | null;
};
