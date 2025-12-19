import { MessageCircle, Sparkles } from 'lucide-react';

interface WelcomePageProps {
  onStartChat: () => void;
}

export default function WelcomePage({ onStartChat }: WelcomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative bg-white rounded-full p-6 shadow-2xl">
                <MessageCircle className="w-16 h-16 text-blue-600" strokeWidth={2} />
              </div>
            </div>
          </div>

          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            به سیستم پشتیبانی خوش آمدید
          </h1>

          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            ما اینجا هستیم تا به شما کمک کنیم
            <br />
            سوالات خود را بپرسید و پاسخ سریع دریافت کنید
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm bg-white/95">
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
              <div className="text-3xl mb-2">💬</div>
              <p className="text-sm font-medium text-gray-700">پاسخ سریع</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
              <div className="text-3xl mb-2">🎯</div>
              <p className="text-sm font-medium text-gray-700">پشتیبانی ۲۴/۷</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl">
              <div className="text-3xl mb-2">✨</div>
              <p className="text-sm font-medium text-gray-700">راهنمای حرفه‌ای</p>
            </div>
          </div>

          <button
            onClick={onStartChat}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-3 text-lg"
          >
            <Sparkles className="w-6 h-6" />
            شروع گفتگو
            <MessageCircle className="w-6 h-6" />
          </button>

          <p className="text-center text-gray-500 text-sm mt-6">
            با کلیک روی دکمه بالا، چت جدیدی شروع می‌شود
          </p>
        </div>

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-6 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>آنلاین</span>
            </div>
            <span>•</span>
            <span>میانگین زمان پاسخگویی: ۱ دقیقه</span>
          </div>
        </div>
      </div>
    </div>
  );
}
