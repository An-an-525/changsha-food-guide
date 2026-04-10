export interface Location {
  address: string;
  coordinates?: [number, number];
  area: string;
}

export interface Place {
  id: string;
  name: string;
  type: 'restaurant' | 'spot';
  category: string;
  priceRange: string;
  studentFriendly: boolean;
  popularity: number; // 0-100
  costPerformance: number; // 1-5
  location: Location;
  features: string[];
  images: string[];
  shortReview: { pros: string; cons: string };
}

export interface Review {
  id: string;
  restaurantId: string;
  author: string;
  date: string;
  rating: number; // 1-5
  pros: string;
  cons: string;
  content: string;
}

export interface ItineraryNode {
  id: string;
  day: 'Saturday' | 'Sunday';
  mealTime: 'Breakfast' | 'Lunch' | 'Dinner' | 'LateNight' | 'Activity';
  timeLabel: string;
  placeId: string;
  description: string;
}

// 原始数据数组：[id, 店名, 类别, 价格, 商圈/地址, 是否大学生友好, 热度, 性价比, 优点, 缺点]
type RawRestaurantData = [string, string, string, string, string, boolean, number, number, string, string];

const rawRestaurants: RawRestaurantData[] = [
  // 五一广场周边 (25家) - 满足用户"输入一个地址不下20家"的需求
  ['r1', '笨萝卜湘菜馆(太平街店)', '湘菜', '¥50/人', '五一广场', true, 99, 4.8, '极其下饭，价格便宜，酸菜炒粉皮绝了', '排队太恐怖了，环境嘈杂'],
  ['r2', '费大厨辣椒炒肉(黄兴中心店)', '湘菜', '¥75/人', '五一广场', false, 97, 4.2, '辣椒炒肉天花板，肉质鲜嫩', '饭点等位久，价格偏高中端'],
  ['r3', '炊烟时代小炒黄牛肉(五一店)', '湘菜', '¥80/人', '五一广场', false, 96, 4.0, '牛肉鲜嫩，湘菜代表', '分量相对较少，偏贵'],
  ['r4', '壹盏灯(蚂蚁工房店)', '湘菜', '¥65/人', '五一广场', false, 95, 4.3, '鸭掌筋绝辣过瘾，老口子最爱', '辣度极高，不能吃辣慎入'],
  ['r5', '鲁哥饭店(北正街店)', '湘菜', '¥60/人', '五一广场', true, 92, 4.7, '地道苍蝇馆子，白辣椒炒肉yyds', '环境一般，服务靠吼'],
  ['r6', '娟娟餐馆(文运街店)', '湘菜', '¥70/人', '五一广场', false, 90, 4.4, '老板娘热情，铁板鹅肉必点', '店面难找，座位拥挤'],
  ['r7', '光脑壳家常菜馆', '湘菜', '¥45/人', '五一广场', true, 88, 4.9, '极致性价比，口味家常且下饭', '纯路边摊环境，没有空调'],
  ['r8', '彭南盖码饭', '快餐/简餐', '¥20/人', '五一广场', true, 85, 5.0, '碳水炸弹，打工人/学生党福音', '油很大，吃多会腻'],
  ['r9', '肆姐面粉馆', '粉面', '¥20/人', '五一广场', true, 94, 4.6, '张艺兴同款，原汤肉丝粉鲜美', '饭点人满为患，需拼桌'],
  ['r10', '公交新村粉店(五一周边分店)', '粉面', '¥15/人', '五一广场', true, 98, 4.9, '长沙粉面名片，码子分量足', '环境简陋，自己端粉'],
  ['r11', '刘百味粉店', '粉面', '¥18/人', '五一广场', true, 89, 4.7, '麻辣鸡丝粉一绝', '稍微有点咸'],
  ['r12', '易裕和', '粉面', '¥25/人', '五一广场', false, 91, 4.2, '环境好，老字号品质稳定', '比一般粉店贵，饭点需抢座'],
  ['r13', '聚味瞿记', '夜市/龙虾', '¥120/人', '五一广场', false, 96, 4.1, '虾肉饱满，口味虾酱汁浓郁', '人均消费高，排队久'],
  ['r14', '天宝兄弟', '夜市/龙虾', '¥180/人', '五一广场', false, 98, 3.9, '长沙吃虾天花板，品质极佳', '价格昂贵，不适合穷游'],
  ['r15', '文和友老长沙龙虾馆', '夜市/龙虾', '¥150/人', '五一广场', false, 99, 3.8, '80年代复古场景，拍照出片', '形式大于内容，口味见仁见智'],
  ['r16', '靓虾二哥', '夜市/龙虾', '¥110/人', '五一广场', false, 87, 4.3, '本地人爱去，口味重', '环境大排档级别'],
  ['r17', '盟重烧烤(高桥店)', '烧烤', '¥80/人', '五一广场', true, 95, 4.5, '烈火牛肉必点，氛围极佳', '烟熏火燎，衣服会沾味'],
  ['r18', '客串出品', '烧烤', '¥85/人', '五一广场', false, 90, 4.2, '食材新鲜，明星打卡地', '价格比普通烧烤贵'],
  ['r19', '正哥牛肉串', '小吃', '¥30/人', '五一广场', true, 93, 4.6, '大串牛肉过瘾，肉质紧实', '只卖牛肉串，种类单一'],
  ['r20', '黑色经典臭豆腐', '小吃', '¥15/人', '五一广场', true, 97, 4.8, '灌汁臭豆腐，外酥里嫩', '节假日排队极长'],
  ['r21', '金记糖油坨坨', '小吃', '¥10/人', '五一广场', true, 94, 5.0, '现炸现卖，甜而不腻', '必须趁热吃，冷了发硬'],
  ['r22', '茶颜悦色(太平街店)', '饮品', '¥18/人', '五一广场', true, 100, 4.7, '幽兰拿铁YYDS，服务态度极好', '十步一家但家家排队'],
  ['r23', '柠季', '饮品', '¥15/人', '五一广场', true, 88, 4.6, '解辣神器，鸭屎香柠檬茶清爽', '冰块较多'],
  ['r24', '墨茉点心局', '甜点', '¥35/人', '五一广场', false, 92, 4.0, '麻薯好吃，国潮包装精美', '价格偏高，热度下降'],
  ['r25', '湘春酒家', '湘菜', '¥65/人', '五一广场', false, 89, 4.5, '老牌酒家，口味地道', '服务态度一般'],
  
  // 大学城/岳麓山周边 (10家) - 强化学生友好属性
  ['r26', '笨萝卜湘菜馆(大学城店)', '湘菜', '¥45/人', '大学城', true, 96, 5.0, '学生党最爱，极致性价比', '排队是常态，环境拥挤'],
  ['r27', '帅哥烧饼', '小吃', '¥10/人', '大学城', true, 92, 4.9, '麓山南路神盘，分量足', '排队人多，纯外带'],
  ['r28', '臭名远扬臭豆腐', '小吃', '¥12/人', '大学城', true, 89, 4.8, '脆皮臭豆腐，酱汁独特', '经常需要等刚出锅的'],
  ['r29', '丹丹热卤', '小吃', '¥20/人', '大学城', true, 90, 4.7, '热卤四合一，下课必吃', '位置较少'],
  ['r30', '麓山南路肉夹馍', '小吃', '¥8/人', '大学城', true, 88, 5.0, '便宜顶饱，外酥里嫩', '只适合速食'],
  ['r31', '花道无名渔粉', '粉面', '¥15/人', '大学城', true, 87, 4.8, '鱼汤鲜美，米粉劲道', '高峰期出餐慢'],
  ['r32', '老头子糖油粑粑', '小吃', '¥5/人', '大学城', true, 91, 5.0, '童年回忆，便宜好吃', '老爷爷不定时出摊'],
  ['r33', '猪脑壳凉面', '小吃', '¥12/人', '大学城', true, 86, 4.7, '夏天解暑，配菜丰富', '冬天吃略凉'],
  ['r34', '紫苏桃子姜', '小吃', '¥15/人', '大学城', true, 85, 4.5, '酸甜解腻，特色小吃', '口味两极分化'],
  ['r35', '烤冷面摊', '小吃', '¥10/人', '大学城', true, 84, 4.9, '加肠加蛋，夜宵首选', '流动摊位难找'],
  // 四方坪/扬帆夜市/冬瓜山/其他热门商圈 (15家) - 覆盖更全面的长沙地道夜市与老街
  ['r36', '四方坪三十栋饭店', '湘菜', '¥55/人', '四方坪', true, 94, 4.8, '本地人扎堆，口味极重极下饭', '环境就是大排档，吵闹'],
  ['r37', '堂客上菜(四方坪店)', '湘菜', '¥60/人', '四方坪', true, 91, 4.6, '爆炒肥肠绝绝子，烟火气足', '地面经常油腻腻的'],
  ['r38', '四方坪土味土菜馆', '湘菜', '¥50/人', '四方坪', true, 89, 4.9, '分量大，价格实惠，适合聚餐', '上菜速度极慢'],
  ['r39', '扬帆夜市烤面筋', '小吃', '¥15/人', '扬帆夜市', true, 95, 4.7, '酱汁浓郁，面筋Q弹', '夜市人挤人，需排队'],
  ['r40', '扬帆夜市生煎包', '小吃', '¥12/人', '扬帆夜市', true, 92, 4.8, '底部酥脆，咬一口爆汁', '非常烫嘴，小心食用'],
  ['r41', '胡记炸炸炸', '夜市/炸串', '¥35/人', '太平街', true, 96, 4.5, '里脊肉和排骨必点，秘制酱料绝了', '吃多了容易腻和上火'],
  ['r42', '冬瓜山肉肠', '小吃', '¥20/人', '冬瓜山', true, 98, 4.6, '长沙香肠界天花板，甜辣可口', '排队起码半小时起步'],
  ['r43', '丹丹热卤(冬瓜山店)', '夜市/小吃', '¥30/人', '冬瓜山', true, 93, 4.5, '热卤四合一搭配紫苏桃子姜绝配', '店面极小，只能坐在路边吃'],
  ['r44', '裕南街炸炸炸', '夜市/炸串', '¥40/人', '冬瓜山', true, 90, 4.4, '炸包菜和兰花干子很脆', '油烟味重，停车困难'],
  ['r45', '天马小区臭豆腐', '小吃', '¥10/人', '天马小区', true, 88, 4.9, '外酥里嫩，蒜蓉辣椒汁很足', '只有晚上才出摊'],
  ['r46', '南门口旺旺小吃', '小吃', '¥25/人', '南门口', true, 91, 4.7, '凉面和刮凉粉是夏天标配', '座位少，基本靠打包'],
  ['r47', '金牛角王中西餐厅', '简餐/西餐', '¥80/人', '芙蓉中路', false, 85, 3.8, '老长沙人的西餐启蒙，牛排不错', '性价比不高，设施陈旧'],
  ['r48', '湘江大码头', '夜市/海鲜', '¥130/人', '湘江风光带', false, 89, 4.0, '吹着江风吃烧烤，氛围拉满', '价格偏贵，风大时较冷'],
  ['r49', '北二楼大排档', '夜市/烧烤', '¥70/人', '湘江风光带', true, 92, 4.5, '烤羊排和烤五花肉很赞', '上菜比较慢，需要催'],
  ['r50', '公交新村粉店(总店)', '粉面', '¥15/人', '曙光中路', true, 97, 5.0, '最正宗的公交新村，码子堆成山', '早上7点就开始排长队'],
];

