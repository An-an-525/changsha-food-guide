import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { User, ShieldCheck, Smartphone, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Login() {
  const { login, currentUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loginMethod, setLoginMethod] = useState<'sms' | 'password'>('sms');
  const [loginInput, setLoginInput] = useState('');
  const [code, setCode] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Extract redirect path from URL query params
  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect') || '/';

  useEffect(() => {
    // If already logged in, redirect immediately
    if (currentUser) {
      navigate(redirectPath, { replace: true });
    }
  }, [currentUser, navigate, redirectPath]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAgreed) {
      alert('请先阅读并同意用户协议');
      return;
    }
    if (loginInput.trim()) {
      login(loginInput.trim());
      // The context update will trigger the currentUser useEffect above to redirect
    }
  };

  const isFormValid = loginInput.trim().length > 0 && (loginMethod === 'password' || code.length === 4) && isAgreed;

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <Helmet>
        <title>登录账号 - 安的湘遇</title>
      </Helmet>

      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-64 bg-dark"></div>
      <div className="absolute top-20 right-10 w-64 h-64 bg-xiang-red/20 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md bg-white shadow-2xl relative z-10 border border-stone-100 flex flex-col">
        {/* Header */}
        <div className="p-8 pb-6 border-b border-stone-100 text-center">
          <div className="w-16 h-16 bg-dark text-cream rounded-full mx-auto flex items-center justify-center mb-4 shadow-lg">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif text-dark mb-2">加入安的探店者联盟</h2>
          <p className="text-stone-500 text-sm">
            安全校验时间：<span className="font-mono">{currentTime.toLocaleString('zh-CN')}</span>
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-100">
          <button 
            type="button"
            onClick={() => setLoginMethod('sms')}
            className={twMerge(clsx(
              "flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors relative",
              loginMethod === 'sms' ? "text-xiang-red" : "text-stone-400 hover:text-stone-600"
            ))}
          >
            <Smartphone className="w-4 h-4" />
            短信验证登录
            {loginMethod === 'sms' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-xiang-red"></div>}
          </button>
          <button 
            type="button"
            onClick={() => setLoginMethod('password')}
            className={twMerge(clsx(
              "flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors relative",
              loginMethod === 'password' ? "text-xiang-red" : "text-stone-400 hover:text-stone-600"
            ))}
          >
            <ShieldCheck className="w-4 h-4" />
            密码直接登录
            {loginMethod === 'password' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-xiang-red"></div>}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="p-8">
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                {loginMethod === 'sms' ? '手机号 / 用户名' : '用户账号'}
              </label>
              <input 
                type="text"
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                placeholder={loginMethod === 'sms' ? "请输入手机号或昵称" : "请输入注册账号"}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:outline-none focus:border-xiang-red focus:bg-white transition-colors"
                autoFocus
              />
            </div>

            {loginMethod === 'sms' ? (
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">验证码</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    maxLength={4}
                    placeholder="4位验证码"
                    className="flex-1 px-4 py-3 bg-stone-50 border border-stone-200 focus:outline-none focus:border-xiang-red focus:bg-white transition-colors font-mono tracking-widest"
                  />
                  <button type="button" className="px-4 py-3 border border-stone-200 text-stone-600 text-sm font-medium hover:bg-stone-50 transition-colors whitespace-nowrap">
                    获取验证码
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">密码</label>
                <input 
                  type="password"
                  placeholder="请输入登录密码"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:outline-none focus:border-xiang-red focus:bg-white transition-colors"
                />
              </div>
            )}
          </div>

          <label className="flex items-start gap-2 mb-8 cursor-pointer group">
            <div className={clsx("w-4 h-4 rounded-sm border mt-0.5 flex items-center justify-center flex-shrink-0 transition-colors", isAgreed ? "bg-xiang-red border-xiang-red" : "border-stone-300 group-hover:border-xiang-red")}>
              {isAgreed && <CheckCircle2 className="w-3 h-3 text-white" />}
            </div>
            <input type="checkbox" className="hidden" checked={isAgreed} onChange={() => setIsAgreed(!isAgreed)} />
            <span className="text-xs text-stone-500 leading-relaxed">
              我已阅读并同意 <a href="#" className="text-blue-600 hover:underline">《安的湘遇用户服务协议》</a> 与 <a href="#" className="text-blue-600 hover:underline">《隐私政策》</a>。未注册的手机号/账号将自动创建新账号。
            </span>
          </label>

          <button 
            type="submit"
            disabled={!isFormValid}
            className={clsx(
              "w-full py-4 font-bold tracking-widest transition-all",
              isFormValid 
                ? "bg-xiang-red text-white hover:bg-xiang-red-dark shadow-md" 
                : "bg-stone-200 text-stone-400 cursor-not-allowed"
            )}
          >
            一键登录 / 注册
          </button>
        </form>
      </div>
    </div>
  );
}