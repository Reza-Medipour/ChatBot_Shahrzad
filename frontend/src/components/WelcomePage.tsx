// import React from "react";
// import { MessageCircle, Sparkles, Headphones, Clock, Users } from "lucide-react";

// interface WelcomePageProps {
//   onStartChat: () => void;
// }

// export default function WelcomePage({ onStartChat }: WelcomePageProps) {
//   return (
//     <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#F4F8FF] via-white to-[#EEF3FF] relative overflow-hidden">
//       <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
//       <div className="absolute -bottom-28 -right-28 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl" />

//       <div className="relative w-full max-w-md px-4">
//         <div className="text-center mb-8">
//           <div className="mx-auto w-28 h-28 rounded-3xl bg-white shadow-[0_20px_40px_rgba(0,0,0,0.12)] flex items-center justify-center">
//             <img src="/logo-header.svg" alt="شهرزاد" className="w-16 h-16" />
//           </div>

//           <h1 className="mt-6 text-3xl font-extrabold text-[#2F7AF8]">شهرزاد</h1>
//           <p className="mt-2 text-sm text-gray-600">دستیار هوشمند شهر تو</p>
//         </div>

//         <div className="rounded-[28px] bg-white shadow-[0_30px_60px_rgba(0,0,0,0.12)] p-5 border border-white">
//           <div className="grid grid-cols-3 gap-3 mb-6">
//             <Feature icon={<Headphones className="w-5 h-5" />} label="پاسخ سریع" />
//             <Feature icon={<Clock className="w-5 h-5" />} label="پشتیبانی ۲۴/۷" />
//             <Feature icon={<Users className="w-5 h-5" />} label="تیم حرفه‌ای" />
//           </div>

//           <button
//             onClick={onStartChat}
//             className="w-full py-3.5 rounded-2xl font-bold text-white
//                        bg-gradient-to-r from-[#2F7AF8] to-[#4A90E2]
//                        shadow-[0_15px_30px_rgba(47,122,248,0.45)]
//                        hover:shadow-[0_20px_40px_rgba(47,122,248,0.6)]
//                        active:scale-[0.97] transition-all duration-200
//                        flex items-center justify-center gap-2"
//           >
//             <Sparkles className="w-5 h-5" />
//             شروع گفتگو
//             <MessageCircle className="w-5 h-5" />
//           </button>
//         </div>

//         <div className="mt-6 flex justify-center items-center gap-3 text-xs text-gray-500">
//           <span className="flex items-center gap-2">
//             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
//             آنلاین
//           </span>
//           <span>•</span>
//           <span>پاسخگویی سریع</span>
//         </div>
//       </div>
//     </div>
//   );
// }

// function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
//   return (
//     <div className="rounded-2xl bg-white shadow-sm p-3 text-center hover:shadow-md transition">
//       <div className="mx-auto mb-2 w-10 h-10 rounded-xl bg-blue-50 text-[#2F7AF8] flex items-center justify-center">
//         {icon}
//       </div>
//       <p className="text-xs font-semibold text-gray-700">{label}</p>
//     </div>
//   );
// }










import React from "react";
import { ChevronRight, Plus } from "lucide-react";

interface WelcomePageProps {
  onStartChat: () => void;
}

export default function WelcomePage({ onStartChat }: WelcomePageProps) {
  return (
    <div className="fixed inset-0 z-40 bg-[#f5f7fa]">
      {/* Mobile App Frame – EXACTLY like Sidebar */}
      <div className="h-screen max-w-md mx-auto bg-white shadow-xl flex flex-col">
        
        {/* Header – same height & typography as Sidebar */}
        <div className="px-4 py-4 flex items-center justify-between border-b">
          <span className="font-bold text-base text-gray-900">
            گفتگوهای قبلی
          </span>

          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>

        {/* New Chat Button – same spacing logic as Sidebar */}
        <div className="p-4">
          <button
            onClick={onStartChat}
            className="
              w-full
              bg-blue-500 hover:bg-blue-600
              text-white font-medium
              py-3 rounded-xl
              flex items-center justify-center gap-2
              transition
            "
          >
            <Plus className="w-5 h-5" />
            آغاز گفتگوی جدید
          </button>
        </div>

        {/* Empty State – centered like native apps */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <img
            src="/image copy.png"
            alt="Chatbot Empty"
            className="w-28 h-28 mb-5 object-contain"
          />

          <h2 className="text-[15px] font-bold text-gray-900 mb-2">
            تا کنون گفتگویی نداشته‌اید
          </h2>

          <p className="text-[13px] text-gray-500 leading-relaxed max-w-[260px]">
            گفتگوهای یک دستیار هوشمند شهرزاد در این قسمت
            نمایش داده می‌شوند.
          </p>
        </div>
      </div>
    </div>
  );
}