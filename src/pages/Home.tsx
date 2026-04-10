import { motion } from 'framer-motion';
import { mockItinerary, mockPlaces } from '../data/mockData';
import { Link } from 'react-router-dom';
import { Clock, MapPin, ArrowRight } from 'lucide-react';

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
  const saturdayItinerary = mockItinerary.filter(i => i.day === 'Saturday');
  const sundayItinerary = mockItinerary.filter(i => i.day === 'Sunday');

  return (
    <div className="flex flex-col bg-cream">
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
            <motion.span variants={heroVariants} className="text-xiang-red tracking-[0.3em] uppercase text-sm md:text-base font-bold mb-4 block">
              Weekend Guide
            </motion.span>
            <motion.h1 variants={heroVariants} className="text-5xl md:text-7xl lg:text-8xl font-serif text-cream mb-6 leading-tight">
              湘遇 · <span className="text-xiang-red">长沙</span>
            </motion.h1>
            <motion.p variants={heroVariants} className="text-stone-300 text-lg md:text-xl font-light mb-12 max-w-2xl leading-relaxed">
              打破虚假滤镜，拒绝流水线好评。
              <br />
              用48小时，带你品味最真实的星城烟火与江阁风光。
            </motion.p>
            <motion.div variants={heroVariants} className="flex flex-col sm:flex-row gap-6">
              <a href="#timeline" className="px-8 py-4 bg-xiang-red text-white text-sm tracking-wider hover:bg-xiang-red-dark transition-colors flex items-center justify-center gap-2">
                开启 48 小时行程
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link to="/map" className="px-8 py-4 bg-transparent border border-cream/30 text-cream text-sm tracking-wider hover:bg-white hover:text-dark transition-colors flex items-center justify-center">
                浏览知识导图
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="timeline" className="py-24 md:py-32 px-4 md:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-serif text-dark mb-4">周末漫游指南</h2>
          <p className="text-stone-500 text-sm md:text-base uppercase tracking-[0.2em]">Curated 48-Hour Itinerary</p>
        </div>

        <div className="space-y-32">
          {/* Saturday */}
          <div className="relative">
            <div className="sticky top-24 z-10 bg-cream/90 backdrop-blur-sm py-4 mb-12 border-b border-stone-200">
              <h3 className="text-3xl font-serif text-xiang-red">第一天 / 周六</h3>
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
              <h3 className="text-3xl font-serif text-xiang-red">第二天 / 周日</h3>
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
          className="group block overflow-hidden relative aspect-[4/3] bg-stone-100"
        >
          <img 
            src={place.images[0]} 
            alt={place.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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