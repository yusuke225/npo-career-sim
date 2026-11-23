import type {
  BackgroundTierId,
  BoardClimate,
  EmploymentType,
  FocusId,
  OrgTypeId,
  RegionId,
  RoleId,
} from '../types/game';

export interface EmploymentTypeConfig {
  id: EmploymentType;
  label: string;
  shortLabel: string;
  description: string;
}

export const EMPLOYMENT_TYPES: Record<EmploymentType, EmploymentTypeConfig> = {
  regular: {
    id: 'regular',
    label: '一般正職受僱（適用勞基法）',
    shortLabel: '正職受僱',
    description: '依法投保勞健保並由雇主提撥 6% 勞退，但實務上仍常面臨凍薪與高薪低報風險。',
  },
  multi_employment: {
    id: 'multi_employment',
    label: '多元就業開發方案進用（公法救助關係）',
    shortLabel: '多元方案',
    description:
      '勞動部補助進用，官方定位屬「公法救助關係」而非一般勞雇：雖有勞保（含職災）與健保，但不適用《勞基法》與《就業保險法》，無雇主 6% 勞退提撥、無資遣費與失業給付，期滿易遇轉銜斷層。',
  },
  contractor: {
    id: 'contractor',
    label: '自然人承攬／委任契約',
    shortLabel: '自然人承攬',
    description: '非典型欠缺保障型態：無雇主 6% 勞退與資遣費，須自付職業工會勞健保（約 $2,600/月）及補充保費。',
  },
};

export interface OrgTypeConfig {
  id: OrgTypeId;
  label: string;
  shortLabel: string;
  legalForm: string;
  weight: number; // 總和 100
  sizeLabel: string;
  fundingModel: string;
  defaultFinanceLevel: 1 | 2 | 3 | 4;
  boardClimates: BoardClimate[];
  salaryBonus: number;
  maxYearEndMonths: number;
  allowedRoles: RoleId[];
  namePool: string[];
  issuePool: string[];
  structuralSummary: string;
}

