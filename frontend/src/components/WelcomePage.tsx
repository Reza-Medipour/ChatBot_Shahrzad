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
import { ChevronRight } from "lucide-react";

interface WelcomePageProps {
  onStartChat: () => void;
}

export default function WelcomePage({ onStartChat }: WelcomePageProps) {
  return (
    <div
      className="w-full min-h-screen bg-white flex flex-col"
      style={{ direction: "rtl" }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-between px-4"
        style={{
          height: 52,
          borderBottom: "1px solid #F1F1F1",
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#111827",
          }}
        >
          گفتگوهای قبلی
        </span>

        <ChevronRight size={20} color="#9CA3AF" />
      </header>

      {/* New Chat Button */}
      <div
        className="px-4"
        style={{
          marginTop: 12,
        }}
      >
        <button
          onClick={onStartChat}
          className="w-full"
          style={{
            height: 44,
            borderRadius: 14,
            backgroundColor: "#2F7AF8",
            color: "#FFFFFF",
            fontSize: 14,
            fontWeight: 600,
            border: "none",
          }}
        >
          آغاز گفتگوی جدید
        </button>
      </div>

      {/* Empty State */}
      <main className="flex-1 flex flex-col items-center justify-center text-center">
        {/* Bot Image */}
        <img
          src="/image copy.png"
          alt="Chatbot Empty State"
          style={{
            width: 104,
            height: 104,
            marginBottom: 20,
            objectFit: "contain",
          }}
        />

        {/* Title */}
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#111827",
            marginBottom: 8,
          }}
        >
          تا کنون گفتگویی نداشته‌اید
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: 13,
            lineHeight: "20px",
            color: "#6B7280",
            maxWidth: 250,
          }}
        >
          گفتگوهای یک دستیار هوشمند شهرزاد در این قسمت نمایش داده
          می‌شوند.
        </p>
      </main>
    </div>
  );
}