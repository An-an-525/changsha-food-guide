import { Link } from 'react-router-dom';
import { Place } from '../data/mockData';
import { MapPin, GraduationCap, Flame, TrendingUp, ThumbsUp, ThumbsDown, Heart, Bookmark, CheckCircle } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function PlaceCard({ place }: { place: Place }) {
  const { profile, toggleLike, toggleFavorite, addCheckIn } = useUser();

  const isLiked = profile?.likes.includes(place.id) || false;
  const isFavorited = profile?.favorites.includes(place.id) || false;
  const isCheckedIn = profile?.checkIns?.includes(place.id) || false;

  return (
    <div className="group flex flex-col bg-white border border-stone-200 hover:border-xiang-red/30 hover:shadow-lg transition-all h-full relative">
      <Link 
        to={`/restaurant/${place.id}`}
        className="block flex-grow"
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
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs tracking-wider bg-stone-100 text-stone-600 px-2 py-1">{place.category}</span>
              <span className="text-xs text-stone-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {place.location.area}
              </span>
            </div>
            {place.author === '安' ? (
              <span className="text-[10px] text-stone-400 uppercase tracking-widest font-mono border border-stone-200 px-1.5 py-0.5">Curated by An</span>
            ) : (
              <span className="text-[10px] text-xiang-red bg-xiang-red/10 px-1.5 py-0.5">UGC: {place.author}</span>
            )}
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
          <div className="space-y-2 bg-stone-50 p-3 text-xs leading-relaxed mb-4">
            <p className="text-emerald-700 flex items-start gap-1.5">
              <ThumbsUp className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span className="line-clamp-1">{place.shortReview?.pros || '暂无数据'}</span>
            </p>
            <p className="text-xiang-red flex items-start gap-1.5">
              <ThumbsDown className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span className="line-clamp-1">{place.shortReview?.cons || '暂无数据'}</span>
            </p>
          </div>
        </div>
      </Link>
      
      {/* Gamification Actions (outside Link to avoid nested a-tags) */}
      <div className="px-5 pb-5 mt-auto flex items-center justify-between border-t border-stone-100 pt-3 bg-white z-10 relative">
        <div className="flex items-center gap-3">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleLike(place.id);
            }}
            className={twMerge(
              clsx(
                "flex items-center gap-1.5 text-xs font-medium transition-colors",
                isLiked ? "text-xiang-red" : "text-stone-400 hover:text-xiang-red"
              )
            )}
          >
            <Heart className={clsx("w-4 h-4", isLiked && "fill-current")} />
            {isLiked ? '已点赞' : '点赞'}
          </button>
          
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(place.id);
            }}
            className={twMerge(
              clsx(
                "flex items-center gap-1.5 text-xs font-medium transition-colors",
                isFavorited ? "text-amber-500" : "text-stone-400 hover:text-amber-500"
              )
            )}
          >
            <Bookmark className={clsx("w-4 h-4", isFavorited && "fill-current")} />
            {isFavorited ? '已收藏' : '收藏'}
          </button>
        </div>

        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addCheckIn(place.id);
          }}
          className={twMerge(
            clsx(
              "flex items-center gap-1 text-xs font-medium px-2 py-1 transition-colors border",
              isCheckedIn 
                ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                : "bg-white text-stone-500 border-stone-200 hover:border-emerald-500 hover:text-emerald-600"
            )
          )}
        >
          <CheckCircle className="w-3.5 h-3.5" />
          {isCheckedIn ? '已打卡' : '签到打卡'}
        </button>
      </div>
    </div>
  );
}