export const ORG_TYPES: Record<OrgTypeId, OrgTypeConfig> = {
  grassroots: {
    id: 'grassroots',
    label: '草根小型協會',
    shortLabel: '草根協會',
    legalForm: '社團法人',
    weight: 22,
    sizeLabel: '專職 3–7 人',
    fundingModel: '小額民間捐款＋零星地方政府補助',
    defaultFinanceLevel: 2,
    boardClimates: ['trusting', 'transition', 'bureaucratic'],
    salaryBonus: -1500,
    maxYearEndMonths: 1.0,
    allowedRoles: ['project_exec', 'social_worker', 'fundraiser_pr', 'admin_finance'],
    namePool: [
      '社團法人山海巷弄共伴協會',
      '社團法人島嶼青銀互助協會',
      '社團法人微光街角兒少關懷協會',
      '社團法人南風新住民生活支持協會',
      '社團法人拾光毛孩守護協會',
    ],
    issuePool: ['社區弱勢與長照據點', '兒少課後陪伴', '外籍移工支持', '街頭動物絕育'],
    structuralSummary:
      '彈性極高、離現場最近，但通常「校長兼撞鐘」，沒有正式 HR 與職務代理制度，經費斷炊風險常年存在。',
  },
  large_welfare: {
    id: 'large_welfare',
    label: '中大型全國性社福機構',
    shortLabel: '大型社福',
    legalForm: '財團法人／全國性社團',
    weight: 32,
    sizeLabel: '專職 50–240 人',
    fundingModel: '衛福部／地方政府委外標案＋大型勸募',
    defaultFinanceLevel: 3,
    boardClimates: ['bureaucratic', 'trusting', 'transition'],
    salaryBonus: 1500,
    maxYearEndMonths: 1.5,
    allowedRoles: ['social_worker', 'project_exec', 'fundraiser_pr', 'admin_finance'],
    namePool: [
      '財團法人晴光社會福利基金會',
      '財團法人春山家庭與兒少扶助基金會',
      '社團法人島嶼銀髮安養暨自立協會',
      '財團法人晨曦無障礙生活基金會',
    ],
    issuePool: ['高風險家庭與兒少保護', '身心障礙社區居住', '失智長照體系', '脆弱家庭經濟扶助'],
    structuralSummary:
      '制度與衛福部社工薪資補助較明確，但高度受制於政府標案評鑑、年底核銷地獄與科層行政程序。',
  },
  academic_society: {
    id: 'academic_society',
    label: '學術與專業學會',
    shortLabel: '專業學會',
    legalForm: '社團法人（內政部人民團體）',
    weight: 6,
    sizeLabel: '專職 1–6 人（多數僅 1–2 人）',
    fundingModel: '常年會費＋年會研討會報名＋繼續教育／廠商贊助',
    defaultFinanceLevel: 2,
    boardClimates: ['transition', 'bureaucratic', 'factional'],
    salaryBonus: 0,
    maxYearEndMonths: 1.2,
    allowedRoles: ['society_secretary', 'society_event_pub', 'admin_finance'],
    namePool: [
      '社團法人島嶼公共治理與政策學會',
      '社團法人福爾摩沙臨床照護研究學會',
      '社團法人微光都市韌性與空間學會',
      '社團法人春山當代教育實務學會',
      '社團法人晨曦助人倫理與實務學會',
    ],
    issuePool: ['專業認證與繼續教育', '學術期刊與年會', '專業倫理與法規建言', '跨校學門交流'],
    structuralSummary:
      '每 2–3 年隨理事長改選換一輪權力核心，全職會務秘書是整間學會唯一的制度記憶，要扛年會、期刊、學分、理監事會與政府評鑑。',
  },
  local_foundation: {
    id: 'local_foundation',
    label: '地方型公益基金會',
    shortLabel: '地方基金會',
    legalForm: '財團法人',
    weight: 14,
    sizeLabel: '專職 10–30 人',
    fundingModel: '地方家族／在地企業捐助＋文化／教育專案補助',
    defaultFinanceLevel: 3,
    boardClimates: ['trusting', 'bureaucratic', 'factional'],
    salaryBonus: 500,
    maxYearEndMonths: 1.5,
    allowedRoles: ['project_exec', 'fundraiser_pr', 'admin_finance', 'social_worker'],
    namePool: [
      '財團法人溪南文教公益基金會',
      '財團法人海風社區共好基金會',
      '財團法人榕樹下青年返鄉基金會',
      '財團法人潮汐山海創生基金會',
    ],
    issuePool: ['偏鄉教育與閱讀', '地方文史與社區營造', '青年返鄉培力', '在地農業與環境'],
    structuralSummary:
      '深耕特定縣市脈絡，與地方士紳、公所及中小學關係緊密，穩定度中等，但常受限於董事會創辦家族的偏好。',
  },
  advocacy_ngo: {
    id: 'advocacy_ngo',
    label: '議題倡議型 NGO',
    shortLabel: '倡議 NGO',
    legalForm: '社團／財團法人',
    weight: 10,
    sizeLabel: '專職 6–25 人',
    fundingModel: '定期定額小額捐款（多數拒收政府標案以保獨立性）',
    defaultFinanceLevel: 2,
    boardClimates: ['trusting', 'factional', 'transition'],
    salaryBonus: 0,
    maxYearEndMonths: 1.0,
    allowedRoles: ['advocacy_researcher', 'fundraiser_pr', 'project_exec', 'admin_finance'],
    namePool: [
      '社團法人島嶼數位公民監督陣線',
      '社團法人福爾摩沙氣候行動聯盟',
      '社團法人微光性別平權倡議協會',
      '財團法人春山司法與人權促進會',
    ],
    issuePool: ['環境與氣候正義', '人權與司改監督', '性別平權與反歧視', '居住與都市權倡議'],
    structuralSummary:
      '不拿政府標案換取發聲自由，代價是緊盯小額定捐流失率；立院會期一來常連夜備戰，成就感與政治消耗都極大。',
  },
  corp_intl_ngo: {
    id: 'corp_intl_ngo',
    label: '企業基金會／國際 NGO 台灣分會',
    shortLabel: '企業/國際分會',
    legalForm: '財團法人／外國法人分會',
    weight: 8,
    sizeLabel: '專職 15–60 人',
    fundingModel: '母企業年度提撥孳息／國際總部撥款＋企業募資',
    defaultFinanceLevel: 4,
    boardClimates: ['bureaucratic', 'trusting'],
    salaryBonus: 5500,
    maxYearEndMonths: 2.0,
    allowedRoles: ['project_exec', 'fundraiser_pr', 'advocacy_researcher', 'corp_esg_officer', 'admin_finance'],
    namePool: [
      '財團法人星辰科技永續公益基金會',
      '國際海平面守護聯盟島嶼分會',
      '財團法人曜石金控社會影響力基金會',
      '全球無國界教育夥伴島嶼辦事處',
    ],
    issuePool: ['企業永續與社區影響力', '跨國人道救援募資', '氣候倡議與能源轉型', 'STEM 教育扶助'],
    structuralSummary:
      '薪資與福利在非營利圈屬前段班，英文報表與 KPI 文化濃厚，常需在「母體品牌公關需求」與「真實現場需求」間走鋼索。',
  },
  industrial_union: {
    id: 'industrial_union',
    label: '產業／企業工會（組織抗爭型）',
    shortLabel: '產企業工會',
    legalForm: '工會法人（工會法）',
    weight: 3,
    sizeLabel: '專職 1–5 人',
    fundingModel: '會員工會會費（無政府常態補助，常設抗爭基金）',
    defaultFinanceLevel: 2,
    boardClimates: ['factional', 'trusting', 'transition'],
    salaryBonus: 0,
    maxYearEndMonths: 1.0,
    allowedRoles: ['union_organizer', 'advocacy_researcher', 'union_admin'],
    namePool: [
      '北區晶圓代工從業人員產業工會',
      '蒼穹航運空地勤聯合企業工會',
      '島嶼醫護與照護受僱者產業工會',
      '都會雲端物流配送員產業工會',
    ],
    issuePool: ['集體談判與團體協約', '不當勞動行為裁決', '輪班過勞與職災權益', '跨廠區組織串聯'],
    structuralSummary:
      '工會秘書與組織者站在勞資衝突第一線：白天跑調解庭、晚上廠區發傳單，還常面對「幫別人爭勞權，自己卻超時過勞」的矛盾。',
  },
  occupational_union: {
    id: 'occupational_union',
    label: '職業工會（基層自營／無一定雇主）',
    shortLabel: '職業工會',
    legalForm: '工會法人（工會法）',
    weight: 5,
    sizeLabel: '專職 3–18 人',
    fundingModel: '會員會費＋勞健保代辦行政費＋勞動部職訓計畫',
    defaultFinanceLevel: 3,
    boardClimates: ['factional', 'bureaucratic', 'trusting'],
    salaryBonus: 500,
    maxYearEndMonths: 1.5,
    allowedRoles: ['union_admin', 'union_organizer', 'admin_finance'],
    namePool: [
      '都會區空間裝修從業人員職業工會',
      '海風餐飲與烘焙勞動者職業工會',
      '春山造型與個人服務職業工會',
      '都會區汽車修護與運輸從業人員職業工會',
    ],
    issuePool: ['勞健保與職災給付代辦', '自營作業者職訓課程', '勞資糾紛與調解諮詢', '基層會員服務與動員'],
    structuralSummary:
      '高度仰賴會務人員維持數千名會員加退保、欠費催繳與職訓核銷；同時必須在理監事派系政治與基層師傅急難之間求生存。',
  },
};

