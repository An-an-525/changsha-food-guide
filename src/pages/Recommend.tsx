import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMergedPlaces } from '../data/mockData';
import { PlaceCard } from '../components/PlaceCard';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, User, MapPin, Coffee, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

type Step = 'budget' | 'who' | 'category' | 'result';

export function Recommend() {
  const navigate = useNavigate();
  const mockPlaces = getMergedPlaces();
  const [step, setStep] = useState<Step>('budget');
  
  const [answers, setAnswers] = useState({
    budget: '',
    who: '',
    category: ''
  });

  const getResults = () => {
    let places = [...mockPlaces];
    
    // Filter logic based on answers
    if (answers.budget === 'cheap') places = places.filter(p => p.costPerformance >= 4.5 || parseInt(p.priceRange.replace(/\D/g, '')) <= 30);
    if (answers.budget === 'expensive') places = places.filter(p => parseInt(p.priceRange.replace(/\D/g, '')) > 80);
    
    if (answers.who === 'date') places = places.filter(p => p.category === '湘菜' || p.category === '甜点' || !p.studentFriendly);
    if (answers.who === 'friends') places = places.filter(p => p.category === '夜市/烧烤' || p.category === '夜市/龙虾' || p.popularity > 85);
    if (answers.who === 'alone') places = places.filter(p => p.category === '小吃' || p.category === '粉面' || p.category === '饮品');

    if (answers.category === 'spicy') places = places.filter(p => p.category === '湘菜' || p.category === '夜市/烧烤');
    if (answers.category === 'sweet') places = places.filter(p => p.category === '甜点' || p.category === '饮品' || p.category === '小吃');
    if (answers.category === 'snack') places = places.filter(p => p.category === '小吃' || p.category === '粉面');

    // Return top 3 matches
    return places.sort((a, b) => b.costPerformance - a.costPerformance).slice(0, 3);
  };

  const handleSelect = (key: keyof typeof answers, value: string, nextStep: Step) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    setTimeout(() => setStep(nextStep), 300); // Slight delay for UX
  };

  const renderStep = () => {
    if (step === 'budget') {
      return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-serif text-dark mb-8 text-center">今天这顿，你的预算是？</h2>
          <div className="flex flex-col w-full max-w-md gap-4">
            <button onClick={() => handleSelect('budget', 'cheap', 'who')} className="w-full py-6 bg-white border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50 text-stone-600 font-bold rounded-xl transition-all shadow-sm flex flex-col items-center justify-center group">
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">💰</span>
              主打性价比 (30元以下)
            </button>
            <button onClick={() => handleSelect('budget', 'mid', 'who')} className="w-full py-6 bg-white border border-stone-200 hover:border-blue-500 hover:bg-blue-50 text-stone-600 font-bold rounded-xl transition-all shadow-sm flex flex-col items-center justify-center group">
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">💵</span>
              吃得舒服点 (30-80元)
            </button>
            <button onClick={() => handleSelect('budget', 'expensive', 'who')} className="w-full py-6 bg-white border border-stone-200 hover:border-amber-500 hover:bg-amber-50 text-stone-600 font-bold rounded-xl transition-all shadow-sm flex flex-col items-center justify-center group">
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">💳</span>
              不差钱，吃顿好的 (80元以上)
            </button>
          </div>
        </motion.div>
      );
    }
    if (step === 'who') {
      return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-serif text-dark mb-8 text-center">打算和谁一起去？</h2>
          <div className="flex flex-col w-full max-w-md gap-4">
            <button onClick={() => handleSelect('who', 'date', 'category')} className="w-full py-6 bg-white border border-stone-200 hover:border-pink-500 hover:bg-pink-50 text-stone-600 font-bold rounded-xl transition-all shadow-sm flex flex-col items-center justify-center group">
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">💕</span>
              约会 / 带对象
            </button>
            <button onClick={() => handleSelect('who', 'friends', 'category')} className="w-full py-6 bg-white border border-stone-200 hover:border-purple-500 hover:bg-purple-50 text-stone-600 font-bold rounded-xl transition-all shadow-sm flex flex-col items-center justify-center group">
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">🍻</span>
              朋友聚餐 / 团建
            </button>
            <button onClick={() => handleSelect('who', 'alone', 'category')} className="w-full py-6 bg-white border border-stone-200 hover:border-stone-500 hover:bg-stone-100 text-stone-600 font-bold rounded-xl transition-all shadow-sm flex flex-col items-center justify-center group">
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">🚶</span>
              独自一人享用
            </button>
          </div>
        </motion.div>
      );
    }
    if (step === 'category') {
      return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-serif text-dark mb-8 text-center">此刻最想吃什么口味？</h2>
          <div className="flex flex-col w-full max-w-md gap-4">
            <button onClick={() => handleSelect('category', 'spicy', 'result')} className="w-full py-6 bg-white border border-stone-200 hover:border-red-500 hover:bg-red-50 text-stone-600 font-bold rounded-xl transition-all shadow-sm flex flex-col items-center justify-center group">
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">🌶️</span>
              无辣不欢，重口湘菜
            </button>
            <button onClick={() => handleSelect('category', 'sweet', 'result')} className="w-full py-6 bg-white border border-stone-200 hover:border-orange-500 hover:bg-orange-50 text-stone-600 font-bold rounded-xl transition-all shadow-sm flex flex-col items-center justify-center group">
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">🍰</span>
              清淡点 / 甜点饮品
            </button>
            <button onClick={() => handleSelect('category', 'snack', 'result')} className="w-full py-6 bg-white border border-stone-200 hover:border-indigo-500 hover:bg-indigo-50 text-stone-600 font-bold rounded-xl transition-all shadow-sm flex flex-col items-center justify-center group">
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">🍜</span>
              碳水炸弹，街头小吃粉面
            </button>
          </div>
        </motion.div>
      );
    }
    if (step === 'result') {
      const results = getResults();
      return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mx-auto flex items-center justify-center text-white shadow-lg mb-6">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-dark mb-4">为您量身定制的私藏推荐</h2>
            <p className="text-stone-500 max-w-lg mx-auto">
              基于您的选择（{answers.budget === 'cheap' ? '性价比' : answers.budget === 'expensive' ? '高预算' : '适中预算'} + 
              {answers.who === 'date' ? '约会' : answers.who === 'friends' ? '聚餐' : '一人食'} + 
              {answers.category === 'spicy' ? '重口辣味' : answers.category === 'sweet' ? '清淡甜品' : '街头碳水'}），
              我们从百家店铺中为您筛选出以下最佳选择：
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {results.length > 0 ? results.map((place, i) => (
              <motion.div key={place.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <div className="relative">
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-dark text-white rounded-full flex items-center justify-center font-bold z-20 shadow-md">
                    {i + 1}
                  </div>
                  <PlaceCard place={place} />
                </div>
              </motion.div>
            )) : (
              <div className="col-span-3 text-center py-20 bg-white border border-stone-200 rounded-xl">
                <Coffee className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                <h3 className="text-xl font-serif text-stone-600 mb-2">哎呀，没有完全匹配的店铺</h3>
                <p className="text-stone-400 mb-6">也许您可以放宽一些条件再试一次？</p>
                <button onClick={() => { setStep('budget'); setAnswers({budget:'', who:'', category:''}); }} className="px-6 py-2 bg-xiang-red text-white rounded-full hover:bg-xiang-red-dark transition-colors">
                  重新测试
                </button>
              </div>
            )}
          </div>

          {results.length > 0 && (
            <div className="mt-12 flex justify-center gap-4">
              <button onClick={() => { setStep('budget'); setAnswers({budget:'', who:'', category:''}); }} className="px-6 py-3 border border-stone-200 text-stone-600 font-bold hover:bg-stone-50 transition-colors rounded-full">
                重新测试
              </button>
              <Link to="/" className="px-6 py-3 bg-dark text-white font-bold hover:bg-xiang-red transition-colors rounded-full flex items-center gap-2">
                返回首页 <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </motion.div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col pt-8 md:pt-12 pb-24 relative overflow-hidden">
      <Helmet>
        <title>AI 自主推荐 - 安的湘遇</title>
      </Helmet>

      {/* Decorative */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto w-full px-4 md:px-8 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-stone-500 hover:text-dark transition-colors mb-12 text-sm font-bold tracking-widest uppercase">
          <ArrowLeft className="w-4 h-4" /> 取消推荐
        </Link>

        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>
    </div>
  );
}