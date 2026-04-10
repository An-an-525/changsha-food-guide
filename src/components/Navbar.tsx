import { Link, useLocation } from 'react-router-dom';
import { Compass, Map as MapIcon, Utensils, Search as SearchIcon, PenSquare, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useUser } from '../context/UserContext';

export function Navbar() {
  const location = useLocation();
  const { currentUser, logout } = useUser();

  const navLinks = [
    { to: '/', icon: <Compass className="w-4 h-4" />, label: '周末导览' },
    { to: '/map', icon: <MapIcon className="w-4 h-4" />, label: '分类导图' },
    { to: '/search', icon: <SearchIcon className="w-4 h-4" />, label: '全网检索' },
    { to: '/publish', icon: <PenSquare className="w-4 h-4" />, label: '发布探店' },
  ];

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

          {/* User Status */}
          <div className="flex items-center gap-2 pl-4 border-l border-stone-200">
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
              <Link to="/publish" className="text-xs font-bold text-xiang-red hover:underline">
                登录/注册
              </Link>
            )}
          </div>
          
          {/* Mobile menu (simplified) */}
          <div className="md:hidden flex items-center gap-3">
            {navLinks.slice(2).map((link) => (
               <Link key={link.to} to={link.to} className={location.pathname === link.to ? "text-xiang-red" : "text-stone-600"}>
                 {link.icon}
               </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}