const rawSpots: RawRestaurantData[] = [
  ['s1', '橘子洲头', '观光', '免费(观光车¥40)', '橘子洲风景区', true, 99, 5.0, '青年毛泽东雕像，湘江风景极佳', '节假日人从众，需要走很多路'],
  ['s2', '岳麓山风景名胜区', '观光/徒步', '免费(索道另收费)', '大学城', true, 98, 5.0, '爱晚亭红叶，索道滑道好玩', '爬山费体力'],
  ['s3', '湖南博物院', '文化', '免费(需预约)', '东风路50号', true, 97, 5.0, '马王堆汉墓，历史底蕴深厚', '极难预约，一票难求'],
];

// 工具函数：根据类别映射不同的图片
const getImageUrl = (category: string, id: string) => {
  const images: Record<string, string[]> = {
    '湘菜': [
      'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&q=80&w=800'
    ],
    '粉面': [
      'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=800'
    ],
    '夜市/龙虾': [
      'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1564671165093-20688ff1fffa?auto=format&fit=crop&q=80&w=800'
    ],
    '夜市/烧烤': [
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&q=80&w=800'
    ],
    '烧烤': [
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&q=80&w=800'
    ],
    '小吃': [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1626804475297-4160aae01beb?auto=format&fit=crop&q=80&w=800'
    ],
    '饮品': [
      'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&q=80&w=800'
    ],
    '甜点': [
      'https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?auto=format&fit=crop&q=80&w=800'
    ]
  };

  const matchedKey = Object.keys(images).find(k => category.includes(k));
  const pool = matchedKey ? images[matchedKey] : images['湘菜'];
  
  // 使用 ID 生成确定的随机索引
  const index = parseInt(id.replace(/\D/g, '')) % pool.length;
  return pool[index];
};

