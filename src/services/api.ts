// API service for communicating with the backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Generic API response interface
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  error?: string;
  details?: string[];
}

// Generic API client
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create API client instance
const apiClient = new ApiClient(API_BASE_URL);

// Project API service
export const projectsApi = {
  getAll: () => apiClient.get('/projects'),
  getById: (id: string) => apiClient.get(`/projects/${id}`),
  create: (data: any) => apiClient.post('/projects', data),
  update: (id: string, data: any) => apiClient.put(`/projects/${id}`, data),
  delete: (id: string) => apiClient.delete(`/projects/${id}`),
  getStats: () => apiClient.get('/projects/stats/summary'),
};

// Employee API service
export const employeesApi = {
  getAll: () => apiClient.get('/employees'),
  getById: (id: string) => apiClient.get(`/employees/${id}`),
  create: (data: any) => apiClient.post('/employees', data),
  update: (id: string, data: any) => apiClient.put(`/employees/${id}`, data),
  delete: (id: string) => apiClient.delete(`/employees/${id}`),
  getStats: () => apiClient.get('/employees/stats/summary'),
};

// Assignment API service
export const assignmentsApi = {
  getAll: () => apiClient.get('/assignments'),
  getById: (id: string) => apiClient.get(`/assignments/${id}`),
  create: (data: any) => apiClient.post('/assignments', data),
  update: (id: string, data: any) => apiClient.put(`/assignments/${id}`, data),
  delete: (id: string) => apiClient.delete(`/assignments/${id}`),
  getByProject: (projectId: string) => apiClient.get(`/assignments/project/${projectId}`),
  getByEmployee: (employeeId: string) => apiClient.get(`/assignments/employee/${employeeId}`),
  getStats: () => apiClient.get('/assignments/stats/summary'),
};

// Health check
export const healthApi = {
  check: () => apiClient.get('/health'),
};

export default apiClient;