import type { GroupDto, GroupDetailsDto } from './group.dto';

export type Group = GroupDto;

export type GroupDetails = GroupDetailsDto;

export type GroupSummaryView = {
  id: string;
  name: string;
  description: string;
  profilePicture: string;
};

export type { GroupMemberRole, GroupMemberDto } from './group.dto';
