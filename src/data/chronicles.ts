import type { FocusId, OrgTypeId, RegionId, RoleId, SimulationState } from '../types/game';
import { pickRandom } from './organizations';

interface RoutineLine {
  title: string;
  text: string;
  tag: string;
  orgTypes?: OrgTypeId[];
  roles?: RoleId[];
  onlyOutsideNPO?: boolean;
  excludeOutsideNPO?: boolean;
  onlyRegular?: boolean;
  quarters?: Array<1 | 2 | 3 | 4>;
  focuses?: FocusId[];
  regions?: RegionId[];
  minAge?: number;
  maxAge?: number;
}

const ROUTINE_LINES: RoutineLine[] = [
  // === 學會專屬日常 ===
  {
    tag: '學會會務',
    title: '理監事會議程與簽到表',
    text: '開會前三天還在電話追問教授與醫師理事能否出席，只怕出席人數沒過半導致議案流會。',
    orgTypes: ['academic_society'],
  },
  {
    tag: '學會年會',
    title: '年會徵稿與審查催件',
    text: '寄出第三封「敬請惠賜審查意見」信件，同時確認飯店會議室投影布幕尺寸與便當素食數量。',
    orgTypes: ['academic_society'],
    quarters: [2, 3],
  },
  {
    tag: '繼續教育',
    title: '學分申報與報到刷卡',
    text: '週末六點半到會場架報到平板，整天處理會員忘記刷簽退、系統沒入檔的抗議電話。',
    orgTypes: ['academic_society'],
  },
  {
    tag: '人團行政',
    title: '內政部年度資料報備',
    text: '把會員名冊、工作計畫書與收支決算表裝訂成冊送審，順便重寄了第十二次電子收據給忘記扣繳的會員。',
    orgTypes: ['academic_society'],
    quarters: [1, 2],
  },
  {
    tag: '學會日常',
    title: '常年會費催繳季',
    text: '逐一比對銀行匯款後五碼，遇到幾位匯款沒註明姓名的資深會員，只能從通訊錄一個個打電話對帳。',
    orgTypes: ['academic_society'],
    quarters: [1],
  },
  {
    tag: '刊物出版',
    title: '期刊校對與廠商贊助排版',
    text: '跟排版社來回核對第八版清樣，還得確認贊助藥廠／器材商的廣告頁沒有誤觸主管機關法規。',
    orgTypes: ['academic_society'],
  },
  {
    tag: '交接備忘',
    title: '理事長換屆前的冷氣修理',
    text: '上屆理事長交辦的專案還沒結案，新任理事長已經開始討論要不要把辦公室搬去他校附近。',
    orgTypes: ['academic_society'],
  },
  {
    tag: '年會現場',
    title: '茶歇點心與大合照動線',
    text: '手裡同時拿著兩支無線電對講機、一疊臨時收據和司儀稿，整場年會結束時才發現自己連一口水都沒喝到。',
    orgTypes: ['academic_society'],
    quarters: [3, 4],
  },

  // === 產業／企業工會專屬日常 ===
  {
    tag: '工會組織',
    title: '廠區換班門口的傳單',
    text: '傍晚五點半站在單位側門風口發入會簡章，警衛一直盯著你的背心，但總算有兩位剛下班的基層員工偷偷接過去。',
    orgTypes: ['industrial_union'],
  },
  {
    tag: '勞資調解',
    title: '勞動局調解室的漫長下午',
    text: '陪會員整理過去三年的出勤打卡紀錄與薪資單明細，在調解室裡和公司法務逐條攻防加班費算法。',
    orgTypes: ['industrial_union'],
  },
  {
    tag: '集體行動',
    title: '連署書與理事會沙盤推演',
    text: '晚上八點半工會辦公室還亮著燈，幹部一邊吃炒飯一邊盤點哪幾個班別與單位還沒湊齊連署門檻。',
    orgTypes: ['industrial_union'],
  },
  {
    tag: '裁決準備',
    title: '整理不當勞動行為證據鏈',
    text: '把資方主管在 LINE 群組暗示「加入工會就別想升等」的截圖做成逐字稿與時間軸附件。',
    orgTypes: ['industrial_union'],
  },
  {
    tag: '工運日常',
    title: '五一遊行物資與旗幟清點',
    text: '倉庫裡堆著剛印好的標語布條和擴音器，群組正在討論怎麼動員不願請假北上的會員。',
    orgTypes: ['industrial_union'],
    quarters: [2],
  },
  {
    tag: '工會自省',
    title: '夜深後的勞動時間帳本',
    text: '今天連續回覆會員私訊到凌晨一點，突然意識到自己這個月的加班時數其實比被調解的公司還長。',
    orgTypes: ['industrial_union'],
  },
  {
    tag: '組織擴張',
    title: '跨夜班輪班座談',
    text: '配合醫院與工廠大夜班下班時間，清晨七點在早餐店辦小型勞教說明會。',
    orgTypes: ['industrial_union'],
  },

  // === 職業工會專屬日常 ===
  {
    tag: '職業工會',
    title: '勞健保加退保櫃檯高峰',
    text: '一早還沒開門就有師傅拿著證件排隊辦加保與投保薪資調整，邊敲系統邊回答「這樣退休能領多少」。',
    orgTypes: ['occupational_union'],
  },
  {
    tag: '職災服務',
    title: '工地摔傷的急件給付',
    text: '幫鷹架摔傷卻差點因為欠繳兩期保費被退保的會員整理就醫證明，順利送進勞保局審核。',
    orgTypes: ['occupational_union'],
  },
  {
    tag: '職訓核銷',
    title: '勞動部職訓計畫點名冊',
    text: '週末陪學員在悶熱教室上技能訓練課，緊盯簽到退與拍照存證，只怕訪視委員抓出兩分鐘誤差。',
    orgTypes: ['occupational_union'],
  },
  {
    tag: '會員大會',
    title: '代表大會紀念品與摸彩券',
    text: '在倉庫搬了兩百箱洗碗精和保溫杯準備當五一紀念品，理事還來關切今年摸彩最大獎夠不夠體面。',
    orgTypes: ['occupational_union'],
    quarters: [1, 2],
  },
  {
    tag: '會務行政',
    title: '季繳催費簡訊與掛號信',
    text: '對完超商代收與郵局劃撥對帳檔，寄出八十封即將停保的催繳雙掛號，只希望別再有人出事才發現斷保。',
    orgTypes: ['occupational_union'],
  },
  {
    tag: '工會政治',
    title: '理監事改選前的茶壺風波',
    text: '不同派系理事輪流來辦公室泡茶探口風，你保持禮貌微笑繼續把手上的月報表打完。',
    orgTypes: ['occupational_union'],
  },

  // === 草根協會日常 ===
  {
    tag: '草根日常',
    title: '一人分飾四角的一週',
    text: '早上寫完補助期中報告，中午開箱物資並自己開貨車送去社區，下午還要修官網捐款按鈕。',
    orgTypes: ['grassroots'],
  },
  {
    tag: '小型協會',
    title: '發票對獎與零用金盤點',
    text: '跟實習生坐在地板上把民眾捐的紙本發票一張張攤開對號，算著這個月辦公室水電費還夠不夠。',
    orgTypes: ['grassroots'],
  },
  {
    tag: '現場溫度',
    title: '社區長輩塞來的兩顆芭樂',
    text: '剛結束一場沒什麼預算的社區活動，雖然累到肩膀發麻，但阿公臨走前笑著說下週還要來。',
    orgTypes: ['grassroots'],
  },
  {
    tag: '財務警戒',
    title: '定期定額退訂通知',
    text: '月底後台跳出七筆信用卡扣款失敗通知，又得花一個下午打電話或寄信溫柔提醒捐款人更新卡號。',
    orgTypes: ['grassroots', 'advocacy_ngo'],
  },

  // === 中大型社福日常 ===
  {
    tag: '核銷地獄',
    title: '憑證粘存單與便當費標準',
    text: '政府標案承辦要求重貼上個月的 42 張發票，因為每顆便當多報了 5 塊錢超過核銷上限。',
    orgTypes: ['large_welfare'],
    quarters: [4],
  },
  {
    tag: '社工現場',
    title: '個案紀錄與督導會議',
    text: '白天跑了三個家庭訪視，回到辦公室打開系統補完 3,000 字紀錄時，窗外已經全黑。',
    orgTypes: ['large_welfare', 'grassroots'],
    roles: ['social_worker'],
  },
  {
    tag: '評鑑備戰',
    title: '機構評鑑資料夾地獄',
    text: '為了迎戰主管機關三年一次的大評鑑，全機構停開部分活動兩週，把每個櫃子的標籤統統重印。',
    orgTypes: ['large_welfare'],
    quarters: [2, 3],
  },
  {
    tag: '標案季',
    title: '年底十二月消化預算衝刺',
    text: '明明已經忙到快撐不住，還是得在 12 月 15 日前把年度方案剩下來的講師費與印製費核銷完畢。',
    orgTypes: ['large_welfare', 'local_foundation'],
    quarters: [4],
  },

  // === 倡議型 NGO 日常 ===
  {
    tag: '立院備戰',
    title: '公聽會發言稿與懶人包',
    text: '對照三個部會的修法版本畫紅線到凌晨，只為了早上九點半委員會質詢能塞進一句關鍵附帶決議。',
    orgTypes: ['advocacy_ngo'],
  },
  {
    tag: '街頭與輿論',
    title: '部會大門前的早晨記者會',
    text: '早上八點半抱著手舉牌和音響搭捷運趕往行政院外，祈禱今天不要剛好遇到娛樂大新聞被洗掉版面。',
    orgTypes: ['advocacy_ngo'],
  },
  {
    tag: '粉專經營',
    title: '留言區攻防與事實查核',
    text: '貼出一篇兩千字的政策長文換來兩百個讚；同一天下午小編貼的迷因圖卻被轉發破千。',
    orgTypes: ['advocacy_ngo'],
  },

  // === 地方基金會 & 企業基金會/國際NGO ===
  {
    tag: '地方深耕',
    title: '鎮公所與里長伯的交陪',
    text: '跑完兩個鄉鎮協調場地借用，學會先坐下來喝完三杯高山茶再切入專案合作細節。',
    orgTypes: ['local_foundation'],
  },
  {
    tag: '企業永續',
    title: '英文季度影響力報表',
    text: '把偏鄉與社區的真實改變拆成 SROI 指標與 ESG 簡報，確保母公司董事會看得懂這筆預算的價值。',
    orgTypes: ['corp_intl_ngo'],
  },
  {
    tag: '跨國時差',
    title: '與總部的深夜視訊會議',
    text: '晚上十點打開視訊向亞太區主管解釋台灣的法規脈絡，對方問為什麼不能直接套用歐美模板。',
    orgTypes: ['corp_intl_ngo'],
  },

  // === 職場內外／季節／地區／生活共通 ===
  {
    tag: '都會租屋',
    title: '捷運站外的小套房帳單',
    text: '扣掉房租、電費與通勤月票後，看著手機網銀餘額發呆了十秒，把原本想點的外送改回超商微波便當。',
    regions: ['taipei_metro'],
    maxAge: 34,
  },
  {
    tag: '區域通勤',
    title: '高鐵與區間車上的筆記',
    text: '搭最早一班車跨縣市開會或跑訪視，筆電在膝蓋上趕著明天要交的期中成果報告。',
    regions: ['other_six'],
  },
  {
    tag: '偏鄉現場',
    title: '山路盡頭的據點燈火',
    text: '開車開了一個半小時才到服務站，這裡沒有同業聚會，卻也少了都市裡無止盡的會議內耗。',
    regions: ['non_six_rural'],
  },
  {
    tag: '年節壓力',
    title: '除夕飯桌上的職涯問候',
    text: '親戚又在問「你們協會是做義工的嗎？一個月有沒有五萬？」你夾了一塊蘿蔔糕笑著帶過。',
    quarters: [1],
    excludeOutsideNPO: true,
  },
  {
    tag: '年底考核',
    title: '年終獎金入帳通知',
    text: '財務傳來今年的年終試算表，在物價上漲的年份裡，大家都默默盯著「0.8 個月還是 1.5 個月」那行字。',
    quarters: [4],
    onlyRegular: true,
    excludeOutsideNPO: true,
  },
  {
    tag: '跨界學習',
    title: '週末工作坊與同業吐苦水',
    text: '參加非營利組織財務與法規講座，中場休息時發現別家秘書和社工也都在抱怨同一件事。',
    focuses: ['growth'],
    excludeOutsideNPO: true,
  },
  {
    tag: '身心界線',
    title: '六點準時關掉公務通知',
    text: '這季強迫自己下班後把工作群組設為靜音，去河濱慢跑四十分鐘，久違地感覺呼吸變深了一點。',
    focuses: ['recovery'],
  },
  {
    tag: '斜槓止血',
    title: '週六下午的接案校稿',
    text: '用週末幫出版案校對兼寫文案多賺了幾千元，至少這個月的學貸與房租不必再動到預備金。',
    focuses: ['finance'],
    excludeOutsideNPO: true,
  },
  {
    tag: '外部資源',
    title: '跨組織募款聯名與企劃',
    text: '為了明年不斷炊，整季密集拜訪企業 CSR 窗口與小型基金會，練就十分鐘把理念講進人心的本事。',
    focuses: ['advocacy'],
    excludeOutsideNPO: true,
  },
  {
    tag: '同梯消息',
    title: '大學系友群組的對照',
    text: '滑著群組裡工程師與金融業同學分享的配股與出國照片，你關掉螢幕繼續準備明早的會員名冊。',
    maxAge: 33,
    excludeOutsideNPO: true,
  },
  {
    tag: '中生代處境',
    title: '夾在理監事與新人之間',
    text: '一方面要替年輕專員擋掉不合理的臨時交辦，另一方面還要消化組織高層「以前我們都這樣做」的堅持。',
    minAge: 33,
    maxAge: 46,
    excludeOutsideNPO: true,
  },
  {
    tag: '資深視角',
    title: '成為新人的避風港',
    text: '看見剛進來三個月的專員因為被捐款人或會員罵而躲在茶水間哭，你默默遞上衛生紙想起十年前的自己。',
    minAge: 36,
    excludeOutsideNPO: true,
  },
  {
    tag: '歲月紀錄',
    title: '重新整理五年來的活動照片',
    text: '在雲端硬碟深處翻出剛入行時的場勘照，才發現原來一路上自己真的陪著這個組織走過這麼多關卡。',
    minAge: 32,
  },
  {
    tag: '颱風季備災',
    title: '豪雨停班課的遠端待命',
    text: '外面宣布停班停課，但社區長輩送餐協調、工會停班出勤爭議詢問或個案安置電話依然一個接一個進來。',
    quarters: [3],
    excludeOutsideNPO: true,
  },
  {
    tag: '夏季暑期',
    title: '營隊、實習生與冷氣費帳單',
    text: '暑期實習生剛報到需要花心力帶，同時辦公室電費帳單創下今年新高，總務又在走廊關燈節電。',
    quarters: [2, 3],
    excludeOutsideNPO: true,
  },
  {
    tag: '春季開局',
    title: '會員大會暨年度計畫啟動',
    text: '年度第一季工作計畫正式上路，白板上寫滿了補助申請期限、理監事會日期與預定募款目標。',
    quarters: [1],
    excludeOutsideNPO: true,
  },
  {
    tag: '報稅季',
    title: '五月捐款與會費收據查詢潮',
    text: '報稅季到來，電話與信箱塞滿「我去年捐的兩千元怎麼沒上傳國稅局」的急切詢問。',
    quarters: [2],
    excludeOutsideNPO: true,
  },
  {
    tag: '中年體檢',
    title: '健檢報告上的數個紅字',
    text: '翻著剛寄到的健檢報告，醫生叮嚀要注意血壓與胃食道逆流，少熬夜趕業務與少喝黑咖啡。',
    minAge: 38,
  },
  {
    tag: '長輩牽掛',
    title: '電話另一頭的門診時間',
    text: '午休十分鐘急忙替爸媽掛好下週三的醫院複診，一邊在行事曆上喬出能請特休陪診的空檔。',
    minAge: 37,
  },
  {
    tag: '資深傳承',
    title: '把隱性知識寫成 SOP',
    text: '意識到如果明天自己請長假就沒人知道主管機關公文怎麼回，開始把十年積累的眉角整理成交接手冊。',
    minAge: 42,
  },
  {
    tag: '商界日常',
    title: '永續報告書與利害關係人訪談',
    text: '在企業辦公室裡用流暢的簡報討論社會投資報酬率，冷氣很強、咖啡免費，偶爾還是會確認原本領域的新聞。',
    roles: ['corp_esg_officer'],
  },
  {
    tag: '行政後勤',
    title: '每一張不能出錯的簽呈與憑證',
    text: '沒有站在記者會閃光燈下，卻在每個發薪日準時把所有同事的薪水、勞健保與報帳誤差壓到零。',
    roles: ['admin_finance'],
  },
  {
    tag: '募款日常',
    title: '週年募資頁面的轉換率',
    text: '盯著募款頁面的點擊轉換報表修第三版文案，苦惱怎麼在不消費弱勢尊嚴的前提下打動捐款人。',
    roles: ['fundraiser_pr'],
  },
  {
    tag: '專案現場',
    title: '合作夥伴臨時抽腿的補位',
    text: '原定協辦單位在活動前十天通知經費撤回，整週都在打電話找替代場地與重算預算表。',
    roles: ['project_exec'],
  },
  {
    tag: '深夜餘裕',
    title: '加班結束後的巷口乾麵',
    text: '九點半離開辦公室，巷口麵攤老闆已經認得你了，多切一盤海帶豆干當作今天的微薄慰勞。',
  },
  {
    tag: '數位工具',
    title: '雲端表單與 AI 初稿輔助',
    text: '開始把會議逐字稿交給 AI 整理草稿，省下了兩小時打字時間，但人際溝通與現場僵局還是得親自上。',
  },
  {
    tag: '組織體感',
    title: '一場比想像中順利的協調會',
    text: '原本以為會吵翻天的跨部門會議，意外在兩小時內達成共識，讓你覺得這份工作好像還能再撐一陣子。',
  },
  {
    tag: '日常挫敗',
    title: '被誤解為公部門櫃檯',
    text: '接起民眾電話被劈頭罵了二十分鐘，解釋半天我們只是民間組織不是市政府，對方仍氣沖沖掛斷電話。',
    excludeOutsideNPO: true,
  },
  {
    tag: '同溫層外',
    title: '搭計程車時司機的一句話',
    text: '司機問起你在哪高就，聽完後說「你們做這種工作的真的很有愛心啦，雖然薪水不高齁」——你禮貌微笑沒接話。',
    excludeOutsideNPO: true,
  },
  {
    tag: '理監事會',
    title: '週末的會議紀錄逐字修正',
    text: '星期六開了一整天理監事或董事會議，禮拜一主管又退回會議紀錄說某位資深委員的措辭要改得「更圓融一點」。',
    orgTypes: ['academic_society', 'industrial_union', 'occupational_union', 'grassroots'],
  },
  {
    tag: '方案創新',
    title: '把舊活動改造成新試點',
    text: '說服主管把沿用八年的制式活動砍掉一半，騰出預算試做更貼近當代需求的小型試驗。',
    excludeOutsideNPO: true,
  },
  {
    tag: '組織老化',
    title: '連續三個月開不出來的招募缺',
    text: '人力銀行履歷打開還是只有零星幾封，大家都知道這個薪資區間在都會區越來越難找到即戰力。',
    excludeOutsideNPO: true,
  },
  {
    tag: '微型勝利',
    title: '深夜收到的一則短短訊息',
    text: '幾個月前合作過的夥伴、會員或支持者突然傳來「謝謝你當時把那件事撐下來，後續真的有改變」，瞬間替你充回半格電。',
    excludeOutsideNPO: true,
  },
  {
    tag: '生活切片',
    title: '陽台盆栽與未拆封的快遞',
    text: '忙完連三週的大型專案，回家才發現網購的書已經躺在管理室五天，決定週末什麼群組都不看。',
  },
  {
    tag: '職涯拉扯',
    title: '更新到一半又關掉的履歷檔',
    text: '半夜打開 104 和 LinkedIn 看了幾個職缺，把履歷草稿寫了兩段又關掉視窗，心想「再把手上的案子帶完這季吧」。',
    excludeOutsideNPO: true,
  },
];

