// import { MessageCircle, Sparkles, Headphones, Clock, Users } from 'lucide-react';

// interface WelcomePageProps {
//   onStartChat: () => void;
// }

// export default function WelcomePage({ onStartChat }: WelcomePageProps) {
//   return (
//     <div className="h-screen w-full bg-white flex items-center justify-center overflow-auto">
//       <div className="w-full max-w-md px-4 py-6">
//         <div className="text-center mb-6 animate-fade-in">
//           <div className="flex justify-center mb-6">
//             <img
//               src="/logo-header.svg"
//               alt="شهرزاد"
//               className="w-32 h-32 drop-shadow-xl"
//             />
//           </div>

//           <h1 className="text-3xl font-bold text-[#307FE2] mb-2 px-2">
//             شهرزاد
//           </h1>
//           <p className="text-lg text-gray-700 mb-6 px-2">
//              دستیار هوشمند شهر تو
//           </p>
//         </div>

//         <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-2xl p-5 border-2 border-blue-100">
//           <div className="grid grid-cols-3 gap-2 mb-6">
//             <div className="text-center p-3 bg-white rounded-xl shadow-sm">
//               <Headphones className="w-7 h-7 text-[#307FE2] mx-auto mb-1" />
//               <p className="text-xs font-medium text-gray-700">پاسخ سریع</p>
//             </div>
//             <div className="text-center p-3 bg-white rounded-xl shadow-sm">
//               <Clock className="w-7 h-7 text-[#307FE2] mx-auto mb-1" />
//               <p className="text-xs font-medium text-gray-700">پشتیبانی ۲۴/۷</p>
//             </div>
//             <div className="text-center p-3 bg-white rounded-xl shadow-sm">
//               <Users className="w-7 h-7 text-[#307FE2] mx-auto mb-1" />
//               <p className="text-xs font-medium text-gray-700">تیم حرفه‌ای</p>
//             </div>
//           </div>

//           <button
//             onClick={onStartChat}
//             className="w-full bg-gradient-to-r from-[#307FE2] to-[#4A90E2] hover:from-[#2563eb] hover:to-[#307FE2] text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
//           >
//             <Sparkles className="w-5 h-5" />
//             شروع گفتگو
//             <MessageCircle className="w-5 h-5" />
//           </button>
//         </div>

//         <div className="mt-6 text-center">
//           <div className="flex items-center justify-center gap-4 text-gray-600 text-xs">
//             <div className="flex items-center gap-2">
//               <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//               <span>آنلاین</span>
//             </div>
//             <span>•</span>
//             <span>پاسخگویی سریع</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { MessageCircle, Sparkles, Headphones, Clock, Users } from "lucide-react";

interface WelcomePageProps {
  onStartChat: () => void;
}

export default function WelcomePage({ onStartChat }: WelcomePageProps) {
  return (
    <div dir="rtl" className="min-h-screen w-full bg-[#F5F8FF] overflow-auto">
      {/* Header (مثل صفحات شما: آبی + موج) */}
      <div className="relative">
        <div className="h-[260px] w-full bg-gradient-to-b from-[#1E63D6] to-[#2F7AF8] rounded-b-[34px]" />

        {/* Pattern / soft circles like your header */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-b-[34px]">
          <div className="absolute -top-10 -left-16 h-48 w-48 rounded-full bg-white/10" />
          <div className="absolute top-10 -right-20 h-56 w-56 rounded-full bg-white/10" />
          <div className="absolute top-24 left-10 h-24 w-24 rounded-full bg-white/10" />
        </div>

        {/* Header content */}
        <div className="absolute top-0 left-0 right-0 px-4 pt-10">
          <div className="flex flex-col items-center text-center">
            <div className="h-24 w-24 rounded-3xl bg-white/15 border border-white/25 flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
              <img src="/logo-header.svg" alt="شهرزاد" className="w-16 h-16" />
            </div>

            <h1 className="mt-4 text-3xl font-extrabold text-white">
              شهرزاد
            </h1>
            <p className="mt-1 text-sm text-white/85">
              دستیار هوشمند شهر تو
            </p>
          </div>
        </div>
      </div>

      {/* Body card (مثل بدنه صفحات شما: سفید، گرد، سایه نرم) */}
      <div className="-mt-12 px-4 pb-8">
        <div className="mx-auto w-full max-w-md rounded-[28px] bg-white shadow-[0_18px_45px_rgba(17,24,39,0.10)] border border-[#EEF2FF] p-5">
          {/* Feature tiles (مثل آیتم‌های خدمات) */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <Feature icon={<Headphones className="w-5 h-5" />} label="پاسخ سریع" />
            <Feature icon={<Clock className="w-5 h-5" />} label="پشتیبانی ۲۴/۷" />
            <Feature icon={<Users className="w-5 h-5" />} label="تیم حرفه‌ای" />
          </div>

          {/* CTA button (آبی یک‌دست مثل UI شما) */}
          <button
            onClick={onStartChat}
            className="w-full rounded-2xl bg-[#2F7AF8] hover:bg-[#276BE3]
                       text-white font-extrabold py-3.5
                       shadow-[0_10px_22px_rgba(47,122,248,0.35)]
                       active:scale-[0.98] transition-all duration-200
                       flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 opacity-95" />
            شروع گفتگو
            <MessageCircle className="w-5 h-5 opacity-95" />
          </button>

          {/* Status row (مثل پایین صفحه شما) */}
          <div className="mt-5 flex items-center justify-center gap-3 text-xs text-[#667085]">
            <span className="inline-flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              آنلاین
            </span>
            <span className="text-[#D0D5DD]">•</span>
            <span>پاسخگویی سریع</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div
      className="rounded-2xl bg-white border border-[#EEF2FF]
                 shadow-[0_8px_18px_rgba(17,24,39,0.06)]
                 p-3 text-center transition-transform duration-200
                 hover:-translate-y-0.5"
    >
      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EEF4FF] text-[#2F7AF8]">
        {icon}
      </div>
      <p className="text-xs font-bold text-[#344054]">{label}</p>
    </div>
  );
}
