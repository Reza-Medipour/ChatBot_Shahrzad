import { useState } from 'react';
import { LogIn, UserPlus, Loader2 } from 'lucide-react';
import { apiClient } from '../lib/api';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

export default function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login
        const { data, error } = await apiClient.login(username, password);
        if (error) {
          setError(error);
          setIsLoading(false);
          return;
        }
        if (data) {
          apiClient.setToken(data.access_token);
          onAuthSuccess();
        }
      } else {
        // Register
        const { data, error } = await apiClient.register(phoneNumber, username, password);
        if (error) {
          setError(error);
          setIsLoading(false);
          return;
        }
        if (data) {
          apiClient.setToken(data.access_token);
          onAuthSuccess();
        }
      }
    } catch (err) {
      setError('خطایی رخ داد. لطفا دوباره تلاش کنید.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#F4F8FF] via-white to-[#EEF3FF] relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-28 -right-28 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="mx-auto w-28 h-28 rounded-3xl bg-white shadow-[0_20px_40px_rgba(0,0,0,0.12)] flex items-center justify-center">
            <img src="/logo-header.svg" alt="شهرزاد" className="w-16 h-16" />
          </div>

          <h1 className="mt-6 text-3xl font-extrabold text-[#2F7AF8]">شهرزاد</h1>
          <p className="mt-2 text-sm text-gray-600">دستیار هوشمند شهر تو</p>
        </div>

        <div className="rounded-[28px] bg-white shadow-[0_30px_60px_rgba(0,0,0,0.12)] p-6 border border-white">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-xl font-bold transition-all ${
                isLogin
                  ? 'bg-gradient-to-r from-[#2F7AF8] to-[#4A90E2] text-white shadow-md'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              ورود
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-xl font-bold transition-all ${
                !isLogin
                  ? 'bg-gradient-to-r from-[#2F7AF8] to-[#4A90E2] text-white shadow-md'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              ثبت‌نام
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 text-right">
                  شماره تلفن
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="09123456789"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#2F7AF8] transition-colors text-right"
                  required
                  dir="rtl"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 text-right">
                نام کاربری
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="نام کاربری خود را وارد کنید"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#2F7AF8] transition-colors text-right"
                required
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 text-right">
                رمز عبور
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="رمز عبور خود را وارد کنید"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#2F7AF8] transition-colors text-right"
                required
                dir="rtl"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-right">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl font-bold text-white
                         bg-gradient-to-r from-[#2F7AF8] to-[#4A90E2]
                         shadow-[0_15px_30px_rgba(47,122,248,0.45)]
                         hover:shadow-[0_20px_40px_rgba(47,122,248,0.6)]
                         active:scale-[0.97] transition-all duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                         flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  لطفا صبر کنید...
                </>
              ) : (
                <>
                  {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                  {isLogin ? 'ورود' : 'ثبت‌نام'}
                </>
              )}
            </button>
          </form>
        </div>

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
