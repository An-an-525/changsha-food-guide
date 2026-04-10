import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, Map as MapIcon, Utensils, Search as SearchIcon, PenSquare, LogOut, Bell, Sun, CloudRain, User } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useUser } from '../context/UserContext';
import toast from 'react-hot-toast';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useUser();

  const handleMockAction = (msg: string) => {
    toast(msg, { icon: '✨', duration: 2000 });
  };

  const navLinks = [
    { to: '/', icon: <Compass className="w-5 h-5 md:w-4 md:h-4" />, label: '周末导览' },
    { to: '/map', icon: <MapIcon className="w-5 h-5 md:w-4 md:h-4" />, label: '分类导图' },
    { to: '/search', icon: <SearchIcon className="w-5 h-5 md:w-4 md:h-4" />, label: '全网检索' },
    { to: '/publish', icon: <PenSquare className="w-5 h-5 md:w-4 md:h-4" />, label: '发布探店' },
  ];

  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/80 backdrop-blur-lg border-b border-stone-200/50">
      <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-serif font-bold text-xiang-red flex items-center gap-2 group">
          <Utensils className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          <div className="flex flex-col">
            <span className="tracking-widest leading-none">安的湘遇</span>
            <span className="text-[9px] uppercase tracking-widest text-stone-400 mt-1 font-sans">Curated by An</span>
          </div>
        </Link>
        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={twMerge(
                  clsx(
                    "flex items-center gap-1.5 font-medium transition-colors",
                    location.pathname === link.to 
                      ? "text-xiang-red border-b-2 border-xiang-red pb-1" 
                      : "text-stone-600 hover:text-xiang-red pb-1 border-b-2 border-transparent"
                  )
                )}
              >
                {link.icon}
                <span className="text-sm">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Global Utilities */}
          <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-stone-200 text-stone-500">
            <button onClick={() => handleMockAction('当前天气：多云转晴，24°C，适合出行探店。')} className="hover:text-amber-500 transition-colors" title="天气情况">
              <CloudRain className="w-4 h-4" />
            </button>
            <button onClick={() => handleMockAction('深色模式(Dark Mode)即将在下个版本开放！')} className="hover:text-dark transition-colors" title="主题切换">
              <Sun className="w-4 h-4" />
            </button>
            <button onClick={() => handleMockAction('暂无新消息通知')} className="hover:text-xiang-red transition-colors relative" title="消息中心">
              <Bell className="w-4 h-4" />
              {currentUser && <span className="absolute -top-1 -right-1 w-2 h-2 bg-xiang-red rounded-full"></span>}
            </button>
          </div>

          {/* User Status */}
          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-stone-200">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="text-xs font-bold bg-dark text-cream px-2 py-1 hover:bg-xiang-red transition-colors">
                  {currentUser}
                </Link>
                <button onClick={logout} className="text-stone-400 hover:text-xiang-red transition-colors" title="注销">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button onClick={handleLoginClick} className="text-xs font-bold text-xiang-red hover:underline">
                登录/注册
              </button>
            )}
          </div>
          
          {/* Mobile menu (simplified) - Removed in favor of MobileTabBar */}
        </div>
      </div>
    </nav>
  );
}