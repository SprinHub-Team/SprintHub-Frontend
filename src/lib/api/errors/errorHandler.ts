import { ZodError } from 'zod';
import { ApiError, type ApiIssue } from './ApiError';
import type { ApiErrorBody } from '../types/ApiResponse';

interface HttpResponseLike {
  status: number;
  data: unknown;
}

interface ErrorWithResponse {
  response: HttpResponseLike;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function hasResponse(value: unknown): value is ErrorWithResponse {
  return isObject(value) && 'response' in value && isObject(value.response);
}

function extractIssues(errors: unknown): ApiIssue[] {
  if (!Array.isArray(errors)) {
    return [];
  }

  return errors
    .filter((issue): issue is Record<string, unknown> => isObject(issue))
    .map((issue) => ({
      path: Array.isArray(issue.path) ? issue.path.join('.') : String(issue.path ?? ''),
      message: typeof issue.message === 'string' ? issue.message : '',
    }))
    .filter((issue) => issue.message.length > 0);
}

function codeFromStatus(status: number): ApiError['code'] {
  switch (status) {
    case 400:
      return 'validation';
    case 401:
      return 'unauthorized';
    case 403:
      return 'forbidden';
    case 404:
      return 'not_found';
    case 409:
      return 'conflict';
    default:
      return status >= 500 ? 'server' : 'unknown';
  }
}

function messageFromStatus(status: number): string {
  switch (status) {
    case 400:
      return 'Los datos enviados no son válidos';
    case 401:
      return 'No autorizado: la sesión no es válida';
    case 403:
      return 'No tienes permisos para realizar esta acción';
    case 404:
      return 'El recurso solicitado no existe';
    case 409:
      return 'El recurso ya existe o hay un conflicto con los datos';
    default:
      return 'Error del servidor al procesar la solicitud';
  }
}

export function errorHandler(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof ZodError) {
    return new ApiError({
      message: 'Los datos recibidos no tienen el formato esperado',
      code: 'validation',
      issues: error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  if (hasResponse(error)) {
    const status = error.response.status;
    const body = isObject(error.response.data)
      ? (error.response.data as ApiErrorBody)
      : {};

    const issues = extractIssues(body.errors);

    return new ApiError({
      message: typeof body.message === 'string' && body.message.length > 0
        ? body.message
        : messageFromStatus(status),
      code: codeFromStatus(status),
      status,
      issues,
    });
  }

  if (error instanceof Error && error.message.toLowerCase().includes('network')) {
    return new ApiError({
      message: 'No fue posible conectar con el servidor de SprintHub',
      code: 'network',
    });
  }

  if (error instanceof Error) {
    return new ApiError({
      message: error.message,
      code: 'unknown',
    });
  }

  return new ApiError({
    message: 'Ocurrió un error inesperado',
    code: 'unknown',
  });
}
