import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { OnboardingGuide } from './OnboardingGuide';
import { MobileTabBar } from './MobileTabBar';
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
      <main className="flex-grow pt-16 pb-16 md:pb-0 flex flex-col relative">
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
      <OnboardingGuide />
      <MobileTabBar />

      {/* Floating Action Buttons (Hidden on mobile to prevent overlap with TabBar) */}
      <div className="fixed bottom-8 right-6 z-50 hidden md:flex flex-col gap-3">
        <button 
          onClick={() => {
            const footer = document.getElementById('contact-footer');
            footer?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="w-12 h-12 bg-white text-stone-600 rounded-full shadow-lg flex items-center justify-center hover:bg-stone-50 hover:text-xiang-red transition-all group border border-stone-200"
          title="联系主理人"
        >
          <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToTop}
              className="w-12 h-12 bg-dark text-cream rounded-full shadow-lg flex items-center justify-center hover:bg-xiang-red transition-colors group"
              title="回到顶部"
            >
              <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}