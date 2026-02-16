import { useState, useEffect } from 'react';
import WelcomePage from './components/WelcomePage';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import { apiClient, ChatSession, Message } from './lib/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Auto-login with shahrzaad_id
  useEffect(() => {
    const initializeAuth = async () => {
      const token = apiClient.getToken();

      if (token) {
        setIsAuthenticated(true);
        setIsInitializing(false);
        return;
      }

      // TODO: Get shahrzaad_id from query params or other source
      // For now, using default shahrzaad_id
      const defaultShahrzaadId = 'default_user';

      const { data, error } = await apiClient.autoLogin(defaultShahrzaadId);

      if (data && data.access_token) {
        apiClient.setToken(data.access_token);
        setIsAuthenticated(true);
      } else {
        console.error('Auto-login failed, using guest mode:', error);
        // Use a dummy token for guest mode so the app can work without backend
        apiClient.setToken('guest_token_' + Date.now());
        setIsAuthenticated(true);
      }

      setIsInitializing(false);
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    if (currentSessionId) {
      loadMessages(currentSessionId);
    }
  }, [currentSessionId]);

  const loadSessions = async () => {
    const { data, error } = await apiClient.getConversations();

    if (error) {
      console.error('Error loading sessions:', error);
      return;
    }

    setSessions(data || []);
  };

  const loadMessages = async (sessionId: string) => {
    const { data, error } = await apiClient.getMessages(sessionId);

    if (error) {
      console.error('Error loading messages:', error);
      return;
    }

    setMessages(data || []);
  };

  const createNewSession = async () => {
    const { data, error } = await apiClient.createConversation('چت جدید');

    if (error) {
      console.error('Error creating session:', error);
      return;
    }

    if (data) {
      setSessions((prev) => [data, ...prev]);
      setCurrentSessionId(data.id);
      setMessages([]);
      setShowWelcome(false);
    }
  };

  const handleStartChat = async () => {
    setShowWelcome(false);
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

  const handleLogout = () => {
    apiClient.setToken(null);
    setIsAuthenticated(false);
    setShowWelcome(true);
    setCurrentSessionId(null);
    setMessages([]);
    setSessions([]);
    setIsSidebarOpen(false);
  };

  const handleDeleteSession = async (sessionId: string) => {
    const { error } = await apiClient.deleteConversation(sessionId);

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
    const { data, error } = await apiClient.chat(sessionId, userMessage);

    if (error || !data) {
      console.error('Error calling chat API:', error);
      return 'متاسفانه در ارتباط با سرور مشکلی پیش آمد. لطفا دوباره تلاش کنید.';
    }

    return data.response || 'متاسفانه در حال حاضر قادر به پاسخگویی نیستم. لطفا دوباره تلاش کنید.';
  };

  const handleSendMessage = async (content: string) => {
    if (!currentSessionId) return;

    setIsLoading(true);

    try {
      // Save user message to database
      const { data: userMessage, error: userError } = await apiClient.createMessage(
        currentSessionId,
        content,
        true
      );

      if (userError) {
        console.error('Error saving user message:', userError);
        setIsLoading(false);
        return;
      }

      if (userMessage) {
        setMessages((prev) => [...prev, userMessage]);
      }

      // Update session title if first message
      const firstMessage = messages.length === 0;
      if (firstMessage) {
        const title = content.substring(0, 50) + (content.length > 50 ? '...' : '');
        setSessions((prev) =>
          prev.map((s) => (s.id === currentSessionId ? { ...s, title } : s))
        );
      }

      // Call chat API to get bot response
      const botResponseText = await generateBotResponse(content, currentSessionId);

      // Save bot message to database
      const { data: botMessage, error: botError } = await apiClient.createMessage(
        currentSessionId,
        botResponseText,
        false
      );

      if (botError) {
        console.error('Error saving bot message:', botError);
      }

      if (botMessage) {
        setMessages((prev) => [...prev, botMessage]);
      }

      await loadSessions();
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-blue-600 font-medium">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="w-full max-w-md">
          <WelcomePage onStartChat={handleStartChat} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
      <div className="w-full max-w-md h-screen shadow-2xl relative">
        <div className="flex h-full overflow-hidden bg-white">
          <Sidebar
            sessions={sessions}
            currentSessionId={currentSessionId}
            onSelectSession={handleSelectSession}
            onNewChat={handleNewChat}
            onDeleteSession={handleDeleteSession}
            onBackToWelcome={handleBackToWelcome}
            onLogout={handleLogout}
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
      </div>
    </div>
  );
}

export default App;
