import { useState } from 'react';
import { Lock, User } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface RegistrationPageProps {
  phoneNumber: string;
  onComplete: (userId: string) => void;
  onBack: () => void;
}

export default function RegistrationPage({ phoneNumber, onComplete, onBack }: RegistrationPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('لطفاً همه فیلدها را پر کنید');
      return;
    }

    if (password !== confirmPassword) {
      setError('رمز عبور و تکرار آن یکسان نیستند');
      return;
    }

    if (password.length < 6) {
      setError('رمز عبور باید حداقل ۶ کاراکتر باشد');
      return;
    }

    if (username.length < 3) {
      setError('نام کاربری باید حداقل ۳ کاراکتر باشد');
      return;
    }

    setIsLoading(true);

    try {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('username', username.trim())
        .maybeSingle();

      if (existingUser) {
        setError('این نام کاربری قبلاً استفاده شده است');
        setIsLoading(false);
        return;
      }

      const { data: user, error: updateError } = await supabase
        .from('users')
        .update({
          username: username.trim(),
          password: password,
          is_registered: true,
        })
        .eq('phone_number', phoneNumber)
        .select()
        .single();

      if (updateError) throw updateError;

      onComplete(user.id);
    } catch (err) {
      console.error('Registration error:', err);
      setError('خطا در ثبت اطلاعات. لطفاً دوباره تلاش کنید');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center overflow-auto">
      <div className="w-full max-w-md px-4 py-8">
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <User className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-blue-900 mb-2">
            ثبت نام
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
                  className="w-full pr-10 pl-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right bg-blue-50/50 text-blue-900 placeholder-blue-400"
                  placeholder="نام کاربری خود را وارد کنید"
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
                  className="w-full pr-10 pl-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right bg-blue-50/50 text-blue-900 placeholder-blue-400"
                  placeholder="رمز عبور خود را وارد کنید"
                  disabled={isLoading}
                  dir="rtl"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-blue-900 mb-2 text-right">
                تکرار رمز عبور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right bg-blue-50/50 text-blue-900 placeholder-blue-400"
                  placeholder="رمز عبور را دوباره وارد کنید"
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
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-bold text-base hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isLoading ? 'در حال ثبت...' : 'ورود به سیستم'}
            </button>

            <button
              type="button"
              onClick={onBack}
              disabled={isLoading}
              className="w-full mt-3 bg-white text-blue-700 py-3 rounded-xl font-bold text-base border-2 border-blue-300 hover:bg-blue-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              بازگشت
            </button>
          </form>
        </div>

        <div className="mt-6 text-center text-xs text-blue-700 bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-blue-200">
          شماره تلفن: {phoneNumber}
        </div>
      </div>
    </div>
  );
}
