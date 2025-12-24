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
    <div className="min-h-screen w-full overflow-auto flex items-center justify-center bg-gradient-to-br from-[#EEF4FF] via-white to-[#F5F0FF]">
      {/* Soft Blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#2F7AF8]/20 blur-3xl" />
        <div className="absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-[#8B5CF6]/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md px-4 py-8">
        {/* Header */}
        <div className="text-center mb-7">
          <div className="flex justify-center mb-5">
            <div className="rounded-3xl bg-white/70 backdrop-blur border border-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-4">
              <img
                src="/logo-header.svg"
                alt="شهرزاد"
                className="w-24 h-24 drop-shadow"
              />
            </div>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-[#2F7AF8] to-[#8B5CF6] bg-clip-text text-transparent">
            شهرزاد
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            دستیار هوشمند شهر تو ✨
          </p>
        </div>

        {/* Gradient Border Wrapper */}
        <div className="p-[1px] rounded-3xl bg-gradient-to-r from-[#2F7AF8]/40 via-[#8B5CF6]/35 to-[#2F7AF8]/40 shadow-[0_14px_40px_rgba(47,122,248,0.18)]">
          <div className="rounded-3xl bg-white/75 backdrop-blur-xl border border-white/60 p-5">
            {/* Features */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <Feature
                icon={<Headphones className="w-5 h-5" />}
                title="پاسخ سریع"
              />
              <Feature
                icon={<Clock className="w-5 h-5" />}
                title="پشتیبانی ۲۴/۷"
              />
              <Feature
                icon={<Users className="w-5 h-5" />}
                title="تیم حرفه‌ای"
              />
            </div>

            {/* CTA */}
            <button
              onClick={onStartChat}
              className="group w-full rounded-2xl py-3.5 px-6 font-bold text-white
                         bg-gradient-to-r from-[#2F7AF8] via-[#4B8DFF] to-[#8B5CF6]
                         shadow-[0_12px_30px_rgba(47,122,248,0.35)]
                         hover:shadow-[0_16px_40px_rgba(139,92,246,0.35)]
                         transition-all duration-200 active:scale-[0.98]
                         flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 opacity-90 group-hover:rotate-6 transition-transform" />
              شروع گفتگو
              <MessageCircle className="w-5 h-5 opacity-90 group-hover:-rotate-6 transition-transform" />
            </button>

            {/* Helper text */}
            <div className="mt-4 flex items-center justify-center gap-3 text-xs text-gray-600">
              <span className="inline-flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                آنلاین
              </span>
              <span className="text-gray-300">•</span>
              <span>پاسخگویی سریع</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div
      className="rounded-2xl bg-white/80 border border-white/60 p-3 text-center
                 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl
                      bg-gradient-to-br from-[#2F7AF8]/15 to-[#8B5CF6]/15 text-[#2F7AF8]">
        {icon}
      </div>
      <p className="text-xs font-semibold text-gray-700">{title}</p>
    </div>
  );
}