export const ORG_TYPE_LIST: OrgTypeConfig[] = Object.values(ORG_TYPES).sort(
  (a, b) => b.weight - a.weight
);

export interface OrgContextTokens {
  orgNoun: string;
  targetNoun: string;
  weekendTask: string;
  fieldMove: string;
  certGoal: string;
  lectureTopic: string;
  hometownOrg: string;
  bossTitle: string;
  sectorFocus: string;
}

export const ORG_CONTEXT_TOKENS: Record<OrgTypeId, OrgContextTokens> = {
  large_welfare: {
    orgNoun: '大型社福機構',
    targetNoun: '高風險個案家庭',
    weekendTask: '高風險個案緊急安置',
    fieldMove: '騎車跑個案家庭訪視',
    certGoal: '高考社工師證照或社福在職碩士',
    lectureTopic: '脆弱家庭處遇與方案核銷實務',
    hometownOrg: '家鄉縣市的社福服務中心',
    bossTitle: '執行長',
    sectorFocus: '脆弱家庭服務與兒少保護',
  },
  grassroots: {
    orgNoun: '社區關懷協會',
    targetNoun: '社區長輩與兒少',
    weekendTask: '社區據點週末活動',
    fieldMove: '載物資跑社區據點',
    certGoal: '非營利組織管理在職專班或社工學分班',
    lectureTopic: '草根募款企劃與社區陪伴實戰',
    hometownOrg: '家鄉在地的社區發展協會',
    bossTitle: '理事長',
    sectorFocus: '社區照顧據點與民間陪伴',
  },
  local_foundation: {
    orgNoun: '地方公益基金會',
    targetNoun: '在地學校與地方團隊',
    weekendTask: '地方教育成果展覽',
    fieldMove: '開車跑偏鄉學校與據點',
    certGoal: '文化行政與非營利管理在職碩士',
    lectureTopic: '地方創生專案規劃與資源整合',
    hometownOrg: '老家縣市的文化教育基金會',
    bossTitle: '執行長',
    sectorFocus: '地方教育培力與社區營造',
  },
  advocacy_ngo: {
    orgNoun: '公民倡議團體',
    targetNoun: '政策關注者與當事人',
    weekendTask: '立院公聽會備戰或街頭陳抗',
    fieldMove: '趕場跑公聽會與記者會',
    certGoal: '公共政策與法政在職專班',
    lectureTopic: '政策遊說策略與公共溝通實戰',
    hometownOrg: '南部區域性議題倡議分會',
    bossTitle: '秘書長',
    sectorFocus: '制度倡議與社會對話',
  },
  corp_intl_ngo: {
    orgNoun: '企業永續基金會',
    targetNoun: '跨國合作夥伴與受助社群',
    weekendTask: '大型企業志工日活動',
    fieldMove: '往返企業總部與合作現場',
    certGoal: 'ESG 永續管理師證照或英文影響力評量課程',
    lectureTopic: '社會影響力評估與跨界公益合作',
    hometownOrg: '中南部的區域型基金會駐點',
    bossTitle: '執行長',
    sectorFocus: '永續影響力與跨界資源媒合',
  },
  academic_society: {
    orgNoun: '專業學術學會',
    targetNoun: '學會會員學者與執業會員',
    weekendTask: '年度學術研討會場勘',
    fieldMove: '抱著紙箱趕往年會飯店會場',
    certGoal: '會展行政與學術出版管理進修',
    lectureTopic: '人民團體會務運作與繼續教育系統治理',
    hometownOrg: '中南部大學附設的區域專業學會',
    bossTitle: '理事長',
    sectorFocus: '專業繼續教育與會務治理',
  },
  occupational_union: {
    orgNoun: '職業工會',
    targetNoun: '加保勞工與基層師傅會員',
    weekendTask: '週末職訓班訪視與會員代表大會',
    fieldMove: '跑職業訓練教室與勞保局送件',
    certGoal: '就業服務乙級證照與勞動法實務班',
    lectureTopic: '職業災害給付申訴與勞健保會務實務',
    hometownOrg: '家鄉的縣市職業工會',
    bossTitle: '總幹事',
    sectorFocus: '基層勞健保服務與職災權益',
  },
  industrial_union: {
    orgNoun: '產業工會',
    targetNoun: '第一線輪班會員',
    weekendTask: '勞資抗爭動員或輪班座談',
    fieldMove: '去職場或輪班現場外發傳單',
    certGoal: '勞動法學程與勞資調解人培訓',
    lectureTopic: '集體勞動爭議調解與不當勞動行為裁決',
    hometownOrg: '家鄉工業區的聯合產業工會',
    bossTitle: '工會秘書長',
    sectorFocus: '集體勞動談判與團體協約',
  },
};

