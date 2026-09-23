const apiUrl = import.meta.env.VITE_API_URL;
const socketUrl = import.meta.env.VITE_SOCKET_URL;

if(!apiUrl){
    throw new Error("la variable VITE_API_URL no esta configurado");
}

if(!socketUrl){
    throw new Error("la variable VITE_SOCKET_URL no esta configurado");
}

const env = {

    apiUrl,
    socketUrl

} as const;

export default env;