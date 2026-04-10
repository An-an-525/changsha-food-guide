import { Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-dark text-stone-400 py-20 border-t-4 border-xiang-red">
      <div className="container mx-auto px-4 md:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="md:col-span-5">
            <h2 className="text-2xl font-serif text-cream mb-4 tracking-widest flex items-center gap-3">
              安的湘遇
              <span className="text-[10px] uppercase tracking-widest text-stone-500 border border-stone-700 px-2 py-1 rounded-sm">Private Collection</span>
            </h2>
            <p className="text-sm leading-relaxed text-stone-500 max-w-sm mb-6">
              打破虚假滤镜，带你探索真实的长沙。本指南由“安”历经数月独立调研、实地采编与整理，特别收录长沙理工大学云塘校区等小众地道吃法。仅为品味相投的你提供最中肯的私藏指南。
            </p>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-4">
            <h3 className="text-cream text-sm font-bold tracking-widest uppercase mb-6">私人合作与咨询</h3>
            <ul className="space-y-4 text-sm text-stone-500">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-xiang-red" />
                <span className="select-all">15574741562</span>
                <span className="text-xs bg-stone-800 px-2 py-0.5 text-stone-400 rounded-sm">安的主理人直线</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-xiang-red" />
                <span className="select-all">contact@an-collection.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-xiang-red shrink-0 mt-0.5" />
                <span>湖南省长沙市天心区<br/>独立调研工作室</span>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="md:col-span-3">
            <h3 className="text-cream text-sm font-bold tracking-widest uppercase mb-6">条款与说明</h3>
            <ul className="space-y-3 text-sm">
              <li><button onClick={(e) => { e.preventDefault(); alert('免责声明正在更新中...'); }} className="hover:text-cream transition-colors cursor-pointer text-left">免责声明 (Disclaimer)</button></li>
              <li><button onClick={(e) => { e.preventDefault(); alert('隐私政策正在更新中...'); }} className="hover:text-cream transition-colors cursor-pointer text-left">隐私政策 (Privacy Policy)</button></li>
              <li><button onClick={(e) => { e.preventDefault(); alert('请联系主理人邮箱申请收录'); }} className="hover:text-cream transition-colors cursor-pointer text-left">收录申请 (Submit a Place)</button></li>
              <li><button onClick={(e) => { e.preventDefault(); alert('独立探店主理人：安。我们致力于发掘真实的城市味道。'); }} className="hover:text-cream transition-colors cursor-pointer text-left">关于主理人 (About An)</button></li>
            </ul>
          </div>
        </div>

        <div className="w-full h-[1px] bg-stone-800 mb-8"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs tracking-widest text-stone-600 uppercase">
          <span>© {new Date().getFullYear()} XIANGYU CHANGSHA. A PRIVATE COLLECTION.</span>
          <span className="italic font-serif">Curated & Researched by An</span>
        </div>
      </div>
    </footer>
  );
}