export const mockPlaces: Place[] = [
  ...rawRestaurants.map((r) => ({
    id: r[0],
    name: r[1],
    type: 'restaurant' as const,
    category: r[2],
    priceRange: r[3],
    location: { address: r[4] + '核心商圈', area: r[4] },
    studentFriendly: r[5],
    popularity: r[6],
    costPerformance: r[7],
    features: ['人气必吃', r[2], r[5] ? '高性价比' : '品质之选'],
    images: [getImageUrl(r[2], r[0])],
    shortReview: { pros: r[8], cons: r[9] }
  })),
  ...rawSpots.map((s) => ({
    id: s[0],
    name: s[1],
    type: 'spot' as const,
    category: s[2],
    priceRange: s[3],
    location: { address: s[4], area: s[4] },
    studentFriendly: s[5],
    popularity: s[6],
    costPerformance: s[7],
    features: ['必打卡地标', '风景名胜'],
    images: ['https://images.unsplash.com/photo-1621262573215-992a00c6d5a1?auto=format&fit=crop&q=80&w=800'],
    shortReview: { pros: s[8], cons: s[9] }
  }))
];

// 自动生成真实褒贬评价，确保每家店都有反馈
export const mockReviews: Review[] = mockPlaces.map((p, i) => {
  const rating = p.costPerformance > 4.5 ? 5 : (p.costPerformance > 4.0 ? 4 : 3);
  return {
    id: `rev${i}`,
    restaurantId: p.id,
    author: `食客${Math.floor(Math.random() * 9000) + 1000}`,
    date: '2023-10-15',
    rating: rating,
    pros: p.shortReview.pros,
    cons: p.shortReview.cons,
    content: `慕名而来打卡${p.name}。优点很明显，${p.shortReview.pros}；但是也有不足之处：${p.shortReview.cons}。整体而言性价比得分为${p.costPerformance}分，大家可以根据自己的需求参考。`
  };
});

