// import { useState, useEffect, useRef } from 'react';
// import { Send, User, Menu } from 'lucide-react';
// import type { Message } from '../lib/api';

// interface ChatInterfaceProps {
//   messages: Message[];
//   onSendMessage: (content: string) => void;
//   isLoading: boolean;
//   onOpenSidebar: () => void;
//   suggestedPrompts?: string[];
// }

// export default function ChatInterface({ messages, onSendMessage, isLoading, onOpenSidebar, suggestedPrompts = [] }: ChatInterfaceProps) {
//   const [inputValue, setInputValue] = useState('');
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (inputValue.trim() && !isLoading) {
//       onSendMessage(inputValue.trim());
//       setInputValue('');
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === 'Enter' && e.shiftKey && !isLoading) {
//       e.preventDefault();
//       if (inputValue.trim()) {
//         onSendMessage(inputValue.trim());
//         setInputValue('');
//       }
//     }
//   };

//   const formatTime = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
//   };

//   return (
//     <div className="flex-1 flex flex-col bg-white h-full">
//       <div className="bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] shadow-lg rounded-t-3xl overflow-hidden">
//         <div className="w-full px-4 py-4">
//           <div className="flex items-center justify-between">
//             <button
//               onClick={onOpenSidebar}
//               className="px-4 py-2 bg-white/30 hover:bg-white/40 rounded-full text-white text-sm font-medium transition-colors backdrop-blur-sm"
//             >
//               پیامهای قبلی
//             </button>

//             <div className="flex items-center gap-3">
//               <div className="text-right">
//                 <h2 className="font-bold text-white text-base">دستیار هوشمند شهرزاد</h2>
//               </div>
//               <div className="relative">
//                 <img
//                   src="/bot-icon.png"
//                   alt="دستیار هوشمند"
//                   className="w-14 h-14 object-contain"
//                 />
//               </div>
//             </div>

//             <button className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
//               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <line x1="18" y1="6" x2="6" y2="18"/>
//                 <line x1="6" y1="6" x2="18" y2="18"/>
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="flex-1 overflow-y-auto p-4 bg-[#f5f7fa]">
//         <div className="w-full space-y-3">
//           {messages.map((message) => (
//             <div
//               key={message.id}
//               className={`flex gap-2 ${message.is_user ? 'justify-start' : 'justify-end'} animate-fade-in`}
//             >
//               {!message.is_user && (
//                 <div className="flex-shrink-0 mt-2">
//                   <img
//                     src="/bot-icon.png"
//                     alt="دستیار هوشمند"
//                     className="w-10 h-10 object-contain"
//                   />
//                 </div>
//               )}

//               <div
//                 className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
//                   message.is_user
//                     ? 'bg-gradient-to-br from-[#3b82f6] to-[#60a5fa] text-white rounded-br-md'
//                     : 'bg-white text-gray-800 rounded-tl-md'
//                 }`}
//               >
//                 <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
//                 <p
//                   className={`text-xs mt-2 text-left ${
//                     message.is_user ? 'text-blue-50' : 'text-gray-400'
//                   }`}
//                 >
//                   {formatTime(message.created_at)}
//                 </p>
//               </div>
//             </div>
//           ))}

//           {messages.length > 0 && messages[messages.length - 1]?.is_user === false && suggestedPrompts.length > 0 && (
//             <div className="mt-4 space-y-2 max-w-md mx-auto">
//               {suggestedPrompts.map((prompt, index) => (
//                 <button
//                   key={index}
//                   onClick={() => onSendMessage(prompt)}
//                   disabled={isLoading}
//                   className="w-full p-4 bg-white hover:bg-gray-50 rounded-2xl text-right transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between group"
//                 >
//                   <div className="flex-1">
//                     <p className="text-sm font-medium text-gray-800 leading-relaxed">
//                       {prompt}
//                     </p>
//                     <p className="text-xs text-gray-500 mt-1">
//                       {index === 0 ? 'در یکی از خدمات شهرزاد نیاز به کمک دارم.' :
//                        index === 1 ? 'می‌خواهم برای تیم پشتیبانی پیام ارسال کنم.' :
//                        'می‌خواهم خودم پاسخ را پیدا کنم.'}
//                     </p>
//                   </div>
//                   <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                   </svg>
//                 </button>
//               ))}
//             </div>
//           )}


//           {isLoading && (
//             <div className="flex gap-2 justify-start animate-fade-in">
//               <div className="flex-shrink-0 mt-2">
//                 <img
//                   src="/bot-icon.png"
//                   alt="دستیار هوشمند"
//                   className="w-10 h-10 object-contain"
//                 />
//               </div>
//               <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
//                 <p className="text-sm text-gray-600">در حال نوشتن...</p>
//               </div>
//             </div>
//           )}

//           <div ref={messagesEndRef} />
//         </div>
//       </div>

//       <div className="bg-white border-t border-gray-200 px-4 py-3">
//         <form onSubmit={handleSubmit} className="w-full">
//           <div className="flex gap-2 items-center bg-gray-100 rounded-2xl px-4 py-2">
//             <button
//               type="button"
//               className="text-gray-500 hover:text-gray-700 transition-colors p-1"
//             >
//               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
//               </svg>
//             </button>
//             <input
//               type="text"
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)}
//               placeholder="پیام خود را بنویسید..."
//               className="flex-1 bg-transparent outline-none text-sm text-right placeholder-gray-400"
//               disabled={isLoading}
//               dir="rtl"
//             />
//             <button
//               type="submit"
//               disabled={!inputValue.trim() || isLoading}
//               className="bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] hover:from-[#2563eb] hover:to-[#3b82f6] disabled:from-gray-300 disabled:to-gray-400 text-white p-2 rounded-xl shadow-sm hover:shadow-md transform active:scale-95 transition-all duration-200 disabled:transform-none disabled:cursor-not-allowed"
//             >
//               <Send className="w-5 h-5" />
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }







import { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import type { Message } from '../lib/api';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  onOpenSidebar: () => void;
  suggestedPrompts?: string[];
}

export default function ChatInterface({
  messages,
  onSendMessage,
  isLoading,
  onOpenSidebar,
  suggestedPrompts = [],
}: ChatInterfaceProps) {
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
    return date.toLocaleTimeString('fa-IR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-white h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] shadow-lg rounded-t-3xl overflow-hidden">
        <div className="w-full px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onOpenSidebar}
              className="px-4 py-2 bg-white/30 hover:bg-white/40 rounded-full text-white text-sm font-medium transition-colors backdrop-blur-sm"
            >
              پیامهای قبلی
            </button>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <h2 className="font-bold text-white text-base">
                  دستیار هوشمند شهرزاد
                </h2>
              </div>
              <img
                src="/bot-icon.png"
                alt="دستیار هوشمند"
                className="w-14 h-14 object-contain"
              />
            </div>

            <button className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
              ✕
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#f5f7fa]">
        <div className="w-full space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-end gap-2 ${
                message.is_user ? 'justify-end' : 'justify-start'
              } animate-fade-in`}
            >
              {/* Bot avatar */}
              {!message.is_user && (
                <img
                  src="/bot-icon.png"
                  alt="دستیار هوشمند"
                  className="w-10 h-10 object-contain flex-shrink-0"
                />
              )}

              {/* Message bubble */}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                  message.is_user
                    ? 'bg-gradient-to-br from-[#3b82f6] to-[#60a5fa] text-white rounded-bl-md'
                    : 'bg-white text-gray-800 rounded-tr-md'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>

              {/* Time (outside bubble) */}
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {formatTime(message.created_at)}
              </span>
            </div>
          ))}

          {/* Suggested prompts */}
          {messages.length > 0 &&
            messages[messages.length - 1]?.is_user === false &&
            suggestedPrompts.length > 0 && (
              <div className="mt-4 space-y-2 max-w-md mx-auto">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => onSendMessage(prompt)}
                    disabled={isLoading}
                    className="w-full p-4 bg-white hover:bg-gray-50 rounded-2xl text-right transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
                  >
                    <p className="text-sm font-medium text-gray-800">
                      {prompt}
                    </p>
                    <span className="text-gray-400">‹</span>
                  </button>
                ))}
              </div>
            )}

          {/* Loading */}
          {isLoading && (
            <div className="flex items-end gap-2 justify-start animate-fade-in">
              <img
                src="/bot-icon.png"
                alt="دستیار هوشمند"
                className="w-10 h-10 object-contain"
              />
              <div className="bg-white rounded-2xl rounded-tr-md px-4 py-3 shadow-sm">
                <p className="text-sm text-gray-600">در حال نوشتن...</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2 items-center bg-gray-100 rounded-2xl px-4 py-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="پیام خود را بنویسید..."
              className="flex-1 bg-transparent outline-none text-sm text-right"
              disabled={isLoading}
              dir="rtl"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] text-white p-2 rounded-xl"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}