// 額外補充達到 85+ 條豐富切片
const EXTRA_SEASONAL_LINES: RoutineLine[] = [
  {
    tag: '工會諮詢',
    title: '下班後的 LINE 法律救急',
    text: '剛洗完澡就收到會員傳來「公司明天要逼我簽自願離職書怎麼辦」，立刻打過去逐句教對方怎麼保留證據與拒絕。',
    orgTypes: ['industrial_union', 'occupational_union'],
  },
  {
    tag: '學會日常',
    title: '學分認證補登期限最後一天',
    text: '全台灣執業會員集中在今天晚上十一點前寄信求救，你守在電腦前手動幫十幾個人解鎖系統帳號。',
    orgTypes: ['academic_society'],
  },
  {
    tag: '職業工會',
    title: '勞保局投保薪資級距調整',
    text: '協助近兩百位會員辦理年度投保級距調高，耐心解釋保費計算與未來老年給付的關係。',
    orgTypes: ['occupational_union'],
    quarters: [1, 4],
  },
  {
    tag: '倡議日常',
    title: '跨團體聯合聲明定稿夜',
    text: '十個友好團體為了同一份聲明第三段的用字在群組裡來回改了八版，終於在半夜一點湊齊所有聯署 LOGO。',
    orgTypes: ['advocacy_ngo'],
  },
  {
    tag: '大型社福',
    title: '內部跨組資源爭奪會議',
    text: '社工組、倡議組與公關組在年度預算分配會議上各自捍衛人力需求，沒有人是壞人，但總盤就是這麼小。',
    orgTypes: ['large_welfare'],
    quarters: [4],
  },
  {
    tag: '草根日常',
    title: '社區二手物資整理間',
    text: '倉庫又被善心人士寄來的過期食品和穿破外套塞滿，花了一個下午分類哪些能用、哪些只能自己清運。',
    orgTypes: ['grassroots'],
  },
  {
    tag: '地方基金會',
    title: '在地中小學合作方案結案',
    text: '跟著偏鄉國小老師一起看孩子們的成果發表，雖然經費只有企業贊助的十分之一，現場的眼神卻亮得很真實。',
    orgTypes: ['local_foundation'],
  },
  {
    tag: '企業/國際',
    title: '志工日上百位企業員工報到',
    text: '帶兩百位穿統一背心的企業志工進場服務，比起服務對象的回饋，更花力氣的是確保大家都能準時拍完大合照。',
    orgTypes: ['corp_intl_ngo'],
  },
  {
    tag: '財政現實',
    title: '主計與會計師查帳週',
    text: '整個星期被叫進會議室抽查兩年前的某張交通費憑證，翻遍五箱舊卷宗總算找出那張有點褪色的車票存根。',
    quarters: [2],
    excludeOutsideNPO: true,
  },
  {
    tag: '心理勞動',
    title: '與督導或同儕的一杯手搖飲',
    text: '下午四點半全辦公室眼神死，有人主動統計訂烏龍青茶加珍珠，大家在茶水間吐槽十分鐘後繼續面對現實。',
    excludeOutsideNPO: true,
  },
  {
    tag: '都會生活',
    title: '月底最後三天的超市折扣時間',
    text: '晚上八點後順路去全聯搶六折即期便當，算起來這個月又省下一千多塊生活費。',
    regions: ['taipei_metro', 'other_six'],
    excludeOutsideNPO: true,
  },
  {
    tag: '政策變動',
    title: '勞動與社福新法規研讀',
    text: '主管機關又公告新版補助辦法或人團會務規範，你把 40 頁 PDF 下載下來用螢光筆畫滿重點。',
    excludeOutsideNPO: true,
  },
  {
    tag: '組織韌性',
    title: '一場安靜卻有實質進展的季度回顧',
    text: '把本季做過的服務與推動過的制度一條條攤在桌面上，發現其實比想像中多守住了一些人的日常。',
    excludeOutsideNPO: true,
  },
  {
    tag: '親密關係',
    title: '差點忘記的紀念日與遲到晚餐',
    text: '因為臨時突發狀況晚了四十分鐘才到餐廳，幸好對方沒有發脾氣，只是提醒你手機可以開飛航模式一小時。',
  },
  {
    tag: '職業認同',
    title: '在演講台下看見自己的影子',
    text: '參加跨界論壇時聽見剛入行兩年的年輕人提問，突然發覺那些你走過的困惑正在下一代身上重演。',
    minAge: 34,
  },
  {
    tag: '資深日常',
    title: '替年輕同事爭取合理補休',
    text: '把原本大家習慣「無償奉獻」的週末活動排班重寫一遍，堅持讓所有同仁確實拿到補休時數。',
    minAge: 35,
    excludeOutsideNPO: true,
  },
  // === 轉任企業 ESG 永續部門專屬日常 ===
  {
    tag: '企業永續',
    title: '跨部門碳盤查與供應鏈訪談',
    text: '整下午跟廠務、採購與財會部開永續工作小組會議，簡報做得漂亮、冷氣很強，偶爾還是會確認原本民間領域的新聞。',
    onlyOutsideNPO: true,
  },
  {
    tag: '企業公益',
    title: '審核民間團體年度公益贊助案',
    text: '桌前擺著十幾份草根協會與社福團體寄來的提案書，你第一次站在甲方位置拿紅筆圈出「誰真的在做實事、誰只是寫漂亮 KPI」。',
    onlyOutsideNPO: true,
  },
  {
    tag: '生活對比',
    title: '準時六點打卡與免費吧台咖啡',
    text: '五點五十八分收拾電腦走進電梯，不必擔心誰半夜打來求救；帳戶數字穩步上升，卻偶爾懷念以前在街頭奔走的真實汗水。',
    onlyOutsideNPO: true,
  },
  {
    tag: '報告衝刺',
    title: 'GRI 準則與永續報告書第三方查證',
    text: '連續兩週跟會計師與外包顧問核對溫室氣體盤查數據與 SROI 模型，深怕一個小數點誤植影響公司評等。',
    onlyOutsideNPO: true,
  },
];

