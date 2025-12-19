import { MessageCircle, Sparkles, Headphones, Clock, Users } from 'lucide-react';

interface WelcomePageProps {
  onStartChat: () => void;
}

export default function WelcomePage({ onStartChat }: WelcomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e40af] via-[#3b82f6] to-[#60a5fa] flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="text-center mb-6 md:mb-8 animate-fade-in">
          <div className="flex justify-center mb-6 md:mb-8">
            <div className="relative">
              <img
                src="/image copy.png"
                alt="Tehran Skyline"
                className="w-full max-w-xs md:max-w-sm h-auto drop-shadow-2xl"
              />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4 drop-shadow-lg px-4">
            به سیستم پشتیبانی خوش آمدید
          </h1>

          <p className="text-base md:text-lg lg:text-xl text-white/90 mb-6 md:mb-8 leading-relaxed px-4">
            ما اینجا هستیم تا به شما کمک کنیم
            <br />
            سوالات خود را بپرسید و پاسخ سریع دریافت کنید
          </p>
        </div>

        <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 backdrop-blur-sm bg-white/95 mx-2">
          <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6 md:mb-8">
            <div className="text-center p-3 md:p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl md:rounded-2xl">
              <Headphones className="w-6 h-6 md:w-8 md:h-8 text-[#1e40af] mx-auto mb-1 md:mb-2" />
              <p className="text-xs md:text-sm font-medium text-gray-700">پاسخ سریع</p>
            </div>
            <div className="text-center p-3 md:p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl md:rounded-2xl">
              <Clock className="w-6 h-6 md:w-8 md:h-8 text-[#1e40af] mx-auto mb-1 md:mb-2" />
              <p className="text-xs md:text-sm font-medium text-gray-700">پشتیبانی ۲۴/۷</p>
            </div>
            <div className="text-center p-3 md:p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl md:rounded-2xl">
              <Users className="w-6 h-6 md:w-8 md:h-8 text-[#1e40af] mx-auto mb-1 md:mb-2" />
              <p className="text-xs md:text-sm font-medium text-gray-700">تیم حرفه‌ای</p>
            </div>
          </div>

          <button
            onClick={onStartChat}
            className="w-full bg-gradient-to-r from-[#1e40af] to-[#3b82f6] hover:from-[#1e3a8a] hover:to-[#2563eb] text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 md:gap-3 text-base md:text-lg"
          >
            <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
            شروع گفتگو
            <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <p className="text-center text-gray-500 text-xs md:text-sm mt-4 md:mt-6">
            با کلیک روی دکمه بالا، چت جدیدی شروع می‌شود
          </p>
        </div>

        <div className="mt-6 md:mt-8 text-center px-4">
          <div className="flex items-center justify-center gap-4 md:gap-6 text-white/90 text-xs md:text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>آنلاین</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <span>پاسخگویی سریع</span>
          </div>
        </div>
      </div>
    </div>
  );
}
