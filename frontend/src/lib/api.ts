const API_URL = import.meta.env.VITE_API_URL || '/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null;

  constructor() {
    this.baseURL = API_URL;
    this.token = localStorage.getItem('token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { error: errorData.detail || 'An error occurred' };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('API request error:', error);
      return { error: 'Network error' };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Auth endpoints
  async register(phone_number: string, username: string, password: string) {
    return this.post<{ access_token: string; token_type: string }>('/auth/register', {
      phone_number,
      username,
      password,
    });
  }

  async login(username: string, password: string) {
    return this.post<{ access_token: string; token_type: string }>('/auth/login', {
      username,
      password,
    });
  }

  async autoLogin(shahrzaad_id: string) {
    return this.post<{ access_token: string; token_type: string }>('/auth/auto-login', {
      shahrzaad_id,
    });
  }

  async getCurrentUser() {
    return this.get<User>('/auth/me');
  }

  // Conversations endpoints
  async getConversations() {
    return this.get<ChatSession[]>('/conversations');
  }

  async createConversation(title: string = 'چت جدید') {
    return this.post<ChatSession>('/conversations', { title });
  }

  async deleteConversation(sessionId: string) {
    return this.delete(`/conversations/${sessionId}`);
  }

  async getMessages(sessionId: string) {
    return this.get<Message[]>(`/conversations/${sessionId}/messages`);
  }

  async createMessage(sessionId: string, content: string, is_user: boolean) {
    return this.post<Message>(`/conversations/${sessionId}/messages`, {
      content,
      is_user,
    });
  }

  // Chat endpoint
  async chat(session_id: string, message: string) {
    return this.post<{ response: string }>('/chat', {
      session_id,
      message,
    });
  }
}

export const apiClient = new ApiClient();

export interface User {
  id: string;
  phone_number: string;
  username: string | null;
  is_registered: boolean;
  created_at: string;
  last_login: string;
}

export interface ChatSession {
  id: string;
  title: string;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  session_id: string;
  content: string;
  is_user: boolean;
  created_at: string;
}
