import axios from 'axios';
import env  from '@/config/env';
import { toApiError } from './errors/errorHandler'

const apiClient = axios.create({
    baseURL: env.apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.response.use(
    response => response,
    error => Promise.reject(toApiError(error))
)

export default apiClient;