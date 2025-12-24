// import { MessageCircle, Sparkles, Headphones, Clock, Users } from 'lucide-react';

// interface WelcomePageProps {
//   onStartChat: () => void;
// }

// export default function WelcomePage({ onStartChat }: WelcomePageProps) {
//   return (
//     <div className="h-screen w-full bg-white flex items-center justify-center overflow-auto">
//       <div className="w-full max-w-md px-4 py-6">
//         <div className="text-center mb-6 animate-fade-in">
//           {/* 
//           <div className="flex justify-center mb-6">
//             <img
//               src="/logo-header.svg"
//               alt="شهرزاد"
//               className="w-32 h-32 drop-shadow-xl"
//             />
//           </div>
//  */}
//           <div className="flex justify-center mb-6">
//             <div className="bg-[#F5F8FF] rounded-3xl p-4 shadow-md">
//               <img
//                 src="/logo-header.svg"
//                 alt="شهرزاد"
//                 className="w-24 h-24"
//               />
//             </div>
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
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#F4F8FF] via-white to-[#EEF3FF] relative overflow-hidden">
      
      {/* Soft light blobs */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-28 -right-28 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md px-4">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="mx-auto w-28 h-28 rounded-3xl bg-white shadow-[0_20px_40px_rgba(0,0,0,0.12)] flex items-center justify-center">
            <img
              src="/logo-header.svg"
              alt="شهرزاد"
              className="w-16 h-16"
            />
          </div>

          <h1 className="mt-6 text-3xl font-extrabold text-[#2F7AF8]">
            شهرزاد
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            دستیار هوشمند شهر تو
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-[28px] bg-white/80 backdrop-blur-sm shadow-[0_30px_60px_rgba(0,0,0,0.12)] p-5 border border-white">
          
          {/* Features */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <Feature icon={<Headphones />} label="پاسخ سریع" />
            <Feature icon={<Clock />} label="پشتیبانی ۲۴/۷" />
            <Feature icon={<Users />} label="تیم حرفه‌ای" />
          </div>

          {/* CTA */}
          <button
            onClick={onStartChat}
            className="w-full py-3.5 rounded-2xl font-bold text-white
                       bg-gradient-to-r from-[#2F7AF8] to-[#4A90E2]
                       shadow-[0_15px_30px_rgba(47,122,248,0.45)]
                       hover:shadow-[0_20px_40px_rgba(47,122,248,0.6)]
                       active:scale-[0.97]
                       transition-all duration-200
                       flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            شروع گفتگو
            <MessageCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Status */}
        <div className="mt-6 flex justify-center items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            آنلاین
          </span>
          <span>•</span>
          <span>پاسخگویی سریع</span>
        </div>

      </div>
    </div>
  );
}

function Feature({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="rounded-2xl bg-white shadow-sm p-3 text-center hover:shadow-md transition">
      <div className="mx-auto mb-2 w-10 h-10 rounded-xl bg-blue-50 text-[#2F7AF8] flex items-center justify-center">
        {icon}
      </div>
      <p className="text-xs font-semibold text-gray-700">{label}</p>
    </div>
  );
}
