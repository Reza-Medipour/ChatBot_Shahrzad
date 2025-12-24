import { useState, useEffect } from 'react';
import WelcomePage from './components/WelcomePage';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import UsernameLoginPage from './components/UsernameLoginPage';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import { supabase, ChatSession, Message } from './lib/supabase';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showUsernameLogin, setShowUsernameLogin] = useState(false);
  const [verifiedPhoneNumber, setVerifiedPhoneNumber] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const savedUserId = localStorage.getItem('userId');
    const savedPhoneNumber = localStorage.getItem('phoneNumber');

    if (savedUserId && savedPhoneNumber) {
      setUserId(savedUserId);
      setPhoneNumber(savedPhoneNumber);
      setShowWelcome(false);
      setShowLogin(false);
      loadSessions(savedUserId);
    }
  }, []);

  useEffect(() => {
    if (currentSessionId && userId) {
      loadMessages(currentSessionId);
    }
  }, [currentSessionId, userId]);

  const loadSessions = async (userIdParam: string) => {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userIdParam)
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

  const handlePhoneVerified = async (phone: string) => {
    try {
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('phone_number', phone)
        .maybeSingle();

      if (fetchError) {
        console.error('Error checking user:', fetchError);
        throw fetchError;
      }

      if (existingUser && existingUser.is_registered) {
        await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', existingUser.id);

        localStorage.setItem('userId', existingUser.id);
        localStorage.setItem('phoneNumber', phone);

        setUserId(existingUser.id);
        setPhoneNumber(phone);
        setShowLogin(false);
        setShowWelcome(false);

        await loadSessions(existingUser.id);
      } else {
        if (!existingUser) {
          const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert([{ phone_number: phone, is_registered: false }])
            .select()
            .single();

          if (insertError) {
            console.error('Error creating user:', insertError);
            throw insertError;
          }
        }

        setVerifiedPhoneNumber(phone);
        setShowLogin(false);
        setShowRegistration(true);
      }
    } catch (error) {
      console.error('Phone verification error:', error);
      throw error;
    }
  };

  const handleRegistrationComplete = async (newUserId: string) => {
    if (!verifiedPhoneNumber) return;

    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', newUserId);

    localStorage.setItem('userId', newUserId);
    localStorage.setItem('phoneNumber', verifiedPhoneNumber);

    setUserId(newUserId);
    setPhoneNumber(verifiedPhoneNumber);
    setShowRegistration(false);
    setShowWelcome(false);
    setVerifiedPhoneNumber(null);

    await loadSessions(newUserId);
  };

  const handleBackToLogin = () => {
    setShowRegistration(false);
    setShowLogin(true);
    setVerifiedPhoneNumber(null);
  };

  const handleUsernameLogin = () => {
    setShowLogin(false);
    setShowUsernameLogin(true);
  };

  const handleUsernameLoginComplete = async (newUserId: string, phone: string) => {
    localStorage.setItem('userId', newUserId);
    localStorage.setItem('phoneNumber', phone);

    setUserId(newUserId);
    setPhoneNumber(phone);
    setShowUsernameLogin(false);
    setShowWelcome(false);

    await loadSessions(newUserId);
  };

  const handleBackToPhoneLogin = () => {
    setShowUsernameLogin(false);
    setShowLogin(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('phoneNumber');
    setUserId(null);
    setPhoneNumber(null);
    setSessions([]);
    setCurrentSessionId(null);
    setMessages([]);
    setShowWelcome(true);
    setShowLogin(false);
    setShowUsernameLogin(false);
    setIsSidebarOpen(false);
  };

  const createNewSession = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('chat_sessions')
      .insert([{ title: 'چت جدید', user_id: userId }])
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
    if (userId) {
      await createNewSession();
    } else {
      setShowWelcome(false);
      setShowLogin(true);
    }
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
      const apiUrl = "/chat";

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
    if (!currentSessionId || !userId) return;

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
      console.error('Error sending message:', userError);
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

    await loadSessions(userId);

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
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="w-full max-w-md">
          <WelcomePage onStartChat={handleStartChat} />
        </div>
      </div>
    );
  }

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="w-full max-w-md">
          <LoginPage onVerified={handlePhoneVerified} onUsernameLogin={handleUsernameLogin} />
        </div>
      </div>
    );
  }

  if (showUsernameLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="w-full max-w-md">
          <UsernameLoginPage onLogin={handleUsernameLoginComplete} onBack={handleBackToPhoneLogin} />
        </div>
      </div>
    );
  }

  if (showRegistration && verifiedPhoneNumber) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="w-full max-w-md">
          <RegistrationPage
            phoneNumber={verifiedPhoneNumber}
            onComplete={handleRegistrationComplete}
            onBack={handleBackToLogin}
          />
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
            phoneNumber={phoneNumber || ''}
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
