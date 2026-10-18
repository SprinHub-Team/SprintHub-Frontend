import type { UserReference } from '@/features/auth/types/user.types';

export type GroupMemberRole = 'admin' | 'collaborator';

export type GroupMemberDto = {
  id: string;
  name: string;
  email: string;
  role: GroupMemberRole;
};

export type GroupDto = {
  id: string;
  name: string;
  description: string;
  profilePicture: string;
};

export type GroupDetailsDto = GroupDto & {
  members: GroupMemberDto[];
};

export type GroupMemberReference = {
  user: UserReference;
  role: GroupMemberRole;
};