export const ALL_ROUTINE_LINES: RoutineLine[] = [...ROUTINE_LINES, ...EXTRA_SEASONAL_LINES];

export function pickRoutineLine(state: SimulationState, rng = Math.random): RoutineLine {
  const isOutside = state.org.isOutsideNPO;

  const baseFilter = (line: RoutineLine) => {
    if (isOutside) {
      if (line.excludeOutsideNPO) return false;
      if (line.orgTypes) return false;
      if (line.roles && !line.roles.includes('corp_esg_officer')) return false;
    } else {
      if (line.onlyOutsideNPO) return false;
      if (line.orgTypes && !line.orgTypes.includes(state.org.type)) return false;
      if (line.roles && !line.roles.includes(state.role)) return false;
    }
    if (line.onlyRegular && state.employmentType !== 'regular') return false;
    if (line.quarters && !line.quarters.includes(state.currentQuarter)) return false;
    if (line.minAge !== undefined && state.age < line.minAge) return false;
    if (line.maxAge !== undefined && state.age > line.maxAge) return false;
    return true;
  };

  const exactMatches = ALL_ROUTINE_LINES.filter((line) => {
    if (!baseFilter(line)) return false;
    if (line.focuses && !line.focuses.includes(state.focus)) return false;
    if (line.regions && !line.regions.includes(state.region)) return false;
    const hasSpecific = isOutside
      ? Boolean(line.onlyOutsideNPO || line.roles?.includes('corp_esg_officer'))
      : Boolean(line.orgTypes || line.roles || line.focuses || line.regions);
    return hasSpecific;
  });

  if (exactMatches.length > 0 && rng() < (isOutside ? 0.85 : 0.72)) {
    return pickRandom(exactMatches, rng);
  }

  const fallbackPool = ALL_ROUTINE_LINES.filter(baseFilter);

  if (fallbackPool.length > 0) {
    return pickRandom(fallbackPool, rng);
  }

  return ALL_ROUTINE_LINES[0];
}
