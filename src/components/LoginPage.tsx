import { useState } from 'react';
import { User, Lock, ArrowLeft } from 'lucide-react';

interface LoginPageProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('لطفاً نام کاربری را وارد کنید');
      return;
    }

    if (!password.trim()) {
      setError('لطفاً رمز عبور را وارد کنید');
      return;
    }

    setIsLoading(true);

    try {
      const success = await onLogin(username, password);
      if (!success) {
        setError('نام کاربری یا رمز عبور اشتباه است');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('خطا در ورود. لطفاً دوباره تلاش کنید');
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center overflow-auto">
      <div className="w-full max-w-md px-4 py-8">
        <div className="text-center mb-8 animate-fade-in">
          <div className="mb-4">
            <img
              src="/logo-header.svg"
              alt="شهرزاد"
              className="h-20 w-20 mx-auto"
            />
          </div>

          <h1 className="text-3xl font-bold text-blue-900 mb-2">
            ورود به چت بات شهرزاد
          </h1>

          <p className="text-sm text-blue-700 leading-relaxed">
            لطفاً نام کاربری و رمز عبور خود را وارد کنید
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm border border-blue-100">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-blue-900 mb-2 text-right">
                نام کاربری
              </label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="نام کاربری خود را وارد کنید"
                  className="w-full pr-10 pl-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right bg-blue-50/50 text-blue-900 placeholder-blue-400"
                  disabled={isLoading}
                  dir="rtl"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-blue-900 mb-2 text-right">
                رمز عبور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="رمز عبور خود را وارد کنید"
                  className="w-full pr-10 pl-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right bg-blue-50/50 text-blue-900 placeholder-blue-400"
                  disabled={isLoading}
                  dir="rtl"
                />
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl text-center text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!username.trim() || !password.trim() || isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-bold text-base hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
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

          <div className="mt-6 pt-6 border-t border-blue-200">
            <div className="flex items-center justify-center gap-2 text-blue-700 text-xs">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>ورود امن و سریع</span>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-blue-600">
            برای تست: username = <span className="font-bold">admin</span>, password = <span className="font-bold">admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
