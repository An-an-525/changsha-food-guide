import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-cream text-stone-800 font-sans selection:bg-xiang-red/20 selection:text-xiang-red">
      <Navbar />
      <main className="flex-grow pt-16 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}