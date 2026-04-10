import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ArrowUp, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Layout() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream text-stone-800 font-sans selection:bg-xiang-red/20 selection:text-xiang-red">
      <Navbar />
      <main className="flex-grow pt-16 flex flex-col relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex flex-col flex-grow"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-6 z-50 flex flex-col gap-3">
        <button 
          onClick={() => alert('合作咨询请联系安主理人直线：15574741562')}
          className="w-12 h-12 bg-dark text-cream rounded-full shadow-lg flex items-center justify-center hover:bg-xiang-red hover:scale-110 transition-all group"
          title="联系安主理人"
        >
          <MessageCircle className="w-5 h-5 group-hover:animate-pulse" />
        </button>

        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={scrollToTop}
              className="w-12 h-12 bg-white text-dark border border-stone-200 rounded-full shadow-md flex items-center justify-center hover:bg-stone-50 hover:scale-110 transition-all"
              title="回到顶部"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}