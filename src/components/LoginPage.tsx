import { useState } from 'react';
import { Phone, ArrowLeft } from 'lucide-react';

interface LoginPageProps {
  onLogin: (phoneNumber: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber.trim() || phoneNumber.length < 10) {
      alert('لطفا شماره تلفن معتبر وارد کنید');
      return;
    }

    setIsLoading(true);

    try {
      await onLogin(phoneNumber);
    } catch (error) {
      console.error('Login error:', error);
      alert('خطا در ورود. لطفا دوباره تلاش کنید');
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setPhoneNumber(value);
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-[#1e40af] via-[#3b82f6] to-[#60a5fa] flex items-center justify-center overflow-auto">
      <div className="w-full max-w-md px-4 py-6">
        <div className="text-center mb-6 animate-fade-in">
          <div className="flex justify-center mb-6">
            <img
              src="/picture2.png"
              alt="Login"
              className="w-full max-w-[280px] h-auto drop-shadow-2xl rounded-2xl"
            />
          </div>

          <h1 className="text-2xl font-bold text-white mb-2 drop-shadow-lg px-2">
            ورود به سیستم
          </h1>

          <p className="text-sm text-white/90 mb-6 leading-relaxed px-2">
            لطفا شماره تلفن خود را وارد کنید
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6 backdrop-blur-sm bg-white/95">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-3 text-right">
                شماره تلفن
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="09123456789"
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e40af] transition-colors text-right"
                  disabled={isLoading}
                  dir="ltr"
                  maxLength={11}
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <Phone className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-right">
                مثال: 09123456789
              </p>
            </div>

            <button
              type="submit"
              disabled={!phoneNumber.trim() || phoneNumber.length < 10 || isLoading}
              className="w-full bg-gradient-to-r from-[#1e40af] to-[#3b82f6] hover:from-[#1e3a8a] hover:to-[#2563eb] disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform active:scale-[0.98] transition-all duration-200 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></div>
                </div>
              ) : (
                <>
                  <span>ورود</span>
                  <ArrowLeft className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center gap-2 text-gray-600 text-xs">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>ورود امن و سریع</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-white/80 text-xs">
            با ورود به سیستم، شماره تلفن شما ذخیره می‌شود
          </p>
        </div>
      </div>
    </div>
  );
}
