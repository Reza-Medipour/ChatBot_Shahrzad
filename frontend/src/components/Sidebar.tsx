// import { Plus, MessageSquare, Trash2, X, LogOut } from 'lucide-react';
// import type { ChatSession } from '../lib/api';

// interface SidebarProps {
//   sessions: ChatSession[];
//   currentSessionId: string | null;
//   onSelectSession: (sessionId: string) => void;
//   onNewChat: () => void;
//   onDeleteSession: (sessionId: string) => void;
//   onBackToWelcome: () => void;
//   onLogout: () => void;
//   isOpen: boolean;
//   onClose: () => void;
// }

// export default function Sidebar({
//   sessions,
//   currentSessionId,
//   onSelectSession,
//   onNewChat,
//   onDeleteSession,
//   onBackToWelcome,
//   onLogout,
//   isOpen,
//   onClose,
// }: SidebarProps) {
//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diff = now.getTime() - date.getTime();
//     const days = Math.floor(diff / (1000 * 60 * 60 * 24));

//     if (days === 0) {
//       return 'امروز';
//     } else if (days === 1) {
//       return 'دیروز';
//     } else if (days < 7) {
//       return `${days} روز پیش`;
//     } else {
//       return date.toLocaleDateString('fa-IR', { month: 'long', day: 'numeric' });
//     }
//   };

//   return (
//     <>
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 z-40"
//           onClick={onClose}
//         />
//       )}

//       <div className={`
//         fixed inset-y-0 right-0 z-50
//         w-80 bg-gradient-to-b from-white via-blue-50 to-blue-100 text-gray-800
//         flex flex-col h-full shadow-2xl
//         transform transition-transform duration-300 ease-in-out
//         ${isOpen ? 'translate-x-0' : 'translate-x-full'}
//       `}>
//         <div className="p-6 border-b border-blue-200">
//           <div className="flex items-center justify-between mb-6">
//             <button
//               onClick={onBackToWelcome}
//               className="cursor-pointer hover:opacity-70 transition-opacity p-0 bg-none border-none"
//             >
//               <img
//                 src="/logo copy copy copy.svg"
//                 alt="شهرزاد"
//                 className="h-12 w-auto"
//               />
//             </button>
//             <button
//               onClick={onClose}
//               className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
//             >
//               <X className="w-6 h-6 text-gray-700" />
//             </button>
//           </div>

//           <button
//             onClick={() => {
//               onNewChat();
//               onClose();
//             }}
//             className="w-full bg-gradient-to-r from-[#1e40af] to-[#3b82f6] hover:from-[#1e3a8a] hover:to-[#2563eb] text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
//           >
//             <Plus className="w-5 h-5" />
//             گفتگوی جدید
//           </button>
//         </div>

//         <div className="flex-1 overflow-y-auto p-4 space-y-2">
//           <h2 className="text-xs font-semibold text-blue-600 uppercase tracking-wider px-3 mb-3">
//             تاریخچه گفتگوها
//           </h2>

//           {sessions.length === 0 ? (
//             <div className="text-center py-12 text-gray-500">
//               <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
//               <p className="text-sm">هنوز گفتگویی وجود ندارد</p>
//             </div>
//           ) : (
//             sessions.map((session) => (
//               <div
//                 key={session.id}
//                 className={`group relative rounded-xl p-3 cursor-pointer transition-all duration-200 ${
//                   currentSessionId === session.id
//                     ? 'bg-blue-100 shadow-md border-2 border-blue-300'
//                     : 'bg-white/70 hover:bg-blue-50 border border-blue-100'
//                 }`}
//                 onClick={() => {
//                   onSelectSession(session.id);
//                   onClose();
//                 }}
//               >
//                 <div className="flex items-start gap-3">
//                   <div className="mt-1">
//                     <MessageSquare className="w-4 h-4 text-blue-600" />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="font-medium truncate text-sm text-gray-800">{session.title}</p>
//                     <p className="text-xs text-gray-500 mt-1">
//                       {formatDate(session.updated_at)}
//                     </p>
//                   </div>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       onDeleteSession(session.id);
//                     }}
//                     className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded-lg"
//                   >
//                     <Trash2 className="w-4 h-4 text-red-500" />
//                   </button>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         <div className="p-4 border-t border-blue-200">
//           <button
//             onClick={() => {
//               onLogout();
//               onClose();
//             }}
//             className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 px-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
//           >
//             <LogOut className="w-5 h-5" />
//             خروج
//           </button>
//         </div>
//       </div>
//     </>
//   );
// }




import { Plus, MessageSquare, Trash2, X, LogOut } from 'lucide-react';
import type { ChatSession } from '../lib/api';

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  onDeleteSession: (sessionId: string) => void;
  onBackToWelcome: () => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onBackToWelcome,
  onLogout,
  isOpen,
  onClose,
}: SidebarProps) {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'امروز';
    if (days === 1) return 'دیروز';
    if (days < 7) return `${days} روز پیش`;

    return date.toLocaleDateString('fa-IR', {
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#f5f7fa]">
      {/* Mobile frame – identical to chat */}
      <div className="h-screen max-w-md mx-auto bg-white shadow-xl flex flex-col">
        {/* Header – same height & font as chat */}
        <div className="bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] px-4 py-4 flex items-center justify-between">
          <span className="text-white font-bold text-base">
            گفتگوهای قبلی
          </span>

          <button
            onClick={onClose}
            className="text-white text-xl px-2"
            aria-label="close"
          >
            ✕
          </button>
        </div>

        {/* New chat button */}
        <div className="p-4">
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition"
          >
            <Plus className="w-5 h-5" />
            گفتگوی جدید
          </button>
        </div>

        {/* Sessions list */}
        <div className="flex-1 overflow-y-auto px-4 space-y-2">
          {sessions.length === 0 ? (
            <div className="text-center mt-20 text-gray-400">
              <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">هنوز گفتگویی وجود ندارد</p>
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => {
                  onSelectSession(session.id);
                  onClose();
                }}
                className={`rounded-xl p-3 cursor-pointer transition border ${
                  currentSessionId === session.id
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-4 h-4 text-blue-500 mt-1" />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {session.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(session.updated_at)}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className="p-1 rounded-md hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <button
            onClick={() => {
              onLogout();
              onClose();
              onBackToWelcome();
            }}
            className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition"
          >
            <LogOut className="w-5 h-5" />
            خروج
          </button>
        </div>
      </div>
    </div>
  );
}