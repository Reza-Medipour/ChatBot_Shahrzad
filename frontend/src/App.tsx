import { useState, useEffect } from 'react';
import AuthPage from './components/AuthPage';
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

  // Check if user is already authenticated
  useEffect(() => {
    const token = apiClient.getToken();
    if (token) {
      setIsAuthenticated(true);
    }
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

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
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

    // Optimistically add user message to UI
    const tempUserMessage: Message = {
      id: 'temp-' + Date.now(),
      session_id: currentSessionId,
      content,
      is_user: true,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);

    // Update session title if first message
    const firstMessage = messages.length === 0;
    if (firstMessage) {
      const title = content.substring(0, 50) + (content.length > 50 ? '...' : '');
      setSessions((prev) =>
        prev.map((s) => (s.id === currentSessionId ? { ...s, title } : s))
      );
    }

    // Call chat API which handles both saving user message and generating bot response
    const botResponseText = await generateBotResponse(content, currentSessionId);

    // Add bot message to UI
    const tempBotMessage: Message = {
      id: 'temp-bot-' + Date.now(),
      session_id: currentSessionId,
      content: botResponseText,
      is_user: false,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempBotMessage]);

    // Reload messages to get actual IDs from server
    await loadMessages(currentSessionId);
    await loadSessions();

    setIsLoading(false);
  };

  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
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
