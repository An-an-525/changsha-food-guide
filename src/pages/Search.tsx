import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockPlaces, Place } from '../data/mockData';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, MapPin, GraduationCap, Flame, TrendingUp, ThumbsUp, ThumbsDown } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

type SortType = 'comprehensive' | 'cost' | 'popularity';

export function Search() {
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortType>('comprehensive');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setActiveQuery(query.trim());
      setHasSearched(true);
    }
  };

  const results = useMemo(() => {
    if (!activeQuery) return [];
    
    // 全面检索：匹配地址、商圈、店名或类别
    let filtered = mockPlaces.filter(p => 
      p.type === 'restaurant' &&
      (p.location.area.includes(activeQuery) || 
       p.location.address.includes(activeQuery) || 
       p.name.includes(activeQuery) ||
       p.category.includes(activeQuery))
    );

    // 排序逻辑
    if (sortBy === 'cost') {
      filtered.sort((a, b) => b.costPerformance - a.costPerformance);
    } else if (sortBy === 'popularity') {
      filtered.sort((a, b) => b.popularity - a.popularity);
    } else {
      // 综合推荐：热度和性价比的加权
      filtered.sort((a, b) => (b.popularity * 0.6 + b.costPerformance * 20 * 0.4) - (a.popularity * 0.6 + a.costPerformance * 20 * 0.4));
    }
    
    return filtered;
  }, [activeQuery, sortBy]);

  return (
    <div className="min-h-screen bg-cream flex flex-col pt-8 pb-24">
      {/* Search Header */}
      <div className="px-4 md:px-8 max-w-5xl mx-auto w-full text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif text-dark mb-6">发现周边好店</h1>
        
        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-6">
          <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-400 w-6 h-6" />
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="输入地名、商圈或美食 (例如: 五一广场, 大学城)..." 
            className="w-full bg-white border-2 border-stone-200 py-5 pl-16 pr-32 text-lg font-medium text-dark focus:border-xiang-red outline-none transition-colors shadow-sm placeholder:text-stone-300 placeholder:font-normal"
          />
          <button 
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-xiang-red text-white px-6 py-2.5 text-sm tracking-widest hover:bg-xiang-red-dark transition-colors font-bold"
          >
            检索
          </button>
        </form>

        <div className="flex flex-wrap justify-center gap-3 text-sm text-stone-500">
          <span>快捷搜索:</span>
          {['五一广场', '大学城', '粉面', '湘菜', '夜市'].map(tag => (
            <button 
              key={tag}
              onClick={() => { setQuery(tag); setActiveQuery(tag); setHasSearched(true); }}
              className="text-stone-600 hover:text-xiang-red border-b border-dashed border-stone-300 hover:border-xiang-red transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results Area */}
      <div className="max-w-6xl mx-auto w-full px-4 md:px-8">
        <AnimatePresence mode="wait">
          {!hasSearched ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 border-t border-stone-200"
            >
              <MapPin className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <h3 className="text-xl font-serif text-stone-600 mb-2">输入一个地址，探索附近不下 20 家精选餐厅</h3>
              <p className="text-stone-400 text-sm">为您提供最真实的价格、类别及褒贬不一的评价参考。</p>
            </motion.div>
          ) : (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Toolbar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-stone-200 gap-4">
                <h2 className="text-xl font-serif text-dark">
                  在 <span className="text-xiang-red font-bold px-1">"{activeQuery}"</span> 附近找到 <span className="font-sans font-bold">{results.length}</span> 家餐厅
                </h2>
                
                {results.length > 0 && (
                  <div className="flex bg-white border border-stone-200 p-1 shadow-sm">
                    {[
                      { id: 'comprehensive', label: '综合推荐' },
                      { id: 'cost', label: '最高性价比 (学生党)' },
                      { id: 'popularity', label: '最受欢迎' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setSortBy(tab.id as SortType)}
                        className={twMerge(
                          clsx(
                            "px-4 py-2 text-sm font-medium transition-colors",
                            sortBy === tab.id 
                              ? "bg-dark text-cream" 
                              : "text-stone-600 hover:bg-stone-50"
                          )
                        )}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Grid */}
              {results.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-stone-500">未找到相关餐厅，请尝试搜索“五一广场”或“大学城”。</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((place, index) => (
                    <motion.div
                      key={place.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link 
                        to={`/restaurant/${place.id}`}
                        className="group flex flex-col bg-white border border-stone-200 hover:border-xiang-red/30 hover:shadow-lg transition-all h-full"
                      >
                        {/* Image & Top Badges */}
                        <div className="relative h-48 overflow-hidden bg-stone-100">
                          <img 
                            src={place.images[0]} 
                            alt={place.name} 
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          {/* Price Badge */}
                          <div className="absolute top-3 right-3 bg-dark/90 backdrop-blur text-cream px-3 py-1.5 text-sm font-mono font-bold shadow-md">
                            {place.priceRange}
                          </div>
                          {/* Student Friendly Badge */}
                          {place.studentFriendly && (
                            <div className="absolute top-3 left-3 bg-amber-400 text-dark px-3 py-1.5 text-xs font-bold shadow-md flex items-center gap-1">
                              <GraduationCap className="w-3.5 h-3.5" /> 大学生优选
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-5 flex flex-col flex-grow">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs tracking-wider bg-stone-100 text-stone-600 px-2 py-1">{place.category}</span>
                            <span className="text-xs text-stone-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {place.location.area}
                            </span>
                          </div>
                          
                          <h3 className="font-serif text-xl text-dark mb-4 group-hover:text-xiang-red transition-colors">{place.name}</h3>
                          
                          {/* Scores */}
                          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-stone-100">
                            <div className="flex items-center gap-1 text-sm text-stone-700">
                              <Flame className="w-4 h-4 text-xiang-red" />
                              热度 <span className="font-bold">{place.popularity}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-stone-700">
                              <TrendingUp className="w-4 h-4 text-emerald-600" />
                              性价比 <span className="font-bold">{place.costPerformance}</span>
                            </div>
                          </div>

                          {/* Mini Review */}
                          <div className="mt-auto space-y-2 bg-stone-50 p-3 text-xs leading-relaxed">
                            <p className="text-emerald-700 flex items-start gap-1.5">
                              <ThumbsUp className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                              <span className="line-clamp-1">{place.shortReview.pros}</span>
                            </p>
                            <p className="text-xiang-red flex items-start gap-1.5">
                              <ThumbsDown className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                              <span className="line-clamp-1">{place.shortReview.cons}</span>
                            </p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}