export interface RoleConfig {
  id: RoleId;
  label: string;
  baseSalaryRange: [number, number]; // 起薪區間 NTD
  titles: [string, string, string, string];
  summary: string;
  primaryStat: 'energy' | 'purpose' | 'capital' | 'life';
}

export const ROLES: Record<RoleId, RoleConfig> = {
  social_worker: {
    id: 'social_worker',
    label: '第一線社工人員',
    baseSalaryRange: [36000, 40500],
    titles: ['社工員', '資深社工師', '社工督導', '服務處長'],
    summary: '直接面對個案家庭與訪視現場，情緒勞動極高，薪資相對受衛福部制度保障，但仍常面臨高案量與深夜緊急電話。',
    primaryStat: 'purpose',
  },
  project_exec: {
    id: 'project_exec',
    label: '方案企劃專員',
    baseSalaryRange: [30500, 35500],
    titles: ['方案企劃專員', '資深方案企劃', '方案組長', '執行長'],
    summary: '寫標案計畫書、辦活動、跑現場、年底扛結案核銷報告，是非營利組織最核心的萬能螺絲釘。',
    primaryStat: 'capital',
  },
  advocacy_researcher: {
    id: 'advocacy_researcher',
    label: '政策倡議專員',
    baseSalaryRange: [31500, 36500],
    titles: ['政策倡議專員', '資深政策研究員', '倡議部主任', '秘書長'],
    summary: '讀法條、寫新聞稿、跑立法院公聽會與跨團體串聯，在政策推進慢如牛步的挫折中尋找破口。',
    primaryStat: 'purpose',
  },
  fundraiser_pr: {
    id: 'fundraiser_pr',
    label: '募款公關專員',
    baseSalaryRange: [31000, 36000],
    titles: ['募款公關專員', '資深募款企劃', '資源發展部主任', '副執行長'],
    summary: '對外把現場故事轉譯為捐款理由，承受定捐成長指標與大額捐款人期待的雙重壓力。',
    primaryStat: 'capital',
  },
  admin_finance: {
    id: 'admin_finance',
    label: '行政財務專員',
    baseSalaryRange: [28590, 33000],
    titles: ['行政財務專員', '資深行政會計', '行政管理組長', '行政部主任'],
    summary: '守住憑證核銷、薪資勞健保與帳務稽核的最後防線；常被社會期待「壓低管銷成本」而最早凍薪。',
    primaryStat: 'life',
  },
  society_secretary: {
    id: 'society_secretary',
    label: '學會會務專員',
    baseSalaryRange: [30500, 35500],
    titles: ['學會會務專員', '資深會務秘書', '副秘書長', '專任秘書長'],
    summary: '撐起整個學會的「唯一常駐記憶」：聯繫理監事、催收會費、對接內政部人團法規與籌備年度大拜拜。',
    primaryStat: 'capital',
  },
  society_event_pub: {
    id: 'society_event_pub',
    label: '年會與刊物專員',
    baseSalaryRange: [30000, 35000],
    titles: ['年會暨刊物專員', '資深學術行政專員', '會務與出版主任', '副秘書長'],
    summary: '負責學術研討會徵稿、繼續教育學分認證、專家審查往來與廠商展位招商，每年年會前兩個月形同不眠。',
    primaryStat: 'energy',
  },
  union_organizer: {
    id: 'union_organizer',
    label: '工會組織秘書',
    baseSalaryRange: [31000, 36500],
    titles: ['工會組織秘書', '資深組織秘書', '組織部主任', '工會秘書長'],
    summary: '走進廠區與門市談組織、陪勞工開勞資調解與裁決庭、籌備罷工投票，承擔高強度勞資張力與工會內部民主壓力。',
    primaryStat: 'purpose',
  },
  union_admin: {
    id: 'union_admin',
    label: '工會會務幹事',
    baseSalaryRange: [29500, 34000],
    titles: ['工會會務幹事', '資深會務專員', '會務組長', '工會總幹事'],
    summary: '每日面對櫃檯加退保、勞保欠費催繳、職災諮詢與職訓課程核銷，兼顧理監事會選舉與會員代表大會。',
    primaryStat: 'life',
  },
  corp_esg_officer: {
    id: 'corp_esg_officer',
    label: '永續影響力專案經理',
    baseSalaryRange: [39000, 47000],
    titles: ['公益影響力專員', '資深永續專案師', '企業基金會副理', '永續影響力總監'],
    summary: '位於企業與民間現場的交界帶，資源較充裕且具備報表紀律，但須時時檢視成果是否淪為公關漂綠。',
    primaryStat: 'capital',
  },
};

