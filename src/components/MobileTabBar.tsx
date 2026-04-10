import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, Search, PenSquare, User } from 'lucide-react';
import { clsx } from 'clsx';
import { useUser } from '../context/UserContext';

export function MobileTabBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useUser();

  const tabs = [
    { path: '/', label: '首页', icon: Compass },
    { path: '/search', label: '发现', icon: Search },
    { path: '/publish', label: '发布', icon: PenSquare },
    { path: '/profile', label: '我的', icon: User }
  ];

  const handleTabClick = (e: React.MouseEvent, path: string) => {
    if ((path === '/publish' || path === '/profile') && !currentUser) {
      e.preventDefault();
      // Redirect logic for protected routes on mobile
      navigate(`/login?redirect=${encodeURIComponent(path)}`);
    }
  };

  // Hide tab bar on specific full-screen pages like Login or Detail if needed
  // For now, let's keep it mostly visible but hide on login
  if (location.pathname === '/login') return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 flex justify-between items-center h-[env(safe-area-inset-bottom,0px)+60px] pb-[env(safe-area-inset-bottom,0px)] z-50 px-2 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path || (tab.path === '/search' && location.pathname.startsWith('/search'));
        const Icon = tab.icon;
        
        return (
          <Link
            key={tab.path}
            to={tab.path}
            onClick={(e) => handleTabClick(e, tab.path)}
            className={clsx(
              "flex-1 flex flex-col items-center justify-center gap-1 h-full transition-colors",
              isActive ? "text-xiang-red" : "text-stone-400 hover:text-stone-600"
            )}
          >
            <Icon 
              className={clsx(
                "w-6 h-6 transition-transform duration-300", 
                isActive ? "scale-110 fill-xiang-red/10 stroke-[2.5]" : "stroke-2"
              )} 
            />
            <span className={clsx("text-[10px] font-medium", isActive && "font-bold")}>
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}