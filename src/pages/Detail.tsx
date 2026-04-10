import { useParams, Link } from 'react-router-dom';
import { mockPlaces, mockReviews } from '../data/mockData';
import { MapPin, ArrowLeft, Star, ThumbsUp, ThumbsDown, Utensils, Info, Flame, TrendingUp, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

export function Detail() {
  const { id } = useParams<{ id: string }>();
  
  const place = mockPlaces.find(p => p.id === id);
  const reviews = mockReviews.filter(r => r.restaurantId === id);
  const nearbySpots = mockPlaces.filter(p => p.type === 'spot' && p.location.area === place?.location.area && p.id !== place.id);

  if (!place) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <h2 className="text-2xl font-serif text-dark mb-4">未找到该地点</h2>
          <Link to="/" className="text-xiang-red hover:underline flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> 返回首页
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pb-24">
      {/* Hero Header */}
      <div className="relative h-[50vh] md:h-[60vh] w-full bg-dark">
        <img 
          src={place.images[0]} 
          alt={place.name}
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cream via-transparent to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-6xl mx-auto">
          <button onClick={() => window.history.back()} className="inline-flex items-center gap-2 text-dark bg-white/80 backdrop-blur px-4 py-2 text-sm mb-6 hover:bg-white transition-colors cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> 返回
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="bg-xiang-red text-white text-xs px-3 py-1.5 tracking-wider uppercase shadow-sm">
                  {place.category}
                </span>
                <span className="text-dark bg-white/90 backdrop-blur px-3 py-1.5 text-xs font-mono font-bold shadow-sm">
                  {place.priceRange}
                </span>
                {place.studentFriendly && (
                  <span className="bg-amber-400 text-dark text-xs px-3 py-1.5 font-bold shadow-sm flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5" /> 大学生优选
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-6xl font-serif text-dark mb-4 drop-shadow-md">
                {place.name}
              </h1>
              <p className="text-stone-800 flex items-center gap-2 text-sm md:text-base font-medium">
                <MapPin className="w-5 h-5 text-xiang-red" />
                {place.location.address} ({place.location.area})
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content: Info & Reviews */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Scores Overview */}
          <section className="flex gap-6 border-y border-stone-200 py-6">
             <div className="flex flex-col items-center flex-1 border-r border-stone-200">
               <span className="text-stone-500 text-xs tracking-widest uppercase mb-2 flex items-center gap-1"><Flame className="w-3 h-3"/> 综合热度</span>
               <span className="text-3xl font-serif text-dark">{place.popularity}<span className="text-sm text-stone-400 ml-1">/100</span></span>
             </div>
             <div className="flex flex-col items-center flex-1">
               <span className="text-stone-500 text-xs tracking-widest uppercase mb-2 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> 性价比指数</span>
               <span className="text-3xl font-serif text-dark">{place.costPerformance.toFixed(1)}<span className="text-sm text-stone-400 ml-1">/5.0</span></span>
             </div>
          </section>

          {/* Features */}
          <section>
            <h2 className="text-2xl font-serif text-dark mb-6 flex items-center gap-2">
              <Utensils className="w-6 h-6 text-xiang-red" />
              特色速览
            </h2>
            <div className="flex flex-wrap gap-3">
              {place.features.map(f => (
                <span key={f} className="px-4 py-2 border border-stone-200 text-stone-600 bg-white shadow-sm text-sm">
                  {f}
                </span>
              ))}
            </div>
          </section>

          {/* Real Reviews */}
          <section>
            <div className="mb-8">
              <h2 className="text-2xl font-serif text-dark mb-2">真实多维评价</h2>
              <p className="text-stone-500 text-sm">打破虚假滤镜，还原最真实的用餐体验。褒贬不一，仅供参考。</p>
            </div>

            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review, i) => (
                  <motion.div 
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-6 md:p-8 border border-stone-100 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-6 border-b border-stone-100 pb-4">
                      <div>
                        <span className="font-bold text-dark block mb-1">{review.author}</span>
                        <span className="text-xs text-stone-400 font-mono">{review.date}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-stone-50 px-3 py-1">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="font-bold text-dark">{review.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-emerald-50/50 p-4 border-l-2 border-emerald-400">
                        <h4 className="text-emerald-700 text-sm font-bold flex items-center gap-2 mb-2">
                          <ThumbsUp className="w-4 h-4" /> 值得推荐
                        </h4>
                        <p className="text-stone-600 text-sm leading-relaxed">{review.pros}</p>
                      </div>
                      <div className="bg-xiang-red/5 p-4 border-l-2 border-xiang-red">
                        <h4 className="text-xiang-red text-sm font-bold flex items-center gap-2 mb-2">
                          <ThumbsDown className="w-4 h-4" /> 可能踩雷
                        </h4>
                        <p className="text-stone-600 text-sm leading-relaxed">{review.cons}</p>
                      </div>
                    </div>
                    
                    <div className="text-stone-700 text-sm leading-relaxed bg-stone-50 p-4 relative mt-6 border border-stone-100">
                      <span className="absolute -top-3 left-4 bg-white px-2 text-xs text-stone-400 font-serif italic border border-stone-100">详细体验</span>
                      {review.content}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-stone-50 p-8 text-center border border-stone-100 border-dashed">
                <Info className="w-6 h-6 text-stone-400 mx-auto mb-2" />
                <p className="text-stone-500">暂无该地点的评价信息</p>
              </div>
            )}
          </section>
        </div>

        {/* Sidebar: Map & Nearby */}
        <div className="space-y-8">
          {/* Mock Map View */}
          <div className="bg-white border border-stone-200 p-2 shadow-sm">
            <div className="aspect-square bg-stone-100 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              <div className="relative z-10 flex flex-col items-center">
                <MapPin className="w-8 h-8 text-xiang-red mb-2 drop-shadow-md" />
                <div className="bg-dark text-cream text-xs px-3 py-1 shadow-lg max-w-[80%] text-center">
                  {place.location.address}
                </div>
              </div>
            </div>
            <a 
              href={`https://uri.amap.com/search?keyword=${encodeURIComponent(place.name + ' ' + place.location.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 text-center bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-medium transition-colors mt-2"
            >
              在地图中打开
            </a>
          </div>

          {/* Nearby Spots */}
          {nearbySpots.length > 0 && (
            <div className="bg-white p-6 border border-stone-100 shadow-sm">
              <h3 className="font-serif text-lg text-dark mb-4 border-b border-stone-100 pb-2">周边景观联动</h3>
              <div className="space-y-4">
                {nearbySpots.map(spot => (
                  <Link 
                    key={spot.id} 
                    to={`/restaurant/${spot.id}`}
                    className="group flex gap-4 items-center"
                  >
                    <img 
                      src={spot.images[0]} 
                      alt={spot.name}
                      className="w-16 h-16 object-cover bg-stone-100 group-hover:opacity-80 transition-opacity"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-dark group-hover:text-xiang-red transition-colors">{spot.name}</h4>
                      <p className="text-xs text-stone-500 mt-1">{spot.category}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}