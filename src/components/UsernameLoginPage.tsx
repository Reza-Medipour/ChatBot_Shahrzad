import { useState } from 'react';
import { User, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface UsernameLoginPageProps {
  onLogin: (userId: string, phoneNumber: string) => void;
  onBack: () => void;
}

export default function UsernameLoginPage({ onLogin, onBack }: UsernameLoginPageProps) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('لطفاً نام کاربری را وارد کنید');
      return;
    }

    setIsLoading(true);

    try {
      let { data: user, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username.trim())
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!user) {
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert({
            username: username.trim(),
            phone_number: '',
            is_registered: true,
            last_login: new Date().toISOString()
          })
          .select()
          .single();

        if (insertError) throw insertError;
        user = newUser;
      } else {
        await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', user.id);
      }

      onLogin(user.id, user.phone_number || username.trim());
    } catch (err) {
      console.error('Login error:', err);
      setError('خطا در ورود. لطفاً دوباره تلاش کنید');
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
            ورود با نام کاربری
          </h1>

          <p className="text-sm text-blue-700 leading-relaxed">
            نام کاربری خود را وارد کنید
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
                  placeholder="نام کاربری"
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
                  <span>ورود به چت</span>
                  <ArrowLeft className="w-5 h-5" />
                </>
              )}
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

          <div className="mt-6 pt-6 border-t border-blue-200">
            <div className="flex items-center justify-center gap-2 text-blue-700 text-xs">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>ورود امن</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
