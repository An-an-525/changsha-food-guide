import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { Place } from '../data/mockData';
import { Helmet } from 'react-helmet-async';

interface PublishForm {
  name: string;
  category: string;
  area: string;
  priceRange: string;
  studentFriendly: boolean;
  pros: string;
  cons: string;
  costPerformance: number;
}

export function Publish() {
  const { currentUser, login } = useUser();
  const { register, handleSubmit, formState: { errors } } = useForm<PublishForm>();
  const navigate = useNavigate();
  const [loginInput, setLoginInput] = useState('');

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream px-4">
        <Helmet>
          <title>登录账号 - 安的湘遇</title>
        </Helmet>
        <div className="bg-white p-8 border border-stone-200 shadow-sm max-w-md w-full text-center">
          <h2 className="text-2xl font-serif text-dark mb-2">加入安的探店者联盟</h2>
          <p className="text-stone-500 text-sm mb-6">每个人都可以拥有独立的账户，发布自己的私藏推荐</p>
          <input 
            type="text"
            value={loginInput}
            onChange={(e) => setLoginInput(e.target.value)}
            placeholder="输入您的昵称 (如: 资深吃货老王)"
            className="w-full px-4 py-3 border border-stone-300 mb-4 focus:outline-none focus:border-xiang-red transition-colors"
          />
          <button 
            onClick={() => loginInput.trim() && login(loginInput.trim())}
            className="w-full bg-xiang-red text-white py-3 font-bold tracking-widest hover:bg-xiang-red-dark transition-colors"
          >
            一键创建账户并登录
          </button>
        </div>
      </div>
    );
  }

  const onSubmit = (data: PublishForm) => {
    const newPlace: Place = {
      id: uuidv4(),
      name: data.name,
      type: 'restaurant',
      category: data.category,
      priceRange: data.priceRange,
      studentFriendly: data.studentFriendly,
      popularity: 80, // initial base popularity
      costPerformance: Number(data.costPerformance),
      location: { address: '网友贡献地址', area: data.area },
      features: ['社区推荐'],
      images: ['https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&q=60&w=400'], // default fallback image
      shortReview: { pros: data.pros, cons: data.cons },
      author: currentUser,
      publishDate: new Date().toISOString().split('T')[0]
    };

    try {
      const existing = localStorage.getItem('xiangyu_ugc_places');
      const places = existing ? JSON.parse(existing) : [];
      places.push(newPlace);
      localStorage.setItem('xiangyu_ugc_places', JSON.stringify(places));
      alert('发布成功！您的攻略已加入全网知识库引擎！');
      navigate('/search');
    } catch (e) {
      alert('存储空间不足或出现错误');
    }
  };

  return (
    <div className="min-h-screen bg-cream py-12 px-4 md:px-8">
      <Helmet>
        <title>发布探店推荐 - 安的湘遇</title>
        <meta name="description" content="发布您自己的长沙探店美食推荐，加入安的长沙本地游导览全网知识库引擎。" />
      </Helmet>
      <div className="max-w-2xl mx-auto bg-white p-8 border border-stone-200 shadow-sm">
        <h1 className="text-3xl font-serif text-dark mb-2">发布探店推荐</h1>
        <p className="text-stone-500 mb-8 pb-6 border-b border-stone-100">
          您当前正以 <span className="font-bold text-xiang-red">{currentUser}</span> 的身份发布攻略。您的内容将直接进入全站知识库引擎。
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">店名</label>
            <input {...register("name", { required: true })} className="w-full border border-stone-300 p-3 focus:border-xiang-red outline-none" placeholder="例如：天宝兄弟" />
            {errors.name && <span className="text-xiang-red text-xs mt-1">必填项</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">所属类别</label>
              <select {...register("category")} className="w-full border border-stone-300 p-3 focus:border-xiang-red outline-none">
                <option value="湘菜">湘菜</option>
                <option value="粉面">粉面</option>
                <option value="夜市/烧烤">夜市/烧烤</option>
                <option value="小吃">小吃</option>
                <option value="饮品">饮品</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">所在区域</label>
              <select {...register("area")} className="w-full border border-stone-300 p-3 focus:border-xiang-red outline-none">
                <option value="五一广场">五一广场</option>
                <option value="大学城">大学城</option>
                <option value="四方坪">四方坪</option>
                <option value="扬帆夜市">扬帆夜市</option>
                <option value="长理云塘周边">长理云塘周边</option>
                <option value="其他">其他</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">人均价格</label>
              <input {...register("priceRange", { required: true })} className="w-full border border-stone-300 p-3 focus:border-xiang-red outline-none" placeholder="如: ¥50/人" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">性价比打分 (1-5)</label>
              <input type="number" step="0.1" max="5" min="1" {...register("costPerformance", { required: true })} className="w-full border border-stone-300 p-3 focus:border-xiang-red outline-none" defaultValue="4.5" />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 bg-amber-50 p-4 border border-amber-200">
            <input type="checkbox" id="studentFriendly" {...register("studentFriendly")} className="w-4 h-4 text-xiang-red accent-xiang-red" />
            <label htmlFor="studentFriendly" className="text-sm font-bold text-amber-800">打上“大学生优选/穷游”标签</label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-emerald-700 mb-2">值得推荐的地方 (优点)</label>
              <textarea {...register("pros", { required: true })} className="w-full border border-stone-300 p-3 h-24 focus:border-emerald-500 outline-none" placeholder="环境好？味道赞？"></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-xiang-red mb-2">排雷指南 (缺点)</label>
              <textarea {...register("cons", { required: true })} className="w-full border border-stone-300 p-3 h-24 focus:border-xiang-red outline-none" placeholder="排队太久？服务差？太辣？"></textarea>
            </div>
          </div>

          <button type="submit" className="w-full bg-dark text-cream py-4 font-bold tracking-widest uppercase hover:bg-xiang-red transition-colors">
            正式发布至知识库引擎
          </button>
        </form>
      </div>
    </div>
  );
}