import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { getMergedPlaces } from '../data/mockData';
import { PlaceCard } from '../components/PlaceCard';
import { Award, Star, Heart, MapPin, TrendingUp, ShieldCheck, History, Gift, Store } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link, Navigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import toast from 'react-hot-toast';

type Tab = 'published' | 'favorites' | 'likes' | 'history' | 'store';

export function Profile() {
  const { profile, currentUser, addPoints } = useUser();
  const [activeTab, setActiveTab] = useState<Tab>('favorites');

  if (!currentUser || !profile) {
    return <Navigate to="/publish" replace />;
  }

  const mockPlaces = getMergedPlaces();
  
  const publishedPlaces = mockPlaces.filter(p => p.author === currentUser);
  const favoritePlaces = mockPlaces.filter(p => profile.favorites.includes(p.id));
  const likedPlaces = mockPlaces.filter(p => profile.likes.includes(p.id));
  const historyPlaces = profile.history.map(id => mockPlaces.find(p => p.id === id)).filter(Boolean) as typeof mockPlaces;

  const handleRedeem = (item: string, cost: number) => {
    if (profile.points >= cost) {
      addPoints(-cost, `兑换商品: ${item}`);
      toast.success(`成功兑换 ${item}！将通过系统消息发放。`, { icon: '🎁' });
    } else {
      toast.error(`积分不足！还差 ${cost - profile.points} 分，快去多打卡吧~`);
    }
  };

  const getLevel = (points: number) => {
    if (points >= 100) return { title: '资深老饕', color: 'text-purple-600', bg: 'bg-purple-100', icon: <ShieldCheck className="w-5 h-5 text-purple-600" /> };
    if (points >= 50) return { title: '美食达人', color: 'text-blue-600', bg: 'bg-blue-100', icon: <Award className="w-5 h-5 text-blue-600" /> };
    if (points >= 20) return { title: '探店新星', color: 'text-emerald-600', bg: 'bg-emerald-100', icon: <TrendingUp className="w-5 h-5 text-emerald-600" /> };
    return { title: '见习食客', color: 'text-stone-600', bg: 'bg-stone-100', icon: <Star className="w-5 h-5 text-stone-600" /> };
  };

  const levelInfo = getLevel(profile.points);

  const renderTabContent = () => {
    let places = [];
    let emptyMessage = '';
    
    if (activeTab === 'published') {
      places = publishedPlaces;
      emptyMessage = '你还没有发布过任何探店记录，快去分享你的私藏吧！';
    } else if (activeTab === 'favorites') {
      places = favoritePlaces;
      emptyMessage = '你还没有收藏过任何地点，去探索一下长沙的美食吧！';
    } else if (activeTab === 'likes') {
      places = likedPlaces;
      emptyMessage = '你还没有点赞过任何地点，去给喜欢的探店点个赞吧！';
    } else if (activeTab === 'history') {
      places = historyPlaces;
      emptyMessage = '最近没有浏览记录，去首页随便逛逛吧！';
    } else if (activeTab === 'store') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[
            { name: '茶颜悦色幽兰拿铁兑换券', cost: 100, image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=60&w=400' },
            { name: '笨萝卜湘菜馆免排队VIP卡', cost: 300, image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&q=60&w=400' },
            { name: '安的私藏·绝密探店地图PDF', cost: 50, image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=60&w=400' }
          ].map((item, i) => (
            <div key={i} className="bg-white border border-stone-200 shadow-sm overflow-hidden flex flex-col group">
              <div className="h-40 bg-stone-100 overflow-hidden relative">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-3 right-3 bg-xiang-red text-white text-xs font-bold px-2 py-1 shadow-md">
                  {item.cost} 积分
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h4 className="font-bold text-dark mb-4">{item.name}</h4>
                <button 
                  onClick={() => handleRedeem(item.name, item.cost)}
                  className="mt-auto w-full py-2 bg-dark text-cream text-sm font-bold tracking-widest hover:bg-xiang-red transition-colors"
                >
                  立即兑换
                </button>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (places.length === 0) {
      return (
        <div className="text-center py-20 bg-white border border-stone-200 mt-8">
          <MapPin className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <h3 className="text-xl font-serif text-stone-600 mb-2">空空如也</h3>
          <p className="text-stone-400 text-sm mb-6">{emptyMessage}</p>
          {activeTab === 'published' ? (
            <Link to="/publish" className="bg-xiang-red text-white px-6 py-2 text-sm tracking-widest hover:bg-xiang-red-dark transition-colors inline-block">
              去发布探店
            </Link>
          ) : (
            <Link to="/search" className="bg-xiang-red text-white px-6 py-2 text-sm tracking-widest hover:bg-xiang-red-dark transition-colors inline-block">
              去全网检索
            </Link>
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {places.map((place, index) => (
          <motion.div
            key={place.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <PlaceCard place={place} />
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col pt-8 pb-24">
      <Helmet>
        <title>{currentUser}的个人主页 · 安的湘遇</title>
      </Helmet>

      <div className="max-w-6xl mx-auto w-full px-4 md:px-8">
        {/* Profile Header */}
        <div className="bg-white border border-stone-200 p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-xiang-red/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="w-24 h-24 rounded-full bg-dark text-cream flex items-center justify-center text-4xl font-serif font-bold shrink-0 z-10 border-4 border-white shadow-lg">
            {currentUser.charAt(0).toUpperCase()}
          </div>
          
          <div className="flex-grow text-center md:text-left z-10">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2 justify-center md:justify-start">
              <h1 className="text-3xl font-serif text-dark">{currentUser}</h1>
              <div className={twMerge(clsx("flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold w-fit mx-auto md:mx-0", levelInfo.bg, levelInfo.color))}>
                {levelInfo.icon}
                {levelInfo.title}
              </div>
            </div>
            
            <p className="text-stone-500 text-sm mb-6 max-w-lg mx-auto md:mx-0">
              欢迎来到你的美食宇宙。在这里管理你的私人收藏，分享你的独家探店记录。
            </p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 border-t border-stone-100 pt-6">
              <div className="text-center md:text-left">
                <p className="text-xs text-stone-400 uppercase tracking-wider mb-1">积分</p>
                <p className="text-2xl font-bold text-dark font-mono">{profile.points}</p>
              </div>
              <div className="w-px h-8 bg-stone-200"></div>
              <div className="text-center md:text-left">
                <p className="text-xs text-stone-400 uppercase tracking-wider mb-1">发布</p>
                <p className="text-2xl font-bold text-dark font-mono">{publishedPlaces.length}</p>
              </div>
              <div className="w-px h-8 bg-stone-200"></div>
              <div className="text-center md:text-left">
                <p className="text-xs text-stone-400 uppercase tracking-wider mb-1">收藏</p>
                <p className="text-2xl font-bold text-dark font-mono">{profile.favorites.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <button
            onClick={() => setActiveTab('favorites')}
            className={twMerge(clsx(
              "flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors relative flex-shrink-0",
              activeTab === 'favorites' ? "text-xiang-red" : "text-stone-500 hover:text-stone-800"
            ))}
          >
            <Star className="w-4 h-4" />
            我的收藏
            {activeTab === 'favorites' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-xiang-red" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('likes')}
            className={twMerge(clsx(
              "flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors relative flex-shrink-0",
              activeTab === 'likes' ? "text-xiang-red" : "text-stone-500 hover:text-stone-800"
            ))}
          >
            <Heart className="w-4 h-4" />
            我的点赞
            {activeTab === 'likes' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-xiang-red" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={twMerge(clsx(
              "flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors relative flex-shrink-0",
              activeTab === 'history' ? "text-xiang-red" : "text-stone-500 hover:text-stone-800"
            ))}
          >
            <History className="w-4 h-4" />
            最近浏览
            {activeTab === 'history' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-xiang-red" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('published')}
            className={twMerge(clsx(
              "flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors relative flex-shrink-0",
              activeTab === 'published' ? "text-xiang-red" : "text-stone-500 hover:text-stone-800"
            ))}
          >
            <MapPin className="w-4 h-4" />
            我的发布
            {activeTab === 'published' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-xiang-red" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('store')}
            className={twMerge(clsx(
              "flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors relative flex-shrink-0",
              activeTab === 'store' ? "text-xiang-red" : "text-stone-500 hover:text-stone-800"
            ))}
          >
            <Store className="w-4 h-4" />
            积分商城
            {activeTab === 'store' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-xiang-red" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
