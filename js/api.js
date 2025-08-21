/*
 * API INTEGRATION - MODIFIED FOR STATIC SITE
 * 
 * This file previously handled API communication with the Node.js backend.
 * For static site conversion, all API functionality has been disabled or
 * replaced with mock implementations for demonstration purposes.
 * 
 * Original functionality included:
 * - Authentication API calls (login, register, logout)
 * - Contact form submission to backend
 * - Admin dashboard data fetching
 * - User management operations
 * - JWT token management
 * 
 * Current static site modifications:
 * - API calls return mock data or success messages
 * - Form submissions show success messages without backend processing
 * - Authentication is simulated with localStorage
 * - Dashboard data is static/demo data
 */

// Mock API Configuration - No actual backend calls
const API_BASE_URL = '/api'; // Not used in static site

// Utility functions for UI feedback
const showMessage = (message, type = 'info') => {
    // Create a message element to show user feedback
    const messageDiv = document.createElement('div');
    messageDiv.className = `alert alert-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'}`;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        padding: 15px 20px;
        border-radius: 4px;
        max-width: 400px;
        font-family: Arial, sans-serif;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        ${type === 'success' ? 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;' :
          type === 'error' ? 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;' :
          'background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb;'}
    `;
    messageDiv.textContent = message;
    
    // Insert at top of body
    document.body.appendChild(messageDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
};

// Mock authentication functions for demo purposes
const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

const setAuthToken = (token) => {
    localStorage.setItem('authToken', token);
};

const removeAuthToken = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
};

const isAuthenticated = () => {
    return !!getAuthToken();
};

const getUserRole = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role;
};

// Mock API functions - These provide demo functionality without backend
const authAPI = {
    // Mock login - creates demo session
    login: async (credentials) => {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        
        // Demo login - accept any credentials for demonstration
        if (credentials.username && credentials.password) {
            const mockToken = 'demo-jwt-token-' + Date.now();
            const mockUser = {
                id: 1,
                username: credentials.username,
                email: credentials.username + '@example.com',
                role: credentials.username.toLowerCase() === 'admin' ? 'owner' : 'member'
            };
            
            setAuthToken(mockToken);
            localStorage.setItem('user', JSON.stringify(mockUser));
            
            showMessage('Login successful! (Demo mode - no actual authentication)', 'success');
            return {
                message: 'Login successful',
                token: mockToken,
                user: mockUser
            };
        } else {
            throw new Error('Username and password are required');
        }
    },

    // Mock registration
    register: async (userData) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (!userData.username || !userData.email || !userData.password) {
            throw new Error('All fields are required');
        }
        
        showMessage('Registration successful! (Demo mode - no actual account created)', 'success');
        return {
            message: 'User registered successfully',
            userId: Date.now()
        };
    },

    // Mock logout
    logout: async () => {
        removeAuthToken();
        showMessage('Logout successful!', 'success');
        return { message: 'Logout successful' };
    },

    // Mock profile fetch
    getProfile: async () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return { user };
    }
};

// Mock contact API
const contactAPI = {
    // Mock contact form submission
    submit: async (contactData) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (!contactData.name || !contactData.email || !contactData.subject || !contactData.message) {
            throw new Error('All required fields must be filled');
        }
        
        // In a real application, this would send to a backend or form service
        showMessage('Thank you for your message! We will get back to you soon. (Demo mode - no actual submission)', 'success');
        
        return {
            message: 'Contact form submitted successfully',
            id: Date.now()
        };
    },

    // Mock stats
    getStats: async () => {
        return {
            totalContacts: 42,
            newContacts: 5,
            responseRate: '85%'
        };
    }
};

// Mock admin API
const adminAPI = {
    // Mock contact list
    getContacts: async (params = {}) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Return demo data
        const mockContacts = [
            {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                subject: 'GST Services Inquiry',
                message: 'I need help with GST filing...',
                status: 'new',
                created_at: new Date().toISOString()
            },
            {
                id: 2,
                name: 'Jane Smith',
                email: 'jane@example.com',
                subject: 'MCA Compliance',
                message: 'Looking for MCA compliance services...',
                status: 'read',
                created_at: new Date(Date.now() - 86400000).toISOString()
            }
        ];
        
        return {
            contacts: mockContacts,
            pagination: {
                page: 1,
                limit: 20,
                total: mockContacts.length,
                pages: 1
            }
        };
    },

    // Mock dashboard stats
    getDashboardStats: async () => {
        return {
            totalContacts: 42,
            statusStats: [
                { status: 'new', count: 12 },
                { status: 'read', count: 15 },
                { status: 'replied', count: 10 },
                { status: 'closed', count: 5 }
            ],
            recentContacts: 8,
            activeDays: [
                { date: '2024-01-20', count: 3 },
                { date: '2024-01-19', count: 5 },
                { date: '2024-01-18', count: 2 }
            ]
        };
    },

    // Mock contact operations
    updateContactStatus: async (id, status) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        showMessage(`Contact status updated to ${status} (Demo mode)`, 'success');
        return { message: 'Contact status updated successfully' };
    },

    deleteContact: async (id) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        showMessage('Contact deleted (Demo mode)', 'success');
        return { message: 'Contact deleted successfully' };
    }
};

// Form handling utilities for static site
const handleFormSubmit = async (formElement, apiFunction, successMessage) => {
    const formData = new FormData(formElement);
    const data = Object.fromEntries(formData.entries());
    
    try {
        // Show loading state
        const submitButton = formElement.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;
        
        await apiFunction(data);
        
        if (successMessage) {
            showMessage(successMessage, 'success');
        }
        
        formElement.reset();
        
        // Restore button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        return true;
    } catch (error) {
        // Restore button state
        const submitButton = formElement.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.textContent = submitButton.textContent.replace('Submitting...', 'Submit');
            submitButton.disabled = false;
        }
        
        showMessage(error.message, 'error');
        return false;
    }
};

// Navigation utilities
const redirectIfNotAuthenticated = () => {
    if (!isAuthenticated()) {
        showMessage('Please log in to access this page', 'error');
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 2000);
    }
};

const redirectIfNotOwner = () => {
    if (!isAuthenticated() || getUserRole() !== 'owner') {
        showMessage('Admin access required', 'error');
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 2000);
    }
};

// Static site deployment note
console.log('🚀 STATIC SITE MODE: All API functionality is simulated for demonstration purposes.');
console.log('📝 For production deployment, integrate with:');
console.log('   - Static form services (Netlify Forms, Formspree, EmailJS)');
console.log('   - Authentication services (Auth0, Firebase Auth)');
console.log('   - Headless CMS (Strapi, Contentful, Sanity)');
console.log('   - Serverless functions for dynamic functionality');

// Export APIs for use in other scripts
window.authAPI = authAPI;
window.contactAPI = contactAPI;
window.adminAPI = adminAPI;
window.showMessage = showMessage;
window.handleFormSubmit = handleFormSubmit;
window.isAuthenticated = isAuthenticated;
window.getUserRole = getUserRole;
window.redirectIfNotAuthenticated = redirectIfNotAuthenticated;
window.redirectIfNotOwner = redirectIfNotOwner;