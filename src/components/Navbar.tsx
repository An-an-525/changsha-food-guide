import { Link, useLocation } from 'react-router-dom';
import { Compass, Map as MapIcon, Utensils, Search as SearchIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Navbar() {
  const location = useLocation();

  const navLinks = [
    { to: '/', icon: <Compass className="w-4 h-4" />, label: '周末导览' },
    { to: '/map', icon: <MapIcon className="w-4 h-4" />, label: '分类导图' },
    { to: '/search', icon: <SearchIcon className="w-4 h-4" />, label: '附近检索' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/80 backdrop-blur-lg border-b border-stone-200/50">
      <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-serif font-bold text-xiang-red flex items-center gap-2 group">
          <Utensils className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          <span className="tracking-widest">湘遇</span>
        </Link>
        <div className="flex items-center gap-6 md:gap-8">
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
              <span className="text-sm md:text-base">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}