export interface RegionConfig {
  id: RegionId;
  label: string;
  weight: number;
  rentShared: number;
  rentStudio: number;
  mortgageMonthly: number;
  baseLiving: number;
  salaryAdj: number;
  note: string;
}

export const REGIONS: Record<RegionId, RegionConfig> = {
  taipei_metro: {
    id: 'taipei_metro',
    label: '雙北都會區',
    weight: 48,
    rentShared: 9500,
    rentStudio: 15000,
    mortgageMonthly: 29500,
    baseLiving: 14500,
    salaryAdj: 2000,
    note: '全國性組織、大型學會與倡議團體高度集中於此，機會最多但房租吞噬近半月薪。',
  },
  other_six: {
    id: 'other_six',
    label: '桃竹中南高都會區',
    weight: 34,
    rentShared: 6500,
    rentStudio: 10500,
    mortgageMonthly: 21500,
    baseLiving: 12500,
    salaryAdj: 0,
    note: '工業區工會、地方社福分會與區域學會大本營，生活空間稍大但跨區通勤耗時。',
  },
  non_six_rural: {
    id: 'non_six_rural',
    label: '非六都與偏鄉離島',
    weight: 18,
    rentShared: 5000,
    rentStudio: 7800,
    mortgageMonthly: 15500,
    baseLiving: 11000,
    salaryAdj: -1500,
    note: '最急需人力的第一線現場，人情緊密、開銷較低，卻常面臨孤立無援與人才斷層。',
  },
};

