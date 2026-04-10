import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMergedPlaces } from '../data/mockData';
import { PlaceCard } from '../components/PlaceCard';
import { Helmet } from 'react-helmet-async';
import { Trophy, Flame, ThumbsUp, MapPin, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

type RankType = 'popularity' | 'costPerformance' | 'xiangcai' | 'xiaochi';

export function Leaderboard() {
  const [activeTab, setActiveTab] = useState<RankType>('popularity');
  const mockPlaces = getMergedPlaces();

  const getRankedPlaces = () => {
    let places = [...mockPlaces];
    if (activeTab === 'popularity') {
      places.sort((a, b) => b.popularity - a.popularity);
    } else if (activeTab === 'costPerformance') {
      places.sort((a, b) => b.costPerformance - a.costPerformance);
    } else if (activeTab === 'xiangcai') {
      places = places.filter(p => p.category === '湘菜').sort((a, b) => b.popularity - a.popularity);
    } else if (activeTab === 'xiaochi') {
      places = places.filter(p => p.category.includes('小吃')).sort((a, b) => b.popularity - a.popularity);
    }
    return places.slice(0, 20); // Show top 20
  };

  const rankedPlaces = getRankedPlaces();

  const getMedalColor = (index: number) => {
    if (index === 0) return 'text-amber-400 bg-amber-50 border-amber-200';
    if (index === 1) return 'text-stone-400 bg-stone-50 border-stone-200';
    if (index === 2) return 'text-orange-400 bg-orange-50 border-orange-200';
    return 'text-stone-500 bg-stone-100 border-stone-200';
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col pt-4 md:pt-8 pb-24">
      <Helmet>
        <title>必吃榜单 - 安的湘遇</title>
      </Helmet>

      <div className="max-w-6xl mx-auto w-full px-4 md:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-stone-500 hover:text-dark transition-colors mb-6 text-sm font-bold tracking-widest uppercase">
          <ArrowLeft className="w-4 h-4" /> 返回首页
        </Link>

        {/* Header */}
        <div className="bg-white border border-stone-200 p-8 md:p-12 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-3">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-serif text-dark mb-2">权威必吃榜单</h1>
              <p className="text-stone-500 text-sm">基于全网真实 UGC 数据与安的主理人深度调研生成，杜绝虚假刷单。</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto whitespace-nowrap border-b border-stone-200 mb-8 scrollbar-hide">
          <button
            onClick={() => setActiveTab('popularity')}
            className={twMerge(clsx("flex items-center gap-2 px-6 py-4 text-sm font-bold transition-colors relative", activeTab === 'popularity' ? "text-xiang-red" : "text-stone-500 hover:text-stone-800"))}
          >
            <Flame className="w-4 h-4" /> 全城热度总榜
            {activeTab === 'popularity' && <motion.div layoutId="rankTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-xiang-red" />}
          </button>
          <button
            onClick={() => setActiveTab('costPerformance')}
            className={twMerge(clsx("flex items-center gap-2 px-6 py-4 text-sm font-bold transition-colors relative", activeTab === 'costPerformance' ? "text-xiang-red" : "text-stone-500 hover:text-stone-800"))}
          >
            <ThumbsUp className="w-4 h-4" /> 极致性价比榜
            {activeTab === 'costPerformance' && <motion.div layoutId="rankTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-xiang-red" />}
          </button>
          <button
            onClick={() => setActiveTab('xiangcai')}
            className={twMerge(clsx("flex items-center gap-2 px-6 py-4 text-sm font-bold transition-colors relative", activeTab === 'xiangcai' ? "text-xiang-red" : "text-stone-500 hover:text-stone-800"))}
          >
            <Trophy className="w-4 h-4" /> 湘菜必吃榜
            {activeTab === 'xiangcai' && <motion.div layoutId="rankTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-xiang-red" />}
          </button>
          <button
            onClick={() => setActiveTab('xiaochi')}
            className={twMerge(clsx("flex items-center gap-2 px-6 py-4 text-sm font-bold transition-colors relative", activeTab === 'xiaochi' ? "text-xiang-red" : "text-stone-500 hover:text-stone-800"))}
          >
            <MapPin className="w-4 h-4" /> 街头小吃榜
            {activeTab === 'xiaochi' && <motion.div layoutId="rankTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-xiang-red" />}
          </button>
        </div>

        {/* List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {rankedPlaces.map((place, index) => (
              <motion.div
                key={place.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="relative"
              >
                {/* Rank Badge */}
                <div className={clsx(
                  "absolute -top-3 -left-3 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg z-20 shadow-sm border-2",
                  getMedalColor(index)
                )}>
                  {index + 1}
                </div>
                <PlaceCard place={place} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}