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
