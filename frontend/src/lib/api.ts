import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const LLM_API_URL = 'http://103.75.196.71:8020/chat';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiClient {
  private shahrzaadId: string | null;

  constructor() {
    this.shahrzaadId = localStorage.getItem('shahrzaad_id') || 'default_user';
  }

  setToken(token: string | null) {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setShahrzaadId(id: string) {
    this.shahrzaadId = id;
    localStorage.setItem('shahrzaad_id', id);
  }

  getShahrzaadId(): string {
    return this.shahrzaadId || 'default_user';
  }

  async autoLogin(shahrzaad_id: string) {
    this.setShahrzaadId(shahrzaad_id);
    return { data: { access_token: 'guest_token_' + Date.now(), token_type: 'bearer' } };
  }

  async getCurrentUser() {
    return {
      data: {
        id: this.shahrzaadId || 'default_user',
        shahrzaad_id: this.shahrzaadId,
        username: 'Guest User',
        is_registered: false,
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      }
    };
  }

  async getConversations(): Promise<ApiResponse<ChatSession[]>> {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('shahrzaad_id', this.getShahrzaadId())
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error loading conversations:', error);
        return { error: error.message };
      }

      return { data: data || [] };
    } catch (error) {
      console.error('Error loading conversations:', error);
      return { error: 'Failed to load conversations' };
    }
  }

  async createConversation(title: string = 'گفتگوی جدید'): Promise<ApiResponse<ChatSession>> {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          title,
          shahrzaad_id: this.getShahrzaadId()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating conversation:', error);
        return { error: error.message };
      }

      return { data };
    } catch (error) {
      console.error('Error creating conversation:', error);
      return { error: 'Failed to create conversation' };
    }
  }

  async deleteConversation(sessionId: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) {
        console.error('Error deleting conversation:', error);
        return { error: error.message };
      }

      return { data: undefined };
    } catch (error) {
      console.error('Error deleting conversation:', error);
      return { error: 'Failed to delete conversation' };
    }
  }

  async getMessages(sessionId: string): Promise<ApiResponse<Message[]>> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        return { error: error.message };
      }

      return { data: data || [] };
    } catch (error) {
      console.error('Error loading messages:', error);
      return { error: 'Failed to load messages' };
    }
  }

  async createMessage(sessionId: string, content: string, is_user: boolean): Promise<ApiResponse<Message>> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          session_id: sessionId,
          content,
          is_user
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating message:', error);
        return { error: error.message };
      }

      await supabase
        .from('chat_sessions')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', sessionId);

      return { data };
    } catch (error) {
      console.error('Error creating message:', error);
      return { error: 'Failed to create message' };
    }
  }

  async chat(session_id: string, message: string): Promise<ApiResponse<{ response: string }>> {
    try {
      const response = await fetch(LLM_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id,
          message,
        }),
      });

      if (!response.ok) {
        return { error: 'Failed to get response from LLM' };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('Error calling LLM:', error);
      return { error: 'Failed to get response from LLM' };
    }
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
