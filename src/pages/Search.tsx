import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMergedPlaces, Place } from '../data/mockData';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, MapPin, GraduationCap, Flame, TrendingUp, ThumbsUp, ThumbsDown, ExternalLink, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PlaceCard } from '../components/PlaceCard';

type SortType = 'comprehensive' | 'cost' | 'popularity';

// 智能词库引擎映射
const smartKeywords: Record<string, (p: Place) => boolean> = {
  '便宜': p => p.studentFriendly,
  '学生': p => p.studentFriendly,
  '穷游': p => p.studentFriendly,
  '平价': p => p.studentFriendly,
  '约会': p => !p.studentFriendly && p.popularity > 90,
  '高级': p => !p.studentFriendly,
  '辣': p => p.category.includes('湘菜') || p.category.includes('夜市'),
  '重口味': p => p.category.includes('湘菜') || p.category.includes('夜市'),
  '宵夜': p => p.category.includes('夜市') || p.category.includes('烧烤'),
  '半夜': p => p.category.includes('夜市') || p.category.includes('烧烤'),
  '早餐': p => p.category.includes('粉面'),
  '打卡': p => p.popularity >= 95 || p.type === 'spot',
  '网红': p => p.popularity >= 95,
  '清淡': p => p.category.includes('甜点') || p.category.includes('饮品') || p.category.includes('西餐'),
};

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
    } else {
      setActiveQuery('长沙'); // Fallback trigger
      setHasSearched(true);
    }
  };

  const { results, isFallback } = useMemo(() => {
    if (!activeQuery) return { results: [], isFallback: false };
    
    const mockPlaces = getMergedPlaces();
    const lowerQuery = activeQuery.toLowerCase();
    
    // 1. 基础匹配：地址、商圈、店名、类别、特色
    let filtered = mockPlaces.filter(p => 
      p.location.area.includes(lowerQuery) || 
      p.location.address.includes(lowerQuery) || 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.category.includes(lowerQuery) ||
      p.features.some(f => f.includes(lowerQuery))
    );

    // 2. 智能词库引擎（如果基础匹配没结果，尝试语义匹配）
    if (filtered.length === 0) {
      for (const [key, matcher] of Object.entries(smartKeywords)) {
        if (lowerQuery.includes(key)) {
          filtered = mockPlaces.filter(matcher);
          break;
        }
      }
    }

    let isFallback = false;
    
    // 3. 终极兜底逻辑：如果什么都没搜到，绝对不返回空！随机/推荐最热门的 9 家
    if (filtered.length === 0) {
      isFallback = true;
      filtered = [...mockPlaces].sort((a, b) => b.popularity - a.popularity).slice(0, 9);
    }

    // 排序逻辑
    if (sortBy === 'cost') {
      filtered.sort((a, b) => b.costPerformance - a.costPerformance);
    } else if (sortBy === 'popularity') {
      filtered.sort((a, b) => b.popularity - a.popularity);
    } else {
      // 综合推荐：热度和性价比的加权
      filtered.sort((a, b) => (b.popularity * 0.6 + b.costPerformance * 20 * 0.4) - (a.popularity * 0.6 + a.costPerformance * 20 * 0.4));
    }
    
    return { results: filtered, isFallback };
  }, [activeQuery, sortBy]);

  return (
    <div className="min-h-screen bg-cream flex flex-col pt-8 pb-24">
      {/* Search Header */}
      <div className="px-4 md:px-8 max-w-5xl mx-auto w-full text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif text-dark mb-4">全网智能检索引擎</h1>
        <p className="text-stone-500 mb-8 text-sm flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          基于安的私有知识库与各大主流平台聚合映射
        </p>
        
        <form onSubmit={handleSearch} className="relative max-w-3xl mx-auto mb-6">
          <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-400 w-6 h-6" />
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="输入任何想吃的：五一广场、穷游、半夜吃宵夜、约会餐厅..." 
            className="w-full bg-white border-2 border-stone-200 py-5 pl-16 pr-32 text-lg font-medium text-dark focus:border-xiang-red outline-none transition-colors shadow-sm placeholder:text-stone-300 placeholder:font-normal"
          />
          <button 
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-xiang-red text-white px-8 py-3 text-sm tracking-widest hover:bg-xiang-red-dark transition-colors font-bold shadow-md"
          >
            智能检索
          </button>
        </form>

        <div className="flex flex-wrap justify-center gap-3 text-sm text-stone-500">
          <span>大家都在搜:</span>
          {['五一广场', '大学城', '穷游党', '约会', '半夜宵夜', '橘子洲'].map(tag => (
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
              <h3 className="text-xl font-serif text-stone-600 mb-2">无论搜什么字眼，都能为您精准推荐</h3>
              <p className="text-stone-400 text-sm">尝试搜索“便宜好吃”、“约会圣地”或任意商圈名称。</p>
            </motion.div>
          ) : (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Aggregated External Links (The "Major Platforms" integration) */}
              <div className="mb-8 p-6 bg-white border border-stone-200 shadow-sm">
                <h3 className="text-sm font-bold tracking-widest text-stone-400 uppercase mb-4 flex items-center gap-2">
                  全网聚合查询入口
                  <span className="bg-stone-100 text-[10px] px-2 py-0.5 rounded-sm">外部知识来源</span>
                </h3>
                <div className="flex flex-wrap gap-4">
                  <a href={`https://www.xiaohongshu.com/explore?keyword=${encodeURIComponent(activeQuery + ' 长沙')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-[#ff2442]/10 text-[#ff2442] hover:bg-[#ff2442] hover:text-white px-4 py-2 text-sm font-medium transition-colors border border-[#ff2442]/20">
                    <ExternalLink className="w-4 h-4" /> 在小红书看『{activeQuery}』攻略
                  </a>
                  <a href={`https://www.dianping.com/search/keyword/314/0_${encodeURIComponent(activeQuery)}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-[#f63]/10 text-[#f63] hover:bg-[#f63] hover:text-white px-4 py-2 text-sm font-medium transition-colors border border-[#f63]/20">
                    <ExternalLink className="w-4 h-4" /> 在大众点评看『{activeQuery}』排雷
                  </a>
                  <a href={`https://www.douyin.com/search/${encodeURIComponent(activeQuery + ' 长沙美食')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-dark/5 text-dark hover:bg-dark hover:text-white px-4 py-2 text-sm font-medium transition-colors border border-dark/20">
                    <ExternalLink className="w-4 h-4" /> 在抖音看『{activeQuery}』探店视频
                  </a>
                </div>
              </div>

              {/* Toolbar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-stone-200 gap-4">
                <h2 className="text-xl font-serif text-dark flex items-center gap-2">
                  {isFallback ? (
                    <span className="text-stone-500">
                      未找到完全匹配的结果，但已为您 <span className="text-xiang-red font-bold">智能推荐</span> 以下高分好店：
                    </span>
                  ) : (
                    <span>
                      关于 <span className="text-xiang-red font-bold px-1">"{activeQuery}"</span> 的深度推荐结果 (<span className="font-sans font-bold">{results.length}</span>)
                    </span>
                  )}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((place, index) => (
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}