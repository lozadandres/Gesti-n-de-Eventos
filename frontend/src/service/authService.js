// Servicio de autenticación para manejar tokens JWT

const API_URL = "http://localhost:5000";

// Función para verificar si el token está expirado
export const isTokenExpired = (token) => {
    if (!token) return true;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        return payload.exp < currentTime;
    } catch (error) {
        return true;
    }
};

// Función para obtener el tiempo restante del token en minutos
export const getTokenRemainingTime = (token) => {
    if (!token) return 0;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        const remainingTime = payload.exp - currentTime;
        return Math.max(0, Math.floor(remainingTime / 60)); // Convertir a minutos
    } catch (error) {
        return 0;
    }
};

// Función para refrescar el token (si el backend lo soporta)
export const refreshToken = async () => {
    try {
        const currentToken = localStorage.getItem('token');
        if (!currentToken) return null;

        const response = await fetch(`${API_URL}/refresh-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentToken}`
            }
        });

        if (!response.ok) {
            throw new Error('No se pudo refrescar el token');
        }

        const data = await response.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
            return data.token;
        }
        
        return null;
    } catch (error) {
        console.error('Error al refrescar token:', error);
        return null;
    }
};

// Función para cerrar sesión
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
};

// Función para obtener headers con autenticación
export const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};

// Función para manejar errores de autenticación
export const handleAuthError = (response, navigate) => {
    if (response.status === 401) {
        logout();
        throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
    }
    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response;
};