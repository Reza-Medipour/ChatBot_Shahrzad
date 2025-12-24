import { useState, useEffect, useRef } from 'react';
import { Send, User, Menu } from 'lucide-react';
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey && !isLoading) {
      e.preventDefault();
      if (inputValue.trim()) {
        onSendMessage(inputValue.trim());
        setInputValue('');
      }
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50 to-blue-50 h-full">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="w-full px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={onOpenSidebar}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>

            <div className="flex items-center gap-3 flex-1 justify-center">
              <div className="relative">
                <img
                  src="/logo-header.svg"
                  alt="شهرزاد"
                  className="h-10 w-10"
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h2 className="font-bold text-gray-800 text-sm">چت بات شهرزاد</h2>
                <p className="text-xs text-gray-500">آنلاین</p>
              </div>
            </div>

            <div className="w-10"></div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="w-full space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 inline-block">
                <img
                  src="/logo-header.svg"
                  alt="شهرزاد"
                  className="h-16 w-16 mx-auto mb-3"
                />
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  سلام! چطور می‌تونم کمکتون کنم؟
                </h3>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.is_user ? 'justify-start' : 'justify-end'} animate-fade-in`}
              >
                {message.is_user && (
                  <div className="flex-shrink-0">
                    <div className="bg-gradient-to-br from-gray-400 to-gray-500 p-2 rounded-xl">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}

                <div
                  className={`max-w-[75%] rounded-2xl p-3 shadow-md ${
                    message.is_user
                      ? 'bg-gradient-to-br from-[#1e40af] to-[#3b82f6] text-white'
                      : 'bg-white text-gray-800'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  <p
                    className={`text-xs mt-2 ${
                      message.is_user ? 'text-blue-100' : 'text-gray-400'
                    }`}
                  >
                    {formatTime(message.created_at)}
                  </p>
                </div>

                {!message.is_user && (
                  <div className="flex-shrink-0">
                    <img
                      src="/logo-1.svg"
                      alt="شهرزاد"
                      className="w-8 h-8"
                    />
                  </div>
                )}
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex gap-2 justify-end animate-fade-in">
              <div className="bg-white rounded-2xl p-3 shadow-md">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <img
                  src="/logo-1.svg"
                  alt="شهرزاد"
                  className="w-8 h-8"
                />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-gray-200 bg-white shadow-lg">
        <form onSubmit={handleSubmit} className="w-full p-3">
          <div className="flex gap-2 items-end">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="پیام خود را بنویسید..."
              className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e40af] transition-colors text-right text-sm resize-none min-h-[40px] max-h-[120px]"
              disabled={isLoading}
              dir="rtl"
              rows={1}
              style={{
                height: 'auto',
                overflowY: inputValue.split('\n').length > 3 ? 'auto' : 'hidden'
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 120) + 'px';
              }}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="bg-gradient-to-r from-[#1e40af] to-[#3b82f6] hover:from-[#1e3a8a] hover:to-[#2563eb] disabled:from-gray-300 disabled:to-gray-400 text-white px-4 py-2 rounded-xl shadow-md hover:shadow-lg transform active:scale-[0.98] transition-all duration-200 disabled:transform-none disabled:cursor-not-allowed flex items-center gap-2 text-sm"
            >
              <Send className="w-4 h-4" />
              <span>ارسال</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