export const mockItinerary: ItineraryNode[] = [
  { id: 'it1', day: 'Saturday', mealTime: 'Breakfast', timeLabel: '08:30', placeId: 'r10', description: '落地长沙，用一碗热气腾腾的公交新村肉丝粉唤醒胃。' },
  { id: 'it2', day: 'Saturday', mealTime: 'Activity', timeLabel: '10:00', placeId: 's1', description: '吃饱喝足，漫步橘子洲头，感受湘江风光与青年毛泽东雕像的震撼。' },
  { id: 'it3', day: 'Saturday', mealTime: 'Lunch', timeLabel: '13:00', placeId: 'r1', description: '来到太平老街，排队打卡笨萝卜，体验重油重辣的下饭湘菜。' },
  { id: 'it4', day: 'Saturday', mealTime: 'Activity', timeLabel: '15:30', placeId: 's3', description: '前往湖南博物院，穿越千年一睹马王堆汉墓的神秘。' },
  { id: 'it5', day: 'Saturday', mealTime: 'Dinner', timeLabel: '19:00', placeId: 'r15', description: '海信广场文和友，边吃小龙虾边感受80年代的老长沙市井氛围。' },
  { id: 'it6', day: 'Sunday', mealTime: 'Breakfast', timeLabel: '09:00', placeId: 'r9', description: '坡子街肆姐面粉馆，一碗张艺兴同款肉丝粉，开启新的一天。' },
  { id: 'it7', day: 'Sunday', mealTime: 'Activity', timeLabel: '10:30', placeId: 's2', description: '登岳麓山，赏爱晚亭红叶，体验刺激的滑道下山。' },
  { id: 'it8', day: 'Sunday', mealTime: 'Lunch', timeLabel: '14:00', placeId: 'r22', description: '下山后来杯茶颜悦色（可搭配周边小吃），稍作休息。' },
  { id: 'it9', day: 'Sunday', mealTime: 'Dinner', timeLabel: '18:00', placeId: 'r14', description: '周末收官大餐！天宝兄弟吃顿好的，用顶级口味虾和口味蟹犒劳自己。' }
];