export interface BackgroundTierConfig {
  id: BackgroundTierId;
  label: string;
  weight: number;
  description: string;
  initialSavingsRange: [number, number];
  studentLoanRange: [number, number];
  monthlyStudentLoan: number;
  monthlyFilialAllowance: number;
  withParentsChance: number;
}

export const BACKGROUND_TIERS: Record<BackgroundTierId, BackgroundTierConfig> = {
  privileged: {
    id: 'privileged',
    label: '家庭後盾充裕',
    weight: 16,
    description: '無學貸、暫住家裡或有長輩小額奧援，讓你比較敢接低薪但有理想的缺。',
    initialSavingsRange: [120000, 260000],
    studentLoanRange: [0, 0],
    monthlyStudentLoan: 0,
    monthlyFilialAllowance: 0,
    withParentsChance: 0.72,
  },
  independent: {
    id: 'independent',
    label: '一般小康自立',
    weight: 42,
    description: '家裡不需你貼補但也幫不上忙，頂多背小額學貸，靠自己薪水打平生活。',
    initialSavingsRange: [35000, 95000],
    studentLoanRange: [0, 180000],
    monthlyStudentLoan: 2800,
    monthlyFilialAllowance: 0,
    withParentsChance: 0.2,
  },
  tight: {
    id: 'tight',
    label: '背負學貸與孝親壓力',
    weight: 29,
    description: '每個月一領薪水就得先扣學貸與家用，每次報案加薪或年終縮水都格外敏感。',
    initialSavingsRange: [15000, 50000],
    studentLoanRange: [180000, 320000],
    monthlyStudentLoan: 3500,
    monthlyFilialAllowance: 4000,
    withParentsChance: 0.14,
  },
  burdened: {
    id: 'burdened',
    label: '家中經濟主要支柱',
    weight: 13,
    description: '背負高額學貸且家中長期依賴你的匯款，理想與存款餘額之間沒有任何緩衝墊。',
    initialSavingsRange: [10000, 30000],
    studentLoanRange: [280000, 420000],
    monthlyStudentLoan: 4500,
    monthlyFilialAllowance: 6500,
    withParentsChance: 0.1,
  },
};

export interface FocusConfig {
  id: FocusId;
  label: string;
  shortDesc: string;
  energyDelta: number;
  purposeDelta: number;
  capitalDelta: number;
  lifeDelta: number;
  impactDelta: number;
}

