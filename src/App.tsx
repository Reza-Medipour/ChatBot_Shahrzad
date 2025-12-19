import { useState, useEffect } from 'react';
import WelcomePage from './components/WelcomePage';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import { supabase, ChatSession, Message } from './lib/supabase';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    if (currentSessionId) {
      loadMessages(currentSessionId);
    }
  }, [currentSessionId]);

  const loadSessions = async () => {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error loading sessions:', error);
      return;
    }

    setSessions(data || []);
  };

  const loadMessages = async (sessionId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading messages:', error);
      return;
    }

    setMessages(data || []);
  };

  const createNewSession = async () => {
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert([{ title: 'چت جدید' }])
      .select()
      .single();

    if (error) {
      console.error('Error creating session:', error);
      return;
    }

    setSessions((prev) => [data, ...prev]);
    setCurrentSessionId(data.id);
    setMessages([]);
    setShowWelcome(false);
  };

  const handleStartChat = async () => {
    await createNewSession();
  };

  const handleNewChat = async () => {
    await createNewSession();
  };

  const handleSelectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setShowWelcome(false);
  };

  const handleBackToWelcome = () => {
    setShowWelcome(true);
    setCurrentSessionId(null);
    setMessages([]);
    setIsSidebarOpen(false);
  };

  const handleDeleteSession = async (sessionId: string) => {
    const { error } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('id', sessionId);

    if (error) {
      console.error('Error deleting session:', error);
      return;
    }

    setSessions((prev) => prev.filter((s) => s.id !== sessionId));

    if (currentSessionId === sessionId) {
      setCurrentSessionId(null);
      setMessages([]);
      if (sessions.length <= 1) {
        setShowWelcome(true);
      }
    }
  };

  const generateBotResponse = async (userMessage: string, sessionId: string): Promise<string> => {
    try {
      const apiUrl = import.meta.env.VITE_CHAT_API_URL || 'http://103.75.196.71:8020/chat';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          message: userMessage,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from chat API');
      }

      const data = await response.json();
      return data.response || data.message || 'متاسفانه در حال حاضر قادر به پاسخگویی نیستم. لطفا دوباره تلاش کنید.';
    } catch (error) {
      console.error('Error calling chat API:', error);
      return 'متاسفانه در ارتباط با سرور مشکلی پیش آمد. لطفا دوباره تلاش کنید.';
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!currentSessionId) return;

    setIsLoading(true);

    const { data: userMessage, error: userError } = await supabase
      .from('messages')
      .insert([
        {
          session_id: currentSessionId,
          content,
          is_user: true,
        },
      ])
      .select()
      .single();

    if (userError) {
      console.error('Error sending message:', error);
      setIsLoading(false);
      return;
    }

    setMessages((prev) => [...prev, userMessage]);

    const firstMessage = messages.length === 0;
    if (firstMessage) {
      const title = content.substring(0, 50) + (content.length > 50 ? '...' : '');
      await supabase
        .from('chat_sessions')
        .update({ title, updated_at: new Date().toISOString() })
        .eq('id', currentSessionId);

      setSessions((prev) =>
        prev.map((s) => (s.id === currentSessionId ? { ...s, title } : s))
      );
    } else {
      await supabase
        .from('chat_sessions')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', currentSessionId);
    }

    await loadSessions();

    setTimeout(async () => {
      const botResponse = await generateBotResponse(content, currentSessionId);

      const { data: botMessage, error: botError } = await supabase
        .from('messages')
        .insert([
          {
            session_id: currentSessionId,
            content: botResponse,
            is_user: false,
          },
        ])
        .select()
        .single();

      if (botError) {
        console.error('Error sending bot message:', botError);
      } else {
        setMessages((prev) => [...prev, botMessage]);
      }

      setIsLoading(false);
    }, 500);
  };

  if (showWelcome) {
    return <WelcomePage onStartChat={handleStartChat} />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        onBackToWelcome={handleBackToWelcome}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <ChatInterface
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        onOpenSidebar={() => setIsSidebarOpen(true)}
      />
    </div>
  );
}

export default App;
