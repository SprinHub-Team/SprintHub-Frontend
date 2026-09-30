export type ApiMessageResponse = {
  message: string;
};

export type ApiDataResponse<TData> = {
  data: TData;
};

export type ApiDataMessageResponse<TData> = {
  data: TData;
  message: string;
};

export type ApiErrorBody = {
  message?: string;
  errors?: unknown;
};
