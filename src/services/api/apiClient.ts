import axios from 'axios';
import env  from '@/config/env';
import { toApiError } from './errors/errorHandler'
import { useAuthStore } from '@/features/auth/store/authStore';

const apiClient = axios.create({
    baseURL: env.apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) =>{
    const token = useAuthStore.getState().token;

    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;

});

apiClient.interceptors.response.use(
    response => response,
    error => Promise.reject(toApiError(error)),
);

export default apiClient;