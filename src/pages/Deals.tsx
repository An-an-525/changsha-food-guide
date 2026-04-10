import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getMergedPlaces } from '../data/mockData';
import { Helmet } from 'react-helmet-async';
import { Ticket, ArrowLeft, Search, Navigation } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useUser } from '../context/UserContext';

export function Deals() {
  const { profile, addPoints } = useUser();
  const navigate = useNavigate();
  const mockPlaces = getMergedPlaces();
  const [searchTerm, setSearchTerm] = useState('');

  const allDeals = useMemo(() => {
    return mockPlaces.flatMap(p => 
      (p.deals || []).map(d => ({ ...d, placeId: p.id, placeName: p.name, image: p.images[0], area: p.location.area }))
    ).filter(d => d.title.includes(searchTerm) || d.placeName.includes(searchTerm));
  }, [mockPlaces, searchTerm]);

  const handleBuy = (deal: typeof allDeals[0]) => {
    toast.success(`模拟支付成功！获得【${deal.placeName}】${deal.title}。积分 +10`, { icon: '💳' });
    addPoints(10, '团购消费奖励');
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col pt-4 md:pt-8 pb-24">
      <Helmet>
        <title>特惠团购中心 - 安的湘遇</title>
      </Helmet>

      <div className="max-w-6xl mx-auto w-full px-4 md:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-stone-500 hover:text-dark transition-colors mb-6 text-sm font-bold tracking-widest uppercase">
          <ArrowLeft className="w-4 h-4" /> 返回首页
        </Link>

        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-8 md:p-12 mb-8 relative overflow-hidden text-white shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center shadow-lg rotate-3">
                <Ticket className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-serif mb-2">特惠团购中心</h1>
                <p className="text-white/80 text-sm">全网真实底价，涵盖百家餐厅超值代金券与套餐。</p>
              </div>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input 
                type="text"
                placeholder="搜索店铺或套餐名..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-full bg-white text-dark focus:outline-none focus:ring-2 focus:ring-white/50 transition-shadow"
              />
            </div>
          </div>
        </div>

        {/* List */}
        {allDeals.length === 0 ? (
          <div className="text-center py-20 text-stone-400">没有找到相关优惠信息。</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allDeals.map((deal, index) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-stone-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group flex flex-col"
              >
                <div className="h-40 relative overflow-hidden bg-stone-100">
                  <img src={deal.image} alt={deal.placeName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-3 left-3 bg-dark/80 backdrop-blur text-white text-xs px-2 py-1 rounded">
                    {deal.area}
                  </div>
                  <div className="absolute top-3 right-3 bg-xiang-red text-white text-xs font-bold px-2 py-1 rounded shadow-md">
                    已售 {deal.sold}+
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <div 
                    onClick={() => navigate(`/restaurant/${deal.placeId}`)}
                    className="text-stone-500 text-xs flex items-center gap-1 mb-2 hover:text-xiang-red cursor-pointer transition-colors"
                  >
                    <Navigation className="w-3 h-3" /> {deal.placeName}
                  </div>
                  <h3 className="font-bold text-dark text-lg mb-4 line-clamp-2 leading-tight">
                    {deal.title}
                  </h3>
                  
                  <div className="mt-auto flex items-end justify-between pt-4 border-t border-stone-100">
                    <div>
                      <span className="text-2xl font-bold text-xiang-red mr-2">¥{deal.price}</span>
                      <span className="text-sm text-stone-400 line-through">¥{deal.originalPrice}</span>
                    </div>
                    <button 
                      onClick={() => handleBuy(deal)}
                      className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-bold rounded-full hover:shadow-md hover:scale-105 transition-all"
                    >
                      抢购
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}