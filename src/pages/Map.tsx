import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMergedPlaces, Place } from '../data/mockData';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

type FilterType = 'category' | 'priceRange' | 'area';

export function Map() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('category');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Get unique tags based on filter type
  const tags = useMemo(() => {
    const mockPlaces = getMergedPlaces();
    const all = mockPlaces.filter(p => p.type === 'restaurant').map(p => {
      if (activeFilter === 'category') return p.category;
      if (activeFilter === 'priceRange') return p.priceRange;
      if (activeFilter === 'area') return p.location.area;
      return '';
    });
    return Array.from(new Set(all));
  }, [activeFilter]);

  // Get filtered places
  const filteredPlaces = useMemo(() => {
    if (!selectedTag) return [];
    const mockPlaces = getMergedPlaces();
    return mockPlaces.filter(p => p.type === 'restaurant' && (
      (activeFilter === 'category' && p.category === selectedTag) ||
      (activeFilter === 'priceRange' && p.priceRange === selectedTag) ||
      (activeFilter === 'area' && p.location.area === selectedTag)
    ));
  }, [activeFilter, selectedTag]);

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <div className="pt-12 pb-8 px-4 md:px-8 max-w-6xl mx-auto w-full text-center">
        <h1 className="text-4xl md:text-5xl font-serif text-dark mb-4">美食知识导图</h1>
        <p className="text-stone-500 max-w-xl mx-auto">
          通过不同的维度探索长沙美食。选择你的偏好，发现属于你的味蕾惊喜。
        </p>
      </div>

      {/* Interactive Map Interface */}
      <div className="flex-grow flex flex-col md:flex-row max-w-7xl mx-auto w-full px-4 md:px-8 gap-8 pb-24">
        
        {/* Left Column: Dimensions & Nodes */}
        <div className="md:w-1/3 flex flex-col gap-8">
          {/* Dimension Selector */}
          <div className="bg-white p-6 shadow-sm border border-stone-100">
            <h3 className="text-sm tracking-widest text-stone-400 uppercase mb-4">1. 探索维度</h3>
            <div className="flex flex-col gap-2">
              {[
                { id: 'category', label: '美食流派 (Category)' },
                { id: 'priceRange', label: '人均消费 (Price)' },
                { id: 'area', label: '地理区域 (Area)' }
              ].map(dim => (
                <button
                  key={dim.id}
                  onClick={() => {
                    setActiveFilter(dim.id as FilterType);
                    setSelectedTag(null);
                  }}
                  className={twMerge(
                    clsx(
                      "text-left px-4 py-3 text-sm transition-all border-l-2",
                      activeFilter === dim.id 
                        ? "border-xiang-red text-xiang-red bg-xiang-red/5 font-bold" 
                        : "border-transparent text-stone-600 hover:bg-stone-50"
                    )
                  )}
                >
                  {dim.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tag Nodes */}
          <div className="bg-white p-6 shadow-sm border border-stone-100 flex-grow">
            <h3 className="text-sm tracking-widest text-stone-400 uppercase mb-4">2. 选择节点</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                  className={twMerge(
                    clsx(
                      "px-4 py-2 text-sm transition-colors border",
                      selectedTag === tag
                        ? "bg-dark text-cream border-dark"
                        : "bg-transparent text-stone-600 border-stone-200 hover:border-dark"
                    )
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="md:w-2/3 bg-white p-6 md:p-8 shadow-sm border border-stone-100 min-h-[500px]">
          <h3 className="text-sm tracking-widest text-stone-400 uppercase mb-6 flex justify-between items-center">
            <span>3. 探索结果</span>
            {selectedTag && (
              <span className="text-xiang-red flex items-center gap-1">
                {selectedTag}
                <button onClick={() => setSelectedTag(null)} className="hover:text-xiang-red-dark">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </h3>

          <AnimatePresence mode="wait">
            {!selectedTag ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex items-center justify-center text-stone-400 text-sm"
              >
                请在左侧选择一个节点以展开对应推荐
              </motion.div>
            ) : (
              <motion.div 
                key="results"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              >
                {filteredPlaces.map(place => (
                  <Link 
                    key={place.id}
                    to={`/restaurant/${place.id}`}
                    className="group flex flex-col border border-stone-100 hover:shadow-md transition-shadow"
                  >
                    <div className="relative aspect-video overflow-hidden bg-stone-100">
                      <img 
                        src={place.images[0]} 
                        alt={place.name} 
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 text-xs text-dark font-medium">
                        {place.priceRange}
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h4 className="font-serif text-lg text-dark mb-1">{place.name}</h4>
                      <p className="text-xs text-stone-500 mb-3 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {place.location.address}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-auto pt-4">
                        {place.features.map(f => (
                          <span key={f} className="text-[10px] px-2 py-1 bg-stone-100 text-stone-600">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}