// API Configuration
const API_BASE_URL = window.location.port === '5500' ? 'http://localhost:3000/api' : '/api';

// Utility functions
const showMessage = (message, type = 'info') => {
    const messageDiv = document.createElement('div');
    messageDiv.className = `alert alert-${type === 'error' ? 'danger' : type}`;
    messageDiv.textContent = message;
    
    // Insert at top of body
    document.body.insertBefore(messageDiv, document.body.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
};

const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

const setAuthToken = (token) => {
    localStorage.setItem('authToken', token);
};

const removeAuthToken = () => {
    localStorage.removeItem('authToken');
};

const isAuthenticated = () => {
    return !!getAuthToken();
};

const getUserRole = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role;
};

// API request helper
const apiRequest = async (endpoint, options = {}) => {
    const token = getAuthToken();
    
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        },
        ...options
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
};

// Authentication API
const authAPI = {
    // User registration
    register: async (userData) => {
        return await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    // User login
    login: async (credentials) => {
        const response = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
        
        // Store token and user data
        setAuthToken(response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        return response;
    },

    // User logout
    logout: async () => {
        try {
            await apiRequest('/auth/logout', { method: 'POST' });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            removeAuthToken();
            localStorage.removeItem('user');
            window.location.href = '/login.html';
        }
    },

    // Get user profile
    getProfile: async () => {
        return await apiRequest('/auth/profile');
    },

    // Change password
    changePassword: async (passwordData) => {
        return await apiRequest('/auth/change-password', {
            method: 'PUT',
            body: JSON.stringify(passwordData)
        });
    }
};

// Contact API
const contactAPI = {
    // Submit contact form
    submit: async (contactData) => {
        return await apiRequest('/contact/submit', {
            method: 'POST',
            body: JSON.stringify(contactData)
        });
    },

    // Get contact statistics
    getStats: async () => {
        return await apiRequest('/contact/stats');
    }
};

// Admin API
const adminAPI = {
    // Get all contacts
    getContacts: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return await apiRequest(`/admin/contacts?${queryString}`);
    },

    // Get single contact
    getContact: async (id) => {
        return await apiRequest(`/admin/contacts/${id}`);
    },

    // Update contact status
    updateContactStatus: async (id, status) => {
        return await apiRequest(`/admin/contacts/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
    },

    // Add note to contact
    addNote: async (id, note) => {
        return await apiRequest(`/admin/contacts/${id}/note`, {
            method: 'POST',
            body: JSON.stringify({ note })
        });
    },

    // Delete contact
    deleteContact: async (id) => {
        return await apiRequest(`/admin/contacts/${id}`, {
            method: 'DELETE'
        });
    },

    // Get dashboard statistics
    getDashboardStats: async () => {
        return await apiRequest('/admin/dashboard');
    },

    // Get all users
    getUsers: async () => {
        return await apiRequest('/admin/users');
    }
};

// Form handling utilities
const handleFormSubmit = async (formElement, apiFunction, successMessage) => {
    const formData = new FormData(formElement);
    const data = Object.fromEntries(formData.entries());
    
    try {
        await apiFunction(data);
        showMessage(successMessage, 'success');
        formElement.reset();
        return true;
    } catch (error) {
        showMessage(error.message, 'error');
        return false;
    }
};

// Navigation utilities
const redirectIfNotAuthenticated = () => {
    if (!isAuthenticated()) {
        window.location.href = '/login.html';
    }
};

const redirectIfNotOwner = () => {
    if (!isAuthenticated() || getUserRole() !== 'owner') {
        window.location.href = '/dashboard.html';
    }
};

// Export for use in other scripts
window.API = {
    auth: authAPI,
    contact: contactAPI,
    admin: adminAPI,
    utils: {
        showMessage,
        getAuthToken,
        setAuthToken,
        removeAuthToken,
        isAuthenticated,
        getUserRole,
        handleFormSubmit,
        redirectIfNotAuthenticated,
        redirectIfNotOwner
    }
};
