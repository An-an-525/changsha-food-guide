import { motion } from 'framer-motion';
import { mockItinerary, getMergedPlaces } from '../data/mockData';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, MapPin, ArrowRight, User, Sparkles, Download, Ticket, Trophy, Map, Camera } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';

const heroVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export function Home() {
  const saturdayItinerary = mockItinerary.filter(i => i.day === 'Day 1');
  const sundayItinerary = mockItinerary.filter(i => i.day === 'Day 2');
  const mockPlaces = getMergedPlaces();
  const navigate = useNavigate();

  const handleLuckyDraw = () => {
    const randomIndex = Math.floor(Math.random() * mockPlaces.length);
    const place = mockPlaces[randomIndex];
    toast.success(`为你抽取了今日幸运店铺：${place.name}！`, { icon: '🎁', duration: 3000 });
    setTimeout(() => {
      navigate(`/restaurant/${place.id}`);
    }, 1000);
  };

  const handleExport = () => {
    toast.success('行程单生成中... (已模拟导出为 PDF)', { icon: '📄' });
  };

  return (
    <div className="flex flex-col bg-cream">
      <Helmet>
        <title>安的湘遇 · 长沙本地游知识库引擎</title>
        <meta name="description" content="全网最全长沙美食探店指南，超过50%核心地段覆盖，由安独立整理发布，支持网友共创UGC点评引擎。" />
      </Helmet>
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-dark">
          <img 
            src="https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&q=60&w=1200" 
            alt="Changsha Food"
            loading="eager"
            fetchPriority="high"
            className="w-full h-full object-cover brightness-[0.4] scale-105 transform transition-transform duration-[20s] hover:scale-100"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-center"
          >
            <motion.span variants={heroVariants} className="flex items-center gap-3 text-stone-300 tracking-[0.2em] uppercase text-xs font-serif mb-6 border border-stone-500/30 px-4 py-1.5 rounded-full bg-dark/30 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-xiang-red animate-pulse"></span>
              An's Private Collection
            </motion.span>
            
            <motion.h1 variants={heroVariants} className="text-5xl md:text-7xl lg:text-8xl font-serif text-cream mb-6 leading-tight flex flex-col items-center">
              <span className="text-2xl md:text-4xl text-xiang-red/80 italic mb-2">安的私藏</span>
              <span>湘遇 · <span className="text-xiang-red">长沙</span></span>
            </motion.h1>
            
            <motion.p variants={heroVariants} className="text-stone-300 text-lg md:text-xl font-light mb-12 max-w-2xl leading-relaxed">
              历经三个月深度调研与实地试吃，拒绝流水线好评。
              <br />
              安的 48 小时私人定制，带你品味最真实的星城烟火。
            </motion.p>
            <motion.div variants={heroVariants} className="flex flex-col sm:flex-row gap-6">
              <button 
                onClick={() => {
                  document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-xiang-red text-white text-sm tracking-wider hover:bg-xiang-red-dark transition-colors flex items-center justify-center gap-2"
              >
                开启漫游指南
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link to="/map" className="px-8 py-4 bg-transparent border border-cream/30 text-cream text-sm tracking-wider hover:bg-white hover:text-dark transition-colors flex items-center justify-center">
                浏览知识导图
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Mobile King Kong Area (Shortcut Actions) */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 max-w-6xl mx-auto z-10">
          <div className="flex justify-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="w-full md:w-auto grid grid-cols-4 gap-4 md:gap-8 bg-dark/60 backdrop-blur-md p-4 md:px-8 rounded-xl border border-white/10 shadow-xl"
            >
              <button onClick={() => navigate('/search')} className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                  <Trophy className="w-5 h-5" />
                </div>
                <span className="text-xs md:text-sm text-cream font-medium whitespace-nowrap">必吃榜单</span>
              </button>
              <button onClick={() => toast('正在加载附近团购优惠...', { icon: '🎟️' })} className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                  <Ticket className="w-5 h-5" />
                </div>
                <span className="text-xs md:text-sm text-cream font-medium whitespace-nowrap">找优惠</span>
              </button>
              <button onClick={() => navigate('/map')} className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                  <Map className="w-5 h-5" />
                </div>
                <span className="text-xs md:text-sm text-cream font-medium whitespace-nowrap">周边游</span>
              </button>
              <button onClick={() => navigate('/publish')} className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                  <Camera className="w-5 h-5" />
                </div>
                <span className="text-xs md:text-sm text-cream font-medium whitespace-nowrap">写评价</span>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="timeline" className="py-24 md:py-32 px-4 md:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center mb-20 relative">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif text-dark mb-4"
          >
            周末漫游指南
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-stone-500 text-sm md:text-base uppercase tracking-[0.2em] mb-8"
          >
            Curated 48-Hour Itinerary
          </motion.p>
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-4"
          >
            <button onClick={handleLuckyDraw} className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 text-dark text-sm font-bold shadow-md hover:scale-105 transition-transform flex items-center gap-2 rounded-full">
              <Sparkles className="w-4 h-4" /> 今日盲盒打卡
            </button>
            <button onClick={handleExport} className="px-6 py-2.5 bg-white border border-stone-200 text-stone-600 text-sm font-medium shadow-sm hover:bg-stone-50 transition-colors flex items-center gap-2 rounded-full">
              <Download className="w-4 h-4" /> 导出本行程
            </button>
          </motion.div>
        </div>

        <div className="space-y-32">
          {/* Saturday */}
          <div className="relative">
            <div className="sticky top-24 z-10 bg-cream/90 backdrop-blur-sm py-4 mb-12 border-b border-stone-200">
              <h3 className="text-3xl font-serif text-xiang-red">第一天 / Day 1</h3>
              <p className="text-stone-500 mt-1">从市井早餐到夜市小龙虾</p>
            </div>
            
            <div className="relative border-l border-stone-300 ml-4 md:ml-1/2 space-y-16">
              {saturdayItinerary.map((node, index) => (
                <TimelineNode key={node.id} node={node} index={index} />
              ))}
            </div>
          </div>

          {/* Sunday */}
          <div className="relative">
            <div className="sticky top-24 z-10 bg-cream/90 backdrop-blur-sm py-4 mb-12 border-b border-stone-200">
              <h3 className="text-3xl font-serif text-xiang-red">第二天 / Day 2</h3>
              <p className="text-stone-500 mt-1">老街走街串巷与登高望远</p>
            </div>
            
            <div className="relative border-l border-stone-300 ml-4 md:ml-1/2 space-y-16">
              {sundayItinerary.map((node, index) => (
                <TimelineNode key={node.id} node={node} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function TimelineNode({ node, index }: { node: any; index: number }) {
  const mockPlaces = getMergedPlaces();
  const place = mockPlaces.find(p => p.id === node.placeId);
  if (!place) return null;

  const isEven = index % 2 === 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative pl-8 md:pl-0 w-full md:flex md:items-center"
    >
      {/* Node Dot */}
      <div className="absolute left-[-5px] md:left-[calc(50%-5px)] top-0 md:top-1/2 md:-translate-y-1/2 w-2.5 h-2.5 bg-xiang-red rounded-full ring-4 ring-cream z-10"></div>
      
      {/* Content */}
      <div className={`md:w-1/2 ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16 md:ml-auto'}`}>
        <div className="flex items-center gap-2 text-xiang-red mb-2 font-mono text-sm md:justify-end">
          <Clock className="w-4 h-4" />
          <span className="tracking-widest">{node.timeLabel}</span>
          <span className="uppercase text-stone-400 ml-2">/ {node.mealTime}</span>
        </div>
        
        <h4 className="text-2xl font-serif text-dark mb-3">{place.name}</h4>
        <p className="text-stone-600 mb-6 leading-relaxed">{node.description}</p>
        
        <Link 
          to={`/restaurant/${place.id}`}
          className="group block overflow-hidden relative aspect-[4/3] bg-stone-200"
        >
          <div className="absolute inset-0 bg-stone-200 animate-pulse"></div>
          <img 
            src={place.images[0]} 
            alt={place.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 relative z-10"
            onLoad={(e) => {
              (e.target as HTMLImageElement).previousElementSibling?.remove();
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between text-cream">
            <div>
              <span className="text-xs tracking-wider uppercase mb-1 block opacity-80">{place.category}</span>
              <span className="flex items-center gap-1 text-sm">
                <MapPin className="w-3.5 h-3.5" />
                {place.location.area}
              </span>
            </div>
            <span className="bg-xiang-red text-white text-xs px-3 py-1.5 flex items-center gap-1">
              查看评价 <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}