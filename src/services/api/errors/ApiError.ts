export type ApiIssue = {
  path: string;
  message: string;
};

export type ApiErrorCode =
  | 'validation'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'conflict'
  | 'server'
  | 'network'
  | 'unknown';

export type ApiErrorParams = {
  message: string;
  code: ApiErrorCode;
  status?: number;
  issues?: ApiIssue[];
};

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;
  readonly issues: ApiIssue[];

  constructor(params: ApiErrorParams) {
    super(params.message);
    this.name = 'ApiError';
    this.code = params.code;
    this.status = params.status ?? 0;
    this.issues = params.issues ?? [];
  }

  get isUnauthorized(): boolean {
    return this.code === 'unauthorized';
  }

  get isNetworkError(): boolean {
    return this.code === 'network';
  }

  get hasValidationIssues(): boolean {
    return this.issues.length > 0;
  }
}
