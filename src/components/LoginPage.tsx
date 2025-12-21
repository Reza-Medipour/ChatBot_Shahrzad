import { useState } from 'react';
import { Phone, Key, ArrowLeft } from 'lucide-react';

interface LoginPageProps {
  onVerified: (phoneNumber: string) => void;
}

export default function LoginPage({ onVerified }: LoginPageProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phoneNumber.trim() || phoneNumber.length < 10) {
      setError('لطفاً شماره تلفن معتبر وارد کنید');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsCodeSent(true);
      setIsLoading(false);
    }, 1000);
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!verificationCode.trim()) {
      setError('لطفاً کد تایید را وارد کنید');
      return;
    }

    if (verificationCode !== '12345') {
      setError('کد تایید نادرست است. از کد 12345 استفاده کنید');
      return;
    }

    setIsLoading(true);

    try {
      await onVerified(phoneNumber);
    } catch (error) {
      console.error('Verification error:', error);
      setError('خطا در تایید. لطفاً دوباره تلاش کنید');
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setPhoneNumber(value);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setVerificationCode(value);
  };

  const handleEditPhone = () => {
    setIsCodeSent(false);
    setVerificationCode('');
    setError('');
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center overflow-auto">
      <div className="w-full max-w-md px-4 py-8">
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Phone className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-blue-900 mb-2">
            ورود به سیستم
          </h1>

          <p className="text-sm text-blue-700 leading-relaxed">
            {!isCodeSent
              ? 'لطفاً شماره تلفن خود را وارد کنید'
              : 'کد تایید ارسال شده را وارد کنید'}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm border border-blue-100">
          {!isCodeSent ? (
            <form onSubmit={handleSendCode}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-blue-900 mb-2 text-right">
                  شماره تلفن
                </label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="09123456789"
                    className="w-full pr-10 pl-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left bg-blue-50/50 text-blue-900 placeholder-blue-400"
                    disabled={isLoading}
                    dir="ltr"
                    maxLength={11}
                  />
                </div>
                <p className="text-xs text-blue-600 mt-2 text-right">
                  مثال: 09123456789
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl text-center text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!phoneNumber.trim() || phoneNumber.length < 10 || isLoading}
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
                    <span>ارسال کد تایید</span>
                    <ArrowLeft className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-blue-900 mb-2 text-right">
                  شماره تلفن
                </label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    disabled
                    className="w-full pr-10 pl-4 py-3 border-2 border-blue-200 rounded-xl text-left bg-blue-100 text-blue-700"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={handleEditPhone}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 text-sm font-semibold hover:text-blue-800"
                  >
                    ویرایش
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-blue-900 mb-2 text-right">
                  کد تایید
                </label>
                <div className="relative">
                  <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={handleCodeChange}
                    placeholder="12345"
                    className="w-full pr-10 pl-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest bg-blue-50/50 text-blue-900 placeholder-blue-400 font-bold"
                    disabled={isLoading}
                    maxLength={5}
                    autoFocus
                  />
                </div>
                <div className="mt-3 p-3 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                  <p className="text-xs text-yellow-800 text-center font-semibold">
                    این سیستم در مرحله تست است
                  </p>
                  <p className="text-xs text-yellow-700 text-center mt-1">
                    برای ورود از کد <span className="font-bold">12345</span> استفاده کنید
                  </p>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl text-center text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!verificationCode.trim() || isLoading}
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
                    <span>تایید کد</span>
                    <ArrowLeft className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-blue-200">
            <div className="flex items-center justify-center gap-2 text-blue-700 text-xs">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>ورود امن و سریع</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
