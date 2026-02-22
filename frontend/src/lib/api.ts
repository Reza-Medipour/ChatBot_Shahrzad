// Dynamic API URL based on current location
const getApiUrl = () => {
  // If running in development with VITE_API_URL env var
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // In production, use same host as frontend
  // This works whether accessed via localhost, IP, or domain
  const origin = window.location.origin;
  return `${origin}/api`;
};

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiClient {
  private baseURL: string;
  private userId: string;

  constructor() {
    this.baseURL = getApiUrl();

    let userId = localStorage.getItem('user_id');
    if (!userId) {
      userId = this.generateUserId();
      localStorage.setItem('user_id', userId);
    }
    this.userId = userId;

    console.log('API Base URL:', this.baseURL);
    console.log('User ID:', this.userId);
  }

  private generateUserId(): string {
    return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  getUserId(): string {
    return this.userId;
  }

  regenerateUserId(): string {
    const newUserId = this.generateUserId();
    localStorage.setItem('user_id', newUserId);
    this.userId = newUserId;
    return newUserId;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-User-Id': this.userId,
      ...options.headers,
    };

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
