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





// import { useState, useEffect, useRef } from 'react';
// import { Send } from 'lucide-react';
// import type { Message } from '../lib/api';

// interface ChatInterfaceProps {
//   messages: Message[];
//   onSendMessage: (content: string) => void;
//   isLoading: boolean;
//   onOpenSidebar: () => void;
//   onCloseChat: () => void;
//   suggestedPrompts?: string[];
// }

// export default function ChatInterface({
//   messages,
//   onSendMessage,
//   isLoading,
//   onOpenSidebar,
//   onCloseChat,
//   suggestedPrompts = [],
// }: ChatInterfaceProps) {
//   const [inputValue, setInputValue] = useState('');
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const formatTime = (date: string) =>
//     new Date(date).toLocaleTimeString('fa-IR', {
//       hour: '2-digit',
//       minute: '2-digit',
//     });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!inputValue.trim() || isLoading) return;
//     onSendMessage(inputValue.trim());
//     setInputValue('');
//   };

//   return (
//     <div className="flex-1 flex flex-col bg-white h-full">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] px-4 py-4 flex items-center justify-between">
//         <button
//           onClick={onOpenSidebar}
//           className="text-white text-sm bg-white/20 px-3 py-1 rounded-full"
//         >
//           پیام‌های قبلی
//         </button>

//         <div className="flex items-center gap-3">
//           <h2 className="text-white font-bold">دستیار هوشمند شهرزاد</h2>
//           <img src="/bot-icon.png" className="w-10 h-10" />
//         </div>

//         <button
//           onClick={onCloseChat}
//           className="text-white text-xl px-2"
//         >
//           ✕
//         </button>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 bg-[#f5f7fa] space-y-3">
//         {messages.map((m) => (
//           <div
//             key={m.id}
//             className={`flex items-end gap-2 ${
//               m.is_user ? 'justify-end' : 'justify-start'
//             }`}
//           >
//             {!m.is_user && (
//               <img
//                 src="/bot-icon.png"
//                 className="w-8 h-8 flex-shrink-0"
//               />
//             )}

//             <div
//               className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
//                 m.is_user
//                   ? 'bg-blue-500 text-white rounded-bl-md'
//                   : 'bg-white text-gray-800 rounded-tr-md'
//               }`}
//             >
//               <p className="text-sm whitespace-pre-wrap">{m.content}</p>
//             </div>

//             <span className="text-xs text-gray-400">
//               {formatTime(m.created_at)}
//             </span>
//           </div>
//         ))}

//         {/* Suggested Prompts */}
//         {suggestedPrompts.length > 0 && (
//           <div className="space-y-2 mt-2">
//             {suggestedPrompts.map((p, i) => (
//               <button
//                 key={i}
//                 onClick={() => onSendMessage(p)}
//                 className="w-full bg-white rounded-xl p-3 text-sm shadow text-right hover:bg-gray-50"
//               >
//                 {p}
//               </button>
//             ))}
//           </div>
//         )}

//         {isLoading && (
//           <div className="flex gap-2 items-center">
//             <img src="/bot-icon.png" className="w-8 h-8" />
//             <div className="bg-white px-4 py-2 rounded-xl text-sm text-gray-500">
//               در حال نوشتن...
//             </div>
//           </div>
//         )}

//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input */}
//       <form
//         onSubmit={handleSubmit}
//         className="border-t px-4 py-3 flex gap-2 items-center"
//       >
//         <input
//           value={inputValue}
//           onChange={(e) => setInputValue(e.target.value)}
//           className="flex-1 bg-gray-100 rounded-xl px-4 py-2 text-right outline-none"
//           placeholder="پیام خود را بنویسید..."
//           dir="rtl"
//         />
//         <button
//           type="submit"
//           disabled={isLoading}
//           className="bg-blue-500 text-white p-2 rounded-xl"
//         >
//           <Send size={18} />
//         </button>
//       </form>
//     </div>
//   );
// }




import { useState, useEffect, useRef } from 'react';
import { Send, User, Menu } from 'lucide-react';
import type { Message } from '../lib/api';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  onOpenSidebar: () => void;
}

export default function ChatInterface({
  messages,
  onSendMessage,
  isLoading,
  onOpenSidebar,
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    onSendMessage(inputValue.trim());
    setInputValue('');
  };

  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString('fa-IR', {
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50 to-blue-50 h-full">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] rounded-b-3xl shadow-md">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={onOpenSidebar}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>

          <h2 className="text-white font-bold text-sm">
            دستیار هوشمند شهرزاد
          </h2>

          <div className="w-8" />
        </div>

        {/* Floating Bot Icon */}
        <div className="absolute -bottom-6 right-4 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center">
          <img
            src="/image copy.png"
            alt="bot"
            className="w-8 h-8"
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 pt-8">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-end gap-2 ${
                message.is_user ? 'justify-end' : 'justify-start'
              }`}
            >
              {/* Bot avatar */}
              {!message.is_user && (
                <img
                  src="/image copy.png"
                  alt="bot"
                  className="w-8 h-8"
                />
              )}

              {/* Bubble */}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-md ${
                  message.is_user
                    ? 'bg-gradient-to-br from-[#1e40af] to-[#3b82f6] text-white text-right'
                    : 'bg-white text-gray-800 text-right'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </p>
                <p
                  className={`text-xs mt-2 ${
                    message.is_user ? 'text-blue-100' : 'text-gray-400'
                  }`}
                >
                  {formatTime(message.created_at)}
                </p>
              </div>

              {/* User avatar */}
              {message.is_user && (
                <div className="bg-gradient-to-br from-gray-400 to-gray-500 p-2 rounded-xl">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {/* Typing */}
          {isLoading && (
            <div className="flex items-end gap-2 justify-start">
              <img
                src="/image copy.png"
                className="w-8 h-8"
              />
              <div className="bg-white rounded-2xl px-4 py-2 shadow">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t bg-white px-4 py-3">
        <form onSubmit={handleSubmit} className="flex gap-2 items-end">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="پیام خود را بنویسید..."
            className="flex-1 bg-gray-100 rounded-xl px-3 py-2 text-right text-sm resize-none outline-none"
            disabled={isLoading}
            dir="rtl"
            rows={1}
            onInput={(e) => {
              const el = e.target as HTMLTextAreaElement;
              el.style.height = 'auto';
              el.style.height = Math.min(el.scrollHeight, 120) + 'px';
            }}
          />

          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="bg-gradient-to-r from-[#1e40af] to-[#3b82f6] text-white px-4 py-2 rounded-xl shadow flex items-center gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            ارسال
          </button>
        </form>
      </div>
    </div>
  );
}