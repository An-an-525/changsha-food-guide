export function Footer() {
  return (
    <footer className="bg-dark text-stone-400 py-16">
      <div className="container mx-auto px-4 md:px-8 text-center">
        <h2 className="text-2xl md:text-3xl font-serif text-cream mb-6 tracking-widest">湘遇 · 长沙周末美食漫游</h2>
        <p className="max-w-lg mx-auto text-sm md:text-base mb-10 leading-relaxed text-stone-500">
          打破虚假滤镜，带你探索真实的长沙。无论是市井烟火还是高级餐厅，在这里都能找到最中肯的评价与指南。
        </p>
        <div className="w-24 h-[1px] bg-stone-800 mx-auto mb-10"></div>
        <div className="text-xs tracking-widest text-stone-600 uppercase">
          © {new Date().getFullYear()} XIANGYU CHANGSHA. CURATED WEEKEND GUIDE.
        </div>
      </div>
    </footer>
  );
}