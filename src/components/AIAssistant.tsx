import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Sparkles, Send, MapPin, Search } from 'lucide-react';
import { getMergedPlaces } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  recommendations?: any[];
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    role: 'assistant',
    content: '你好！我是安的专属AI旅行导购。告诉我你的需求（比如“找家便宜好吃的湘菜”、“五一广场附近不排队的夜宵”），我来帮你挑选！'
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const places = getMergedPlaces();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking and logic
    setTimeout(() => {
      const response = generateAIResponse(userMsg.content);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1200);
  };

  const generateAIResponse = (query: string): Message => {
    let filtered = [...places];
    let reply = '';
    
    // Simple NLP simulation for intent parsing
    const intents = {
      isStudent: query.includes('便宜') || query.includes('学生') || query.includes('性价比') || query.includes('穷游') || query.includes('30内'),
      isNoQueue: query.includes('不排队') || query.includes('人少') || query.includes('清净'),
      isSpot: query.includes('好玩') || query.includes('景点') || query.includes('橘子洲') || query.includes('博物院'),
      isXiang: query.includes('湘菜') || query.includes('小炒肉') || query.includes('下饭'),
      isSnack: query.includes('小吃') || query.includes('臭豆腐') || query.includes('糖油粑粑'),
      isWuyi: query.includes('五一') || query.includes('市中心') || query.includes('步行街'),
      isDaxuecheng: query.includes('大学城') || query.includes('麓山南路'),
      isTianbao: query.includes('天宝兄弟') || query.includes('文和友'),
    };

    // Apply filters
    if (intents.isXiang) filtered = filtered.filter(p => p.category.includes('湘菜'));
    if (intents.isSnack) filtered = filtered.filter(p => p.category.includes('小吃') || p.category.includes('夜市'));
    if (intents.isStudent) filtered = filtered.filter(p => p.studentFriendly);
    if (intents.isWuyi) filtered = filtered.filter(p => p.location.area.includes('五一') || p.location.area.includes('太平街'));
    if (intents.isDaxuecheng) filtered = filtered.filter(p => p.location.area.includes('大学城') || p.location.area.includes('岳麓'));
    if (intents.isNoQueue) filtered = filtered.filter(p => p.popularity < 95);
    if (intents.isSpot) filtered = filtered.filter(p => p.type === 'spot');
    
    if (intents.isTianbao) {
      filtered = places.filter(p => p.name.includes('天宝兄弟') || p.name.includes('文和友'));
      reply = '这是为你找到的长沙顶流餐饮！AI小贴士：这些地方排队极度夸张，建议提前3小时线上取号。';
    } else if (intents.isStudent && intents.isDaxuecheng) {
      filtered.sort((a, b) => b.costPerformance - a.costPerformance);
      reply = '大学生看过来！在大学城这些地方好吃又便宜，人均30内绝对管饱：';
    } else if (intents.isWuyi && intents.isNoQueue && intents.isXiang) {
      reply = '五一广场虽然人多，但我也为你找到了这几家口味不错、相对好等位的湘菜馆：';
    } else if (intents.isSpot) {
      filtered.sort((a, b) => b.popularity - a.popularity);
      reply = '为你推荐长沙必打卡的绝美地标，记得穿双好走路的鞋！';
    } else {
      filtered.sort((a, b) => b.costPerformance - a.costPerformance);
      reply = `根据你的需求“${query}”，我为你精选了这几个好去处：`;
    }

    if (filtered.length === 0) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: '抱歉，没有找到完全符合你要求的地点。你可以换个说法试试，或者放宽一些条件哦！'
      };
    }

    const topPicks = filtered.slice(0, 3);
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: reply,
      recommendations: topPicks
    };
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-24 md:bottom-24 right-6 z-50 w-14 h-14 bg-dark text-white rounded-full shadow-xl flex items-center justify-center border-2 border-white/20"
      >
        <Sparkles className="w-6 h-6 absolute text-amber-300 -top-1 -right-1 animate-pulse" />
        <Bot className="w-7 h-7" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 md:bottom-24 right-4 md:right-6 z-[60] w-[calc(100vw-2rem)] md:w-[380px] h-[500px] bg-white rounded-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-dark text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-6 h-6 text-amber-400" />
                <span className="font-bold tracking-wider">AI 导购助手</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
              {messages.map(msg => (
                <div key={msg.id} className={\`flex \${msg.role === 'user' ? 'justify-end' : 'justify-start'}\`}>
                  <div className={\`max-w-[85%] rounded-2xl p-3 text-sm \${
                    msg.role === 'user' 
                      ? 'bg-xiang-red text-white rounded-tr-sm' 
                      : 'bg-white border border-stone-200 text-stone-800 rounded-tl-sm shadow-sm'
                  }\`}>
                    <p className="leading-relaxed">{msg.content}</p>
                    
                    {/* Recommendations Cards */}
                    {msg.recommendations && (
                      <div className="mt-3 space-y-2">
                        {msg.recommendations.map(place => (
                          <div 
                            key={place.id} 
                            onClick={() => {
                              navigate(\`/detail/\${place.id}\`);
                              setIsOpen(false);
                            }}
                            className="flex items-center gap-3 p-2 bg-stone-50 border border-stone-100 rounded-lg cursor-pointer hover:bg-stone-100 transition-colors"
                          >
                            <img src={place.images[0]} alt={place.name} className="w-12 h-12 rounded object-cover" />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-sm text-dark truncate">{place.name}</h4>
                              <div className="flex items-center text-xs text-stone-500 gap-1 mt-0.5">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate">{place.location.area}</span>
                                <span className="text-xiang-red ml-1 font-mono">{place.priceRange}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-sm p-3 shadow-sm flex gap-1.5 items-center">
                    <span className="w-2 h-2 bg-stone-300 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Preset Queries */}
            {messages.length === 1 && (
              <div className="px-4 py-2 bg-white border-t border-stone-100 flex gap-2 overflow-x-auto no-scrollbar">
                {['大学城平价美食', '五一广场不排队', '晚上去哪撸串'].map(q => (
                  <button 
                    key={q}
                    onClick={() => { setInput(q); }}
                    className="whitespace-nowrap text-xs bg-stone-100 text-stone-600 px-3 py-1.5 rounded-full hover:bg-stone-200 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-stone-200">
              <div className="flex items-center gap-2 bg-stone-100 rounded-full px-4 py-2">
                <Search className="w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="问问AI，比如：找个适合约会的..."
                  className="flex-1 bg-transparent border-none outline-none text-sm text-dark placeholder:text-stone-400"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="text-xiang-red disabled:text-stone-300 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}