export const FOCUS_OPTIONS: FocusConfig[] = [
  {
    id: 'fieldwork',
    label: '深耕實務現場',
    shortDesc: '把案子、會員或個案顧到最好，影響力上升，但體力與情緒消耗較明顯。',
    energyDelta: -0.6,
    purposeDelta: 0.7,
    capitalDelta: 0.9,
    lifeDelta: -0.4,
    impactDelta: 3.5,
  },
  {
    id: 'growth',
    label: '跨界培力與進修',
    shortDesc: '整理作品集、修法規課、建立同業人脈，提升專業資本與談薪籌碼。',
    energyDelta: -0.1,
    purposeDelta: 0.2,
    capitalDelta: 2.2,
    lifeDelta: -0.1,
    impactDelta: 1.8,
  },
  {
    id: 'advocacy',
    label: '外部倡議與募款',
    shortDesc: '寫計畫、跑公聽會、對外發聲與拓捐款，提升影響力與人脈，情緒耗損不小。',
    energyDelta: -0.7,
    purposeDelta: 0.6,
    capitalDelta: 1.7,
    lifeDelta: -0.5,
    impactDelta: 3.2,
  },
  {
    id: 'recovery',
    label: '嚴守下班與身心修復',
    shortDesc: '準時關掉公務 LINE、拒絕無償加班，顯著回復身心能量與生活品質。',
    energyDelta: 4.0,
    purposeDelta: -0.3,
    capitalDelta: -0.2,
    lifeDelta: 2.2,
    impactDelta: 0.7,
  },
  {
    id: 'finance',
    label: '斜槓兼差與財務止血',
    shortDesc: '接講座、校稿或假日打工補貼生活費（每季額外進帳約 $6,500），明顯犧牲休息與生活時間。',
    energyDelta: -1.9,
    purposeDelta: -0.6,
    capitalDelta: 0.6,
    lifeDelta: -1.4,
    impactDelta: 0.8,
  },
];

export const PLAYER_NAME_POOL = [
  '林書羽',
  '陳柏均',
  '張家瑜',
  '黃品諺',
  '吳思樺',
  '劉宇軒',
  '蔡宜庭',
  '郭庭瑋',
  '許詠晴',
  '鄭子安',
  '謝佳蓉',
  '楊孟翰',
];

export const ERA_NOTES: Array<{ minYear: number; maxYear: number; text: string }> = [
  {
    minYear: 2010,
    maxYear: 2015,
    text: '社群網路崛起與公民運動升溫的年代，許多青年帶著熱血進場，卻也撞上 22K 與回捐文化。',
  },
  {
    minYear: 2016,
    maxYear: 2019,
    text: '社工薪資回捐爭議受到輿論檢視，衛福部與勞動部開始調整補助基準與工會法適用環境。',
  },
  {
    minYear: 2020,
    maxYear: 2021,
    text: 'COVID-19 疫情改寫實體活動、研討會與社區據點運作，線上轉型與防疫壓力瞬間湧現。',
  },
  {
    minYear: 2022,
    maxYear: 2024,
    text: '疫後通膨與都會房租急漲，同期企業大舉開出 ESG 永續職缺，非營利圈面臨嚴峻人才外流。',
  },
  {
    minYear: 2025,
    maxYear: 2032,
    text: 'AI 工具進入行政核銷與文案現場，但第一線陪伴、勞資談判與人情協調依舊無法被替代。',
  },
  {
    minYear: 2033,
    maxYear: 2060,
    text: '台灣邁入超高齡社會，長照、職業病、學會認證與工會保障需求居高不下，組織世代交棒迫在眉睫。',
  },
];

export function pickWeighted<T extends { weight: number }>(items: T[], rng = Math.random): T {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let cursor = rng() * total;
  for (const item of items) {
    cursor -= item.weight;
    if (cursor <= 0) return item;
  }
  return items[items.length - 1];
}

export function pickRandom<T>(arr: T[], rng = Math.random): T {
  return arr[Math.floor(rng() * arr.length)];
}

export function randomInt(min: number, max: number, rng = Math.random): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}
