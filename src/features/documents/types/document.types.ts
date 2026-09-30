export type DocumentUploaderDto = {
  id: string;
  name: string;
  email: string;
};

export type ProjectDocumentDto = {
  id: string;
  title: string;
  fileName: string;
  fileUrl: string;
  groupId: string;
  uploadedBy: DocumentUploaderDto;
  createdAt: string;
  updatedAt: string;
};
