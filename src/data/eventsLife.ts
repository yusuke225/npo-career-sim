import type { GameEvent } from '../types/game';

export const LIFE_AND_ERA_EVENTS: GameEvent[] = [
  // =========================================================================
  // 時代大事件（依年份區間觸發）
  // =========================================================================
  {
    id: 'era_2020_covid_welfare',
    title: '2020 疫情海嘯：據點關閉改送餐與急難紓困求生戰',
    category: 'era',
    tag: '台灣時代事件 · 2020',
    weight: 40,
    isEraEvent: true,
    conditions: {
      yearRange: [2020, 2021],
      excludeOutsideNPO: true,
      orgTypes: ['large_welfare', 'grassroots', 'local_foundation'],
    },
    narrative:
      '三級警戒與防疫規範說來就來，社區共餐據點與課輔班被迫緊急關閉、實體募款義賣歸零。獨居長輩斷了熱食、脆弱家庭父母因停業頓失收入，辦公室得在一週內改組為送餐與防疫物資調度站。',
    choices: [
      {
        id: 'covid_welfare_delivery',
        label: '改採無接觸送餐與防疫物資包宅配，同時把募款與志工聯繫全面搬上線',
        sublabel: '超時搶救服務不斷線與現金流，練就跨螢幕動員能力',
        effect: {
          statsDelta: { energy: -11, capital: 10, purpose: 8, life: -4, impactScore: 16 },
          milestoneTag: '帶領社福團隊完成疫情期間無接觸送餐與數位轉型',
        },
        outcomeText:
          '雖然半夜還在包防疫口罩與乾糧箱，但看著阿嬤隔著鐵門揮手說「有你們送便當我就不怕了」，整季的疲憊瞬間有了重量。',
      },
      {
        id: 'covid_welfare_relief',
        label: '逐案協助受創家庭整理文件、向區公所與衛福部申請急難紓困',
        sublabel: '把自己當成政策與弱勢家庭之間最後一哩的翻譯員',
        effect: {
          statsDelta: { energy: -13, purpose: 12, capital: 6, life: -5, impactScore: 17 },
        },
        outcomeText:
          '你替幾十戶沒有薪資轉帳紀錄的單親與零工家庭補齊切結書送到區公所。電話打到喉嚨沙啞，卻在最恐慌的一年撐住很多人的房租。',
      },
    ],
  },
  {
    id: 'era_2020_covid_union',
    title: '2020 疫情海嘯：勞工紓困爆量、減班休息與防疫假攻防',
    category: 'era',
    tag: '台灣時代事件 · 2020',
    weight: 40,
    isEraEvent: true,
    conditions: {
      yearRange: [2020, 2021],
      excludeOutsideNPO: true,
      orgTypes: ['industrial_union', 'occupational_union'],
    },
    narrative:
      '三級警戒重創各行各業，工會電話從早響到晚：職業工會會員急著問「勞工生活補貼三萬／一萬元怎麼申請」，第一線輪班與服務業會員則面臨資方片面放無薪假、扣防疫隔離假薪水與職場群聚風險。',
    choices: [
      {
        id: 'covid_union_relief_desk',
        label: '緊急架設線上紓困查詢與表單分流，連夜替會員逐案核對加保資格與申辦補助',
        sublabel: '工會櫃檯與 LINE 群組全面爆線，但守住基層勞工最急迫的救命錢',
        effect: {
          statsDelta: { energy: -13, purpose: 12, capital: 8, life: -5, impactScore: 17 },
          milestoneTag: '疫情期間協助大批工會會員完成勞工紓困申辦',
        },
        outcomeText:
          '你連續兩週加班核對數百份投保明細與帳戶資料，幫許多手停口停的師傅與輪班勞工順利領到補貼，會員對工會的向心力創下新高。',
      },
      {
        id: 'covid_union_labor_defense',
        label: '發函要求資方落實分艙分流與合法防疫假，針對違法無薪假火速向勞動局舉發',
        sublabel: '站上防疫勞權第一線，扛住資方壓力替勞工守住薪資與健康底線',
        effect: {
          statsDelta: { energy: -11, purpose: 11, capital: 10, life: -4, impactScore: 16 },
        },
        outcomeText:
          '在工會強硬介入與勞動局發函關切下，資方被迫撤回違法減薪並補發防疫隔離津貼，讓會員看見有工會撐腰的實質力量。',
      },
    ],
  },
  {
    id: 'era_2020_covid_advocacy',
    title: '2020 疫情海嘯：街頭與實體講座歸零，全面轉戰線上倡議',
    category: 'era',
    tag: '台灣時代事件 · 2020',
    weight: 40,
    isEraEvent: true,
    conditions: {
      yearRange: [2020, 2021],
      excludeOutsideNPO: true,
      orgTypes: ['advocacy_ngo', 'corp_intl_ngo'],
    },
    narrative:
      '三級警戒下所有街頭集會、公聽會動員與實體倡議講座瞬間喊卡，新聞版面九成被每日確診數佔滿，原本關注的環境、人權或永續議題幾乎失去曝光。同時外送暴增帶來大量一次性垃圾、數位足跡隱私爭議也浮上檯面。',
    choices: [
      {
        id: 'covid_advocacy_online_pivot',
        label: '一週內架起線上直播論壇與社群圖卡戰隊，把議題扣連疫情下的結構漏洞重新發聲',
        sublabel: '練就遠距倡議與數位募資技能，在媒體真空期守住公共討論空間',
        effect: {
          statsDelta: { energy: -10, capital: 11, purpose: 8, life: -3, impactScore: 15 },
          milestoneTag: '帶領團隊完成疫情期間線上倡議與數位轉型',
        },
        outcomeText:
          '你在一週內學會 OBS 直播與線上連署導流，單場線上座談意外吸引上千位跨縣市網友參與，也開拓出一批全新的年輕定捐支持者。',
      },
      {
        id: 'covid_advocacy_policy_watch',
        label: '趁實體活動暫停沉潛做深度政策研究，盯緊紓困特別條例的環保與人權把關條款',
        sublabel: '聲量較低但累積扎實研究能量，替疫後倡議備妥彈藥',
        effect: {
          statsDelta: { energy: -6, purpose: 9, capital: 9, life: 0, impactScore: 13 },
        },
        outcomeText:
          '你們發布的特別條例監督報告被多位立委引用，成功在預算審查中擋下數項趁疫情夾帶闖關的爭議開發條款。',
      },
    ],
  },
  {
    id: 'era_2020_covid_society',
    title: '2020 疫情海嘯：年度學術研討會喊卡與繼續教育學分斷鏈危機',
    category: 'era',
    tag: '台灣時代事件 · 2020',
    weight: 40,
    isEraEvent: true,
    conditions: {
      yearRange: [2020, 2021],
      excludeOutsideNPO: true,
      orgTypes: ['academic_society'],
    },
    narrative:
      '三級警戒說來就來，原定五百人的年度學術研討會飯店場地訂金卡死，廠商贊助攤位紛紛喊退；同時數百位執業會員急著湊足年度繼續教育學分換發執照，焦急電話一通接一通打進秘書處。',
    choices: [
      {
        id: 'covid_society_virtual_conf',
        label: '連夜把實體年會全面改成線上視訊研討會，並向主管機關申請核定線上學分簽到',
        sublabel: '一週內學會視訊導播與線上簽退機制，保住學會年度核心收入與會員換證權益',
        effect: {
          statsDelta: { energy: -12, capital: 12, purpose: 7, life: -4, impactScore: 15 },
          milestoneTag: '成功將學會實體年會轉型為線上研討會與學分認證',
        },
        outcomeText:
          '你邊跟飯店談判延用訂金、邊幫十幾位不熟視訊軟體的資深教授做彩排，年會當天零斷線順利落幕，連理監事都對你佩服得五體投地。',
      },
      {
        id: 'covid_society_postpone_credits',
        label: '先向主管機關爭取執業換證學分展延，並將年會延期、改推小型線上專題工作坊',
        sublabel: '降低一次爆肝轉型的技術風險，但學會年度會費與贊助收入明顯縮水',
        effect: {
          orgFinanceDelta: -1,
          statsDelta: { energy: -6, purpose: 5, capital: 6, life: 0, impactScore: 10 },
        },
        outcomeText:
          '雖然今年度贊助費少了一大截，但成功爭取到會員學分展延緩衝期，也讓秘書處在最混亂的半年保住基本運作節奏。',
      },
    ],
  },
  {
    id: 'era_2022_inflation_rent',
    title: '疫後萬物齊漲：蛋價、便當與房租通膨夾擊',
    category: 'era',
    tag: '台灣時代事件 · 物價飆升',
    weight: 35,
    isEraEvent: true,
    conditions: { yearRange: [2022, 2025], excludeOutsideNPO: true },
    narrative:
      '原本巷口八十元的排骨便當漲破一百一，房東又發訊息通知下期起反映電價調漲。回頭看組織薪資表，今年的調薪幅度卻只有 0% 到 2%，實質購買力倒退回五年前。全辦公室午休話題只剩下哪裡還有便宜便當與到底要不要轉行。',
    choices: [
      {
        id: 'push_cost_of_living_adj',
        label: '整理主計總處 CPI 數據，聯合同事正式向理監事會爭取通膨調薪',
        sublabel: '替整個團隊試著爭取制度性調整，不靠個別哀求',
        effect: {
          statsDelta: { energy: -6, purpose: 5, capital: 6, life: 2, impactScore: 9 },
          salaryDelta: 1800,
        },
        outcomeText:
          '理監事會看著白紙黑字的物價漲幅表不好意思全部駁回，最終通過每人微調一千八百元伙食津貼，雖然追不上房租，至少感覺沒有被完全無視。',
      },
      {
        id: 'tighten_personal_belt',
        label: '組織帳面實在擠不出錢，只能靠自己搬遠一點通勤與帶便當省錢',
        sublabel: '減少職場衝突，把財務壓力吞進每日一小時的通勤時間裡',
        effect: {
          statsDelta: { energy: -7, purpose: -3, capital: 2, life: -5, impactScore: 4 },
          savingsDelta: 6000,
        },
        outcomeText:
          '你練就了星期天晚上做好五天份備餐便當的本事。帳面多存下幾千塊，只是每天早上要提早四十分鐘出門搭公車。',
      },
    ],
  },
  {
    id: 'era_earthquake_crowdout',
    title: '重大天災發生後的「善款排擠效應」',
    category: 'era',
    tag: '台灣公益結構現場',
    weight: 32,
    isEraEvent: true,
    conditions: {
      yearRange: [2018, 2032],
      excludeOutsideNPO: true,
      orgTypes: ['grassroots', 'large_welfare', 'local_foundation', 'advocacy_ngo'],
    },
    narrative:
      '台灣發生重大地震與複合災情，全國愛心捐款瞬間大量湧入大型救災專戶。這當然令人欣慰，但你們這種非急難型的日常服務或小型倡議組織，緊接著三個月的單筆捐款與小額轉帳幾乎腰斬。財務會議上沒人敢大聲抱怨，只能苦笑著重算明年預算。',
    choices: [
      {
        id: 'collaborate_disaster_support',
        label: '主動盤點組織專業與災區連結（如身心支持／勞權／地方據點），加入跨團救援網',
        sublabel: '不搶資源而是補上長期重建缺口，拓展跨界盟友',
        effect: {
          statsDelta: { energy: -9, purpose: 8, capital: 9, life: -2, impactScore: 15 },
        },
        outcomeText:
          '你們串聯三個友會接手災後第三個月媒體退燒後的長期陪伴工作，不但沒有被邊緣化，反而讓幾位新捐款人看見深耕日常的價值。',
      },
      {
        id: 'educate_steady_giving',
        label: '寫一篇誠實的公開信告訴支持者「日常防護網同樣不能斷電」',
        sublabel: '溫柔溝通捐款結構問題，盼留住核心定捐護城河',
        effect: {
          statsDelta: { energy: -5, purpose: 6, capital: 5, life: 0, impactScore: 10 },
          orgFinanceDelta: 1,
        },
        outcomeText:
          '雖然點閱率遠不如救災新聞，但好幾位老捐款人看完信後悄悄把每月三百元調高成五百元，留言寫著「謝謝你們一直都在」。',
      },
    ],
  },
  {
    id: 'era_ai_and_esg_wave',
    title: 'AI 工具與永續揭露潮：行政縮時還是工作加速？',
    category: 'era',
    tag: '台灣時代事件 · 2025+',
    weight: 30,
    isEraEvent: true,
    conditions: { yearRange: [2025, 2045], excludeOutsideNPO: true },
    narrative:
      '生成式 AI 快速進駐辦公室，公文草稿與會議逐字稿速度翻倍；但主管與{boardNoun}也開始期待「既然現在有 AI，那明年方案數量跟社群貼文是不是可以再多做三成？」同時間大企業永續報告書需求暴增，身邊不斷有同業收到獵人頭邀請。',
    choices: [
      {
        id: 'ai_for_worker_relief',
        label: '將 AI 導入核銷、逐字稿與雙語對照 SOP，堅持把省下的時間拿去補實務與準時下班',
        sublabel: '善用工具為人減負，而非無限擴張產出指標',
        effect: {
          statsDelta: { energy: 5, purpose: 3, capital: 10, life: 4, impactScore: 11 },
        },
        outcomeText:
          '你替辦公室建了一套行政自動化流程，把原本要加班三小時整理的理監事逐字稿壓縮到三十分鐘，還開了一堂課教同業使用。',
      },
      {
        id: 'double_output_hustle',
        label: '用 AI 狂衝研究報告、募款文案與英語提案量，拼出亮眼年度績效',
        sublabel: '專業籌碼與影響力快速拉升，代價是節奏更快更難喘氣',
        effect: {
          statsDelta: { energy: -9, purpose: 4, capital: 12, life: -5, impactScore: 16 },
        },
        outcomeText:
          '這季產出的報告量創下組織五年紀錄，但也讓你感受到演算法與高速度時代下，思考反而更難沉澱的焦慮。',
      },
    ],
  },

  // =========================================================================
  // 20 世代人生與職場外壓力（22–29 歲）
  // =========================================================================
  {
    id: 'life20_rent_hike',
    title: '房東來訊：「下個月續約房租調漲 3,000 元」',
    category: 'life',
    tag: '居住成本現實',
    weight: 18,
    conditions: { minAge: 22, maxAge: 34, housing: ['studio_rent', 'shared_room'] },
    narrative:
      '下班走進電梯剛好收到房東 LINE 訊息，以「稅金與附近行情上漲」為由通知續約每月加租三千元。這筆錢幾乎吃掉你去年好不容易才爭取到的全部調薪，讓你不得不重新盤算自己的居住與職涯選擇。',
    choices: [
      {
        id: 'downgrade_shared_room',
        label: '咬牙搬去離捷運更遠的雅房或合租公寓，把月租壓下來保住現金流',
        sublabel: '省下房租差額，代價是通勤變長、室友生活習慣磨合',
        effect: {
          housing: 'shared_room',
          statsDelta: { energy: -6, life: -5, capital: 1 },
          savingsDelta: 4000,
        },
        outcomeText:
          '週末叫了一台小貨車把紙箱搬去老公寓四樓。房間小了一半，但每個月多出四千元喘息空間，不用再月底看著超商貨架算卡路里與價格。',
      },
      {
        id: 'apply_subsidy_and_stay',
        label: '保留獨立小套房保住下班後的完整修復空間，研究並申請租屋補助',
        sublabel: '生活品質維持住，但每個月存款幾乎原地踏步',
        effect: {
          housing: 'studio_rent',
          statsDelta: { energy: 4, life: 5 },
          savingsDelta: -3000,
        },
        outcomeText:
          '經過跟房東來回協商終於辦過租屋補助，雖然還是多貼了點錢，但下班關上門那刻完全屬於自己的安靜，是支撐你隔天繼續面對人群的防空洞。',
      },
    ],
  },
  {
    id: 'life20_cny_relatives',
    title: '過年圍爐親戚連環問：「你在{orgNoun}上班，一個月領多少？」',
    category: 'life',
    tag: '家庭與社會認同',
    weight: 16,
    conditions: { minAge: 22, maxAge: 32, excludeOutsideNPO: true },
    narrative:
      '除夕夜飯桌上，剛領完六個月科技業年終的表弟正在聊新車頭期款，大伯轉過頭問你：「阿你在那個{orgNoun}上班，算不算在當義工？聽說領不到三萬多喔，要不要叫姑丈幫你介紹去公司當行政？」爸媽在旁邊默默扒飯沒說話，但你知道他們其實也在擔心你的未來。',
    choices: [
      {
        id: 'explain_professionally',
        label: '不卑不亢解釋非營利部門與人民團體的專業價值與自身累積',
        sublabel: '練就溫柔反擊的話術，回家心裡還是有點酸澀',
        effect: {
          statsDelta: { energy: -4, purpose: 6, capital: 3, life: -2 },
        },
        outcomeText:
          '你拿手機給他們看你們推動的法案或幫師傅追回職災給付的新聞，大伯聽完「喔喔」兩聲轉移話題；深夜媽媽悄悄塞給你一個兩千塊小紅包說「自己買點補品」。',
      },
      {
        id: 'laugh_it_off_reflect',
        label: '笑笑說「夠吃飯啦」草草帶過，晚上卻忍不住開始認真算自己的十年職涯帳',
        sublabel: '避免過年吵架，開始重視財務規劃與未來出路',
        effect: {
          statsDelta: { energy: -3, purpose: -3, capital: 4, life: 1 },
        },
        outcomeText:
          '那晚你躺在老家床上用手機試算如果一直領三萬八到四十歲會發生什麼事，第一次認真思考要在這個圈子走下去，自己需要什麼條件。',
      },
    ],
  },
  {
    id: 'life20_reunion_comparison',
    title: '大學同學會：大家聊股票與預售屋，你剛忙完{weekendTask}',
    category: 'life',
    tag: '同儕差距感',
    weight: 15,
    conditions: { minAge: 24, maxAge: 33, excludeOutsideNPO: true },
    narrative:
      '剛結束加班趕在最後一刻衝進熱炒店時，已經遲到四十分鐘。同桌大學好友有人年薪破百萬正在看重劃區兩房，有人準備去外商報到。大家客氣地舉杯說「真的好佩服你待在{orgNoun}這麼有熱忱，不像我們都被資本主義綁架」，但結帳分攤每人一千二的聚餐費時，你還是下意識算了一下這個月剩多少預算。',
    choices: [
      {
        id: 'embrace_own_pace',
        label: '誠實分享自己工作上的荒謬趣事與成就，不把「清高」或「自卑」掛在臉上',
        sublabel: '練習與不同人生軌道的朋友平等相處',
        effect: {
          statsDelta: { energy: 1, purpose: 5, capital: 3, life: 4 },
        },
        outcomeText:
          '聊開以後才發現當工程師的朋友其實也每天失眠、羨慕你工作真的看得到「人」。散場時一位好友說下次聚餐一定要多聽你聊聊{orgNoun}現場的故事。',
      },
      {
        id: 'retreat_into_bubble',
        label: '覺得話不投機早早藉口離開，默默縮回只跟圈內人取暖的同溫層',
        sublabel: '減少被比較的刺痛，但也漸漸失去理解外界的窗口',
        effect: {
          statsDelta: { energy: -3, purpose: 2, capital: -2, life: -5 },
        },
        outcomeText:
          '回家路上你滑著同業吐槽社團才覺得鬆了一口氣，卻隱約擔心自己會不會越活世界越小。',
      },
    ],
  },
  {
    id: 'life20_partner_weekend_fight',
    title: '親密關係警報：連續第三個週末因{weekendTask}取消約會',
    category: 'intertwined',
    tag: '工作與愛情衝突',
    weight: 17,
    conditions: { minAge: 23, maxAge: 38, relationship: ['single', 'dating'], excludeOutsideNPO: true },
    narrative:
      '原本約好這週六去看電影吃飯，但星期四下午突然接到週末緊急加班支援（{weekendTask}）。當你傳訊息說「抱歉這週六又不行」時，對方已讀了十分鐘才回：「你到底是在跟組織談戀愛，還是跟我？」',
    choices: [
      {
        id: 'swap_shift_keep_date',
        label: '硬著頭皮跟主管同事調班或只去半天，晚上無論如何趕回來陪對方',
        sublabel: '向組織示範「工作者也有私生活」，守護重要關係',
        effect: {
          relationship: 'dating',
          statsDelta: { energy: -5, purpose: -1, capital: 1, life: 10 },
        },
        outcomeText:
          '你在現場忙完上午場就跟同事交接趕回市區。晚上吃到那頓遲來卻安靜的晚餐時，對方緊繃的肩膀終於軟了下來。',
      },
      {
        id: 'prioritize_duty',
        label: '告訴對方「這個現場現在真的不能沒有我」，承諾下個月再補請吃大餐',
        sublabel: '完成工作責任，卻在關係帳戶裡留下一筆赤字',
        effect: {
          statsDelta: { energy: -6, purpose: 4, capital: 3, life: -11, impactScore: 6 },
        },
        outcomeText:
          '週末任務圓滿結束了，但回家打開手機只看到對方傳來「沒關係你忙吧」五個字，冷戰持續了整整兩週。',
      },
    ],
  },
  {
    id: 'life20_first_thank_you',
    title: '差點提離職的夜晚，抽屜裡收到一封親筆謝卡',
    category: 'intertwined',
    tag: '使命感微光',
    weight: 15,
    conditions: { minAge: 22, maxAge: 35, maxPurpose: 75, excludeOutsideNPO: true },
    narrative:
      '連著三個月被行政雜務、低薪與無止盡的表格磨到懷疑人生，這天正打算把寫好的離職信存進隨身碟時，在信箱裡看到一封半年多前你經手幫助過的{targetNoun}親筆寄來的明信片，上面歪歪扭扭寫著你的名字與一句「幸好那時候你沒有掛我電話」。',
    choices: [
      {
        id: 'pin_on_desk',
        label: '把卡片夾在辦公桌隔板上，決定再陪這個現場走一段路',
        sublabel: '非營利圈最致命也最溫柔的「續命電力」',
        effect: {
          statsDelta: { energy: 5, purpose: 12, life: 2, impactScore: 8 },
        },
        outcomeText:
          '雖然薪水明天依然不會變高、憑證還是得一張張貼，但至少今晚回家時你不再覺得自己過去一年白費了。',
      },
      {
        id: 'cherish_but_stay_clear',
        label: '好好收進抽屜作為禮物，但提醒自己不能只靠情緒價值撐過結構性低薪',
        sublabel: '保持清醒邊界：珍惜感動，同時持續為合理待遇發聲',
        effect: {
          statsDelta: { energy: 3, purpose: 7, capital: 5, life: 3 },
        },
        outcomeText:
          '你替那張卡片拍了照存檔，然後回頭在筆記本寫下明年向組織爭取調薪與補休制度的具體清單。',
      },
    ],
  },
  {
    id: 'life20_grad_school_cert',
    title: '進修與證照交叉口：要不要攻讀{certGoal}？',
    category: 'intertwined',
    tag: '專業資本投資',
    weight: 16,
    conditions: { minAge: 24, maxAge: 39, requiresNoCert: true, excludeOutsideNPO: true },
    narrative:
      '工作幾年下來明顯感覺到「只靠熱情做不長久」，這季你認真評估起報名「{certGoal}」，希望能替自己在組織敘薪或未來跨界談判多加一張硬底氣。但下定決心代表未來兩三年每個下班與週末都要繳學費兼熬夜讀書。',
    choices: [
      {
        id: 'enroll_and_grind',
        label: '報名進修考照！花四萬塊學費與兩年下班時間投資自己',
        sublabel: '存款一次減少 $40,000，取得專業證照資格並加速未來加薪籌碼',
        effect: {
          savingsDelta: -40000,
          hasProfessionalCert: true,
          salaryDelta: 2500,
          statsDelta: { energy: -11, capital: 15, purpose: 5, life: -6, impactScore: 10 },
          milestoneTag: '完成{certGoal}',
        },
        outcomeText:
          '兩年來在公車上背法條、週末窩圖書館改論文差點掉光頭髮，但拿到證書與學歷敘薪加給的那天，你第一次在履歷表前感到踏實。',
      },
      {
        id: 'learn_on_job',
        label: '暫不背額外學費與論文債，改用免費實務社群與跨界案例累積作品集',
        sublabel: '守住存款與下班睡眠，靠實戰戰績說話',
        effect: {
          statsDelta: { energy: 3, capital: 6, life: 4, impactScore: 5 },
        },
        outcomeText:
          '你把學費省下來當緊急預備金，同時建立起自己的專案與實務案例資料庫，一樣成為圈內搶手的實戰派。',
      },
    ],
  },

  // =========================================================================
  // 30 世代職場外與人生關鍵抉擇（30–39 歲）
  // =========================================================================
  {
    id: 'life30_marriage_and_housing',
    title: '三十歲的現實試算：論及婚嫁與購屋／租屋現實攤牌',
    category: 'life',
    tag: '三十世代門檻',
    weight: 18,
    conditions: { minAge: 29, maxAge: 40, relationship: ['single', 'dating'], excludeOutsideNPO: true },
    narrative:
      '身邊與伴侶走到談論未來的階段，雙方坐下來拿計算機算帳：以你目前在民間組織的薪資與存款，加上都會區房價與成家支出，若不靠家裡奧援幾乎買不起房；對方的家人也委婉探問「你們這樣婚後生活穩不穩定」。',
    choices: [
      {
        id: 'partner_rent_solidarity',
        label: '坦誠攤開彼此財務底線，決定不當屋奴、婚後先長期租屋保住生活彈性',
        sublabel: '組成務實的雙薪夥伴家庭，減少過早被千萬房貸鎖死的焦慮',
        effect: {
          relationship: 'married',
          housing: 'studio_rent',
          savingsDelta: -30000,
          statsDelta: { energy: 2, purpose: 4, capital: 2, life: 12 },
          milestoneTag: '步入婚姻並維持財務彈性不強求買房',
        },
        outcomeText:
          '一場沒有豪華婚宴的登記結婚。雖然一樣是無殼蝸牛，但多了一個能互相分擔房租、半夜聽你吐苦水的隊友，孤單感少了一大半。',
      },
      {
        id: 'stretch_for_mortgage',
        label: '咬牙湊出所有存款加上長輩小額借款買下蛋白區老屋背房貸',
        sublabel: '存款大減 $120,000 且月支出劇增，從此每個月都對薪水高度敏感',
        effect: {
          relationship: 'married',
          housing: 'mortgage',
          savingsDelta: -120000,
          statsDelta: { energy: -6, purpose: -3, capital: 4, life: 7 },
          milestoneTag: '咬牙背起房貸成家',
        },
        outcomeText:
          '拿到權狀那天很感動，但看到接下來三十年每個月要自動扣款的房貸金額後，你發現自己再也不敢隨便開口說「大不了老子不幹了」。',
      },
      {
        id: 'stay_unmarried_for_now',
        label: '誠實面對現階段無力承擔成家重擔，決定暫時維持單身或緩談婚約',
        sublabel: '忠於自己的真實承受力，關係卻也可能因此走到盡頭',
        effect: {
          relationship: 'single',
          statsDelta: { energy: -3, purpose: 2, life: -7 },
        },
        outcomeText:
          '沒有誰錯，只是兩個人對安全感的底線不同。分開後你把更多時間投回工作與自己身上，只是深夜回到租屋處特別安靜。',
      },
    ],
  },
  {
    id: 'life30_parenting_or_leave',
    title: '迎來新生命與小小辦公室的「育嬰留停焦慮」',
    category: 'intertwined',
    tag: '育兒與職場結構',
    weight: 17,
    conditions: { minAge: 28, maxAge: 42, relationship: ['married'], hasChild: false, excludeOutsideNPO: true },
    narrative:
      '驗孕棒出現兩條線（或迎來領養／家庭新成員）的那一刻又驚又喜，然而隔天走進只有四名專職的辦公室，你立刻想到現實問題：請半年育嬰留停期間組織根本找不到短期代理人，回來後位置還在不在？準公托抽不抽得到？',
    choices: [
      {
        id: 'take_parental_leave_rights',
        label: '依法申請育嬰留職停薪半年，提前三個月寫好交接手冊與外包建議',
        sublabel: '實踐自己平常也在倡議的勞動權益，克服對組織的罪惡感',
        effect: {
          hasChild: true,
          childAge: 0,
          savingsDelta: -25000,
          statsDelta: { energy: -8, purpose: 6, capital: 4, life: 12, impactScore: 6 },
          milestoneTag: '成為父母並依法請領育嬰留停',
        },
        outcomeText:
          '請假期間依然接到過幾通急事求救電話，但看見組織撐過沒有你的半年、且回來時大家給你一個大擁抱，你證明了「非營利工作者也值得擁有完整家庭」。',
      },
      {
        id: 'parttime_or_hybrid_parenting',
        label: '與組織協商暫轉八成工時彈性遠端兩年，領八折薪水兼顧幼兒接送',
        sublabel: '減少金錢與時間雙邊撕裂，維持專業不斷線',
        effect: {
          hasChild: true,
          childAge: 0,
          partTimeReduced: true,
          salaryMultiplier: 0.85,
          statsDelta: { energy: -7, purpose: 2, life: 10 },
          milestoneTag: '以彈性減班模式兼顧育兒與現場工作',
        },
        outcomeText:
          '雖然薪水打了八五折讓家計緊了一點，但每天下午五點能準時去托嬰中心抱回小孩，在這個高壓行業裡已經是奢侈的幸福。',
      },
    ],
  },
  {
    id: 'life30_relocate_out_of_taipei',
    title: '逃離天龍國？中南部或家鄉組織開出實務主管缺',
    category: 'intertwined',
    tag: '區域移動選擇',
    weight: 15,
    conditions: { minAge: 28, maxAge: 43, regions: ['taipei_metro'], excludeOutsideNPO: true },
    narrative:
      '在雙北租屋工作數年，存摺數字總是跑輸房租漲幅。這時桃竹中南高或東部一間深耕地方的組織邀請你南下接任專案主管，月薪雖然比台北少三千，但當地房租只要台北的一半、而且離年邁父母更近了。',
    choices: [
      {
        id: 'move_south_or_home',
        label: '打包南下／返鄉任職！換取更寬敞的生活空間與照顧家人彈性',
        sublabel: '地區移往非雙北，月薪微調 -$2,500 但大幅降低房租開銷',
        effect: {
          moveRegion: 'other_six',
          salaryDelta: -2500,
          savingsDelta: -15000,
          statsDelta: { energy: 8, purpose: 3, capital: 4, life: 11, impactScore: 8 },
          milestoneTag: '離開雙北轉往區域組織深耕',
        },
        outcomeText:
          '花三千塊台北雅房的價錢租到一整層兩房公寓，陽台終於照得到太陽。雖然少了不少大台北的跨界交流資源，但下班騎十分鐘就能吃到熱騰騰的晚餐。',
      },
      {
        id: 'stay_taipei_hub',
        label: '留在雙北核心戰場，繼續累積全國性政策與跨會人脈密度',
        sublabel: '扛住高生活成本，留住最多的資源串聯與跳板機會',
        effect: {
          statsDelta: { energy: -4, capital: 6, life: -4, impactScore: 7 },
        },
        outcomeText:
          '你還是繼續搭著板南線通勤。台北確實冷酷又貴，但每次去中央部會、跨界協調會或大型論壇走路搭捷運就到，這份即時現場感讓你暫時捨不得離開。',
      },
    ],
  },
  {
    id: 'life30_best_friend_leaves_npo',
    title: '入行時的戰友徹底離開非營利圈：深夜居酒屋的長談',
    category: 'life',
    tag: '價值觀動搖',
    weight: 15,
    conditions: { minAge: 29, maxAge: 42 },
    narrative:
      '曾經比你更熱血、說好要一起推動台灣改革十年的好友，今天辦完離職手續轉進外商當公關，晚上約你喝兩杯。幾杯啤酒下肚後他紅著眼眶說：「我不是不相信那些價值了，我只是受不了每次生病看醫生都要算這筆掛號費會不會影響下個月房租。」',
    choices: [
      {
        id: 'bless_without_guilt',
        label: '抱抱他告訴他「去好好過生活，你已經替這個圈子撐夠久了」',
        sublabel: '理解組織結構才是問題而非個人逃兵，也重新整理自己留下的理由',
        effect: {
          statsDelta: { energy: 2, purpose: 5, capital: 3, life: 6 },
        },
        outcomeText:
          '沒有誰背叛了理想。你們約好半年後就算在不同世界依然要吃飯，你送他上計程車後走回捷運站，覺得心裡寬闊了許多。',
      },
      {
        id: 'spiral_into_doubt',
        label: '嘴上祝福，回家卻整夜失眠反問自己是不是唯一還沒醒過來的傻子',
        sublabel: '被深層動搖，迫切需要找回自己的意義錨點或重新談待遇',
        effect: {
          statsDelta: { energy: -7, purpose: -9, life: -3 },
        },
        outcomeText:
          '那一整週進辦公室看到桌上的工作簡章都覺得很刺眼，你把這份自我懷疑壓在心底，默默開始投幾封履歷試水溫。',
      },
    ],
  },
  {
    id: 'life30_student_loan_paid',
    title: '最後一期學貸扣款通知：終於把青春債還清了',
    category: 'life',
    tag: '財務解套',
    weight: 18,
    conditions: { minAge: 27, maxAge: 40, requiresStudentLoan: true },
    narrative:
      '手機跳出台灣銀行自動扣款成功簡訊，上面顯示「本筆就學貸款已全數清償完畢」。出社會好幾年來，每個月無論薪水再少都先被抽走幾千塊的緊箍咒終於解除，你站在公車站牌下多看了這封簡訊三次。',
    choices: [
      {
        id: 'build_emergency_fund',
        label: '把原本繳學貸的錢全數轉成「拒絕爛工作的底氣預備金」自動定存',
        sublabel: '不再只是勉強打平，第一次感覺到可以替自己存下一點選擇權',
        effect: {
          savingsDelta: 15000,
          statsDelta: { energy: 6, purpose: 4, life: 9 },
          milestoneTag: '全額清償就學貸款建立緊急預備金',
        },
        outcomeText:
          '存摺數字終於開始每個月確實往上跳一點點。你突然明白，真正的自由不是發大財，而是有底氣對不合理的壓榨說不。',
      },
      {
        id: 'treat_self_and_family',
        label: '帶爸媽或伴侶吃頓好的並安排人生第一趟真正放空的小旅行',
        sublabel: '好好犒賞撐過最苦頭幾年的自己，修復長期緊繃的神經',
        effect: {
          savingsDelta: -8000,
          statsDelta: { energy: 12, purpose: 5, life: 11 },
          milestoneTag: '清償學貸後給自己一趟久違的休假',
        },
        outcomeText:
          '去了花東海岸發呆三天、關掉工作通知。回台北時雖然銀行帳戶沒多出多少錢，但整個人像重新開機一樣明亮。',
      },
    ],
  },

  // =========================================================================
  // 40 世代三明治與身體警訊（40–49 歲）
  // =========================================================================
  {
    id: 'life40_parent_ltc_crisis',
    title: '四十歲三明治風暴：父母突發重病失能的長照拉鋸',
    category: 'intertwined',
    tag: '長照與職場重擊',
    weight: 22,
    conditions: { minAge: 38, maxAge: 55, parentCare: ['healthy', 'allowance'], excludeOutsideNPO: true },
    narrative:
      '平常替{targetNoun}奔走各種權益的你，最害怕的電話還是響了——長輩在家跌倒中風住院，出院後需要全天候復健與專人看顧。外籍看護與長照喘息自付額每月至少吃掉兩萬到三萬五，兄弟姊妹又都在外地或無力分擔。你站在醫院走廊算著請假天數與存摺餘額。',
    choices: [
      {
        id: 'hire_care_and_apply_ltc',
        label: '動用長照 2.0 資源並分擔聘請專業看護，自己留在全職位置保住薪水與勞保年資',
        sublabel: '進入長照自付額重壓期（每月支出顯著增加），用現金換時間',
        effect: {
          parentCare: 'long_term_care',
          savingsDelta: -35000,
          statsDelta: { energy: -10, purpose: 2, capital: 4, life: -8, impactScore: 6 },
          milestoneTag: '扛起家庭長照 2.0 協調與經濟重擔',
        },
        outcomeText:
          '你把所有公部門長照補助、輔具申請與日照排隊表摸得比社福個案還熟。每個月帳單數字令人心驚，但至少保住了自己的職涯年資與不至崩盤的睡眠。',
      },
      {
        id: 'cut_hours_care_personally',
        label: '與組織協議改為兼職／減班排班（降薪兩成五），自己扛起部分日間照顧',
        sublabel: '減輕現金支出卻大幅壓縮個人休息與職涯升遷空間',
        effect: {
          parentCare: 'long_term_care',
          partTimeReduced: true,
          salaryMultiplier: 0.78,
          statsDelta: { energy: -15, purpose: 1, capital: -4, life: -4 },
          milestoneTag: '減班親力分擔年邁雙親長期照顧',
        },
        outcomeText:
          '每天早上先去幫爸媽備餐與復健再趕去開會，晚上寫案子寫到凌晨。你成了許多統計數字裡那個「沒有離職卻被迫退場邊緣」的中年照顧者。',
      },
    ],
  },
  {
    id: 'life40_health_red_flags',
    title: '中年健檢滿江紅：自律神經失調與胃潰瘍警告',
    category: 'life',
    tag: '身體抗議訊號',
    weight: 18,
    conditions: { minAge: 37, maxAge: 55 },
    narrative:
      '拖了三年終於去醫院做完整健檢，報告上血壓、肝指數、胃鏡潰瘍與自律神經失調一口氣亮出四個紅字。醫師盯著螢幕問你：「你是不是長年一天喝兩杯黑咖啡、睡不到六小時又壓力很大？再不改作息，下次就不是在門診看到你了。」',
    choices: [
      {
        id: 'mandatory_health_reset',
        label: '硬起來實行醫療級自我保護：推掉非必要晚宴與兼差，每週固定運動復健',
        sublabel: '放慢衝刺腳步花錢顧身體，保住下半場職涯本錢',
        effect: {
          healthAlert: false,
          savingsDelta: -15000,
          statsDelta: { energy: 14, purpose: 1, capital: -2, life: 9 },
        },
        outcomeText:
          '你把辦公桌抽屜的止痛藥換成溫水壺，晚上九點手機自動轉勿擾。三個月後回診，醫師看著降下來的血壓數字終於露出笑容。',
      },
      {
        id: 'take_pills_keep_pushing',
        label: '拿了三個月慢性病藥先吃著，眼前組織正在關鍵轉型期還不能停',
        sublabel: '短期任務不斷線，代價是健康債持續滾雪球',
        effect: {
          healthAlert: true,
          savingsDelta: -5000,
          statsDelta: { energy: -9, purpose: 3, capital: 4, life: -6, impactScore: 6 },
        },
        outcomeText:
          '抽屜多了一個小藥盒。同事誇你四十幾歲體力還這麼拼，只有半夜心悸驚醒時你自己清楚這副身體正在超貸。',
      },
    ],
  },
  {
    id: 'life40_found_welfare_assoc',
    title: '自立門戶的召喚：與第一線社工戰友發起成立在地社區關懷協會',
    category: 'work',
    tag: '社福組織創辦',
    weight: 15,
    conditions: {
      startOrgTypes: ['large_welfare', 'grassroots', 'local_foundation'],
      minAge: 34,
      maxAge: 52,
      minCapital: 55,
      excludeOutsideNPO: true,
    },
    narrative:
      '在社福與社區現場打滾多年，你看見太多家庭卡在公部門僵硬指標的縫隙裡求助無門。幾位信任你的資深社工與里長找上門：「發起人名冊三十個人已經簽好了，只要你點頭出任第一任秘書長，我們自己向社會局立案成立在地社區關懷協會！」',
    choices: [
      {
        id: 'co_found_welfare_assoc',
        label: '拿出部分存款墊付開辦周轉，與戰友共同立案成立在地社區協會！',
        sublabel: '存款 -$50,000、轉戰草創社區組織，重燃初衷寫下自己的代表作',
        effect: {
          savingsDelta: -50000,
          changeOrgType: 'grassroots',
          changeOrgName: '社團法人島嶼社區共伴關懷協會',
          roleLevelDelta: 1,
          statsDelta: { energy: -10, purpose: 20, capital: 12, life: -5, impactScore: 26 },
          boardClimate: 'trusting',
          milestoneTag: '共同發起立案在地社區共伴關懷協會',
        },
        outcomeText:
          '從印章刻印、借社區活動室當籌備處到跑社會局登記，一切從零開始。頭兩年雖然窮到只有二手折疊桌，但每一個家庭方案終於能長出貼近現場的樣子。',
      },
      {
        id: 'support_welfare_board',
        label: '考量家庭經濟底線婉拒全職跳槽，改任新協會創會理事協助募款督導',
        sublabel: '穩住現職薪資與安全感，仍能以督導與理事角色扶植新團隊',
        effect: {
          statsDelta: { energy: 2, purpose: 7, capital: 7, life: 4, impactScore: 11 },
        },
        outcomeText:
          '你替這群戰友審完章程並捐出第一筆兩萬元開辦金，笑著說：「第一線的實驗就交給你們衝，我在理事會替大家把關。」',
      },
    ],
  },
  {
    id: 'life40_found_advocacy_ngo',
    title: '自立門戶的召喚：與議題戰友共同發起新興公民監督聯盟',
    category: 'work',
    tag: '倡議組織創辦',
    weight: 15,
    conditions: {
      startOrgTypes: ['advocacy_ngo', 'corp_intl_ngo'],
      minAge: 34,
      maxAge: 52,
      minCapital: 55,
      excludeOutsideNPO: true,
    },
    narrative:
      '待過現有倡議與基金會體制後，你發現幾個新興科技人權與永續政策領域完全缺乏獨立民間監督者。幾位熟識的研究員與律師找上門：「三十位發起人已經簽名，只要你願意出來當創會秘書長，我們自己向內政部立案成立新倡議聯盟！」',
    choices: [
      {
        id: 'co_found_advocacy_ngo',
        label: '拿出部分存款墊付開辦費，親自創辦獨立公民監督聯盟！',
        sublabel: '存款 -$50,000、開啟獨立倡議組織新局，不看大機構臉色發聲',
        effect: {
          savingsDelta: -50000,
          changeOrgType: 'advocacy_ngo',
          changeOrgName: '社團法人島嶼公共政策監督聯盟',
          roleLevelDelta: 1,
          statsDelta: { energy: -10, purpose: 20, capital: 12, life: -5, impactScore: 26 },
          boardClimate: 'trusting',
          milestoneTag: '共同發起立案島嶼公共政策監督聯盟',
        },
        outcomeText:
          '你們不收政府標案，靠著幾百位早鳥定捐支持者租下小工作室開張，每一份聲明都能直指核心痛點。',
      },
      {
        id: 'support_advocacy_board',
        label: '考量現有家庭支出婉拒全職離職，改擔任創會理事與義務顧問',
        sublabel: '保留穩定薪酬，從側翼協助新組織站穩腳步',
        effect: {
          statsDelta: { energy: 2, purpose: 7, capital: 7, life: 4, impactScore: 11 },
        },
        outcomeText:
          '你替新組織寫好募款說帖並擔任發起理事，用另一種穩健方式替台灣公民社會開出新支線。',
      },
    ],
  },
  {
    id: 'life40_found_academic_society',
    title: '自立門戶的召喚：協助跨領域學者發起籌組新興實務研究學會',
    category: 'work',
    tag: '專業學會創辦',
    weight: 15,
    conditions: {
      startOrgTypes: ['academic_society'],
      minAge: 34,
      maxAge: 52,
      minCapital: 55,
      excludeOutsideNPO: true,
    },
    narrative:
      '隨著跨界專業興起，幾位跟你有深厚交情的年輕教授與臨床專家決定從舊有僵化學會出走，想籌組一個真正重視青年學者與實務工作者對話的新學會：「沒有你這個熟透內政部人團法規跟學分系統的活字典根本立不了案，來當我們首任專任秘書長吧！」',
    choices: [
      {
        id: 'co_found_society',
        label: '接受邀請從零草創！親手替新學會建立民主章程與合理秘書處待遇',
        sublabel: '存款 -$50,000、轉任新立案專業學會，徹底告別舊理事長派系',
        effect: {
          savingsDelta: -50000,
          changeOrgType: 'academic_society',
          changeOrgName: '社團法人春山跨界實務學會',
          roleLevelDelta: 1,
          statsDelta: { energy: -10, purpose: 20, capital: 12, life: -5, impactScore: 26 },
          boardClimate: 'trusting',
          milestoneTag: '發起籌組並立案春山跨界實務學會',
        },
        outcomeText:
          '你在新學會章程第一條就寫進秘書處合理工時與制度保障，首屆年會雖然借用大學階梯教室克難舉辦，卻座無虛席。',
      },
      {
        id: 'support_society_advisor',
        label: '婉拒全職跳槽，改以人團法規顧問身分協助籌備成立大會並轉回原職',
        sublabel: '穩住既有人脈與年資，用專業知識協助新社群誕生',
        effect: {
          statsDelta: { energy: 2, purpose: 7, capital: 7, life: 4, impactScore: 11 },
        },
        outcomeText:
          '你花兩個週末幫他們搞定內政部籌備公文與線上繳費系統，成為這間新學會最感謝的幕後推手。',
      },
    ],
  },
  {
    id: 'life40_found_new_union',
    title: '自立門戶的召喚：串聯跨廠區基層勞工發起籌組新興產業工會',
    category: 'work',
    tag: '工會組織創辦',
    weight: 15,
    conditions: {
      startOrgTypes: ['industrial_union', 'occupational_union'],
      minAge: 34,
      maxAge: 52,
      minCapital: 55,
      excludeOutsideNPO: true,
    },
    narrative:
      '眼看平台經濟與跨區新興行業勞工長期缺乏工會保障，一群信任你的基層工會代表與配送員找上門：「發起人名冊已經湊齊三十五人了，只要你願意來扛創會秘書長，我們自己向勞動局申請立案成立聯合產業工會！」',
    choices: [
      {
        id: 'co_found_union',
        label: '拿出儲蓄墊付初期抗爭與行政費，陪這群勞工親手立起新工會！',
        sublabel: '存款 -$50,000、重返工運草創前線，寫下屬於新世代的工會戰旗',
        effect: {
          savingsDelta: -50000,
          changeOrgType: 'industrial_union',
          changeOrgName: '島嶼跨領域受僱者聯合產業工會',
          roleLevelDelta: 1,
          statsDelta: { energy: -10, purpose: 20, capital: 12, life: -5, impactScore: 26 },
          boardClimate: 'trusting',
          milestoneTag: '共同發起立案島嶼跨領域受僱者聯合產業工會',
        },
        outcomeText:
          '從籌備會借咖啡廳角落開會到拿到工會登記證書那天，大家輪流摸著還熱呼呼的印信說：「這次我們真的有自己的家了。」',
      },
      {
        id: 'support_union_mentor',
        label: '考量家庭責任留在原工會位置，改擔任新工會的義務培訓顧問與友會盟友',
        sublabel: '穩住自身薪資與勞健保，持續用多年談判經驗支援新工會',
        effect: {
          statsDelta: { energy: 2, purpose: 7, capital: 7, life: 4, impactScore: 11 },
        },
        outcomeText:
          '你替新工會上完第一堂「如何不被資方抓到籌組漏洞」實戰課，並串聯友會借出第一間臨時辦公桌。',
      },
    ],
  },
  {
    id: 'life40_generation_gap',
    title: '世代落差現場：新進 Z 世代同事「準時六點下班拒絕收群組」',
    category: 'work',
    tag: '中生代管理課題',
    weight: 15,
    conditions: { minAge: 36, maxAge: 55, excludeOutsideNPO: true },
    narrative:
      '這季新來的年輕專員工作能力不差，但嚴格遵守「五點五十九分收書包、週末不回工作 LINE、拒絕任何未事先申請的臨時加工作業」。昨天一場臨時記者會前夕他依舊準時下班，害你跟另一位老同事默默留下來做到十點。老戰友氣得說「現在年輕人一點使命感都沒有」。',
    choices: [
      {
        id: 'rebuild_system_not_guilt',
        label: '忍住情緒不道德綁架新人，回頭重新檢討「為什麼組織總是靠緊急加班運作」',
        sublabel: '消化夾心層痛苦，推動真正適合下一代的永續工時設計',
        effect: {
          statsDelta: { energy: -6, purpose: 7, capital: 10, life: 4, impactScore: 12 },
        },
        outcomeText:
          '你跟年輕專員坦白溝通預警期的重要性，同時逼自己與{boardNoun}戒掉「前兩天才臨時改議程」的壞習慣。三個月後，那位新人反而主動提出好幾個高效改善提案。',
      },
      {
        id: 'lecture_passion',
        label: '找新人約談「非營利組織性質不同於一般公司，要有彈性與使命感」',
        sublabel: '抒發了資深者的無奈，卻讓新人開始默默刷 104 準備離職',
        effect: {
          statsDelta: { energy: -5, purpose: -5, capital: -2, life: -3 },
        },
        outcomeText:
          '新人禮貌點頭說知道了，但兩個月後試用期滿就提離職，留下一句「謝謝前輩指導，但我還是比較重視生活品質」。',
      },
    ],
  },
  {
    id: 'life40_quit_without_plan',
    title: '還沒到能退休的年紀，卻已快撐不下去：離職之後到底能轉行去哪？',
    category: 'intertwined',
    tag: '中生代迷惘離開',
    weight: 14,
    conditions: { minAge: 33, maxAge: 54, minTenure: 5, maxEnergy: 58, excludeOutsideNPO: true },
    narrative:
      '三十多到五十出頭正是雙親漸老、帳單滿身的年紀——遠遠還不到 55 歲可以談退休的時候，更還沒滿 60 歲能領勞退，但日復一日的低薪凍漲、情緒勞動與無效行政已經把最後一點力氣磨平。你看著同事群組裡陸續有人離職後跑去做臨時行政、開小店、跑外送或長期待業摸索，突然發現離開這個圈子後，自己其實也不知道該轉行去哪裡。',
    choices: [
      {
        id: 'quit_into_unknown',
        label: '先遞出辭呈離開再說！就算還不知道要轉行去哪裡，也得先把身心救回來',
        sublabel: '【直接結算】未達退休年齡的悄然離職，帶著空白與未知重新摸索出路',
        effect: {
          statsDelta: { energy: 4, purpose: -8, life: 6 },
          setFlag: 'quit_uncertain_path',
          endGameReason: 'meaning_exit',
          milestoneTag: '未達退休年齡便遞出辭呈，帶著迷惘告別民間現場',
        },
        outcomeText:
          '同事替你辦了一場安靜的送別午餐，問你「接下來要去哪家單位」時，你只能笑著說「先休息一陣子再打算」。走出辦公大樓那天沒有下一個高薪頭銜等著你，但至少肩膀上的石頭暫時卸下來了。',
      },
      {
        id: 'stay_and_drag_on',
        label: '看著房租與帳單不敢裸辭，只能先請幾天特休喘口氣、繼續邊做邊看',
        sublabel: '守住眼前微薄但確定的月薪現金流，先把眼前的日子過下去',
        effect: {
          statsDelta: { energy: 6, purpose: -4, capital: 2, life: 3 },
        },
        outcomeText:
          '你請了三天假把手機關靜音在家睡到飽。回到辦公室那天工作一樣多，但心裡多了幾分「只要不委屈過頭就先做下去」的務實平靜。',
      },
    ],
  },

  // =========================================================================
  // 50–60+ 世代交棒、勞退試算（依法 60 歲請領）與退休前夕（55 歲+）
  // =========================================================================
  {
    id: 'life50_pension_reality',
    title: '登入勞保局 e 化系統：看見勞退新制專戶數字的那天',
    category: 'life',
    tag: '老年經濟現實',
    weight: 24,
    conditions: { minAge: 52, maxAge: 64 },
    narrative:
      '某天午休順手插上自然人憑證查詢勞保局專戶。依台灣勞退新制規定，必須年滿 60 歲才能請領個人專戶退休金；回頭看早年非營利圈普遍低薪、甚至曾經歷過高薪低報或承攬空窗期，螢幕上試算出的「滿 60 歲後每月可領金額」比想像中單薄許多。距離法定請領門檻已不算太遠，老後帳單卻讓人靜下心重算一遍。',
    choices: [
      {
        id: 'self_contribute_6pct',
        label: '立刻向會計申請「勞退自提 6%」並調整個人保守型理財配置',
        sublabel: '減少眼前可支配零用錢，強迫替老年的自己守住基本線',
        effect: {
          savingsDelta: -10000,
          statsDelta: { energy: 1, purpose: 1, capital: 5, life: 5 },
          milestoneTag: '啟動勞退自提 6% 搶救老年預備金',
        },
        outcomeText:
          '扣掉自提後每個月手頭緊了兩三千，但看著專戶數字加速爬升與節稅效果，深夜焦慮總算消退一半。',
      },
      {
        id: 'plan_consulting_second_act',
        label: '規劃「60 歲退下第一線、轉做外部督導／評鑑委員與講師」的第二曲線',
        sublabel: '善用二十多年實務資歷，延長專業變現年限而不靠死薪水',
        effect: {
          statsDelta: { energy: 2, purpose: 6, capital: 8, life: 4, impactScore: 8 },
        },
        outcomeText:
          '你開始整理過往所有的組織章程、核銷範本與案例教案，為十年後的半退休講師生涯鋪好第一塊磚。',
      },
    ],
  },
  {
    id: 'life50_physical_limit',
    title: '歲月不饒人：連日趕場備戰與長期熬夜的體力真的扛不住了',
    category: 'intertwined',
    tag: '體力轉折點',
    weight: 22,
    conditions: { minAge: 50, maxAge: 64, excludeOutsideNPO: true },
    narrative:
      '又是一個密集忙碌的{weekendTask}檔期。二十幾歲時你能連續跑點奔波、一次搬十幾箱資料與設備走三層樓、熬兩夜趕公文與簡報都不眨眼；今天卻只是多站了幾小時腰椎就隱隱作痛，回家還得貼兩片痠痛貼布。你突然承認，自己不再適合扛在體力消耗的最前排。',
    choices: [
      {
        id: 'mentor_young_leaders',
        label: '退居二線專注經驗傳承、策略協調與把關法規細節，把第一線執行交給年輕一代',
        sublabel: '角色成功轉型：從「親自做完」變成「讓團隊做得到」',
        effect: {
          statsDelta: { energy: 8, purpose: 8, capital: 7, life: 7, impactScore: 12 },
          milestoneTag: '順利完成第一線體力勞動退位與經驗傳承',
        },
        outcomeText:
          '看著年輕同仁自信站上前線挑大樑的那天，你在後排默默替大家顧好後勤與聯絡細節。那種不必自己事必躬親卻看著組織制度延續下去的踏實，是年輕時體會不到的。',
      },
      {
        id: 'refuse_to_slow',
        label: '覺得新人還不夠穩、不放心放手，依然事必躬親衝第一線',
        sublabel: '組織暫時不出錯，但既傷自己身體也拖慢了下一代接班',
        effect: {
          statsDelta: { energy: -12, purpose: 2, capital: -2, life: -7, impactScore: 6 },
        },
        outcomeText:
          '大家依然習慣大事小事都喊你救火，然而腰傷復發請假一週時，整個辦公室幾乎癱瘓，這才驚覺不放手本身就是最大風險。',
      },
    ],
  },
  {
    id: 'life50_succession_handover',
    title: '組織交棒時刻：要不要相信這群還有些青澀的接班人？',
    category: 'work',
    tag: '55+ 世代交棒',
    weight: 26,
    conditions: { minAge: 55, maxAge: 65, excludeOutsideNPO: true },
    narrative:
      '在這個生態走過四分之一個世紀，如今理監事與後輩都敬你三分。然而眼前培養了四年的接班人選，作風與你大不相同——他們想把行之有年的紙本流程全面數位化、砍掉你當年一手建立的某些傳統做法。是趁還沒離開前出手擋下，還是真的放手讓屬於他們的組織長出來？',
    choices: [
      {
        id: 'graceful_handover',
        label: '寫完最後一份完整的交接備忘錄後笑著放手，甚至開始考慮體面退休',
        sublabel: '完成「制度交棒」最後一哩路，將主導權交給下一世代',
        effect: {
          statsDelta: { energy: 10, purpose: 12, capital: 6, life: 12, impactScore: 16 },
          milestoneTag: '完成跨世代組織記憶交棒',
        },
        outcomeText:
          '你把二十年的憑證邏輯、會員人脈眉角與法規地雷整理成一本《組織生存說明書》交給他們，心想：組織不該屬於某個老人，它要自己長出新的樣子。',
      },
      {
        id: 'graceful_retire_now',
        label: '確定交接就緒後，提前辦理榮譽退休／轉任不支薪顧問為職涯謝幕',
        sublabel: '【圓滿結算】以「體面交棒與退休」作為本段職涯結局',
        effect: {
          statsDelta: { energy: 12, purpose: 14, life: 14, impactScore: 18 },
          endGameReason: 'retired_gracefully',
          milestoneTag: '成功交棒後體面退休謝幕',
        },
        outcomeText:
          '歡送茶會那天沒有太悲情的感言，年輕同仁送你一本簽滿名字的相冊。走出辦公大樓大門時陽光剛好落下來，這段漫長卻沒白走的路，就先交給你們了。',
      },
    ],
  },

  // =========================================================================
  // 補充生活與內外交織事件（全齡段通用，防事件池枯竭）
  // =========================================================================
  {
    id: 'life_all_burnout_alarm',
    title: '週一早上在捷運站月台突然呼吸急促：身心亮起紅燈',
    category: 'intertwined',
    tag: '耗竭預警',
    weight: 26,
    conditions: { maxEnergy: 32 },
    narrative:
      '這幾個月積累的案量、核銷、櫃檯衝突或家庭壓力終於在今天早上爆發——明明沒趕時間，站進捷運車廂門關上的瞬間卻突然胸悶心悸、眼淚止不住掉下來，只好在下一站衝出來坐在月台椅子上發抖。',
    choices: [
      {
        id: 'take_sick_leave_therapy',
        label: '立刻請特休或無薪休養兩週，預約身心科與心理諮商好好停下來',
        sublabel: '花費 $8,000 醫療諮詢費，緊急搶救墜谷的身心能量',
        effect: {
          savingsDelta: -8000,
          statsDelta: { energy: 26, purpose: 3, life: 10 },
          milestoneTag: '誠實面對職業倦怠並透過休養止血',
        },
        outcomeText:
          '諮商師說了一句讓你爆哭的話：「你替那麼多人扛住了世界，卻忘記自己也是一條需要被照顧的人命。」兩週後重新開機，你終於知道何時必須踩煞車。',
      },
      {
        id: 'push_through_burnout',
        label: '擦乾眼淚去超商買了止痛藥和黑咖啡，搭下一班車硬撐進辦公室開早會',
        sublabel: '維持表面正常運作，但離全面崩潰只剩一步之遙',
        effect: {
          statsDelta: { energy: -8, purpose: -7, life: -8 },
        },
        outcomeText:
          '沒有人發現你早上在月台哭過。你照常開完會、微笑接完三通電話，只是晚上回家看著牆壁發呆了兩個小時卻什麼也想不起來。',
      },
    ],
  },
  {
    id: 'life_all_cross_sector_workshop',
    title: '受邀擔任外部培訓講師：原來你在民間磨練出的本事這麼值錢',
    category: 'intertwined',
    tag: '專業自信回復',
    weight: 13,
    conditions: { minTenure: 3, minCapital: 42, excludeOutsideNPO: true },
    narrative:
      '某大學相關科系或友會邀你去分享實務經驗（{lectureTopic}），並提供一筆體面的外聘講師費。上台前你還覺得「自己做的事這麼平凡有什麼好講」，結果台下幾十位學員筆記抄不停、會後排隊發問了半小時。',
    choices: [
      {
        id: 'build_lecture_brand',
        label: '把經驗系統化成講義，開始建立個人專業講師與外部督導口碑',
        sublabel: '賺到外快 $12,000 並大幅拉升業界人脈與自信',
        effect: {
          savingsDelta: 12000,
          statsDelta: { energy: -4, purpose: 9, capital: 11, life: 2, impactScore: 12 },
        },
        outcomeText:
          '原來每天在泥淖裡摸索出來的報表邏輯、溝通眉角與法規解法，在別人眼裡都是千金難買的實務資產。你的眼神久違地重新亮了起來。',
      },
      {
        id: 'donate_or_share_openly',
        label: '把整份簡報模板開源分享給各小團體免費下載，保留適度接課節奏',
        sublabel: '進帳 $6,000 同時大幅放大對整體生態的正向影響力',
        effect: {
          savingsDelta: 6000,
          statsDelta: { energy: -1, purpose: 11, capital: 7, life: 4, impactScore: 16 },
        },
        outcomeText:
          '好幾位遠在花東與離島的專職人員私訊謝謝你的模板幫他們省下好幾天摸索時間——這大概就是民間部門最可愛的互助文化。',
      },
    ],
  },
  {
    id: 'life_all_meaning_crisis',
    title: '夜深後的意義拷問：「我做這一切，結構真的有變好一公釐嗎？」',
    category: 'intertwined',
    tag: '理想空洞時刻',
    weight: 24,
    conditions: { maxPurpose: 50, excludeOutsideNPO: true },
    narrative:
      '又忙完一輪{weekendTask}，下週結構問題依舊原地打轉；好不容易熬夜交出專案與報告，卻彷彿沒人真正看見{targetNoun}的處境。你坐在書桌前望著熄掉的螢幕，突然徹底感受不到這些努力的意義。',
    choices: [
      {
        id: 'seek_peer_support_circle',
        label: '約三位跨組織老朋友去吃熱炒，老實承認自己「理想沒電了」',
        sublabel: '停止獨自消化結構無力感，向同行夥伴借一點光',
        effect: {
          statsDelta: { energy: 4, purpose: 18, life: 7 },
        },
        outcomeText:
          '大家一輪輪罵完官僚、資方與大環境後竟笑成一團。原來不是你一個人覺得荒謬，而願意一起承認「沒辦法馬上改變世界，但今天先守住旁邊這個人」，反而讓你重新站回地面。',
      },
      {
        id: 'keep_numb_routine',
        label: '告訴自己「上班就只是上班」，把心徹底關起來只當一份領薪水的行政活',
        sublabel: '不再那麼容易受傷，但離開組織的倒數計時也悄悄開始',
        effect: {
          statsDelta: { energy: 3, purpose: -8, capital: 1, life: 2 },
        },
        outcomeText:
          '你的效率變高了、也不再為任何人掉眼淚，只是每次在公開場合聽見新人談理想時，心底只剩下一聲很輕很輕的嘆息。',
        },
    ],
  },
  {
    id: 'life_all_family_loan_request',
    title: '老家急電：親戚周轉或長輩醫療需要一筆六萬元急用',
    category: 'life',
    tag: '突發家庭支出',
    weight: 14,
    conditions: { minSavings: 45000 },
    narrative:
      '正慶幸今年終於多存下一點緊急預備金，媽媽卻在電話那頭支支吾吾說爸爸牙科植牙或家裡老屋漏水急需一筆大修費，問你手頭方不方便先支援六萬元。這幾乎是你半年才存下來的全部積蓄。',
    choices: [
      {
        id: 'cover_in_full',
        label: '直接匯出六萬元替家裡解圍，自己接下來幾個月再省一點',
        sublabel: '存款 -$60,000，讓父母安心、自己再度回到低水位焦慮',
        effect: {
          savingsDelta: -60000,
          statsDelta: { energy: -4, purpose: 2, life: 6 },
        },
        outcomeText:
          '媽媽在電話那頭不斷說「等領到錢一定還你」，但你們彼此都知道不用還。看著重新縮水的帳戶數字，你默默把原本要買的筆電延後到明年。',
      },
      {
        id: 'split_and_apply_aid',
        label: '先出三萬，同時發揮專業幫家裡查清楚縣市政府修繕補助或分期方案',
        sublabel: '存款 -$30,000，用專業知識守住自己最後的緩衝墊',
        effect: {
          savingsDelta: -30000,
          statsDelta: { energy: -3, capital: 4, life: 4 },
        },
        outcomeText:
          '你替家裡查到長輩輔具／修繕補助省下兩萬多，自己只貼補了三萬塊，既幫上忙也沒有把自己掏空。',
      },
    ],
  },
  {
    id: 'life_all_unexpected_joy',
    title: '一個沒有任何急事的週五下午：整個辦公室意外提前放風',
    category: 'life',
    tag: '難得喘息',
    weight: 12,
    conditions: { minTenure: 1, excludeOutsideNPO: true },
    narrative:
      '年度重大計畫與會議都剛順利交卷，下午三點半{bossTitle}罕見地走出來說：「大家這季辛苦了，沒急事的話四點就各自收一收提前下班吧。」外頭剛好是微涼的晴天。',
    choices: [
      {
        id: 'walk_in_sunshine',
        label: '去逛平日總是關門的小書店與市場，替自己煮一頓完整的晚餐',
        sublabel: '替枯竭的身心與生活感同時補回大量電量',
        effect: {
          statsDelta: { energy: 14, purpose: 6, life: 12 },
        },
        outcomeText:
          '原來下午四點的街道長這個樣子！你坐在公園長椅上曬著太陽吃豆花，突然重新喜歡上這座城市與自己的生活。',
      },
      {
        id: 'catch_up_sleep',
        label: '回家拉上窗簾一口氣睡到隔天早上十點，還清這幾個月的睡眠債',
        sublabel: '極致純粹的物理修復',
        effect: {
          statsDelta: { energy: 20, life: 6 },
        },
        outcomeText:
          '睡滿十二個小時醒來時頭腦無比清醒，肩膀的僵硬少了一大半，又可以回去面對下週的挑戰了。',
      },
    ],
  },
  {
    id: 'life20_side_gig_burnout',
    title: '下班後的副業外包：多賺八千元卻快把最後一絲熱情磨光',
    category: 'life',
    tag: '經濟補貼代價',
    weight: 14,
    conditions: { minAge: 23, maxAge: 36, maxSavings: 180000, excludeOutsideNPO: true },
    narrative:
      '為了應付都會生活費與孝親壓力，這幾個月下班後你又接了文字校對與週末活動兼職打工，每月確實多擠出八千塊入袋。但已經連續五週沒有睡超過六小時，白天在原組織開會時腦袋常常一片空白。',
    choices: [
      {
        id: 'pause_side_gig',
        label: '先停掉高耗能副業三個月，把體力拿回來準備談正職調薪或轉職',
        sublabel: '捨棄短期八千元現金流，避免「正職低薪＋副業過勞」雙輸循環',
        effect: {
          statsDelta: { energy: 14, purpose: 3, capital: 4, life: 8 },
        },
        outcomeText:
          '停掉兼差的第一個週末你睡醒看著窗外陽光，突然恢復了思考能力，還順便改好了一份漂亮的專業履歷。',
      },
      {
        id: 'keep_grinding_savings',
        label: '存款數字還沒有安全感，咬牙繼續兼差把預備金存到下一階段',
        sublabel: '現金立刻增加 $18,000，但身心耗損持續擴大',
        effect: {
          savingsDelta: 18000,
          statsDelta: { energy: -13, purpose: -5, life: -9 },
        },
        outcomeText:
          '看著帳戶終於多出兩萬塊緩衝心安了一點，只是下班後面對螢幕的那種乾嘔感越來越頻繁。',
      },
    ],
  },
  {
    id: 'life30_sibling_care_argument',
    title: '家庭群組的沉默分工：「你在那個比較彈性的{orgNoun}，爸媽看醫生就你去吧」',
    category: 'intertwined',
    tag: '家庭性別與職涯偏見',
    weight: 15,
    conditions: { minAge: 30, maxAge: 46, excludeOutsideNPO: true },
    narrative:
      '父母年紀漸長、回診頻率變高。週末家族聚餐時，在科技業或銀行上班的手足順理成章地說：「我們請假扣薪很重啦，你在那個{orgNoun}比較沒那麼賺錢、時間也比較自由，平日陪診就交給你跑比較划算。」',
    choices: [
      {
        id: 'set_fair_family_ledger',
        label: '直接算出自己請特休的時間成本與勞務價值，要求手足「出錢分擔或輪流請假」',
        sublabel: '打破「領比較少的人時間比較不值錢」的家庭迷思',
        effect: {
          savingsDelta: 8000,
          statsDelta: { energy: -3, purpose: 4, capital: 3, life: 5 },
        },
        outcomeText:
          '雖然當場氣氛僵了三分鐘，但後來哥哥／姊姊終於同意每月多出五千元請接送復康與計程車，不再把你的時間當成免費資源。',
      },
      {
        id: 'absorb_quietly_out_of_guilt',
        label: '覺得反正自己真的薪水比較低不好意思爭，默默把平日陪診全接過來',
        sublabel: '家庭暫時沒吵架，卻在職場頻繁請假與個人睡眠間雙重壓扁自己',
        effect: {
          statsDelta: { energy: -11, purpose: -2, life: -6 },
        },
        outcomeText:
          '每個禮拜三早上在醫院候診區用筆電回工作訊息成了你的日常。有時候真的分不清自己是在照顧世界、還是被所有人理所當然地依賴。',
      },
    ],
  },
  {
    id: 'life30_housing_or_mobility',
    title: '三十五歲的分叉：要不要為了「老家有免費房子」回去領低薪？',
    category: 'life',
    tag: '返鄉與發展拉鋸',
    weight: 13,
    conditions: { minAge: 31, maxAge: 42, regions: ['taipei_metro', 'other_six'], excludeOutsideNPO: true },
    narrative:
      '老家那邊的{hometownOrg}開了一個缺，薪水比都會區少六千，但回家住老宅就能免去每月一萬多塊房租，順便顧家。然而一旦回去，就意味著退出過去累積十年的都會人脈圈與政策核心。',
    choices: [
      {
        id: 'move_rural_rooted',
        label: '搬回非六都家鄉據點深耕！把省下來的房租轉成真正的個人存款',
        sublabel: '轉入非六都與偏鄉組織，月薪 -$5,500 但居住成本大降',
        effect: {
          moveRegion: 'non_six_rural',
          housing: 'with_parents',
          salaryDelta: -5500,
          statsDelta: { energy: 6, purpose: 5, capital: -2, life: 9, impactScore: 10 },
          milestoneTag: '返鄉轉赴非六都第一線現場深耕',
        },
        outcomeText:
          '雖然週末少了很多藝術展與論壇可跑，但看著每個月實際存下來的金額與早晨窗外的稻田或海線，你終於不再覺得被房租追著跑。',
      },
      {
        id: 'stay_urban_network',
        label: '維持現行都會區發展軌道，相信多元機會長期仍能帶來更好的專業回報',
        sublabel: '承擔高房租壓力，保留職涯跨界與政策參與上限',
        effect: {
          statsDelta: { energy: -2, capital: 5, life: -2, impactScore: 5 },
        },
        outcomeText:
          '你婉拒了家鄉那份缺，繼續在都會叢林裡打拼，偶爾搭高鐵回去吃一頓媽媽煮的菜再北上。',
      },
    ],
  },
  {
    id: 'life40_child_school_transition',
    title: '孩子的補習班與才藝帳單：第一次感受到低薪對下一代的壓力',
    category: 'life',
    tag: '家庭教育開銷',
    weight: 14,
    conditions: { minAge: 36, maxAge: 52, hasChild: true, excludeOutsideNPO: true },
    narrative:
      '孩子準備升國中或進入花錢的學齡期，同學都在上英文補習班與暑期營隊。看著繳費單與家裡每個月勉強打平的收支表，孩子懂事地說「其實我不用去補習班沒關係」的那一刻，你心裡突然揪了一下。',
    choices: [
      {
        id: 'invest_in_kid_carefully',
        label: '擠出儲蓄與接外快講師費替孩子報關鍵資源，自己再少買幾件新衣',
        sublabel: '存款 -$25,000，把省下的資源優先留給孩子教育選擇',
        effect: {
          savingsDelta: -25000,
          statsDelta: { energy: -5, purpose: 2, life: 8 },
        },
        outcomeText:
          '雖然這個季度的個人存摺縮水了，但看見孩子開心地背著書包去上他喜歡的社團課，你覺得那些熬夜接案講課都值得。',
      },
      {
        id: 'community_and_public_resources',
        label: '善用社區圖書館、公部門免費青年中心與友會交換資源，不盲從焦慮軍備賽',
        sublabel: '發揮民間工作者的找資源超能力，省錢同時教會孩子生活素養',
        effect: {
          statsDelta: { energy: -3, purpose: 5, capital: 3, life: 6 },
        },
        outcomeText:
          '你帶孩子一起參加免費的博物館導覽與社區足球隊，省下大筆補習費，還意外跟幾位同樣務實的家長成了好朋友。',
      },
    ],
  },
  {
    id: 'life40_old_mentor_illness',
    title: '帶你入行的資深前輩病倒了：去醫院探望看見他一生的清貧與尊嚴',
    category: 'intertwined',
    tag: '前輩的鏡子',
    weight: 14,
    conditions: { minAge: 36, maxAge: 56 },
    narrative:
      '當年手把手帶你入行、陪你一起{fieldMove}的資深前輩住進了加護病房。他奉獻了三十年給台灣民間組織與基層現場，名下沒有房產、存款有限，病房外擠滿了各單位趕來輪班照顧的後輩。看著病床上的他，你彷彿看見某種版本的未來。',
    choices: [
      {
        id: 'organize_mutual_aid_fund',
        label: '協助揪同業發起前輩急難醫療互助，同時立誓要替這一代建立合理的退休與待遇文化',
        sublabel: '把震撼化為制度行動，拒絕讓奉獻者老無所終成為浪漫神話',
        effect: {
          savingsDelta: -6000,
          statsDelta: { energy: -5, purpose: 10, capital: 7, life: 2, impactScore: 13 },
          milestoneTag: '發起前輩醫療互助並推動同業勞動保障文化',
        },
        outcomeText:
          '不到三天大家就湊齊醫藥與看護費。那天傍晚你坐在醫院走廊寫下：「敬重前輩的最好方式，就是不讓下一代重複一樣的貧窮燃燒。」',
      },
      {
        id: 'rethink_own_safety_net',
        label: '默默包了一包紅包陪伴家屬，回家後立刻重整自己的保險與退休試算表',
        sublabel: '從前輩身上看清結構現實，先把自己的安全網補牢',
        effect: {
          savingsDelta: -8000,
          statsDelta: { energy: 1, purpose: 2, capital: 5, life: 6 },
        },
        outcomeText:
          '你替自己補齊了實支實付與長照基本保障，清楚提醒自己：照顧別人的前提是老後不要成為組織與家人的負擔。',
      },
    ],
  },
  {
    id: 'life50_peer_legacy_reunion',
    title: '入行二十年小聚：當年一起受訓的十個人，現在只剩兩個還在這個圈子',
    category: 'intertwined',
    tag: '歲月同溫層對照',
    weight: 16,
    conditions: { minAge: 43, maxAge: 62, minTenure: 12, excludeOutsideNPO: true },
    narrative:
      '當初同一梯進非營利與人民團體培訓班的十個年輕人，二十年後在台北一家老台菜館重聚。桌上有人是外商永續長、有人在部會當簡任官、有人回家接便當店，只剩你跟另一位老夥伴還留在民間組織第一線。大家笑談往事，空氣裡有種說不出的複雜情感。',
    choices: [
      {
        id: 'proud_of_long_haul',
        label: '坦然舉杯致敬所有留在現場與離開的人：「每個階段的我們都盡力過了」',
        sublabel: '和解所有的比較與遺憾，確認自己走出一條無愧於心的長路',
        effect: {
          savingsDelta: -2000,
          statsDelta: { energy: 5, purpose: 13, capital: 5, life: 9, impactScore: 10 },
        },
        outcomeText:
          '散場時那位跨去外商的朋友用力抱了你一下：「幸好還有你們留在那邊，我們才敢說台灣公民社會還在。」',
      },
      {
        id: 'leverage_cross_network',
        label: '趁機建立「畢業校友資源聯盟」，請已經在企業與公部門的同學固定反哺現場',
        sublabel: '把二十年同梯人脈轉化成實質跨界支援網路',
        effect: {
          savingsDelta: -2000,
          statsDelta: { energy: 1, purpose: 8, capital: 12, life: 5, impactScore: 16 },
          orgFinanceDelta: 1,
        },
        outcomeText:
          '那頓飯最後變成一場熱血的資源對接會——兩個月後真的有一筆企業設備捐贈與跨部會諮詢因為這群老同學而促成。',
      },
    ],
  },
  {
    id: 'life_all_gov_committee_invite',
    title: '受邀擔任縣市政府／中央部會「民間委員或審查委員」',
    category: 'work',
    tag: '體制內外對話',
    weight: 13,
    conditions: { minTenure: 5, minCapital: 48, excludeOutsideNPO: true },
    narrative:
      '累積多年的專業口碑終於被看見，主管機關來函邀請你以專家或民間團體代表身分出任為期兩年的委員會成員。雖然每次開會只有兩千五百元出席費、還得讀厚厚兩百頁議程資料，但這是少數能在體制內直接審預算與挑毛病的位子。',
    choices: [
      {
        id: 'accept_watchdog_seat',
        label: '接下委員聘書！把第一線看過的所有核銷荒謬與現場痛點帶進會議室質詢官員',
        sublabel: '專業聲望與影響力大增，每次開會前要熬夜讀完大量公文',
        effect: {
          savingsDelta: 10000,
          statsDelta: { energy: -8, purpose: 10, capital: 12, life: -3, impactScore: 18 },
          milestoneTag: '獲聘擔任政府民間委員／審查委員',
        },
        outcomeText:
          '第一次坐進部會會議室發言時手心還有點出汗，但當你點出某項補助辦法的盲點並真的寫進修正紀錄時，覺得過去十年的苦都變成子彈了。',
      },
      {
        id: 'decline_avoid_cooptation',
        label: '擔心進去當委員反被「背書摸頭」且分身乏術，禮貌婉拒專心守住外部監督角色',
        sublabel: '保留完整批判自由與下班時間',
        effect: {
          statsDelta: { energy: 3, purpose: 5, capital: 2, life: 4, impactScore: 7 },
        },
        outcomeText:
          '你把時間留給組織本業與生活，同時維持寫評論自由痛批政策不合理處的彈性，不必為了會議和諧而吞下妥協。',
      },
    ],
  },
  {
    id: 'life_all_housing_emergency_repair',
    title: '生活突發狀況：通勤機車報廢或租屋冷氣漏水大修',
    category: 'life',
    tag: '生活意外開銷',
    weight: 14,
    conditions: { minTenure: 1, excludeOutsideNPO: true },
    narrative:
      '本來就抓得很緊的月份，偏偏通勤{fieldMove}的老機車半路拋錨大修或報廢，或者租屋處老舊家電突然壞掉得自己貼錢換新。兩三萬元的意外支出，對沒有高年終緩衝的非營利工作者來說格外刺痛。',
    choices: [
      {
        id: 'buy_reliable_replacement',
        label: '咬牙花三萬五買可靠二手代步車或修繕到位，不讓每天通勤安全出問題',
        sublabel: '存款 -$35,000，確保日常交通與安全無虞',
        effect: {
          savingsDelta: -35000,
          statsDelta: { energy: 2, life: 3 },
        },
        outcomeText:
          '看著網銀扣款還是心痛了一下，但至少雨天騎車跑現場不用再提心吊膽怕半路熄火。',
      },
      {
        id: 'switch_public_transit_temporarily',
        label: '先暫時靠公車、Ubike 與捷運硬撐幾個月，把現金留著應付更緊急的帳單',
        sublabel: '只花 $4,000 交通月票，代價是每日多耗一小時體力通勤',
        effect: {
          savingsDelta: -4000,
          statsDelta: { energy: -8, life: -5 },
        },
        outcomeText:
          '省下了三萬塊，但也開始在夏天的正中午背著電腦追公車、趕場勘，體會什麼叫「沒錢只能拿體力換時間」。',
      },
    ],
  },
  {
    id: 'life_expense_may_tax_and_weddings',
    title: '五月報稅季撞上三張紅色炸彈：帳戶瞬間少掉半個月薪水',
    category: 'life',
    tag: '日常開銷衝擊',
    weight: 16,
    conditions: { minAge: 25, maxAge: 45 },
    narrative:
      '五月才剛刷完綜合所得稅、機車燃料稅與牌照稅，同一個禮拜桌曆上又連續出現大學同學、前同事與表妹的三場喜宴。紅包行情一張比一張高，看著網銀餘額數字，這個月連一杯手搖飲都要猶豫三秒。',
    choices: [
      {
        id: 'attend_and_pay_full',
        label: '人情還是得顧：照行情包完紅包並如期繳清稅單，勒緊褲帶過下個月',
        sublabel: '存款一次減少 $18,000，守住親友與同儕人情',
        effect: {
          savingsDelta: -18000,
          statsDelta: { energy: -3, life: 4 },
        },
        outcomeText:
          '婚禮上大家都笑得很開心，只有你自己回家打開記帳 App 嘆了一口氣，決定接下來三週晚餐全部自己煮麵。',
      },
      {
        id: 'selective_attend_budget',
        label: '只挑最要好的一場出席，其餘禮到人不到並把稅款辦分期減輕現金壓力',
        sublabel: '存款減少 $9,500，守住緊急預備金但略感人情疏離',
        effect: {
          savingsDelta: -9500,
          statsDelta: { energy: 1, life: -3 },
        },
        outcomeText:
          '雖然心裡有點不好意思，但至少沒有讓這個月帳戶見底，也學會量力而為才是長久之道。',
      },
    ],
  },
  {
    id: 'life_expense_dental_root_canal',
    title: '牙痛拖到半夜掛急診：牙醫宣布得做顯微根管與全瓷冠自費',
    category: 'life',
    tag: '醫療自費帳單',
    weight: 16,
    conditions: { minAge: 26, maxAge: 58 },
    narrative:
      '忙著趕專案一再延後洗牙與補牙，這週終於半夜痛到睡不著。牙醫照完 X 光搖搖頭說已經蛀到神經，想保住這顆臼齒得做顯微根管加上全瓷冠牙套，健保不給付，整套報價三萬二千元。',
    choices: [
      {
        id: 'do_proper_crown',
        label: '牙齒要用一輩子：咬牙刷卡做完整根管與牙套，徹底治好不留後患',
        sublabel: '存款減少 $32,000，保住長期健康與生活品質',
        effect: {
          savingsDelta: -32000,
          statsDelta: { energy: 4, life: 2 },
        },
        outcomeText:
          '付錢那刻幾乎聽到存摺哀嚎，但終於能正常吃飯不再半夜痛醒，也下定決心以後再忙也要每半年定期看牙。',
      },
      {
        id: 'cheaper_metal_or_delay',
        label: '選最便宜的健保根管加基礎材質先撐著，能省一半是一半',
        sublabel: '存款減少 $14,000，但治療過程折騰且恢復期不適',
        effect: {
          savingsDelta: -14000,
          statsDelta: { energy: -5, life: -2 },
        },
        outcomeText:
          '跑了五趟診所總算補起來，省下一萬八的代價是往後啃硬東西都得小心翼翼。',
      },
    ],
  },
  {
    id: 'life_expense_laptop_phone_dead',
    title: '陪伴五年的筆電與手機同月罷工：不換連工作群組都回不了',
    category: 'life',
    tag: '3C 設備汰換',
    weight: 15,
    conditions: { minAge: 24, maxAge: 55 },
    narrative:
      '組織沒配公務手機、筆電也早已過保卡頓，偏偏這週你自己的筆電主機板燒掉，手機電池也膨脹到自動關機。明天還要交計畫簡報跟回工作 LINE，只好衝去賣場看著動輒兩三萬的標價發呆。',
    choices: [
      {
        id: 'buy_reliable_new_gear',
        label: '一次換成耐用中階新機，免得開會簡報到一半又藍屏社死',
        sublabel: '存款減少 $28,000，工作效率與日常順暢度大幅提升',
        effect: {
          savingsDelta: -28000,
          statsDelta: { energy: 3, capital: 2, life: 2 },
        },
        outcomeText:
          '新筆電三秒開機的那一刻確實很爽，只是分期帳單會提醒你這筆支出整整半年的時間。',
      },
      {
        id: 'buy_refurbished_and_repair',
        label: '手機只花錢換副廠電池、筆電買二手整新機先頂著用',
        sublabel: '存款減少 $12,000，守住現金流但設備偶爾還是卡頓',
        effect: {
          savingsDelta: -12000,
          statsDelta: { energy: -4, life: -2 },
        },
        outcomeText:
          '靠著逛拍賣網站跟維修小店省下一萬六，雖然新買的二手筆電風扇聲像吹風機，至少簡報順利交卷了。',
      },
    ],
  },
  {
    id: 'life_expense_insurance_and_home_appliance',
    title: '商業醫療險保費調漲＋租屋家電汰換：成年人的隱形固定帳單',
    category: 'life',
    tag: '風險防護與生活費',
    weight: 15,
    conditions: { minAge: 28, maxAge: 52 },
    narrative:
      '月底一次收到兩張通知：年繳的實支實付醫療與意外險因年齡級距與條款調整一次調漲，同時間家裡除濕機與熱水器也雙雙故障。這類平常不會算進月薪試算表的隱形開銷，總在最沒防備的時候一起報到。',
    choices: [
      {
        id: 'keep_full_insurance_and_replace',
        label: '醫療保障不能斷！照繳年保費並把壞掉的家電一次換新',
        sublabel: '存款減少 $24,000，守住生病時的風險底線與居住舒適度',
        effect: {
          savingsDelta: -24000,
          statsDelta: { energy: 2, life: 4 },
        },
        outcomeText:
          '看著帳戶數字縮水一截，但想到身邊曾有同業沒買保險住院差點借錢，還是覺得這筆保命錢不能省。',
      },
      {
        id: 'trim_insurance_and_diy',
        label: '請保險業務把保單瘦身成最陽春的基礎方案，家電先買便宜二手貨湊合',
        sublabel: '存款減少 $11,000，短期壓力減輕但未來抗風險能力下降',
        effect: {
          savingsDelta: -11000,
          statsDelta: { energy: -3, life: -3 },
        },
        outcomeText:
          '帳面現金守住了，但半夜聽著二手除濕機喀喀作響，心裡也明白低薪最可怕的是連風險緩衝都得打折。',
      },
    ],
  },
  {
    id: 'life_npo_mba_program',
    title: '報考私立大學「非營利組織管理學程碩士在職專班」：週末上課換學位與跨團人脈？',
    category: 'intertwined',
    tag: '在職進修與人脈',
    weight: 15,
    conditions: {
      orgTypes: [
        'large_welfare',
        'grassroots',
        'local_foundation',
        'advocacy_ngo',
        'academic_society',
        'corp_intl_ngo',
      ],
      excludeOutsideNPO: true,
      minAge: 26,
      maxAge: 46,
    },
    narrative:
      '工作幾年後，你開始覺得單靠現場土法煉鋼總有天花板。某私立大學的「非營利組織管理學程碩士在職專班」正在招生，簡章上寫著師資涵蓋社福、倡議、勸募與組織治理實務，同學多半是各組織主管與資深專員。只是兩年學分費加上週末整天上課、下班趕論文，對存款與體力都是硬仗。',
    choices: [
      {
        id: 'enroll_npo_mba',
        label: '正式報考入學！咬牙扛兩年學分費與週末課表，把實務經驗升級成管理視野',
        sublabel: '存款 -$65,000、身心能量大減，但大幅累積專業資本、人脈與學歷加給資格',
        effect: {
          savingsDelta: -65000,
          hasProfessionalCert: true,
          salaryDelta: 2500,
          statsDelta: { energy: -10, capital: 16, purpose: 6, life: -6, impactScore: 10 },
          milestoneTag: '考取私立大學非營利組織管理學程碩士在職專班',
        },
        outcomeText:
          '兩年來週六早八準時進教室、半夜改問卷差點懷疑人生，但拿到學位與認識一群不同領域的同學後，你第一次感覺自己不再是一個人在孤軍奮戰。',
      },
      {
        id: 'audit_free_lectures',
        label: '先旁聽公開講座與工作坊就好，把六萬多學費留著當緊急預備金',
        sublabel: '守住存款與週末睡眠，靠免費跨團社群慢慢補齊管理知識',
        effect: {
          statsDelta: { energy: 3, capital: 6, life: 4, impactScore: 4 },
        },
        outcomeText:
          '你把簡章收進抽屜，改報名幾場免費的組織治理與財務講座。雖然沒有多一張碩士文憑，但週末能好好睡到自然醒也是一種續航力。',
      },
    ],
  },
  {
    id: 'life_union_labor_grad_school',
    title: '報考國立大學「勞工研究所」在職專班：把第一線勞權實務升級為勞動法與集體協商專業',
    category: 'intertwined',
    tag: '工會在職進修',
    weight: 16,
    conditions: {
      orgTypes: ['industrial_union', 'occupational_union'],
      excludeOutsideNPO: true,
      minAge: 26,
      maxAge: 46,
    },
    narrative:
      '跑了幾場勞資爭議調解與裁決庭後，你越來越深刻體會只靠熱血衝撞不夠，面對資方律師團還得要有更扎實的勞動法理與集體談判研究功底。某國立大學「勞工研究所」在職專班正在招生，同學幾乎都是各工會幹部、調解人與勞政實務者，只是兩年通勤上課與寫論文勢必吃掉所有週末。',
    choices: [
      {
        id: 'enroll_labor_grad_school',
        label: '報考入學！扛下學費與兩年下班唸書壓力，取得勞研所碩士學位與跨工會戰友網',
        sublabel: '存款 -$55,000、獲得證照／碩士敘薪資格，談判底氣與專業人脈大增',
        effect: {
          savingsDelta: -55000,
          hasProfessionalCert: true,
          salaryDelta: 2500,
          statsDelta: { energy: -10, capital: 17, purpose: 7, life: -6, impactScore: 11 },
          milestoneTag: '考取國立大學勞工研究所在職專班',
        },
        outcomeText:
          '下班趕高鐵去上勞工法研討課的日子累到不行，但寫出的碩士論文案例直接被其他工會拿來當裁決參考，那份專業自信無可取代。',
      },
      {
        id: 'join_labor_study_group',
        label: '暫不背學費與論文債，先加入免費跨工會勞動法讀書會累積實戰筆記',
        sublabel: '守住存款與休假時間，用案例實戰與前輩共學替代正式學位',
        effect: {
          statsDelta: { energy: 3, capital: 7, life: 4, impactScore: 5 },
        },
        outcomeText:
          '你省下五萬多學費，每隔週晚上和幾位友會秘書聚在咖啡廳拆解最新裁決書，一樣練出一身硬底子。',
      },
    ],
  },
  {
    id: 'life_union_social_gathering',
    title: '受邀參加工會聯誼活動：原來全台灣不是只有我在這間辦公室快撐不下去',
    category: 'life',
    tag: '工會交流與支持',
    weight: 15,
    conditions: { excludeOutsideNPO: true, minTenure: 1 },
    narrative:
      '週末傍晚，朋友拉你參加一場由工會舉辦的「民間組織與基層工作者聯誼餐會」。走進餐廳原本有點社恐，沒想到一聊起來，隔壁桌的學會秘書、社福社工、倡議專員跟工會幹部全都在吐一樣的苦水——凍薪、理監事會奇聞、評鑑核銷與永無止境的庶務地獄。大家邊吃邊笑，反而有一種久違的被理解感。',
    choices: [
      {
        id: 'join_union_mutual_aid',
        label: '留到最後和大家交換聯絡方式，加入互助群組固定交流薪資行情與職場經驗',
        sublabel: '花一點餐費與週末夜晚，換來跨組織戰友與情緒支持網',
        effect: {
          savingsDelta: -800,
          statsDelta: { energy: 8, purpose: 7, capital: 8, life: 8, impactScore: 5 },
        },
        outcomeText:
          '回家路上你發現手機多了十幾個新朋友，群組裡有人分享薪資行情、有人整理勞基法範本。原來知道自己不孤單，就足以讓人多撐過好幾個低潮。',
      },
      {
        id: 'greet_and_rest_early',
        label: '禮貌打完招呼、聽完大家經驗分享就先回家早點休息',
        sublabel: '省下社交耗電，帶回幾個實用小道消息並保有獨處時間',
        effect: {
          savingsDelta: -500,
          statsDelta: { energy: 5, capital: 3, life: 4 },
        },
        outcomeText:
          '雖然沒有深聊，但聽見別間組織也有一模一樣的荒謬日常，你心裡默默鬆了一口氣，回家泡了杯熱茶早早上床睡覺。',
      },
    ],
  },
  {
    id: 'life_union_labor_education',
    title: '報名工會勞動教育課程：第一次把《勞基法》、特休與勞退帳本徹底搞懂',
    category: 'intertwined',
    tag: '勞動權益培力',
    weight: 15,
    conditions: { excludeOutsideNPO: true, minTenure: 1 },
    narrative:
      '工會在假日開了一場免費的「非營利與受僱者勞動教育工作坊」，主題直指圈內最常踩的坑：補休歸零、假承攬真僱傭、高薪低報、以及勞退 6% 怎麼查。報名人數意外爆滿，台上講師一句「做好事不代表你要放棄自己的勞動基準」，讓台下不少人默默點頭拍照。',
    choices: [
      {
        id: 'audit_own_labor_rights',
        label: '認真抄完筆記並回家核對自己的薪資單、投保級距與勞退專戶',
        sublabel: '把法規知識變成保護自己的護身符，未來面對不合理要求更有底氣',
        effect: {
          statsDelta: { energy: -2, purpose: 6, capital: 10, life: 4, impactScore: 8 },
          milestoneTag: '完成工會勞動教育培力並學會維護自身勞權',
        },
        outcomeText:
          '核對完資料才發現自己過去對加班費與投保級距一知半解。你把講義存進雲端，也開始懂得在不撕破臉的前提下，用白紙黑字保護自己與同事。',
      },
      {
        id: 'share_labor_edu_with_team',
        label: '順手把課程重點整理成懶人包分享給辦公室同事，一起討論合理工時',
        sublabel: '從獨善其身走向集體意識，在團隊裡播下重視勞動條件的種子',
        effect: {
          statsDelta: { energy: -4, purpose: 9, capital: 8, life: 2, impactScore: 12 },
        },
        outcomeText:
          '茶水間裡大家第一次公開聊起補休與加班規範，雖然主管路過時表情有點微妙，但團隊對「好好工作也要好好生活」多了一份共識。',
      },
    ],
  },
];

