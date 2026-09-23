import axios from 'axios';
import { ApiError } from './ApiError';

export function toApiError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const data = error.response?.data as
            | {
                  message?: string;
                  errors?: string | undefined;
              }
            | undefined;

        const message =
            data?.message ??
            'Ocurrió un error al comunicarse con el servidor.';

        return new ApiError(
            message,
            status,
            undefined,
            data?.errors,
        );
    }

    if (error instanceof Error) {
        return new ApiError(error.message);
    }

    return new ApiError('Ocurrió un error inesperado.');
}