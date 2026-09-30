import type { ColumnDto } from '@/features/columns/types/column.dto';

export type BoardDto = {
  id: string;
  title: string;
  description: string;
  groupId: string;
};

export type BoardDetailsDto = BoardDto & {
  columns: ColumnDto[];
};

export type BoardTemplateDto = {
  id: string;
  name: string;
  description: string;
  columns: { title: string; order: number }[];
};
