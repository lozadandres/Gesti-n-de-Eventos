// Crear la URL base de la API
const API_URL = "http://localhost:5000/items";

// Función auxiliar para obtener el token de autenticación
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};

// Función auxiliar para manejar errores de autenticación
const handleAuthError = (response) => {
    if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
    }
    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response;
};

// Función para verificar y refrescar token si es necesario
const checkAndRefreshToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        const timeUntilExpiry = payload.exp - currentTime;
        
        // Si el token expira en menos de 5 minutos, intentar refrescarlo
        if (timeUntilExpiry < 300) {
            const response = await fetch('http://localhost:5000/refresh-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }
            }
        }
    } catch (error) {
        console.error('Error al verificar/refrescar token:', error);
    }
};

// Función para obtener todos los elementos
export const getItems = async () => {
    try {
        // Verificar y refrescar token si es necesario
        await checkAndRefreshToken();
        
        const response = await fetch(API_URL, {
            headers: getAuthHeaders()
        });
        await handleAuthError(response);
        return await response.json();
    } catch (error) {
        console.error('Error al obtener items:', error);
        throw error;
    }
};

// Función para agregar un nuevo evento
export const addItem = async (item) => {
    try {
        // Verificar y refrescar token si es necesario
        await checkAndRefreshToken();
        
        const response = await fetch(API_URL, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(item),
        });
        await handleAuthError(response);
        return await response.json();
    } catch (error) {
        console.error('Error al agregar item:', error);
        throw error;
    }
};

// Función para actualizar un evento
export const updateItem = async (id, item) => {
    try {
        // Verificar y refrescar token si es necesario
        await checkAndRefreshToken();
        
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(item)
        });
        await handleAuthError(response);
        return await response.json();
    } catch (error) {
        console.error('Error al actualizar item:', error);
        throw error;
    }
};

// Función para eliminar un evento
export const deleteItem = async (id) => {
    try {
        // Verificar y refrescar token si es necesario
        await checkAndRefreshToken();
        
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });
        await handleAuthError(response);
        return response;
    } catch (error) {
        console.error('Error al eliminar item:', error);
        throw error;
    }
};