import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Menu } from 'lucide-react';
import { Message } from '../lib/supabase';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  onOpenSidebar: () => void;
}

export default function ChatInterface({ messages, onSendMessage, isLoading, onOpenSidebar }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50 to-blue-50 h-screen">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="w-full px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={onOpenSidebar}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>

            <div className="flex items-center gap-3 flex-1 justify-center lg:justify-start">
              <div className="relative">
                <div className="bg-gradient-to-br from-[#1e40af] to-[#3b82f6] p-2 rounded-xl">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h2 className="font-bold text-gray-800 text-sm">دستیار پشتیبانی</h2>
                <p className="text-xs text-gray-500">آنلاین</p>
              </div>
            </div>

            <div className="w-10 lg:hidden"></div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 md:p-6">
        <div className="w-full max-w-4xl mx-auto space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-8 md:py-12">
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 inline-block">
                <Bot className="w-12 h-12 md:w-16 md:h-16 text-[#1e40af] mx-auto mb-3 md:mb-4" />
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
                  سلام! چطور می‌تونم کمکتون کنم؟
                </h3>
                <p className="text-sm md:text-base text-gray-600">
                  سوال خود را بپرسید و ما در اسرع وقت پاسخ خواهیم داد
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 md:gap-3 ${message.is_user ? 'justify-start' : 'justify-end'} animate-fade-in`}
              >
                {message.is_user && (
                  <div className="flex-shrink-0">
                    <div className="bg-gradient-to-br from-gray-400 to-gray-500 p-1.5 md:p-2 rounded-xl">
                      <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                  </div>
                )}

                <div
                  className={`max-w-[75%] md:max-w-md rounded-2xl p-3 md:p-4 shadow-md ${
                    message.is_user
                      ? 'bg-gradient-to-br from-[#1e40af] to-[#3b82f6] text-white'
                      : 'bg-white text-gray-800'
                  }`}
                >
                  <p className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  <p
                    className={`text-[10px] md:text-xs mt-1.5 md:mt-2 ${
                      message.is_user ? 'text-blue-100' : 'text-gray-400'
                    }`}
                  >
                    {formatTime(message.created_at)}
                  </p>
                </div>

                {!message.is_user && (
                  <div className="flex-shrink-0">
                    <div className="bg-gradient-to-br from-[#1e40af] to-[#3b82f6] p-1.5 md:p-2 rounded-xl">
                      <Bot className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex gap-2 md:gap-3 justify-end animate-fade-in">
              <div className="bg-white rounded-2xl p-3 md:p-4 shadow-md">
                <div className="flex gap-1.5 md:gap-2">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="bg-gradient-to-br from-[#1e40af] to-[#3b82f6] p-1.5 md:p-2 rounded-xl">
                  <Bot className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-gray-200 bg-white shadow-lg">
        <form onSubmit={handleSubmit} className="w-full p-3 md:p-4">
          <div className="flex gap-2 md:gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="پیام خود را بنویسید..."
              className="flex-1 px-3 md:px-4 py-2 md:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e40af] transition-colors text-right text-sm md:text-base"
              disabled={isLoading}
              dir="rtl"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="bg-gradient-to-r from-[#1e40af] to-[#3b82f6] hover:from-[#1e3a8a] hover:to-[#2563eb] disabled:from-gray-300 disabled:to-gray-400 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:transform-none disabled:cursor-not-allowed flex items-center gap-1.5 md:gap-2 text-sm md:text-base"
            >
              <Send className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">ارسال</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
