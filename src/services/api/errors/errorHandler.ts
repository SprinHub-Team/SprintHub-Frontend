import axios from 'axios';
import { ApiError } from './ApiError';

export function toApiError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        const message =
            error.response?.data?.message ??
            'Ocurrió un error al comunicarse con el servidor.';

        return new ApiError(message, status);
    }

    if (error instanceof Error) {
        return new ApiError(error.message);
    }

    return new ApiError('Ocurrió un error inesperado.');
}