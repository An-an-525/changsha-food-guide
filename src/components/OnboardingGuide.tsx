import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, User, Star, X, CheckCircle2 } from 'lucide-react';
import { useUser } from '../context/UserContext';

export function OnboardingGuide() {
  const { currentUser, profile, completeGuide } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Show guide if logged in but hasn't seen it
    if (currentUser && profile && !profile.hasSeenGuide) {
      // Delay slightly for better UX
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [currentUser, profile]);

  const handleComplete = () => {
    setIsOpen(false);
    completeGuide();
  };

  const steps = [
    {
      title: '欢迎加入安的探店者联盟！',
      desc: '在这个全新的知识库引擎中，你不仅可以查看安的私藏，还能解锁几十种实用探店功能。',
      icon: <Star className="w-12 h-12 text-amber-400 mx-auto mb-4" />
    },
    {
      title: '一键检索，全网聚合',
      desc: '在「全网检索」页面，你可以搜索任何你想吃的，我们不仅有本地智能推荐，还会自动为你抓取小红书、大众点评的真实排雷信息。',
      icon: <Search className="w-12 h-12 text-blue-500 mx-auto mb-4" />
    },
    {
      title: '超多实用探店工具',
      desc: '在每一家店的详情页，我们为你准备了：一键导航、拨打电话、查看电子菜单、实地打卡等10+项全新功能。',
      icon: <MapPin className="w-12 h-12 text-xiang-red mx-auto mb-4" />
    },
    {
      title: '积攒你的吃货成就',
      desc: '点赞、收藏、打卡、发布探店均可获得积分。快去「个人主页」查看你的专属吃货等级吧！',
      icon: <User className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-dark/60 backdrop-blur-sm p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white max-w-md w-full relative overflow-hidden shadow-2xl border-2 border-xiang-red"
          >
            <button onClick={handleComplete} className="absolute top-4 right-4 text-stone-400 hover:text-dark z-10">
              <X className="w-5 h-5" />
            </button>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-stone-100 flex">
              {steps.map((_, i) => (
                <div key={i} className={`flex-1 h-full transition-colors duration-300 ${i <= step ? 'bg-xiang-red' : 'bg-transparent'}`} />
              ))}
            </div>

            <div className="p-8 text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {steps[step].icon}
                  <h3 className="text-2xl font-serif text-dark mb-3">{steps[step].title}</h3>
                  <p className="text-stone-500 leading-relaxed text-sm min-h-[80px]">
                    {steps[step].desc}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 flex gap-3">
                {step > 0 && (
                  <button 
                    onClick={() => setStep(s => s - 1)}
                    className="flex-1 py-3 border border-stone-200 text-stone-600 font-bold tracking-widest text-sm hover:bg-stone-50 transition-colors"
                  >
                    上一步
                  </button>
                )}
                <button 
                  onClick={() => {
                    if (step === steps.length - 1) {
                      handleComplete();
                    } else {
                      setStep(s => s + 1);
                    }
                  }}
                  className="flex-1 py-3 bg-xiang-red text-white font-bold tracking-widest text-sm hover:bg-xiang-red-dark transition-colors flex items-center justify-center gap-2"
                >
                  {step === steps.length - 1 ? (
                    <>开启探店之旅 <CheckCircle2 className="w-4 h-4" /></>
                  ) : (
                    '下一步'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}