// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// API utility class
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Generic request method with automatic token refresh
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // If token expired, try to refresh
        if (response.status === 401 && localStorage.getItem('refresh_token') && !endpoint.includes('/auth/refresh')) {
          try {
            const refreshResponse = await this.auth.refreshToken();
            if (refreshResponse.token) {
              // Retry the original request with new token
              const newConfig = {
                ...config,
                headers: {
                  ...config.headers,
                  Authorization: `Bearer ${refreshResponse.token}`
                }
              };
              const retryResponse = await fetch(url, newConfig);
              const retryData = await retryResponse.json();
              
              if (!retryResponse.ok) {
                throw new Error(retryData.message || `HTTP error! status: ${retryResponse.status}`);
              }
              return retryData;
            }
          } catch (refreshError) {
            // Refresh failed, clear tokens and redirect to login
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/signin';
            throw new Error('Session expired. Please login again.');
          }
        }
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  auth = {
    register: async (userData) => {
      return this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    },

    login: async (credentials) => {
      const response = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
        if (response.refreshToken) {
          localStorage.setItem('refresh_token', response.refreshToken);
        }
      }
      
      return response;
    },

    logout: async () => {
      try {
        await this.request('/auth/logout', { method: 'POST' });
      } finally {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
      }
    },

    getMe: async () => {
      return this.request('/auth/me');
    },

    updateMe: async (userData) => {
      return this.request('/auth/me', {
        method: 'PATCH',
        body: JSON.stringify(userData),
      });
    },

    updatePassword: async (passwordData) => {
      return this.request('/auth/update-password', {
        method: 'PATCH',
        body: JSON.stringify(passwordData),
      });
    },

    forgotPassword: async (email) => {
      return this.request('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    },

    resetPassword: async (token, password) => {
      return this.request(`/auth/reset-password/${token}`, {
        method: 'PATCH',
        body: JSON.stringify({ password }),
      });
    },

    refreshToken: async () => {
      const refreshToken = localStorage.getItem('refresh_token');
      const response = await this.request('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });
      
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
        if (response.refreshToken) {
          localStorage.setItem('refresh_token', response.refreshToken);
        }
      }
      
      return response;
    },
  };

  // User endpoints
  users = {
    getProfile: async () => {
      return this.request('/users/profile');
    },

    updateProfile: async (profileData) => {
      return this.request('/users/profile', {
        method: 'PATCH',
        body: JSON.stringify(profileData),
      });
    },

    getDashboard: async () => {
      return this.request('/users/dashboard');
    },

    getStats: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return this.request(`/users/stats?${query}`);
    },

    getActivity: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return this.request(`/users/activity?${query}`);
    },

    getSettings: async () => {
      return this.request('/users/settings');
    },

    updateSettings: async (settings) => {
      return this.request('/users/settings', {
        method: 'PATCH',
        body: JSON.stringify(settings),
      });
    },

    getCreations: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return this.request(`/users/creations?${query}`);
    },

    getPosts: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return this.request(`/users/posts?${query}`);
    },

    uploadAvatar: async (file) => {
      const formData = new FormData();
      formData.append('avatar', file);
      
      return this.request('/users/avatar', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: formData,
      });
    },
  };

  // Creation endpoints
  creations = {
    create: async (creationData) => {
      return this.request('/creations', {
        method: 'POST',
        body: JSON.stringify(creationData),
      });
    },

    getAll: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return this.request(`/creations?${query}`);
    },

    getById: async (id) => {
      return this.request(`/creations/${id}`);
    },

    update: async (id, updateData) => {
      return this.request(`/creations/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      });
    },

    delete: async (id) => {
      return this.request(`/creations/${id}`, {
        method: 'DELETE',
      });
    },

    generateImage: async (prompt, options = {}) => {
      return this.request('/creations/generate/image', {
        method: 'POST',
        body: JSON.stringify({ prompt, ...options }),
      });
    },

    generateVideo: async (prompt, options = {}) => {
      return this.request('/creations/generate/video', {
        method: 'POST',
        body: JSON.stringify({ prompt, ...options }),
      });
    },
  };

  // Post endpoints
  posts = {
    create: async (postData) => {
      return this.request('/posts', {
        method: 'POST',
        body: JSON.stringify(postData),
      });
    },

    getAll: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return this.request(`/posts?${query}`);
    },

    getById: async (id) => {
      return this.request(`/posts/${id}`);
    },

    update: async (id, updateData) => {
      return this.request(`/posts/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      });
    },

    delete: async (id) => {
      return this.request(`/posts/${id}`, {
        method: 'DELETE',
      });
    },

    publish: async (id) => {
      return this.request(`/posts/${id}/publish`, {
        method: 'POST',
      });
    },

    getScheduled: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return this.request(`/posts/scheduled?${query}`);
    },

    updateEngagement: async (id, engagementData) => {
      return this.request(`/posts/${id}/engagement`, {
        method: 'PATCH',
        body: JSON.stringify(engagementData),
      });
    },

    getStats: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return this.request(`/posts/stats?${query}`);
    },
  };

  // Social endpoints
  social = {
    connectAccount: async (accountData) => {
      return this.request('/social/connect', {
        method: 'POST',
        body: JSON.stringify(accountData),
      });
    },

    getAccounts: async () => {
      return this.request('/social/accounts');
    },

    getAccount: async (id) => {
      return this.request(`/social/accounts/${id}`);
    },

    updateAccount: async (id, updateData) => {
      return this.request(`/social/accounts/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      });
    },

    disconnectAccount: async (id) => {
      return this.request(`/social/accounts/${id}`, {
        method: 'DELETE',
      });
    },

    syncAccount: async (id) => {
      return this.request(`/social/accounts/${id}/sync`, {
        method: 'POST',
      });
    },

    getStats: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return this.request(`/social/stats?${query}`);
    },

    getInsights: async (platform, params = {}) => {
      const query = new URLSearchParams(params).toString();
      return this.request(`/social/insights/${platform}?${query}`);
    },
  };

  // Analytics endpoints
  analytics = {
    getOverview: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return this.request(`/analytics/overview?${query}`);
    },

    getCreations: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return this.request(`/analytics/creations?${query}`);
    },

    getPosts: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return this.request(`/analytics/posts?${query}`);
    },

    getUsage: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return this.request(`/analytics/usage?${query}`);
    },

    getPlatforms: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return this.request(`/analytics/platforms?${query}`);
    },

    getTrends: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return this.request(`/analytics/trends?${query}`);
    },

    getEntity: async (entityType, entityId, params = {}) => {
      const query = new URLSearchParams(params).toString();
      return this.request(`/analytics/entity/${entityType}/${entityId}?${query}`);
    },

    export: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return this.request(`/analytics/export?${query}`);
    },
  };

  // Templates endpoints
  templates = {
    getAll: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return this.request(`/templates?${query}`);
    },

    getById: async (id) => {
      return this.request(`/templates/${id}`);
    },

    create: async (templateData) => {
      return this.request('/templates', {
        method: 'POST',
        body: JSON.stringify(templateData),
      });
    },

    update: async (id, updateData) => {
      return this.request(`/templates/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      });
    },

    delete: async (id) => {
      return this.request(`/templates/${id}`, {
        method: 'DELETE',
      });
    },

    clone: async (id) => {
      return this.request(`/templates/${id}/clone`, {
        method: 'POST',
      });
    },
  };
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
