import { MessageCircle, Sparkles, Headphones, Clock, Users } from 'lucide-react';

interface WelcomePageProps {
  onStartChat: () => void;
}

export default function WelcomePage({ onStartChat }: WelcomePageProps) {
  return (
    <div className="h-screen w-full bg-gradient-to-br from-[#1e40af] via-[#3b82f6] to-[#60a5fa] flex items-center justify-center overflow-auto">
      <div className="w-full max-w-md px-4 py-6">
        <div className="text-center mb-6 animate-fade-in">
          <div className="flex justify-center mb-6">
            <img
              src="/logo_bg.svg"
              alt="شهرزاد"
              className="w-full max-w-[280px] h-auto drop-shadow-2xl"
            />
          </div>

          <h1 className="text-2xl font-bold text-white mb-3 drop-shadow-lg px-2">
            به چت بات شهرزاد خوش آمدید
          </h1>

          <p className="text-sm text-white/90 mb-6 leading-relaxed px-2">
            دستیار هوشمند شما برای پاسخگویی
            <br />
            سوالات خود را بپرسید و پاسخ سریع دریافت کنید
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-5 backdrop-blur-sm bg-white/95">
          <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <Headphones className="w-7 h-7 text-[#1e40af] mx-auto mb-1" />
              <p className="text-xs font-medium text-gray-700">پاسخ سریع</p>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <Clock className="w-7 h-7 text-[#1e40af] mx-auto mb-1" />
              <p className="text-xs font-medium text-gray-700">پشتیبانی ۲۴/۷</p>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <Users className="w-7 h-7 text-[#1e40af] mx-auto mb-1" />
              <p className="text-xs font-medium text-gray-700">تیم حرفه‌ای</p>
            </div>
          </div>

          <button
            onClick={onStartChat}
            className="w-full bg-gradient-to-r from-[#1e40af] to-[#3b82f6] hover:from-[#1e3a8a] hover:to-[#2563eb] text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            شروع گفتگو
            <MessageCircle className="w-5 h-5" />
          </button>

          <p className="text-center text-gray-500 text-xs mt-4">
            با کلیک روی دکمه بالا، چت جدیدی شروع می‌شود
          </p>
        </div>

        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-4 text-white/90 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>آنلاین</span>
            </div>
            <span>•</span>
            <span>پاسخگویی سریع</span>
          </div>
        </div>
      </div>
    </div>
  );
}
