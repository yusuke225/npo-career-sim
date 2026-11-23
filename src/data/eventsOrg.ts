import type { GameEvent } from '../types/game';

export const ORG_EVENTS: GameEvent[] = [
  // =========================================================================
  // 一、學術與專業學會專屬（7+）
  // =========================================================================
  {
    id: 'soc_keynote_cancel',
    title: '年會倒數兩週：主講人臨時取消與理監事踢皮球',
    category: 'work',
    tag: '學會年會危機',
    weight: 18,
    conditions: { orgTypes: ['academic_society'], excludeOutsideNPO: true },
    narrative:
      '年度學術研討會報名人數已破五百人、大會手冊準備送印，海外 Keynote 講者卻在凌晨來信因家庭急事取消來台。學術主委與理事長在 LINE 群組互相推託「當初不是我邀的」，最後把視窗轉回給唯一全職的你：「秘書，你想辦法先頂一下。」',
    choices: [
      {
        id: 'pull_connections',
        label: '硬著頭皮動員學界人脈，48 小時內急邀國內大老救火',
        sublabel: '連續熬夜重編議程與海報，保住年會品質',
        effect: {
          statsDelta: { energy: -13, capital: 10, purpose: 4, life: -6, impactScore: 14 },
          setFlag: 'soc_saved_annual',
          milestoneTag: '獨力穩住五百人年會危機',
        },
        outcomeText:
          '你打爆二十幾通電話終於邀到頂尖國立大學資深教授救急，大會順利落幕。閉幕致詞時沒人提到你三天只睡八小時，但各校理事都記住了你的救火能力。',
      },
      {
        id: 'force_board_owner',
        label: '直接發出正式會議通知，要求當初提案的學術委員會共同承擔補位',
        sublabel: '堅守專職行政與理事權責分際，但會得罪幾位大教授',
        effect: {
          statsDelta: { energy: -4, capital: 2, purpose: 3, life: 2, impactScore: 6 },
          boardClimate: 'factional',
        },
        outcomeText:
          '主委面子掛不住，在群組冷回一句「現在秘書處都這麼有主見」，但最後委員會還是自己喬出替代論壇，讓你至少保住了這兩週的睡眠。',
      },
    ],
  },
  {
    id: 'soc_president_turnover',
    title: '理事長換屆改選：新團隊要求「全部重來」',
    category: 'work',
    tag: '學會權力交替',
    weight: 18,
    conditions: { orgTypes: ['academic_society'], excludeOutsideNPO: true, minOrgYears: 2 },
    narrative:
      '學會三年一次改選落幕，新任理事長上台第一天就把辦公室裡的舊檔案櫃貼滿便條紙，要求把會址從雙北某大學旁搬去他在中南部的醫學院，並打算把合作五年的年會公關公司與系統商全部換掉。身為全學會唯一知道所有帳本與內政部報備進度的人，你的去留成了關鍵。',
    choices: [
      {
        id: 'stay_as_memory',
        label: '留任並與新理事長建立默契，成為跨屆制度橋樑',
        sublabel: '消化新舊派系磨合壓力，爭取微調待遇與遠端彈性',
        effect: {
          statsDelta: { energy: -9, capital: 9, purpose: 3, life: -4, impactScore: 12 },
          salaryDelta: 2500,
          boardClimate: 'transition',
        },
        outcomeText:
          '你花了半年重新整理章程沿革、逐一拜會新舊理事，甚至學會寫遠端交接備忘錄。新理事長發現沒有你根本找不到前年大會憑證，終於答應幫你加薪。',
      },
      {
        id: 'refuse_relocate',
        label: '拒絕配合跨縣市無償搬遷，談不攏就準備轉往其他學會',
        sublabel: '守住生活圈，但會失去既有組織年資紅利',
        effect: {
          statsDelta: { energy: 4, capital: 4, purpose: -3, life: 7, impactScore: 4 },
          changeOrgName: '社團法人春山跨界實務學會',
          boardClimate: 'bureaucratic',
        },
        outcomeText:
          '新任秘書處把辦公室搬走後，兩個月內連續打電話問你三次系統密碼。你則已平靜交接完畢，帶著累積的學分認證與會務經驗跳槽到另一間規模較大的全國性學會。',
      },
    ],
  },
  {
    id: 'soc_dues_collection',
    title: '常年會費催繳與資深會員的「電話說教」',
    category: 'work',
    tag: '學會財務日常',
    weight: 15,
    conditions: { orgTypes: ['academic_society'], excludeOutsideNPO: true },
    narrative:
      '本年度尚有近三成會員未繳交兩千元常年會費，導致學會下個月印刷期刊與支付兼職校對費出現缺口。照章寄出簡訊與催繳信後，一位在學界頗有輩分的老會員打電話來，劈頭質問：「我創會就在了，你們年輕秘書怎麼敢寫這種像討債一樣的通知？」',
    choices: [
      {
        id: 'soft_diplomacy',
        label: '放低身段逐一電話致意，順便推「終身會員一次繳清方案」',
        sublabel: '吞下委屈但能實質幫學會補回現金流',
        effect: {
          statsDelta: { energy: -8, purpose: -2, capital: 6, life: -2, impactScore: 8 },
          orgFinanceDelta: 1,
        },
        outcomeText:
          '你花了三天用溫柔客氣的語氣打完四十通電話，意外說服八位教授直接改繳終身會費，學會帳戶總算多出二十萬元緩衝金。',
      },
      {
        id: 'firm_bylaws',
        label: '依理監事會決議與章程平等處理，不開特例',
        sublabel: '維護制度公平，但得自己承受理事長關切',
        effect: {
          statsDelta: { energy: -5, purpose: 6, capital: 2, life: 1, impactScore: 7 },
        },
        outcomeText:
          '老會員雖然不滿地向理事長告狀，但幾位年輕理監事私下傳訊息力挺你「終於有人敢照章程走」。',
      },
    ],
  },
  {
    id: 'soc_credit_system_crash',
    title: '繼續教育學分系統出包：三百位會員執照續期告急',
    category: 'work',
    tag: '繼續教育行政',
    weight: 15,
    conditions: { orgTypes: ['academic_society'], excludeOutsideNPO: true },
    narrative:
      '衛福部／相關主管機關更換積分申報平台格式，學會外包的低價舊系統忘記同步欄位，導致上個月三場大型工作坊共 320 位會員的繼續教育學分全部匯入失敗。週五傍晚五點，抗議信件與電話湧入，許多會員下週就面臨換照死線。',
    choices: [
      {
        id: 'weekend_manual_fix',
        label: '週末抱筆電回家一筆筆手動轉檔上傳，並公開發道歉與進度表',
        sublabel: '保住學會信譽與會員換照資格，但整個週末報銷',
        effect: {
          statsDelta: { energy: -14, purpose: 5, capital: 7, life: -8, impactScore: 13 },
          setFlag: 'soc_credit_hero',
        },
        outcomeText:
          '你在電腦前核對了 320 筆身分證字號與時數到週日深夜，週一早上九點發信通知全數入檔成功。那天辦公室收到了兩位會員寄來的手搖飲外送。',
      },
      {
        id: 'vendor_pressure',
        label: '正式發函要求系統商緊急派工處理，並在網站公告延期說明',
        sublabel: '減少個人過勞，但會員怒火會延燒一個禮拜',
        effect: {
          statsDelta: { energy: -6, purpose: -2, capital: 4, life: 2, impactScore: 6 },
          savingsDelta: 0,
        },
        outcomeText:
          '系統商拖到下週三才修好欄位，這五天你接了上百通憤怒電話，但也逼使理監事會終於同意編列明年更新資訊系統的預算。',
      },
    ],
  },
  {
    id: 'soc_journal_delay',
    title: '學會期刊面臨「開天窗」與教授拖稿危機',
    category: 'work',
    tag: '出版與審查',
    weight: 14,
    conditions: { orgTypes: ['academic_society'], excludeOutsideNPO: true },
    narrative:
      '每年兩期的學會學報即將截稿，若無法如期出刊，明年爭取國科會或相關評鑑的期刊點數將直接扣分。總編輯教授忙著升等與計畫結案已讀不回一週，兩位審查委員也遲遲未交回審查意見表。',
    choices: [
      {
        id: 'camp_office',
        label: '親自跑去總編輯研究室堵人順便幫他整理文獻格式',
        sublabel: '準時保住出刊紀錄，代價是越界做起編輯苦工',
        effect: {
          statsDelta: { energy: -10, capital: 5, purpose: 2, life: -4, impactScore: 10 },
        },
        outcomeText:
          '教授不好意思地趕工寫完編者序，期刊如期印出寄往各校圖書館。但從此以後編輯委員會更理所當然把格式校對全推給你。',
      },
      {
        id: 'restructure_process',
        label: '啟動備援徵稿名單並向理事會提案設立「專任編輯津貼」',
        sublabel: '花時間建立制度，避免明年重複上演地獄',
        effect: {
          statsDelta: { energy: -5, capital: 8, purpose: 5, life: 0, impactScore: 11 },
        },
        outcomeText:
          '這期雖然延後三週出刊被幾位會員碎念，但理事會終於看見「沒有專責執行編輯」的結構問題，通過每期一萬五千元的專案編輯費。',
      },
    ],
  },
  {
    id: 'soc_sub_association',
    title: '「順便兼管」另一個新成立的相關學會',
    category: 'work',
    tag: '一人兼多會',
    weight: 14,
    conditions: { orgTypes: ['academic_society'], excludeOutsideNPO: true, minTenure: 2 },
    narrative:
      '幾位關係密切的常務理事合組了一個跨領域次專科／子學會，因為剛立案沒預算請人，理事笑著對你說：「反正辦公桌都在同一間，你平常發信順便幫我們發一下、收個會費，我們每個月補貼你三千元車馬費！」',
    choices: [
      {
        id: 'take_side_allowance',
        label: '為了那三千元與人情接受兼辦',
        sublabel: '實質增加一點月收入，但變成兩間學會同時打電話給你',
        effect: {
          salaryDelta: 3000,
          statsDelta: { energy: -12, purpose: -3, capital: 4, life: -7, impactScore: 8 },
        },
        outcomeText:
          '三千元聽起來不無小補，但兩個月後你發現兩間學會的會員大會撞在同一個月，每天像精神分裂一樣切換兩個官方信箱與兩套帳本。',
      },
      {
        id: 'decline_and_propose_parttime',
        label: '婉拒無償兼管，提議合聘一位半職行政助理分攤兩會庶務',
        sublabel: '沒拿到三千元，卻守住工作量不至於崩盤',
        effect: {
          statsDelta: { energy: 2, capital: 7, purpose: 5, life: 4, impactScore: 9 },
        },
        outcomeText:
          '理事一開始嫌麻煩，但看到你列出的實際工時統計表後還是點頭同意合聘工讀生。你也第一次練習到如何拒絕「順便一下」的無限擴張。',
      },
    ],
  },
  {
    id: 'soc_ministry_audit',
    title: '內政部人民團體會務查核與改選流會警報',
    category: 'work',
    tag: '人團法規現場',
    weight: 13,
    conditions: { orgTypes: ['academic_society', 'grassroots'], excludeOutsideNPO: true },
    narrative:
      '年度會員大會規定必須有過半數會員（含委託書）出席才算有效，但離報到截止只剩四十分鐘，現場簽到與委託書加起來還差 28 張。偏偏今年主管機關派了科員來列席指導，一旦流會，所有年度預算案與理監事改選都將被迫重辦。',
    choices: [
      {
        id: 'blitz_proxy_calls',
        label: '啟動「委託書奪命連環扣」＋現場請理事立刻傳真／線上補件',
        sublabel: '狼狽卻救場成功，練就人團法實務硬功夫',
        effect: {
          statsDelta: { energy: -10, capital: 8, purpose: 2, life: -2, impactScore: 10 },
        },
        outcomeText:
          '在截止前五分鐘驚險壓線湊滿法定人數！那位主管機關科員點點頭簽了名，你手心全是汗，卻也深刻體會民間團體維繫民主程序有多耗費心力。',
      },
      {
        id: 'propose_delegate_system',
        label: '依規定宣告流會改開二次會議，順便推動「會員代表制」修章',
        sublabel: '短期很尷尬，但能根治學會動輒千人卻湊不齊出席率的結構難題',
        effect: {
          statsDelta: { energy: -7, capital: 10, purpose: 6, life: 0, impactScore: 12 },
          milestoneTag: '推動人民團體會員代表制修章',
        },
        outcomeText:
          '二次大會雖然讓行政多跑一輪公文，但你把流會危機轉成修章契機，半年後順利通過分區會員代表制，從此以後學會不再每年為簽到人數提心吊膽。',
      },
    ],
  },

  // =========================================================================
  // 二、產業／企業工會專屬（7+）
  // =========================================================================
  {
    id: 'ind_union_leak_scare',
    title: '秘密籌組工會名單疑似外洩：資方個別約談風暴',
    category: 'work',
    tag: '工會籌組防線',
    weight: 18,
    conditions: { orgTypes: ['industrial_union'], excludeOutsideNPO: true },
    narrative:
      '你協助某高科技園區／傳產廠區秘密籌組企業工會已經三個月，距離三十人發起門檻只差最後五份連署書。不料昨晚有兩名熱心員工被廠長個別叫進會議室「關心最近是不是下班跟外面工會的人走很近」，群組瞬間人心惶惶，已有三人私訊想撤回連署。',
    choices: [
      {
        id: 'rush_register_and_protect',
        label: '連夜補齊備位發起人送件登記，並教大家錄音蒐證申請不當勞動行為裁決',
        sublabel: '正面對決資方打壓，體力與心理張力拉滿',
        effect: {
          statsDelta: { energy: -14, purpose: 12, capital: 9, life: -7, impactScore: 18 },
          setFlag: 'union_won_organizing',
          milestoneTag: '頂住資方約談壓力完成工會立案',
        },
        outcomeText:
          '你們在 72 小時內把三十份文件搶先送進市政府勞工局取得立案證書。發起人雖然還是被調班刁難，但有了法定保護傘與裁決案撐腰，終於沒有人撤退。',
      },
      {
        id: 'slow_down_underground',
        label: '暫時轉為地下一對一深耕，撤下公開社群動作先保住發起人飯碗',
        sublabel: '避開正面碰撞，但進度拖長且部分勞工會失去耐心',
        effect: {
          statsDelta: { energy: -7, purpose: 3, capital: 5, life: -2, impactScore: 8 },
        },
        outcomeText:
          '你們取消了工廠外發傳單，改在假日約咖啡廳小聚，撐過這波清查。雖然多花了半年才立案，但核心幹部一個都沒被資遣。',
      },
    ],
  },
  {
    id: 'ind_union_strike_vote',
    title: '勞資調解破裂：是否推動「罷工投票」的關鍵抉擇',
    category: 'work',
    tag: '集體爭議權',
    weight: 18,
    conditions: { orgTypes: ['industrial_union'], excludeOutsideNPO: true, minTenure: 2 },
    narrative:
      '針對輪班加班費與年終減半的爭議，經過三次市政府勞資調解依舊完全破裂，資方代表在會議結束前只留下一句「不爽可以走法院」。工會理事會分成兩派：鷹派主張立刻啟動合法罷工投票，鴿派擔心會員只敢在群組罵、真要過半投票會失敗收場反而讓工會徹底漏氣。',
    choices: [
      {
        id: 'organize_strike_ballot',
        label: '扛起全部動員規劃，走進每個班別辦說明會衝刺過半罷工投票',
        sublabel: '工運組織者的終極考驗：成則寫下歷史，敗則元氣大傷',
        effect: {
          statsDelta: { energy: -16, purpose: 14, capital: 12, life: -9, impactScore: 22 },
          roleLevelDelta: 1,
          milestoneTag: '籌辦合法罷工投票並逼回資方談判桌',
        },
        outcomeText:
          '連續三週每天清晨六點與半夜十二點守在換班口開講，投票箱開出的那一刻同意票跨越法定門檻！資方隔天主動重啟協商，雖然你累到失聲一週，卻成為圈內敬重的核心組織者。',
      },
      {
        id: 'escalate_media_and_inspection',
        label: '先打勞動檢查、裁決與記者會輿論戰，保留罷工牌不貿然梭哈',
        sublabel: '穩健累積談判籌碼，但也可能被激進幹部批評太保守',
        effect: {
          statsDelta: { energy: -9, purpose: 6, capital: 8, life: -3, impactScore: 13 },
          boardClimate: 'factional',
        },
        outcomeText:
          '連續兩波勞檢罰單與媒體報導逼使資方讓步五成條件。雖然激進派幹部仍嫌不夠痛快，但會員至少實質領回了積欠已久的加班費。',
      },
    ],
  },
  {
    id: 'ind_union_gift_members',
    title: '會員只問「今年五一發什麼禮券」，沒人要來開會員大會',
    category: 'work',
    tag: '工會內部民主',
    weight: 16,
    conditions: { orgTypes: ['industrial_union', 'occupational_union'], excludeOutsideNPO: true },
    narrative:
      '工會上週剛幫兩位被違法解僱的會員談回百萬資遣費，但當你在會員大群組公告這週六召開年度會員大會與團協草案說明時，底下連續十幾則回覆都在問：「秘書，沒辦法到可以託人代領超商禮券嗎？」「繳會費就是為了紀念品啊。」那一刻你盯著螢幕感到一陣深深的虛無。',
    choices: [
      {
        id: 'labor_ed_reframing',
        label: '設計互動式勞權小遊戲與個案分享，把領紀念品的場合變成分組對話現場',
        sublabel: '不放棄跟「冷漠多數」溝通，花兩倍力氣設計活動',
        effect: {
          statsDelta: { energy: -10, purpose: 7, capital: 7, life: -3, impactScore: 12 },
        },
        outcomeText:
          '你把無聊的議程拆成「三分鐘看懂你少領多少加班費」實算工作坊，原本只想領完便當就走的會員，居然多留了半小時開始追問自己的班表。',
      },
      {
        id: 'accept_service_reality',
        label: '承認工會兼具服務與互助性質，把心力集中在願意站出來的 15% 骨幹幹部',
        sublabel: '調整心理預期，減少無謂的自我消耗',
        effect: {
          statsDelta: { energy: 3, purpose: -3, capital: 4, life: 3, impactScore: 6 },
        },
        outcomeText:
          '你想通了「不是每個勞工都有餘裕當社運青年」，不再因群組冷場而受傷，把時間省下來深度培訓各部門願意出面的種子代表。',
      },
    ],
  },
  {
    id: 'ind_union_self_overwork',
    title: '「幫別人爭勞權的我們，自己卻沒有加班費」',
    category: 'work',
    tag: '工會勞動條件',
    weight: 17,
    conditions: { orgTypes: ['industrial_union', 'occupational_union'], excludeOutsideNPO: true },
    narrative:
      '這季為了接兩件重大勞資爭議與週末勞教營，你已經連續 19 天沒有完整休假，月均工時突破 220 小時。你鼓起勇氣在工會理事會提出「秘書處也應落實一例一休與補休制度」，沒想到幾位本身也是基層勞工的理事卻皺眉說：「我們會費也是工人一塊一塊湊出來的，以前前輩做工運哪有在算幾點下班的？」',
    choices: [
      {
        id: 'negotiate_cba_inside',
        label: '拿出自己的工時紀錄與勞基法條文，正式跟自家理事會「團體協商」',
        sublabel: '極度尷尬的一戰，但決定工會秘書這份工作能否長久',
        effect: {
          statsDelta: { energy: -6, purpose: 9, capital: 8, life: 6, impactScore: 11 },
          salaryDelta: 2000,
          milestoneTag: '成功推動工會內部秘書處工時保障條款',
        },
        outcomeText:
          '討論氣氛一度僵到冰點，最後一位資深女理事開口挺你：「我們自己都在罵資方用熱血綁架員工，不能對自己的秘書做一樣的事。」最後通過了確實補休與加班費上限制度。',
      },
      {
        id: 'swallow_for_movement',
        label: '看到工會帳上抗爭基金捉襟見肘，默默把提案收回只求補休兩天',
        sublabel: '維持表面和諧，內心對組織文化多了一道裂痕',
        effect: {
          statsDelta: { energy: -8, purpose: -8, capital: 1, life: -4, impactScore: 4 },
        },
        outcomeText:
          '理事們誇你體諒工人辛苦，但那天深夜坐捷運回家時，你突然覺得那些「體諒」跟一般公司老闆講的「共體時艱」聽起來有八分像。',
      },
    ],
  },
  {
    id: 'ind_union_slapp_lawsuit',
    title: '資方祭出民事求償千萬與假處分：司法戰施壓',
    category: 'work',
    tag: '勞資司法攻防',
    weight: 14,
    conditions: { orgTypes: ['industrial_union'], excludeOutsideNPO: true, minTenure: 3 },
    narrative:
      '工會在股東會場外拉布條抗議低薪與違法解僱後，資方聘請大型事務所對工會與包括你在內的三位幹部寄出存證信函，以「侵害商譽」為由求償一千兩百萬元。家人看到掛號信嚇壞了，工會帳上現金卻只有八十萬。',
    choices: [
      {
        id: 'counter_media_and_legal',
        label: '聯繫義務律師團開記者會反擊「SLAPP 策略性訴訟」，發起小額抗爭募款',
        sublabel: '正面迎戰司法恐嚇，考驗心理韌性與社會串聯力',
        effect: {
          statsDelta: { energy: -13, purpose: 10, capital: 11, life: -6, impactScore: 17 },
          setFlag: 'union_survived_slapp',
        },
        outcomeText:
          '友會與勞動法學者聯合聲援，三天內募到足夠的訴訟擔保與宣傳費。一年後法院認定工會抗議屬合理意見表達駁回求償，你也收進人生第一張律師團的擊掌照。',
      },
      {
        id: 'settle_quietly',
        label: '為保護幹部家庭不被查封薪資，評估與資方交換條件撤除部分抗議行動',
        sublabel: '大幅降低風險，但得吞下「退讓」的內部責難',
        effect: {
          statsDelta: { energy: -5, purpose: -7, capital: 3, life: 4, impactScore: 4 },
          boardClimate: 'factional',
        },
        outcomeText:
          '資方撤回告訴，換取工會半年內不再於總部外抗議。雖然保住了每位幹部的生活平靜，但有幾位年輕會員失望地退出了群組。',
      },
    ],
  },
  {
    id: 'ind_union_cba_win',
    title: '歷時兩年談判：第一份《團體協約》簽署在即',
    category: 'work',
    tag: '團體協約里程碑',
    weight: 14,
    conditions: { orgTypes: ['industrial_union'], excludeOutsideNPO: true, minTenure: 4 },
    narrative:
      '歷經十四輪馬拉松式協商，資方終於鬆口願意在《團體協約》寫入調薪公式與育兒留停保障，但最後一刻要求刪除「非會員不得搭便車條款」（禁止搭便車條款），條件是換取每位會員再多 500 元伙食津貼。這考驗工會是要守住制度長遠生命力，還是先拿眼前實惠安撫會員。',
    choices: [
      {
        id: 'hold_anti_freerider',
        label: '死守「禁止搭便車條款」與工會會務公假，絕不退讓組織根基',
        sublabel: '可能讓簽約再延半年，但守住工會永續籌碼',
        effect: {
          statsDelta: { energy: -10, purpose: 11, capital: 10, life: -3, impactScore: 19 },
          milestoneTag: '成功簽署含禁搭便車條款之團體協約',
          salaryDelta: 2000,
        },
        outcomeText:
          '資方拖了四個月見工會寸步不讓，最終還是簽字了。這份條文讓接下來的入會率一口氣翻倍，成為台灣工運教科書級的簽約案例。',
      },
      {
        id: 'take_immediate_wage',
        label: '優先替基層拿下實質津貼與調薪公式，先簽下歷史性第一份團協',
        sublabel: '讓會員立刻有感，組織擴張留待下一輪再戰',
        effect: {
          statsDelta: { energy: -6, purpose: 6, capital: 8, life: 2, impactScore: 15 },
          milestoneTag: '完成工會首份團體協約簽署',
        },
        outcomeText:
          '簽約當天會場掌聲不斷，輪班媽媽抱著你感謝多出的津貼與育兒保障。儘管知道「搭便車」問題遲早還要再戰一次，至少你們跨出了第一步。',
      },
    ],
  },
  {
    id: 'ind_union_faction_split',
    title: '工會理事會路線分裂：談判派與抗爭派攤牌',
    category: 'work',
    tag: '組織路線衝突',
    weight: 14,
    conditions: { orgTypes: ['industrial_union'], excludeOutsideNPO: true },
    narrative:
      '工會內部兩大派系在會員代表大會前夕徹底撕破臉：理事長這派主張維持與資方及勞動部官員的體制內對話管道；監事長那派則公開貼文痛批秘書處「軟弱妥協」，要求立刻發動包圍主管機關抗爭。雙方都要你這個全職秘書表態選邊站。',
    choices: [
      {
        id: 'mediate_procedural',
        label: '維持秘書處中立專業，把兩派方案交由會員無記名投票決定',
        sublabel: '短期兩邊都不討好，但守住工會民主正當性',
        effect: {
          statsDelta: { energy: -10, purpose: 6, capital: 8, life: -2, impactScore: 11 },
          boardClimate: 'transition',
        },
        outcomeText:
          '兩邊幹部輪流把你罵了一輪「沒有立場」，但公開辯論與無記名投票讓普通會員第一次真正參與決策，也保住了工會沒分裂出走。',
      },
      {
        id: 'back_militant_action',
        label: '判斷資方只吃硬不吃軟，力挺強硬抗爭路線並協助動員',
        sublabel: '痛快出氣但政治風險極高，可能引爆理事集體請辭',
        effect: {
          statsDelta: { energy: -12, purpose: 8, capital: 5, life: -5, impactScore: 12 },
          boardClimate: 'factional',
        },
        outcomeText:
          '記者會確實上了新聞頭版，迫使部會官員出來接陳情書；但理事長一派在會後遞出辭呈，留下滿地分裂的會務等你收拾。',
      },
    ],
  },

  // =========================================================================
  // 三、職業工會／區域總工會專屬（6+）
  // =========================================================================
  {
    id: 'occ_counter_explosion',
    title: '欠費斷保會員在工會櫃檯拍桌：「我繳了十年怎麼沒勞保！」',
    category: 'work',
    tag: '職業工會櫃檯',
    weight: 18,
    conditions: { orgTypes: ['occupational_union'], excludeOutsideNPO: true },
    narrative:
      '週一早上九點，一位滿身油漆味的師傅衝進辦公室拍桌怒吼，因為他上週工作受傷想請領給付，醫院一查才發現他已被退保。調出系統紀錄，工會三個月前寄過兩次雙掛號催繳與四通簡訊通知，他自己搬家沒改地址又欠繳兩期保費，但他堅持「我平常那麼忙哪有看信，就是你們秘書偷懶沒打電話」。',
    choices: [
      {
        id: 'help_remedy_calmly',
        label: '先穩住情緒幫他查清楚醫療與補救管道（如職災保護法救濟），同時拿簽收紀錄說明',
        sublabel: '極度消耗情緒，但有機會真正幫到一個基層家庭',
        effect: {
          statsDelta: { energy: -11, purpose: 7, capital: 7, life: -3, impactScore: 13 },
          setFlag: 'occ_saved_craftsman',
        },
        outcomeText:
          '你替他整理好職保法相關申請與急難救助資料，兩週後師傅拎著一袋蓮霧回來櫃檯小聲說「歹勢那天太急口氣不好」。這大概是職業工會裡最真實的瞬間。',
      },
      {
        id: 'strict_boundary',
        label: '請理監事出面依規章與送達回執處理，拒絕無限上綱的櫃檯情緒勒索',
        sublabel: '守住第一線行政人員尊嚴與作業標準',
        effect: {
          statsDelta: { energy: -5, purpose: 1, capital: 4, life: 4, impactScore: 6 },
        },
        outcomeText:
          '你把雙掛號收執聯複印出來交給他並保持安全距離。雖然對方嘴裡碎念還是走了，但也讓辦公室其餘兩位會務姊妹鬆了一口氣。',
      },
    ],
  },
  {
    id: 'occ_occupational_injury_win',
    title: '替外送／裝修師傅爭取到百萬職災失能給付',
    category: 'work',
    tag: '職災權益現場',
    weight: 16,
    conditions: { orgTypes: ['occupational_union'], excludeOutsideNPO: true },
    narrative:
      '一位單親媽媽會員通勤摔傷嚴重骨折，勞保局初步以「非工作時段且證據不足」駁回職災認定，改按普通傷病給付，金額落差高達數十萬。她幾乎想放棄申訴，問你工會能不能幫她寫覆審理由書。這完全超出單純代辦加退保的本業，寫下去得自己翻法條與跑現場拍照。',
    choices: [
      {
        id: 'fight_appeal',
        label: '下班後陪她調監視器與路線紀錄，逐條寫出專業申訴書並陪開審議會',
        sublabel: '超時投入大量心力，換取無可取代的職業尊嚴',
        effect: {
          statsDelta: { energy: -12, purpose: 13, capital: 9, life: -5, impactScore: 19 },
          milestoneTag: '協助會員翻案成功領回職災給付',
        },
        outcomeText:
          '三個月後勞保局撤銷原處分改核定職災！會員帶著孩子來工會鞠躬道謝的那天，你覺得自己做的不只是行政代辦，而是真正在撐住勞工的安全網。',
      },
      {
        id: 'refer_legal_aid',
        label: '整理好基本投保與就醫時序表，協助轉介法扶與勞工局免費律師諮詢',
        sublabel: '在有限人手下做好專業分工，不讓自己燃燒殆盡',
        effect: {
          statsDelta: { energy: -4, purpose: 5, capital: 5, life: 2, impactScore: 9 },
        },
        outcomeText:
          '法扶律師接手後稱讚你整理的資料時間軸非常完整清晰，既幫上會員的忙，也沒有讓已經吃緊的櫃檯作業停擺。',
      },
    ],
  },
  {
    id: 'occ_training_audit',
    title: '勞動部職訓計畫突擊訪視：簽到表與講師時數差兩分鐘',
    category: 'work',
    tag: '職訓標案查核',
    weight: 15,
    conditions: { orgTypes: ['occupational_union'], excludeOutsideNPO: true },
    narrative:
      '職業工會為了拓展財源與服務會員，承接了勞動部產業人才投資／失業者職訓班。偏偏這天訪視委員無預警提早二十分鐘衝進教室，發現有三位學員還沒到齊、材料清點表少了兩張簽名，揚言要把整門課列入異常紀錄，影響明年核銷與評鑑等級。',
    choices: [
      {
        id: 'full_audit_defense',
        label: '立刻調出學員請假簡訊、刷卡紀錄與材料出貨單，撰寫二十頁說明附件救場',
        sublabel: '熬夜做文書防禦戰，保住工會明年兩百萬職訓案',
        effect: {
          statsDelta: { energy: -11, capital: 7, purpose: -1, life: -5, impactScore: 9 },
          orgFinanceDelta: 1,
        },
        outcomeText:
          '你把每一分鐘的出缺席證據都對得滴水不漏，最後只被記了輕微行政提醒。理事長口頭嘉許你一句「不錯」，但隔週又多加了一班叫你順便開。',
      },
      {
        id: 'cut_training_load',
        label: '誠實檢討改善並向理事會建議明年減半開班，回歸會員本業服務',
        sublabel: '減少行政核銷地獄，但工會收入會小幅縮水',
        effect: {
          statsDelta: { energy: 4, capital: 4, purpose: 3, life: 5, impactScore: 6 },
        },
        outcomeText:
          '理事會雖心疼補助款減少，但看到這兩年會務人員為了核銷離職了三個，終於點頭同意把人力優先留給會員服務。',
      },
    ],
  },
  {
    id: 'occ_election_factions',
    title: '理監事改選派系角力：要求秘書處「洩漏會員通訊錄」',
    category: 'work',
    tag: '工會選舉倫理',
    weight: 16,
    conditions: { orgTypes: ['occupational_union'], excludeOutsideNPO: true, minTenure: 2 },
    narrative:
      '四年一度的職業工會會員代表選舉逼近，現任理事長派與在野改革派正激烈搶票。下午，一位平時對你很客氣的常務理事把門帶上，低聲要你把全會三千多名會員的手機與住址匯出成 Excel 讓他「去拜票聯絡感情」，暗示選贏後會幫秘書處調薪。',
    choices: [
      {
        id: 'refuse_pdpa',
        label: '搬出《個資法》與《工會法》嚴正拒絕，只依選委會規定寄發公開選舉公報',
        sublabel: '守住會務中立與法律紅線，但可能被當權派穿小鞋',
        effect: {
          statsDelta: { energy: -7, purpose: 10, capital: 7, life: -1, impactScore: 14 },
          boardClimate: 'factional',
          milestoneTag: '嚴守個資法與工會選舉會務中立',
        },
        outcomeText:
          '那位理事臉色鐵青摔門出去，但選舉當天勞工局列席人員查核時對選務程序挑不出半點毛病。選後新理事會反而更不敢隨便叫你做違法的事。',
      },
      {
        id: 'formal_board_resolution',
        label: '不私下給名單，改提議由工會統一提供「各候選人對等聯名文宣代寄服務」',
        sublabel: '聰明化解人情壓力，累在選前多寄一輪兩千封信',
        effect: {
          statsDelta: { energy: -9, purpose: 6, capital: 9, life: -3, impactScore: 12 },
        },
        outcomeText:
          '所有候選人都能公平寄一次文宣，誰也不能佔便宜。雖然選務工作量暴增，但兩派事後都承認秘書處確實辦得公道。',
      },
    ],
  },
  {
    id: 'occ_digital_upgrade',
    title: '推動「LINE 線上繳費與加退保」：資深老同事集體抗拒',
    category: 'work',
    tag: '會務數位轉型',
    weight: 14,
    conditions: { orgTypes: ['occupational_union', 'academic_society'], excludeOutsideNPO: true },
    narrative:
      '工會至今還在用手寫三聯單收費、每季對幾千筆郵局劃撥單對到眼睛脫窗。你想導入超商條碼繳費與 LINE 官方帳號線上查詢功能，卻遭到在工會待了二十年的資深會計姊姊強烈反對：「我們會員都做工的老實人啦，不會用手機！而且改系統萬一出錯誰負責？」',
    choices: [
      {
        id: 'hybrid_pilot',
        label: '保留櫃檯紙本三個月並行，親自幫師傅與老同事一對一設定成功',
        sublabel: '前期加倍辛勞，但能溫和帶動整個工會升級',
        effect: {
          statsDelta: { energy: -10, capital: 10, purpose: 5, life: -2, impactScore: 13 },
          salaryDelta: 1500,
        },
        outcomeText:
          '第一季雙軌並行累翻了，但連六十歲的裝修師傅都學會用手機在超商刷條碼繳勞保費後，資深同事終於笑著說：「早知道這麼輕鬆十年前就該換了。」',
      },
      {
        id: 'keep_status_quo',
        label: '不想撕破職場人際氣氛，暫緩系統全面改造只小幅整理 Excel',
        sublabel: '維持辦公室和諧，繼續承受繁重手工對帳',
        effect: {
          statsDelta: { energy: -4, purpose: -3, capital: 1, life: 3, impactScore: 4 },
        },
        outcomeText:
          '辦公室氣氛保住了，但每到一、四、七、十月的繳費季，桌上依舊堆滿比人還高的劃撥收據。',
      },
    ],
  },
  {
    id: 'occ_souvenir_procurement',
    title: '會員大會紀念品採購與理事人情關說',
    category: 'work',
    tag: '人民團體採購',
    weight: 13,
    conditions: { orgTypes: ['occupational_union'], excludeOutsideNPO: true },
    narrative:
      '今年會員代表大會共有兩百萬紀念品預算。按比價表，A 廠商的不鏽鋼保溫瓶品質好又便宜；但有兩位資深理事帶著熟識的 B 廠商名片走進來：「這家是我們自己親戚開的，東西雖然貴兩成、比較薄一點，大家互相關照嘛。」',
    choices: [
      {
        id: 'public_bidding_matrix',
        label: '堅持做成三家公開比價表送理監事會記名審議，讓決定攤在陽光下',
        sublabel: '自保兼守住會員會費，考驗溝通智慧',
        effect: {
          statsDelta: { energy: -6, purpose: 7, capital: 6, life: 0, impactScore: 10 },
        },
        outcomeText:
          '一旦白紙黑字列進議事錄，原本打探口風的理事反而不敢強押 B 廠商過關。你守住了幾十萬會費，也替自己留下清白的經手紀錄。',
      },
      {
        id: 'compromise_split',
        label: '要求 B 廠商降價並追加品質保證條款才納入採購，換取議程順利通過',
        sublabel: '台灣職場的灰色折衷，心裡有點疙瘩',
        effect: {
          statsDelta: { energy: -4, purpose: -5, capital: 5, life: 2, impactScore: 5 },
        },
        outcomeText:
          '大會順利發完紀念品，理事們對你很滿意，但收到會員抱怨今年保溫瓶有點漏水時，你只能默默記下教訓。',
      },
    ],
  },

  // =========================================================================
  // 四、草根小型協會專屬（5+）
  // =========================================================================
  {
    id: 'grass_payroll_delay',
    title: '月底帳上剩八萬：創辦人問「這個月薪水能不能晚十天發？」',
    category: 'work',
    tag: '草根現金流危機',
    weight: 18,
    conditions: { orgTypes: ['grassroots'], excludeOutsideNPO: true },
    narrative:
      '原定核撥的地方政府補助款因為承辦換人又卡在主計室，協會活存只剩八萬元，剛好只夠付房租和一位兼職老師的鐘點費。創辦人紅著眼眶找你跟另外兩位專職開會：「大家都是為了理念一起撐這個家，這期薪水能不能先延十天，我明天先去跟朋友借週轉？」',
    choices: [
      {
        id: 'refuse_and_audit_cash',
        label: '堅持薪資必須準時給付，一起盤點並砍掉非緊急活動先把現金留給人事',
        sublabel: '幫創辦人從「熱情經營」拉回「合法雇主」底線',
        effect: {
          statsDelta: { energy: -7, purpose: 4, capital: 8, life: 2, impactScore: 9 },
          orgFinanceDelta: 1,
        },
        outcomeText:
          '你們緊急取消了下週一場燒錢的實體市集並盤點預收款，發薪日當天薪資還是準時入帳了，也從此訂下「三個月現金安全水位」警戒線。',
      },
      {
        id: 'agree_defer_once',
        label: '體諒現場辛苦答應延後兩週領薪，先刷自己信用卡買活動急需物資',
        sublabel: '替協會撐過難關，但讓自己的財務跟組織風險綁在一起',
        effect: {
          savingsDelta: -12000,
          statsDelta: { energy: -9, purpose: 5, capital: 2, life: -8, impactScore: 10 },
          orgFinanceDelta: -1,
        },
        outcomeText:
          '十八天後補助款終於入帳，薪水也補齊了。但這件事讓你開始意識到：用個人財務墊付組織缺口，往往是草根 NPO 拖垮工作者的起點。',
      },
    ],
  },
  {
    id: 'grass_founder_midnight_line',
    title: '創辦人半夜一點傳 LINE：「突然有個好點子，明天早上討論！」',
    category: 'work',
    tag: '公私界線模糊',
    weight: 16,
    conditions: { orgTypes: ['grassroots', 'advocacy_ngo'], excludeOutsideNPO: true },
    narrative:
      '小協會沒有打卡鐘也沒有明確工作說明書。熱血又焦慮的創辦人習慣半夜滑手機看到新聞就連發十幾則語音訊息進群組，期待大家隔天一早九點已經生出企劃雛形。這個月已經連續發生三次了。',
    choices: [
      {
        id: 'set_line_boundary',
        label: '隔天早上九點整統一禮貌回覆，並提案建立「非緊急事項週會才討論」機制',
        sublabel: '試圖建立健康邊界，可能被當成「不夠熱血」',
        effect: {
          statsDelta: { energy: 4, purpose: -1, capital: 6, life: 7, impactScore: 6 },
        },
        outcomeText:
          '前兩週創辦人有點失落覺得大家變冷淡，但兩個月後發現準時開會討論出的點子品質反而更高，整個小團隊離職念頭少了一半。',
      },
      {
        id: 'reply_immediately',
        label: '怕漏掉關鍵訊息立刻爬起來回訊息並做筆記',
        sublabel: '成為創辦人最信賴的左右手，但睡眠品質持續惡化',
        effect: {
          statsDelta: { energy: -11, purpose: 2, capital: 4, life: -8, impactScore: 8 },
        },
        outcomeText:
          '創辦人逢人就誇你「超級可靠、跟他一樣把協會當自己的孩子」，只有你自己知道凌晨兩點盯著手機藍光的胃痛感。',
      },
    ],
  },
  {
    id: 'grass_viral_overload',
    title: '一篇粉專貼文意外爆紅：湧入十倍求助私訊卻沒有人力接住',
    category: 'work',
    tag: '爆紅與負荷',
    weight: 15,
    conditions: { orgTypes: ['grassroots', 'local_foundation'], excludeOutsideNPO: true },
    narrative:
      '你上週熬夜寫的真實故事貼文意外被上萬人轉發，捐款箱多進帳十幾萬元，但同時私訊信箱湧入兩百多封急切求助個案與媒體採訪邀約。你們整個協會只有四個專職，原本的服務行程已經排滿到下個月。',
    choices: [
      {
        id: 'scale_carefully',
        label: '誠實公告「目前接案量已達上限」，將這筆善款專款聘請兼職專業支援並串聯友會分流',
        sublabel: '守住服務品質不畫大餅，考驗對大眾期待的溝通',
        effect: {
          statsDelta: { energy: -7, purpose: 7, capital: 9, life: 0, impactScore: 15 },
          orgFinanceDelta: 1,
        },
        outcomeText:
          '雖然少數網友留言酸「募了錢還不接案」，但公開透明的人力拆解說明獲得多數定捐人理解，也讓協會首度有餘裕增聘半職人力。',
      },
      {
        id: 'absorb_all',
        label: '不忍心拒絕任何一個求助者，四人咬牙輪班消化所有私訊',
        sublabel: '短期救了不少人，團隊卻在兩個月後逼近集體耗竭',
        effect: {
          statsDelta: { energy: -16, purpose: 9, capital: 3, life: -9, impactScore: 17 },
        },
        outcomeText:
          '你們撐過了那兩個月，然而當熱度退去、定捐回落時，團隊裡有一位資深夥伴默默遞出了辭呈。',
      },
    ],
  },
  {
    id: 'grass_volunteer_boundary',
    title: '熱心大額志工干預第一線專業判斷',
    category: 'work',
    tag: '志工與專業衝突',
    weight: 14,
    conditions: { orgTypes: ['grassroots', 'local_foundation'], excludeOutsideNPO: true },
    narrative:
      '一位長年出錢又出力的資深志工阿姨，未經告知就私下給服務家庭留了電話並承諾「協會下週會買一台新冰箱送去」，甚至在檢討會當場質疑年輕社工「照規定評估太冷血」。',
    choices: [
      {
        id: 'educate_volunteer',
        label: '私下致謝後清楚說明「個案賦權與專業邊界」原則，訂立志工守則',
        sublabel: '冒著資深志工退團的風險保護個案與團隊專業',
        effect: {
          statsDelta: { energy: -7, purpose: 8, capital: 6, life: 0, impactScore: 11 },
        },
        outcomeText:
          '志工阿姨生氣了一個月沒來，但後來在你的邀請下參加了培訓課，終於理解直接塞物資與長期陪伴的差異。',
      },
      {
        id: 'smooth_over',
        label: '先順著阿姨面子把事情圓過去，叫內部自己補破網',
        sublabel: '保住人情與捐款來源，第一線同事感到未被支持',
        effect: {
          statsDelta: { energy: -6, purpose: -7, capital: 2, life: -1, impactScore: 5 },
        },
        outcomeText:
          '志工開心繼續幫忙募物資，但團隊內部開始出現「有錢有勢的志工說了算」的無力感。',
      },
    ],
  },
  {
    id: 'grass_take_gov_grant',
    title: '轉型十字路口：要不要開始接政府百萬委外標案？',
    category: 'work',
    tag: '財源依賴選擇',
    weight: 15,
    conditions: { orgTypes: ['grassroots'], excludeOutsideNPO: true, minTenure: 2 },
    narrative:
      '小額捐款成長見頂，政府剛好開出一個跟你們理念接近的兩百萬年度委外方案。接下去，大家明年至少不用再擔心發不出薪水；但一旦接了，未來三分之一工時都要拿來寫評鑑資料、貼發票粘存單，還要配合長官指定指標。',
    choices: [
      {
        id: 'accept_grant',
        label: '投標拿下政府方案，換取穩定的薪資與固定服務據點',
        sublabel: '組織走上制度化與核銷日常，降低斷炊焦慮',
        effect: {
          salaryDelta: 2500,
          orgFinanceDelta: 1,
          boardClimate: 'bureaucratic',
          statsDelta: { energy: -5, purpose: -2, capital: 7, life: 3, impactScore: 11 },
        },
        outcomeText:
          '標案順利過關，辦公室終於買了新印表機也調了基本薪。只是到了年底，大家看著厚如字典的核銷冊苦笑：「我們好像回不去了。」',
      },
      {
        id: 'stay_independent',
        label: '拒絕高行政成本標案，改推「百人定期定額小額募款計畫」',
        sublabel: '守住組織自主性，但募款壓力直接落在團隊肩上',
        effect: {
          statsDelta: { energy: -8, purpose: 9, capital: 6, life: -2, impactScore: 12 },
        },
        outcomeText:
          '你們跑了二十場社區分享會終於湊齊穩定定捐戶。錢不多，但每一場活動都能照著現場真正需要的樣子長出來。',
      },
    ],
  },

  // =========================================================================
  // 五、中大型社福機構專屬（5+）
  // =========================================================================
  {
    id: 'large_december_audit',
    title: '十二月核銷地獄：被退件四次的憑證與「消化預算」',
    category: 'work',
    tag: '標案核銷現場',
    weight: 18,
    conditions: { orgTypes: ['large_welfare', 'local_foundation'], excludeOutsideNPO: true },
    narrative:
      '距離年度結案只剩十天，主管機關承辦退回你們整箱結案憑證，理由是「講師交通費沒有附上高鐵電子車票購票證明影本」以及「剩下十二萬元活動費若沒在 12/20 前執行完畢明年將減編」。明明現場案量已經爆炸，督導卻要求全組擠出兩場趕工講座把預算花完。',
    choices: [
      {
        id: 'play_the_game',
        label: '加班重貼全部憑證，火速加開兩場充數講座保住明年預算額度',
        sublabel: '機構預算安全了，但對「形式主義」的懷疑深了一層',
        effect: {
          statsDelta: { energy: -11, purpose: -6, capital: 4, life: -5, impactScore: 6 },
        },
        outcomeText:
          '你練就了在 48 小時內生出百頁結案報告的神技，明年標案預算成功保住；只是看著垃圾桶裡剩下一半的便當，心裡五味雜陳。',
      },
      {
        id: 'redesign_useful_spend',
        label: '把剩餘款依法申請變更科目，採購真正急需的個案輔具與教材',
        sublabel: '跟公部門承辦來回公文扯皮半個月，但花得心安理得',
        effect: {
          statsDelta: { energy: -12, purpose: 8, capital: 8, life: -4, impactScore: 14 },
        },
        outcomeText:
          '你打了好幾通電話跟承辦解釋現場實況，奇蹟似地簽過經費流用同意函。那些原本要拿去請人吃便當的錢，最後變成了十幾個家庭的緊急生活補給包。',
      },
    ],
  },
  {
    id: 'large_salary_gap_admin',
    title: '衛福部社工加薪新制上路，行政與總務組卻持續凍薪',
    category: 'work',
    tag: '機構內部裂痕',
    weight: 16,
    conditions: { orgTypes: ['large_welfare'], excludeOutsideNPO: true },
    narrative:
      '政府補助方案調高了具證照社工的薪資基準，消息公布當天社工組歡呼；然而財務會計、總務司機與活動助理因為「不屬於直接專業人力補助項目」完全沒在調薪名單內，管銷比例限制也讓董事會不敢自掏腰包補齊。茶水間裡的氣氛冷到極點。',
    choices: [
      {
        id: 'advocate_all_staff_raise',
        label: '跨組連署向董事會與管理階層提案，動用民間自由募款替行政後勤同步調薪',
        sublabel: '站出來為後勤夥伴發聲，可能被高層貼上難搞標籤',
        effect: {
          statsDelta: { energy: -7, purpose: 10, capital: 7, life: 1, impactScore: 13 },
          salaryDelta: 1500,
        },
        outcomeText:
          '你們把「沒有行政核銷與接送車隊，社工根本無法跑外訪」的數據攤在理事會桌前，雖然沒全額齊頭調漲，但成功替後勤組爭取到每月兩千元的留任津貼。',
      },
      {
        id: 'focus_own_track',
        label: '保持沉默專心把自身考績顧好，私下多幫行政同事分擔文書',
        sublabel: '避免捲入組織政治，但優秀的老會計半年後還是離職了',
        effect: {
          statsDelta: { energy: -4, purpose: -5, capital: 2, life: 1, impactScore: 5 },
        },
        outcomeText:
          '老會計離職後，新來的行政因為不熟核銷規則連續出錯，全機構接下來半年反而付出了更高的溝通代價。',
      },
    ],
  },
  {
    id: 'large_high_risk_midnight',
    title: '週五晚上十一點的急件：高風險個案再次打來哭訴',
    category: 'work',
    tag: '情緒勞動與界線',
    weight: 17,
    conditions: {
      orgTypes: ['large_welfare', 'grassroots'],
      roles: ['social_worker', 'project_exec'],
      excludeOutsideNPO: true,
    },
    narrative:
      '剛準備熄燈睡覺，工作機（或更糟，私人手機）突然響起。長期輔導的脆弱家庭案主在電話那頭情緒崩潰，伴隨背景爭吵聲。113 與緊急值班線已經接手處理過一次，但案主只信任你，喊著「你不來我就不活了」。',
    choices: [
      {
        id: 'follow_emergency_protocol',
        label: '依危機處遇 SOP 同步通報 110／值班主管與警消介入，在電話上穩住情緒直到救援抵達',
        sublabel: '專業界線與人命之間的鋼索，深夜腎上腺素狂飆',
        effect: {
          statsDelta: { energy: -11, purpose: 7, capital: 8, life: -5, impactScore: 14 },
        },
        outcomeText:
          '你在客廳走來走去安撫了四十分鐘直到轄區員警與值班社工到場。掛斷電話後手還在發抖，但你知道只有建立團隊備援才不會兩個人一起沉下去。',
      },
      {
        id: 'rush_out_alone',
        label: '擔心通報流程太慢，自己換衣服騎車先衝去現場看看',
        sublabel: '展現高度同理心，卻暴露於人身安全與職業耗竭風險',
        effect: {
          statsDelta: { energy: -17, purpose: 5, capital: -2, life: -9, impactScore: 12 },
        },
        outcomeText:
          '雖然成功把案主帶去醫院急診，隔天卻被督導嚴厲檢討違反安全規範，自己也因此重感冒發燒躺了三天。',
      },
    ],
  },
  {
    id: 'large_media_witchhunt',
    title: '社會重大案件爆發：基層社工遭全網肉搜獵巫',
    category: 'work',
    tag: '結構性背鍋',
    weight: 15,
    conditions: { orgTypes: ['large_welfare'], excludeOutsideNPO: true, minTenure: 2 },
    narrative:
      '某縣市發生震驚全台的兒少／照顧悲劇事件，社會輿論瞬間炸鍋，新聞台整天重播「社福機構失靈」，連你們組織粉專也湧入大量留言謾罵「領善款不做事」。主管機關一面開記者會切割，一面發公文要求全國社福機構下週全面交回千份個案複查報告。',
    choices: [
      {
        id: 'join_solidarity_statement',
        label: '參與串聯跨機構基層聲明，公開指出「一比四十案量」才是系統破網元凶',
        sublabel: '替第一線說話找回職業尊嚴，頂著機構保守高層的壓力',
        effect: {
          statsDelta: { energy: -9, purpose: 12, capital: 8, life: -3, impactScore: 16 },
          milestoneTag: '參與社福基層結構改革公開連署',
        },
        outcomeText:
          '那份一萬多人轉發的聲明沒能立刻改變法規，但讓許多躲在辦公室哭泣的年輕社工知道自己不是孤單的代罪羔羊。',
      },
      {
        id: 'silent_compliance',
        label: '關閉社群留言、默默加班完成這輪「防呆自保式」全面訪視清查',
        sublabel: '減少正面風波，內心對大環境卻徹底冷了一半',
        effect: {
          statsDelta: { energy: -12, purpose: -8, capital: 2, life: -4, impactScore: 7 },
        },
        outcomeText:
          '你們照章補齊了兩百份簽名表交差。案主沒變安全，只是第一線的記錄時間又多被切走兩成。',
      },
    ],
  },
  {
    id: 'large_accreditation_pause',
    title: '機構三年一度大評鑑：停下服務兩週只為「裝訂資料」',
    category: 'work',
    tag: '評鑑文化',
    weight: 14,
    conditions: { orgTypes: ['large_welfare'], excludeOutsideNPO: true },
    narrative:
      '下個月主管機關將派五位外聘委員進駐機構評鑑，優等與否直接關係到明年是否能續約。全辦公室把會議室搬空，改用來排兩百個顏色統一的檔案夾，督導甚至下令「這兩週非緊急訪視先延後，先把去年少簽的督導紀錄補齊」。',
    choices: [
      {
        id: 'build_real_template',
        label: '藉這次整頓直接改掉冗餘表格，做一套平日就能自動累積證據的簡化系統',
        sublabel: '花額外腦力重整流程，希望下一次不用再集體演戲',
        effect: {
          statsDelta: { energy: -10, purpose: 4, capital: 9, life: -3, impactScore: 11 },
        },
        outcomeText:
          '最後還是拿到了優等。雖然這兩週同樣累到想吐，但你建立的數位化追蹤模板，確實幫團隊在下個年度省下三分之一文書時間。',
      },
      {
        id: 'sprint_paperwork',
        label: '照指示埋頭補齊漂亮封面與紙本簽章，撐完評鑑日就去大吃一頓',
        sublabel: '最省腦的務實做法，但強烈體會到文書荒謬感',
        effect: {
          statsDelta: { energy: -9, purpose: -5, capital: 3, life: -2, impactScore: 5 },
        },
        outcomeText:
          '評鑑委員翻了十五分鐘就笑著離開了，留下整間會議室你花兩週印出來、大概再也不會有人打開第二次的彩色檔案夾。',
      },
    ],
  },

  // =========================================================================
  // 六、議題倡議型 NGO 專屬（5+）
  // =========================================================================
  {
    id: 'adv_legislative_ambush',
    title: '立法院委員會突襲排審：連夜搶寫修法版本與說帖',
    category: 'work',
    tag: '國會倡議實戰',
    weight: 18,
    conditions: { orgTypes: ['advocacy_ngo'], excludeOutsideNPO: true },
    narrative:
      '原本以為這會期不會動的關鍵法案，傍晚六點突然出現在立法院後天早上的議程表，而且執政與在野各自塞進對環境／勞權／弱勢極度不利的條文。辦公室瞬間進入戰時狀態，明天早上七點半要帶五十份紙本說帖堵在委員會門口發給每位立委助理。',
    choices: [
      {
        id: 'all_night_warroom',
        label: '留守辦公室作戰到凌晨四點，逐條拆解反制條文並動員友團聯署',
        sublabel: '倡議者的腎上腺素高峰：有機會擋下惡法，但爆肝指數破表',
        effect: {
          statsDelta: { energy: -14, purpose: 13, capital: 10, life: -7, impactScore: 20 },
          setFlag: 'adv_legislative_battle',
          milestoneTag: '連夜備戰擋下國會關鍵爭議條文',
        },
        outcomeText:
          '早上八點頂著黑眼圈站在立法院群賢樓外發說帖，下午直播看到三位委員直接照著你們說帖第三頁的數字質詢官員，最後法案成功退回保留協商！',
      },
      {
        id: 'focused_media_brief',
        label: '集中火力寫兩頁精準新聞稿與圖卡鎖定關鍵記者，不搞盲目人海戰術',
        sublabel: '兼顧身心與傳播效率，風險是無法全面顧及所有條文',
        effect: {
          statsDelta: { energy: -7, purpose: 7, capital: 8, life: -1, impactScore: 13 },
        },
        outcomeText:
          '晚上十一點半準時下班回家睡覺，隔天早上六點精準搶下兩家主流網媒頭條版面，雖然條文沒全擋下，但至少迫使委員會加開一場公聽會。',
      },
    ],
  },
  {
    id: 'adv_greenwashing_sponsor',
    title: '一百萬贊助支票背後的「噤聲條件」',
    category: 'work',
    tag: '獨立性與財務拉鋸',
    weight: 17,
    conditions: { orgTypes: ['advocacy_ngo', 'grassroots'], excludeOutsideNPO: true },
    narrative:
      '組織今年小額定期定額流失嚴重，帳上只剩四個月營運費。這時某大型企業公關主動聯繫，表示願意捐助一百萬元支持你們的教育與社區計畫——唯一的附帶條件是：「未來一年貴會對我們集團在南部的新開發案或勞資爭議新聞稿，希望能先內部溝通、不要點名批評。」',
    choices: [
      {
        id: 'reject_dirty_money',
        label: '公開且體面地婉拒這筆百萬贊助，發動「百萬元獨立倡議急難募資」',
        sublabel: '守住組織靈魂與社會公信力，但下個月發薪要很拚',
        effect: {
          statsDelta: { energy: -9, purpose: 14, capital: 9, life: -3, impactScore: 18 },
          milestoneTag: '婉拒企業附條件百萬贊助守住獨立性',
        },
        outcomeText:
          '你們沒點名該企業，只發布一篇《為什麼小額捐款是我們唯一的底氣》長文，意外打動上千位新定捐人進場，湊齊了七十萬——沒拿滿百萬，但團隊士氣破表。',
      },
      {
        id: 'accept_compromise',
        label: '認為可切割專案界線，收下百萬先讓六位全職同事撐過今年再說',
        sublabel: '組織財務馬上喘口氣，但要面對內外對「被摸頭」的質疑',
        effect: {
          orgFinanceDelta: 2,
          statsDelta: { energy: 4, purpose: -12, capital: -4, life: 3, impactScore: 3 },
        },
        outcomeText:
          '帳目確實好看了許多，年終也發得出來；但三個月後該企業真的發生爭議時，辦公室裡那股說不出口的沉默，讓兩位老戰友陸續提了離職。',
      },
    ],
  },
  {
    id: 'adv_online_brigading',
    title: '粉專斷章取義遭網軍出征：一小時湧入三千則惡意留言',
    category: 'work',
    tag: '公共溝通危機',
    weight: 15,
    conditions: { orgTypes: ['advocacy_ngo', 'industrial_union'], excludeOutsideNPO: true },
    narrative:
      '昨天的立場聲明被特定粉專與政治側翼擷取其中一句話做梗圖，嘲諷你們是「收錢辦事的左膠／雙標團體」。一小時內 Google 評論被洗成一顆星，辦公電話甚至有人打來飆罵三字經，還出現十幾筆寫著「退捐」的來信。',
    choices: [
      {
        id: 'calm_factcheck',
        label: '穩住陣腳貼出完整原文與數據懶人包，不對罵、並設下員工接聽謾罵電話止損機制',
        sublabel: '考驗組織心理素質與危機公關定力',
        effect: {
          statsDelta: { energy: -8, purpose: 5, capital: 8, life: -2, impactScore: 12 },
        },
        outcomeText:
          '風暴延燒三天後退去，退捐數比想像中少，反而有不少長期讀者留言加油「就是因為看到你們沒跟著情緒起舞才繼續定期捐」。',
      },
      {
        id: 'fire_back_hard',
        label: '不甘受辱親自下場留言逐條筆戰，氣到連續兩天吃不下飯',
        sublabel: '情緒發洩了一時，演算法卻只把負面戰火越推越大',
        effect: {
          statsDelta: { energy: -14, purpose: -3, capital: -2, life: -7, impactScore: 5 },
        },
        outcomeText:
          '你贏了幾句嘴仗，卻把自己捲進無止盡的網路泥巴戰，耗光一個月的創作能量，連帶延誤了真正重要的政策研究進度。',
      },
    ],
  },
  {
    id: 'adv_bill_passed',
    title: '倡議五年的法案終於在立法院三讀通過',
    category: 'work',
    tag: '修法里程碑',
    weight: 13,
    conditions: { orgTypes: ['advocacy_ngo', 'industrial_union'], excludeOutsideNPO: true, minTenure: 4 },
    narrative:
      '從第一場十人不到的小記者會、無數次冷門公聽會到三次政黨輪替，這部你們推動了五年的關鍵法規終於在今晚排上院會三讀。議場二樓旁聽席上坐著歷任離職和現任的戰友，不過你知道，三讀版本被偷偷刪掉了最重要的一項罰則。',
    choices: [
      {
        id: 'celebrate_and_watchdog',
        label: '在立法院門口擁抱哭完這一晚，明天繼續寫「施行細則監督計畫」',
        sublabel: '台灣倡議者的宿命與榮光：沒有終點，只有下一階段',
        effect: {
          statsDelta: { energy: -4, purpose: 15, capital: 11, life: 4, impactScore: 24 },
          milestoneTag: '推動核心倡議法案完成立院三讀',
          roleLevelDelta: 1,
        },
        outcomeText:
          '議槌落下的那一刻整個旁聽席都紅了眼眶。雖然條文只拿回七成目標，但你知道幾百萬人的處境真的因為這幾年你們沒放棄而改寫了一小步。',
      },
      {
        id: 'critique_missing_tooth',
        label: '當場召開記者會嚴厲批判被閹割的罰則條文，拒絕替半套修法背書',
        sublabel: '維持極高批判標準，但讓辛苦陪跑的溫和盟友感到挫折',
        effect: {
          statsDelta: { energy: -7, purpose: 11, capital: 5, life: -2, impactScore: 17 },
          milestoneTag: '堅持完整修法標準公開發聲',
        },
        outcomeText:
          '新聞標題寫著「民團不滿半套修法抗議」，一部分當事人佩服你們毫不妥協的風骨，也有合作很久的學者私訊嘆氣說先肯定進步比較好推下一輪。',
      },
    ],
  },
  {
    id: 'adv_donor_fatigue',
    title: '政治與大選後捐款斷崖下跌：組織被迫縮編討論',
    category: 'work',
    tag: '募款低谷',
    weight: 14,
    conditions: { orgTypes: ['advocacy_ngo', 'grassroots'], excludeOutsideNPO: true },
    narrative:
      '大環境選後政治疲乏加上物價上漲，倡議型組織的小額定捐出現連續四個月淨流失。秘書長召集資深同仁開會：「如果不開拓新財源，明年要不是砍掉一個研究員缺，就是大家凍薪一年半。」',
    choices: [
      {
        id: 'launch_membership_value',
        label: '主導策劃「議題深度訂閱報告與實體沙龍」，把捐款人轉成深度社群',
        sublabel: '耗費極大企劃心力，但幫組織開出第二曲線財源',
        effect: {
          statsDelta: { energy: -10, purpose: 5, capital: 10, life: -3, impactScore: 12 },
          orgFinanceDelta: 1,
        },
        outcomeText:
          '前兩個月報名慘淡，但第三場地方沙龍意外爆滿，半年後定捐回穩了八成，保住了沒有任何人被資遣的底線。',
      },
      {
        id: 'freeze_salary_hold_on',
        label: '共體時艱同意暫緩調薪，同時向海外基金會申請專案補助救急',
        sublabel: '保住團隊完整編制，個人財務壓力跟著吃緊',
        effect: {
          statsDelta: { energy: -6, purpose: 3, capital: 4, life: -4, impactScore: 8 },
        },
        outcomeText:
          '大家默默簽了年度預算調整案。雖然今年沒有加薪也沒有年終，但至少沒有任何一個議題戰場被迫撤守。',
      },
    ],
  },

  // =========================================================================
  // 七、地方基金會 & 企業基金會／國際 NGO 專屬（6+）
  // =========================================================================
  {
    id: 'local_donor_pet_project',
    title: '創辦家族董事：「這個月把預算拿去辦我們家鄉的大型煙火嘉年華吧」',
    category: 'work',
    tag: '地方董事會政治',
    weight: 17,
    conditions: { orgTypes: ['local_foundation'], excludeOutsideNPO: true },
    narrative:
      '你花了半年培力偏鄉青年團隊才剛起步，某位掌控基金會主要捐款的家族董事卻在茶會上靈光一閃，要求把原定社區培力款項挪一半去辦「千人園遊會暨地方煙火節」，理由是「縣長跟地方民代比較看得到熱鬧場面」。',
    choices: [
      {
        id: 'repackage_for_impact',
        label: '順水推舟接下活動，但把「地方青年市集與成果展」塞成嘉年華主舞台',
        sublabel: '展現地方手腕：既有面子也替青年爭取到曝光與現金收入',
        effect: {
          statsDelta: { energy: -10, purpose: 4, capital: 10, life: -3, impactScore: 13 },
        },
        outcomeText:
          '縣長致詞剪綵後，董事開心拍你肩膀；更重要的是那二十幾個返鄉青創攤位那天總共賣出四十萬業績，比純補助更有底氣。',
      },
      {
        id: 'argue_against_waste',
        label: '在董事會拿影響力評估數據直球反對煙火式活動',
        sublabel: '守住公益純粹性，但得罪關鍵董事後資源空間急縮',
        effect: {
          statsDelta: { energy: -7, purpose: 8, capital: -2, life: 0, impactScore: 7 },
          boardClimate: 'factional',
        },
        outcomeText:
          '董事嘴上說「尊重專業」，但下半年你負責的青年案簽呈突然卡關兩個月才批下來，讓你深深體會地方脈絡的水有多深。',
      },
    ],
  },
  {
    id: 'corp_greenwash_pr',
    title: '母公司爆發勞資／環評公關危機：急需基金會辦「洗白公益活動」',
    category: 'work',
    tag: '企業永續矛盾',
    weight: 18,
    conditions: { orgTypes: ['corp_intl_ngo'], excludeOutsideNPO: true },
    narrative:
      '母公司上週才因排廢或過勞裁員上新聞，今天公關部主管就急電基金會，要求兩週內找五十個偏鄉孩童或社區長輩拍一支「企業愛心溫暖台灣」形象廣告，預算無上限只求快，標題最好還能壓過負面搜尋結果。',
    choices: [
      {
        id: 'push_internal_reform_condition',
        label: '拒絕消費弱勢拍速成形象片，提案改做實質賠償與社區透明監督基金',
        sublabel: '極可能被母企業邊緣化，但守住最後的公益良知',
        effect: {
          statsDelta: { energy: -9, purpose: 12, capital: 5, life: -2, impactScore: 15 },
          boardClimate: 'factional',
          milestoneTag: '在企業基金會內部拒拍公關洗白廣告',
        },
        outcomeText:
          '公關副總氣到直接跳過你找外部廣告公司處理，但你的直屬執行長私下肯定你的骨氣，甚至順勢說服董事會撥了一筆真實改善預算。',
      },
      {
        id: 'execute_professionally',
        label: '拿錢辦事，確保在執行過程中對服務對象給足尊重與實質物資資源',
        sublabel: '領著不錯薪水的務實選擇，心裡慢慢學會把工作和靈魂拆開',
        effect: {
          statsDelta: { energy: -4, purpose: -9, capital: 6, life: 3, impactScore: 4 },
        },
        outcomeText:
          '廣告在電視與社群上大獲好評，你的年度績效拿到 A 等與兩個月年終；只有原本待過草根協會的同事在茶水間苦笑問：「我們現在算在做哪一行的？」',
      },
    ],
  },
  {
    id: 'intl_hq_kpi_clash',
    title: '國際總部要求套用歐美 KPI 模板，台灣現場完全水土不服',
    category: 'work',
    tag: '在地化張力',
    weight: 16,
    conditions: { orgTypes: ['corp_intl_ngo'], excludeOutsideNPO: true },
    narrative:
      '亞太區域總部下達年度指標，要求台灣分會三個月內複製一份在東南亞大獲成功的「街頭連署與社區動員專案」，但他們忽略了台灣法規、都會通勤習慣與本地已經有成熟草根夥伴。總部副總只看英文報表上的完成率。',
    choices: [
      {
        id: 'translate_and_partner',
        label: '花兩倍時間寫英文分析說服總部改版，並把經費轉分包給台灣在地小協會協力',
        sublabel: '發揮大型分會「資源轉譯與橋樑」的最大價值',
        effect: {
          statsDelta: { energy: -11, purpose: 9, capital: 11, life: -4, impactScore: 17 },
          milestoneTag: '成功爭取國際資源在地轉譯並分包草根夥伴',
        },
        outcomeText:
          '熬了三個跨時區深夜簡報終於說服總部放行「台灣修改版」。這筆資源最後實際養活了兩個原本快斷炊的地方小團體。',
      },
      {
        id: 'deliver_hq_numbers',
        label: '乖乖照總部劇本跑完漂亮指標交英語簡報，省下跨國爭辯的力氣',
        sublabel: 'KPI 滿分升遷穩當，但感覺自己離真實現場越來越遠',
        effect: {
          statsDelta: { energy: -3, purpose: -6, capital: 5, life: 4, impactScore: 5 },
          salaryDelta: 1500,
        },
        outcomeText:
          '總部在季報會議上大讚台灣分會執行率第一名，只有你自己知道那場活動裡八成參與者只是來領禮品的路人。',
      },
    ],
  },

  // =========================================================================
  // 八、跨組織共通、升遷與轉職分岔點（8+）
  // =========================================================================
  {
    id: 'common_colleague_quit',
    title: '同期夥伴突襲離職：「這個位置一人扛兩人的份先頂半年」',
    category: 'work',
    tag: '人力斷層衝擊',
    weight: 16,
    conditions: { excludeOutsideNPO: true },
    narrative:
      '和你一起並肩作戰兩年的同事撐不住低薪與過勞遞出辭呈，一個月後離職。然而人力銀行掛了三週只有兩封不符資格的履歷，主管拍拍你肩膀說：「現在大環境不好找人，他的業務先由你代理到這季結束，我們一定加速徵才。」結果你心裡隱約覺得這個「暫代」會變成常態。',
    choices: [
      {
        id: 'negotiate_scope_cut',
        label: '明確列出「接手 A 案就必須暫停 B 案」，逼組織正視人力承載上限',
        sublabel: '打破 NPO「能者過勞」潛規則，雖然主管臉色不好看',
        effect: {
          statsDelta: { energy: -5, purpose: 2, capital: 8, life: 3, impactScore: 8 },
        },
        outcomeText:
          '主管被迫自己下來扛一部分聯絡工作並主動把薪資級距調高三千元重新招募，兩個月後終於補進一位合適的新夥伴。',
      },
      {
        id: 'carry_both_roles',
        label: '怕原本經手的{targetNoun}與業務沒人接手，咬牙把兩個人的工作量一肩扛下',
        sublabel: '成為組織不可或缺的救火隊，代價是身心劇烈透支',
        effect: {
          statsDelta: { energy: -16, purpose: 3, capital: 5, life: -10, impactScore: 11 },
          salaryDelta: 1000,
        },
        outcomeText:
          '你真的撐完了半年，主管也「順理成章」把那個職缺預算收回省錢了。只是每到週日晚上想到明天要上班就開始反胃。',
      },
    ],
  },
  {
    id: 'promo_mid_welfare',
    title: '升遷的誘惑與代價：社工督導與方案組長職缺空出來了',
    category: 'work',
    tag: '社福管理門檻',
    weight: 16,
    conditions: {
      orgTypes: ['large_welfare', 'grassroots', 'local_foundation'],
      excludeOutsideNPO: true,
      minTenure: 3,
      maxRoleLevel: 1,
    },
    narrative:
      '原單位督導離職轉進公部門，執行長約談你：「我們最放心交給你帶社工與企劃團隊，月薪可以加三千五百元！」但你心知肚明，一旦接下督導與組長職，除了原本個案與方案放不掉，還要天天盯核銷憑證、幫新人扛高風險通報壓力與假日外賓接待。',
    choices: [
      {
        id: 'accept_welfare_mid',
        label: '接下社工督導與組長職！替第一線年輕同仁擋下不合理指標',
        sublabel: '加薪 $3,500、職級晉升，從實務執行蛻變為團隊守門人',
        effect: {
          roleLevelDelta: 1,
          salaryDelta: 3500,
          statsDelta: { energy: -10, purpose: 5, capital: 12, life: -6, impactScore: 14 },
          milestoneTag: '晉升社福組織督導管理職',
        },
        outcomeText:
          '第一季每天都在看別人的個案紀錄與核銷單據中度過，但當你成功替一位快崩潰的新進社工調降案量時，開始體會到管理位置的價值。',
      },
      {
        id: 'stay_welfare_frontline',
        label: '婉拒督導缺，留在第一線深耕直接服務與外部授課路線',
        sublabel: '少賺一點主管加給，卻保住下班時間與直接服務的純粹',
        effect: {
          statsDelta: { energy: 4, purpose: 5, capital: 4, life: 7, impactScore: 8 },
        },
        outcomeText:
          '機構另外空降了一位督導進來，雖然初期磨合有點卡，但你多了不少時間整理實務案例，開始接到學校與友會的分享邀約。',
      },
    ],
  },
  {
    id: 'promo_mid_society_adv',
    title: '升遷的誘惑與代價：副秘書長與部門主任職缺空出來了',
    category: 'work',
    tag: '會務與倡議管理',
    weight: 16,
    conditions: {
      orgTypes: ['academic_society', 'advocacy_ngo', 'corp_intl_ngo'],
      excludeOutsideNPO: true,
      minTenure: 3,
      maxRoleLevel: 1,
    },
    narrative:
      '前任主任或副秘書長離任，{bossTitle}約談你：「組織最放心交給你統籌年會、倡議與對外募款進度，月薪可以加三千五百元！」一旦接下這個位置，白天要應付理事會與新聞媒體，晚上還要幫專員改公文與盯進度。',
    choices: [
      {
        id: 'accept_society_adv_mid',
        label: '接下副秘書長重任！練習向上溝通理監事並保護底下專員工時',
        sublabel: '加薪 $3,500、職級晉升，開始參與組織核心決策',
        effect: {
          roleLevelDelta: 1,
          salaryDelta: 3500,
          statsDelta: { energy: -10, purpose: 5, capital: 12, life: -6, impactScore: 14 },
          milestoneTag: '晉升副秘書長與部門主管職',
        },
        outcomeText:
          '你學會了在理監事會議與立院行程之間穿梭協調，成功幫專員擋下好幾件毫無意義的臨時交辦。',
      },
      {
        id: 'stay_specialist_track',
        label: '婉拒行政管理缺，專心走深耕研究與專業執行路線',
        sublabel: '少賺一點主管加給，保住專注思考與生活界線',
        effect: {
          statsDelta: { energy: 4, purpose: 5, capital: 4, life: 7, impactScore: 8 },
        },
        outcomeText:
          '你選擇繼續當一名精銳資深專員，把繁瑣的理事應酬留給別人，下班後也能完整保留自己的生活。',
      },
    ],
  },
  {
    id: 'promo_mid_union',
    title: '升遷的誘惑與代價：工會會務組長與資深秘書缺出缺',
    category: 'work',
    tag: '工會幹部升遷',
    weight: 16,
    conditions: {
      orgTypes: ['industrial_union', 'occupational_union'],
      excludeOutsideNPO: true,
      minTenure: 3,
      maxRoleLevel: 1,
    },
    narrative:
      '資深秘書退休或轉任勞工局，工會理事會決議推舉你升任組長級資深幹部，月薪加三千五百元，統籌全會勞資調解、職訓核銷與會員大會動員。只是接下去得同時面對資方壓力與理事會各派系的電話關切。',
    choices: [
      {
        id: 'accept_union_mid',
        label: '接下組長位置！把多年實戰的談判與會務制度化教給新人',
        sublabel: '加薪 $3,500、職級晉升，成為工會秘書處的核心骨幹',
        effect: {
          roleLevelDelta: 1,
          salaryDelta: 3500,
          statsDelta: { energy: -10, purpose: 6, capital: 12, life: -6, impactScore: 14 },
          milestoneTag: '晉升工會組長級資深秘書',
        },
        outcomeText:
          '你一面扛起重大爭議調解主談，一面替工會新人建立系統化的案件追蹤表，讓秘書處不再完全依賴個人經驗。',
      },
      {
        id: 'stay_union_frontline',
        label: '婉拒統籌管理缺，專心顧好手上的廠區服務或勞健保櫃檯',
        sublabel: '避開理監事派系角力漩渦，維持生活穩定',
        effect: {
          statsDelta: { energy: 4, purpose: 4, capital: 4, life: 7, impactScore: 8 },
        },
        outcomeText:
          '你不碰派系協調，專心把手邊每一件會員職災與調解辦到漂亮，成了會員心裡最踏實的老面孔。',
      },
    ],
  },
  {
    id: 'promo_top_foundation',
    title: '組織靈魂出缺：董事會推舉你接任「執行長」',
    category: 'work',
    tag: '基金會最高執行職',
    weight: 15,
    conditions: {
      orgTypes: ['large_welfare', 'local_foundation', 'corp_intl_ngo'],
      excludeOutsideNPO: true,
      minTenure: 6,
      maxRoleLevel: 2,
      minCapital: 45,
    },
    narrative:
      '歷任執行長正式退休或卸任，幾位核心董事一致看向你：「這個機構沒有人比你更熟悉帳務、評鑑與第一線服務現場了，由你來接任執行長，大家才安心。」接下這份聘書，代表全體員工下個月的發薪水壓力與募款目標將直接壓在你肩上。',
    choices: [
      {
        id: 'take_ceo_seat',
        label: '扛起執行長大任，推動機構薪資結構與合理案量改革',
        sublabel: '登頂基金會最高專職位置，為整個機構定調未來十年',
        effect: {
          roleLevelDelta: 2,
          salaryDelta: 6500,
          statsDelta: { energy: -12, purpose: 10, capital: 14, life: -7, impactScore: 22 },
          milestoneTag: '接任基金會專任執行長',
        },
        outcomeText:
          '接任執行長第一個月，你做的第一件事不是拍照發新聞，而是重算明年全員留任加給與補休制度。從此以後每個月看帳戶餘額時再也沒人替你扛。',
      },
      {
        id: 'decline_ceo_seat',
        label: '誠實評估健康與家庭需求婉拒，願擔任資深處長輔助新任執行長',
        sublabel: '體面退出募款高壓中心，守住家庭與身心餘裕',
        effect: {
          statsDelta: { energy: 6, purpose: 2, capital: 5, life: 9, impactScore: 9 },
        },
        outcomeText:
          '董事會雖有些遺憾，仍尊重你的清醒選擇。你成為團隊裡最穩定的定海神針，不必承擔全部募款壓力，依舊守住服務品質。',
      },
    ],
  },
  {
    id: 'promo_top_association',
    title: '組織靈魂出缺：理監事會推舉你接任專任「秘書長」',
    category: 'work',
    tag: '社團法人最高幕僚',
    weight: 15,
    conditions: {
      orgTypes: ['grassroots', 'advocacy_ngo', 'academic_society'],
      excludeOutsideNPO: true,
      minTenure: 6,
      maxRoleLevel: 2,
      minCapital: 45,
    },
    narrative:
      '歷經數屆理事長更迭，前任秘書長正式交棒。理監事會一致決議推舉你擔任專任秘書長：「全會沒有人比你更懂內政部人團法規、財報帳本與現場推進，這個擔子只能請你來接。」',
    choices: [
      {
        id: 'take_sg_seat',
        label: '接下專任秘書長重擔，替協會與會員社群立下永續制度',
        sublabel: '成為真正握有決策權與制度記憶的核心舵手',
        effect: {
          roleLevelDelta: 2,
          salaryDelta: 6500,
          statsDelta: { energy: -12, purpose: 10, capital: 14, life: -7, impactScore: 22 },
          milestoneTag: '接任社團法人專任秘書長',
        },
        outcomeText:
          '從小專員一路走到秘書長，你第一次把辦公室裡那些口耳相傳的潛規則寫成白紙黑字的制度與勞權條款。',
      },
      {
        id: 'decline_sg_seat',
        label: '評估體力與私人時間婉拒全責，改當資深顧問協助新任團隊',
        sublabel: '保有下班空間與自主性，持續發揮老手經驗',
        effect: {
          statsDelta: { energy: 6, purpose: 2, capital: 5, life: 9, impactScore: 9 },
        },
        outcomeText:
          '你笑著把總指揮棒交給下一棒，自己退居側翼替大家看住預算與法律底線。',
      },
    ],
  },
  {
    id: 'promo_top_union',
    title: '組織靈魂出缺：工會理事會推舉你接任「工會總幹事」',
    category: 'work',
    tag: '工會最高專職',
    weight: 15,
    conditions: {
      orgTypes: ['industrial_union', 'occupational_union'],
      excludeOutsideNPO: true,
      minTenure: 6,
      maxRoleLevel: 2,
      minCapital: 45,
    },
    narrative:
      '多年來陪著會員打調解、守櫃檯與衝抗爭，如今工會總幹事缺出。理監事會推舉你正式升任工會總幹事，統籌秘書處預算、勞動政策發聲與跨工會串聯，但也得全面承接工會內部民主政治的砲火。',
    choices: [
      {
        id: 'take_union_chief',
        label: '接任工會總幹事！把秘書處勞動保障與抗爭基金制度一起拉起來',
        sublabel: '登頂工會專職核心，撐起更多基層勞工的安全網',
        effect: {
          roleLevelDelta: 2,
          salaryDelta: 6500,
          statsDelta: { energy: -12, purpose: 11, capital: 14, life: -7, impactScore: 22 },
          milestoneTag: '接任工會專任總幹事',
        },
        outcomeText:
          '接任當天你先替秘書處同事簽下明確補休與加班保障條款，然後才回過頭帶領全會迎戰下一場勞資談判。',
      },
      {
        id: 'decline_union_chief',
        label: '婉拒總幹事政治風暴位置，專注守住勞教培力與實務諮詢角色',
        sublabel: '減少內部派系耗損，細水長流陪勞工走下去',
        effect: {
          statsDelta: { energy: 6, purpose: 3, capital: 5, life: 9, impactScore: 9 },
        },
        outcomeText:
          '你退回實務顧問位置，少了無止盡的理監事電話協調，反而更能專心培訓新世代年輕工運秘書。',
      },
    ],
  },
  {
    id: 'common_cross_sector_offer',
    title: '友會挖角：完全不同的組織生態向你招手',
    category: 'work',
    tag: '跨組織流動',
    weight: 13,
    conditions: { excludeOutsideNPO: true, minTenure: 2 },
    narrative:
      '因為在跨團體會議上表現亮眼，一間規模與性質完全不同的組織理事長私下約你喝咖啡，開出比現在多四千元的月薪邀請你轉戰該會擔任核心幕僚：「我們很缺像你這樣懂制度又懂現場的人。」',
    choices: [
      {
        id: 'jump_to_society_or_advocacy',
        label: '趁機換跑道！體驗台灣非營利部門另一種組織生態',
        sublabel: '月薪 +$4,000、轉換為專業學會或大型體系，重設職涯視野',
        effect: {
          salaryDelta: 4000,
          changeOrgType: 'academic_society',
          changeRole: 'society_secretary',
          statsDelta: { energy: 2, purpose: 3, capital: 8, life: 2, impactScore: 10 },
          milestoneTag: '跨界轉任專業學會核心會務',
        },
        outcomeText:
          '你辦妥交接走進另一棟大樓的辦公室。雖然一樣要對付理監事與年度預算，但換了一個視角看台灣民間部門，頓時又多出幾年新鮮能量。',
      },
      {
        id: 'jump_to_union_or_welfare',
        label: '轉戰大型全國性社福機構，累積更扎實的制度履歷',
        sublabel: '月薪 +$4,500、進入更具規模的組織平台',
        effect: {
          salaryDelta: 4500,
          changeOrgType: 'large_welfare',
          changeRole: 'project_exec',
          statsDelta: { energy: -2, purpose: 4, capital: 9, life: 3, impactScore: 11 },
          milestoneTag: '轉任大型全國性社福機構骨幹',
        },
        outcomeText:
          '離開小團隊的不捨只持續了一週，看到新單位有明確的分層授權與準時發放的三節獎金，你還是忍不住鬆了一口氣。',
      },
      {
        id: 'stay_put_for_now',
        label: '手邊正在推動的案子還放不下，婉拒挖角繼續留在原組織',
        sublabel: '保留深厚情誼與組織信任，把成果留給原單位',
        effect: {
          statsDelta: { energy: -2, purpose: 6, capital: 3, life: 1, impactScore: 8 },
        },
        outcomeText:
          '同事聽說你推掉高薪挖角留下來都很感動，只是每當月底帳單寄來時，偶爾還是會閃過「當時是不是該答應去吃那頓飯」的念頭。',
      },
    ],
  },
  {
    id: 'common_esg_headhunter',
    title: '獵人頭來電：上市企業 ESG 永續部門開出「月薪加兩萬」',
    category: 'intertwined',
    tag: '職涯大分岔點',
    weight: 6,
    conditions: {
      excludeOutsideNPO: true,
      roles: ['corp_esg_officer', 'fundraiser_pr', 'advocacy_researcher', 'project_exec', 'society_secretary'],
      minTenure: 5,
      minCapital: 58,
    },
    narrative:
      '隨著金管會擴大永續報告書規範，一位科技業獵人頭在 LinkedIn 找到你：「我們注意到你在{orgNoun}累積多年{sectorFocus}與跨界溝通實績，客戶開出月薪六萬以上加上十四個月年終，找你當企業 ESG 永續經理。」你看著自己的存款數字與這幾年漲不停的房租，陷入漫長的沉默。',
    choices: [
      {
        id: 'pivot_to_esg',
        label: '點頭轉戰企業 ESG 永續部門！先改善生活與家人經濟安全感',
        sublabel: '實質進入企業端（月薪大幅躍升），從體制外改從甲方視角看生態',
        effect: {
          enterOutsideNPO: {
            orgName: '星辰光電股份有限公司 · 永續發展處',
            role: 'corp_esg_officer',
            newSalary: 62000,
          },
          statsDelta: { energy: 8, purpose: -8, capital: 10, life: 12, impactScore: 6 },
          setFlag: 'entered_corp_esg',
          milestoneTag: '轉戰上市企業 ESG 永續部門',
        },
        outcomeText:
          '交接完最後一本核銷冊走出協會大門那天，你在便利商店買了兩罐啤酒。進科技公司第一天領到配發筆電與免費咖啡時，震撼於同樣一天八小時的報酬竟能差這麼多。',
      },
      {
        id: 'stay_in_npo_field',
        label: '禮貌回絕獵人頭，把民間組織當作自己真正想待的戰場',
        sublabel: '維持原薪水水準，內心對自己為何留下的答案更加清晰',
        effect: {
          statsDelta: { energy: -3, purpose: 12, capital: 4, life: -3, impactScore: 14 },
        },
        outcomeText:
          '你回覆獵人頭「謝謝肯定，但這裡還有幾件我想親自陪完的事」。關掉對話框後心情意外平靜，雖然隔天還是要繼續面對難搞的核銷憑證。',
      },
      {
        id: 'pivot_and_exit_end',
        label: '接受高薪轉職並正式為這段非營利職涯畫下體面句點',
        sublabel: '【直接結算】以「成功跨界轉職企業」作為本段 NPO 職涯結局',
        effect: {
          enterOutsideNPO: {
            orgName: '星辰光電股份有限公司 · 永續發展處',
            role: 'corp_esg_officer',
            newSalary: 64000,
          },
          statsDelta: { energy: 10, purpose: -4, capital: 10, life: 12, impactScore: 6 },
          endGameReason: 'pivoted_to_corp',
          milestoneTag: '自民間團體跨界轉任企業永續管理職',
        },
        outcomeText:
          '你沒有愧疚感地整理好所有交接手冊。待過第一線的人並不虧欠這個圈子一輩子，帶著對現場的理解走向下一個人生階段，也是一種完結。',
      },
    ],
  },
  {
    id: 'outside_corp_return_call',
    title: '身在企業冷氣房，老戰友傳來「新組織缺秘書長」的邀請',
    category: 'intertwined',
    tag: '回鍋兩難',
    weight: 20,
    conditions: { onlyOutsideNPO: true },
    narrative:
      '轉進企業永續部門後，存款終於穩步上升、也準時下班吃晚餐了，但整天盯著碳盤查表格與公關稿的日子偶爾讓你覺得空虛。這天兩位以前在民間團體的老同事約你吃飯，說他們與一群實務者剛成立一個新的民間倡議組織，想請你回去當專任秘書長，月薪只能給到四萬六。',
    choices: [
      {
        id: 'return_to_npo',
        label: '帶著在企業存到的預備金與管理能力，重返非營利第一線！',
        sublabel: '月薪降回 $48,000，職級升為秘書長，心靈重新燃起火花',
        effect: {
          returnToNPO: {
            orgType: 'advocacy_ngo',
            role: 'advocacy_researcher',
            newSalary: 48000,
          },
          roleLevelDelta: 1,
          statsDelta: { energy: -6, purpose: 18, capital: 8, life: -4, impactScore: 20 },
          milestoneTag: '自企業永續部門帶著資本重返民間組織',
        },
        outcomeText:
          '大家都笑你瘋了，放棄六七萬的企業年薪回去吹風曬太陽。只有你知道，經過那段喘息期存下來的財務底氣，讓你這次回來終於不必再委屈求全。',
      },
      {
        id: 'stay_outside_and_donate',
        label: '婉拒全職回鍋，改當該會不支薪理事並每月固定大額捐款支持',
        sublabel: '留在商界維持高生活安全感，換個位置做資源後盾',
        effect: {
          statsDelta: { energy: 5, purpose: 6, capital: 5, life: 7, impactScore: 10 },
          savingsDelta: -12000,
        },
        outcomeText:
          '你替新成立的協會捐了一筆開辦費，並在下班後幫他們審年度預算表。或許換成「穩定的外部盟友」，才是你最能長久陪伴的方式。',
      },
    ],
  },
  {
    id: 'outside_corp_greenwashing_dilemma',
    title: '永續報告書的「數據美化」壓力：昔日民間戰友點名抗議母公司',
    category: 'intertwined',
    tag: '企業漂綠考驗',
    weight: 22,
    conditions: { onlyOutsideNPO: true },
    narrative:
      '坐在上市科技公司舒適的辦公區裡，新聞突然跳出民間團體聯合記者會——點名你們母公司供應鏈的減碳與外包勞動條件言行不一，帶隊的還是你以前社團圈的老朋友。一小時後公關處緊急找你開會：「你在民間混過那麼久，趕快幫我們寫一篇有說服力的永續澄清稿滅火。」',
    choices: [
      {
        id: 'push_internal_reform',
        label: '拒絕單純公關消毒，拿出供應鏈實測證據在內部會議逼高層改善問題',
        sublabel: '可能得罪部門主管，但真正動用甲方內部權力修補漏洞',
        effect: {
          statsDelta: { energy: -9, purpose: 10, capital: 8, life: -3, impactScore: 16 },
          milestoneTag: '在企業 ESG 部門內部成功推動實質供應鏈改善',
        },
        outcomeText:
          '會議室氣氛凝結了五分鐘，但你列出的風險分析讓總經理最後點頭撥預算調整外包規範。這份在企業內部守住的底線，比外界任何鼓掌都真實。',
      },
      {
        id: 'write_safe_pr_response',
        label: '領人薪水替人消災，撰寫四平八穩的標準法遵回應聲明先度過輿論浪頭',
        sublabel: '職場表現安穩過關，卻感覺原本體內的某些熱血徹底冷卻下來',
        effect: {
          statsDelta: { energy: 2, purpose: -11, capital: 4, life: 4, impactScore: 2 },
        },
        outcomeText:
          '聲明發出後董事會很滿意。只是當晚經過以前常去開會的路口時，你第一次不敢聯絡老朋友出來喝一杯。',
      },
    ],
  },
  {
    id: 'outside_corp_grantmaking_power',
    title: '換坐甲方評審桌：手握企業百萬公益預算的分配權',
    category: 'intertwined',
    tag: '資源分配兩難',
    weight: 22,
    conditions: { onlyOutsideNPO: true },
    narrative:
      '年度企業永續公益預算審查季開跑，桌上擺著三十多份來自台灣各地民間組織的補助申請書。行銷部希望挑幾個「能跟大明星同框、新聞版面好看」的大案子；但你在最底下看到幾個沒有知名代言人、卻在地方真正缺錢苦撐的小協會與工會方案。',
    choices: [
      {
        id: 'fund_grassroots_quietly',
        label: '發揮甲方專業影響力，設計「三年期基礎營運補助」力挺缺資源的小組織',
        sublabel: '用企業資本彌補過去最痛恨的「短視專案核銷」文化',
        effect: {
          statsDelta: { energy: -5, purpose: 13, capital: 9, life: 2, impactScore: 18 },
          milestoneTag: '運用企業 ESG 公益資源扶植草根實務現場',
        },
        outcomeText:
          '你替這幾個小團體擋掉了繁複的形象打卡要求，讓他們把錢實實在在用在專職人事費上——這也是你轉戰商界後最接近理想的一天。',
      },
      {
        id: 'pick_pr_friendly_projects',
        label: '配合行銷與公關部門 KPI，挑選視覺與曝光效益最強的合作案交差',
        sublabel: '年度績效考核滿分，對部門同事來說是最省力的合作夥伴',
        effect: {
          statsDelta: { energy: 4, purpose: -7, capital: 5, life: 4, impactScore: 6 },
        },
        outcomeText:
          '成果發表會辦得冠蓋雲集，你的季度獎金拿得很穩，只是夜深人靜看著那幾個被退件的小團體名字，還是嘆了口氣。',
      },
    ],
  },
  {
    id: 'common_public_sector_recruit',
    title: '轉職另一扇門：縣市政府開出「約聘督導／專員」穩定薪點職缺',
    category: 'intertwined',
    tag: '公部門轉出契機',
    weight: 8,
    conditions: {
      excludeOutsideNPO: true,
      roles: ['social_worker', 'union_admin', 'union_organizer', 'project_exec', 'admin_finance'],
      minTenure: 4,
      minCapital: 45,
    },
    narrative:
      '多年在{orgNoun}與公部門承辦窗口打交道的專業能力被局處主管看見。縣市政府社會局或勞工局私下詢問你有沒有意願應徵約聘督導與專案專員——依照公部門薪點起敘立刻加薪七千五百元、見紅就休、不用再靠小額募款擔心組織斷炊，但從此必須改坐在公部門審查桌的另一側。',
    choices: [
      {
        id: 'pivot_to_public_sector_end',
        label: '點頭轉赴公部門體制！以穩定的薪點與見紅就休展開人生下一階段',
        sublabel: '【直接結算】以「轉任公部門約聘督導與專員」為本段民間職涯畫下句點',
        effect: {
          salaryDelta: 7500,
          statsDelta: { energy: 8, purpose: -3, capital: 8, life: 10, impactScore: 8 },
          setFlag: 'pivoted_to_public_sector',
          endGameReason: 'pivoted_to_corp',
          milestoneTag: '自民間現場轉任縣市政府約聘督導與專員',
        },
        outcomeText:
          '交接完民間組織所有卷宗走向市政大樓報到那天，你暗自決定：坐上審查桌之後，至少不能變成當年自己最討厭的那種只看發票核銷的官僚。',
      },
      {
        id: 'leverage_offer_with_org',
        label: '婉拒公部門聘書，但藉機拿這份待遇行情與組織談留任調薪與補休保障',
        sublabel: '成功撬開微幅加薪 $2,000，同時留住第一線實踐空間',
        effect: {
          salaryDelta: 2000,
          statsDelta: { energy: -2, purpose: 6, capital: 5, life: 2, impactScore: 8 },
        },
        outcomeText:
          '主管聽完你差點去公部門後連忙開出兩千元留任調整——雖然還是比外面少，但至少看見組織終於願意正視人才流失的代價。',
      },
      {
        id: 'stay_frontline_independence',
        label: '婉拒體制內公文與長官指示文化，繼續留在民間保持直接行動與批判自由',
        sublabel: '薪水維持原狀，但守住民間組織獨有的彈性與獨立立場',
        effect: {
          statsDelta: { energy: -3, purpose: 9, capital: 4, life: 0, impactScore: 12 },
        },
        outcomeText:
          '想到進公部門後很多話不能說、很多案子只能照法條跑，你笑著回絕了邀約，轉頭繼續準備下週現場的會議資料。',
      },
    ],
  },
  {
    id: 'local_township_politics',
    title: '地方派系與鎮公所合辦活動：上台致詞名單比社區方案還敏感',
    category: 'work',
    tag: '地方生態現場',
    weight: 16,
    conditions: { orgTypes: ['local_foundation'], excludeOutsideNPO: true },
    narrative:
      '年度社區營造博覽會前一天，縣議員辦公室突然來電關切舞台排座與致詞順序，還要求將活動主視覺加上地方派系聯誼會的協辦字樣。你們明明是無黨派公益基金會，但鎮公所的場地與水電借用還卡在對方手上。',
    choices: [
      {
        id: 'protocol_balance',
        label: '依「場地提供與實質協力單位」公開原則安排席次，拒絕政治掛名但給足禮貌接待',
        sublabel: '守住中立原則與地方和氣，需要極高圓融技巧',
        effect: {
          statsDelta: { energy: -8, purpose: 6, capital: 8, life: -1, impactScore: 11 },
        },
        outcomeText:
          '你親自去服務處送邀請函並說明基金會捐助章程對政治中立的限制，最後對方只來現場拍了張照便離席，活動主角依然留給了地方長輩與孩子。',
      },
      {
        id: 'keep_clean_venue',
        label: '寧可自己多花兩萬元租民間廟埕或學校操場，徹底切割地方政治人情',
        sublabel: '減少內耗卻多出一筆預料外的場地費壓力',
        effect: {
          statsDelta: { energy: -5, purpose: 9, capital: 3, life: 2, impactScore: 10 },
          orgFinanceDelta: -1,
        },
        outcomeText:
          '雖然活動經費更緊了，但整場成果展沒有半句政令宣導，社區媽媽們笑得比往年都要自在。',
      },
    ],
  },
  {
    id: 'local_endowment_yield_drop',
    title: '地方基金會母金孳息縮水：年度獎助學金與社造補助面臨對半砍',
    category: 'work',
    tag: '基金會財源挑戰',
    weight: 15,
    conditions: { orgTypes: ['local_foundation', 'corp_intl_ngo'], excludeOutsideNPO: true },
    narrative:
      '今年定存與股利配息不如預期，董事會通知明年可動支的公益孳息少掉三成。然而縣內四間偏鄉小學的課輔班和兩個文史保存團隊都正指望你們的續約補助過日子。',
    choices: [
      {
        id: 'crowdfund_match',
        label: '發起「在地企業與鄉親 1:1 相對捐款計畫」，親自拜訪中小企業補回缺口',
        sublabel: '走出舒適圈學募款，成功替地方留住八成獎助額度',
        effect: {
          statsDelta: { energy: -11, purpose: 8, capital: 10, life: -4, impactScore: 15 },
          orgFinanceDelta: 1,
        },
        outcomeText:
          '跑了二十幾家在地食品廠與校友會，雖然吃過不少閉門羹，最後居然真的湊回了一百二十萬，順利讓課輔班照常開學。',
      },
      {
        id: 'transparent_triage',
        label: '提早半年召集所有受補助團隊開誠布公溝通減額比例，協助對接其他部會資源',
        sublabel: '避免年底斷崖式停辦造成現場混亂',
        effect: {
          statsDelta: { energy: -6, purpose: 4, capital: 6, life: 1, impactScore: 9 },
        },
        outcomeText:
          '幾個小團隊雖然失望，但因為提早半年得知消息並拿到你的轉介清單，成功轉向文化部與民間大基金會補上資金。',
      },
    ],
  },
  {
    id: 'corp_annual_esg_crunch',
    title: '年報與國際評比截稿季：把一年血汗壓縮成十二頁英文 SROI 圖表',
    category: 'work',
    tag: '跨國報告文化',
    weight: 16,
    conditions: { orgTypes: ['corp_intl_ngo'], excludeOutsideNPO: true },
    narrative:
      '母公司要編寫永續報告書送國際道瓊永續指數（DJSI）評比，總部又同步要求交出台灣區影響力英文年報。這兩週你幾乎忘記台灣現場長什麼樣子，整天在調整雙語表格、驗證每張照片肖像權授權書、以及把社區阿公阿嬤的改變換算成貨幣化社會報酬率。',
    choices: [
      {
        id: 'craft_honest_metrics',
        label: '堅持在英文報告裡保留「質性訪談與失敗反思」，不讓數字變成單純的粉飾工具',
        sublabel: '加班打磨雙語文本，守住專業報告的誠實度',
        effect: {
          statsDelta: { energy: -10, purpose: 5, capital: 10, life: -5, impactScore: 12 },
        },
        outcomeText:
          '總部審閱官反而稱讚台灣分會寫出的反思章節非常有說服力，讓這份年報不只是冰冷的 KPI 展示冊。',
      },
      {
        id: 'automate_and_protect_time',
        label: '建立標準化雙語影響力儀表板模板，準時交件後立刻把時間留回給實務夥伴',
        sublabel: '效率優先，練習不要被繁瑣的跨國報表吞噬全部心力',
        effect: {
          statsDelta: { energy: -4, purpose: 1, capital: 7, life: 4, impactScore: 8 },
        },
        outcomeText:
          '你把繁瑣的數字清洗流程簡化了一半，終於在週五準時關掉電腦去吃一頓熱騰騰的火鍋。',
      },
    ],
  },
  {
    id: 'common_whistleblower_dilemma',
    title: '組織內部帳務瑕疵：發現資深主管把個人餐敘混進專案核銷',
    category: 'work',
    tag: '職場倫理底線',
    weight: 14,
    conditions: { excludeOutsideNPO: true, minTenure: 2 },
    narrative:
      '核對季度單據時，你意外發現幾張打著「跨團體聯繫會議」名義報支的高價餐廳發票，實際上是理事長或某資深主管私人宴請友人的開銷。金額不算天文數字，但這正是會員與支持者最痛恨的信任破口。',
    choices: [
      {
        id: 'block_and_record',
        label: '堅持依財會準則退件不予核銷，並請監事長備查帳務內控流程',
        sublabel: '守住組織清白與自己不背黑鍋的法律底線，但辦公室氣氛降至冰點',
        effect: {
          statsDelta: { energy: -8, purpose: 10, capital: 6, life: -2, impactScore: 12 },
          boardClimate: 'factional',
          milestoneTag: '擋下組織內部不實核銷守住財務公信力',
        },
        outcomeText:
          '對方臉色鐵青自己把發票抽回去改用私人支付。雖然接下來三個月你在辦公室被冷處理，但至少每個發薪日和年終簽名時你問心無愧。',
      },
      {
        id: 'warn_privately_fix',
        label: '私下提醒對方這次改列為「自籌公關雜支上限內」或自行抽回，避免鬧上理事會',
        sublabel: '拆彈成功也保住對方台階，但見識到組織治理的灰色地帶',
        effect: {
          statsDelta: { energy: -5, purpose: -3, capital: 4, life: 1, impactScore: 5 },
        },
        outcomeText:
          '那位主管尷尬地笑笑說「啊不小心混到私卡收據」，抽回發票後再也沒犯過。只是你心裡多了一層警覺，從此所有經手憑證一定雙重留底。',
      },
    ],
  },

  // =========================================================================
  // 九、台灣 NPO 非典型勞動、勞資爭議與工會求助（8 個）
  // =========================================================================
  {
    id: 'labor_multi_employment_trap',
    title: '「多元就業開發方案」期滿倒數：公法救助無勞退與失業給付的斷層',
    category: 'work',
    tag: '多元方案斷層',
    weight: 26,
    conditions: { employmentTypes: ['multi_employment'], excludeOutsideNPO: true },
    narrative:
      '你透過勞動部「多元就業開發方案」進駐協會滿一年，領著接近基本工資的上工津貼卻實際在扛全職專案與核銷。因官方將此方案定調為「公法救助關係」而非一般勞雇關係，這一年雖有勞保與健保，但完全不適用《勞基法》與《就業保險法》——既沒有一毛錢雇主 6% 勞退提撥，方案期滿也沒有資遣費或失業給付可領。補助即將屆滿，組織卻說自籌款不足無法轉正職，主管委婉問：「要不要先空窗一陣子，或是改簽自然人承攬繼續幫我們？」',
    choices: [
      {
        id: 'fight_convert_regular',
        label: '拒絕非法空窗回聘，拿出這一年建立的服務實績與外部補助提案爭取轉為一般正職',
        sublabel: '成功轉正職納入《勞基法》、就業保險並開始享有雇主 6% 勞退提撥',
        effect: {
          changeEmploymentType: 'regular',
          salaryDelta: 2000,
          statsDelta: { energy: -8, purpose: 4, capital: 8, life: 4, impactScore: 10 },
          setFlag: 'labor_dispute_hit',
          milestoneTag: '成功自多元就業方案轉為一般正職受僱',
        },
        outcomeText:
          '你替協會連夜寫出一份地方企業合作小額補助案，理事會看著沒有你就沒人會跑核銷系統的現實，終於點頭把你納進一般正職編制，總算開始累積 6% 勞退與就保年資。',
      },
      {
        id: 'accept_contractor_shift',
        label: '不捨放掉手邊案子與收入空窗，答應先改簽「自然人承攬」續留原單位',
        sublabel: '表面月領多 $1,500，但同樣無 6% 勞退，連原有的單位勞健保都失去、須全額自付工會保費',
        effect: {
          changeEmploymentType: 'contractor',
          salaryDelta: 1500,
          statsDelta: { energy: -5, purpose: -7, life: -4, impactScore: 4 },
          setFlag: 'labor_dispute_hit',
        },
        outcomeText:
          '你照樣每天早上九點到辦公室報到、聽從主管交辦業務，只是身分從「公法救助進用人員」變成了「外部專案承攬」，依舊沒有勞退，連勞健保都得自己去職業工會全額加保。',
      },
    ],
  },
  {
    id: 'labor_fake_contractor',
    title: '「自然人承攬」的真相：每天打卡開早會，卻沒有勞健保與特休',
    category: 'work',
    tag: '假承攬真僱傭',
    weight: 26,
    conditions: { employmentTypes: ['contractor'], excludeOutsideNPO: true },
    narrative:
      '簽約時組織說「因為人事管銷上限，只能用自然人承攬領車馬費／研究費」，結果一樣要求你每天九點打卡、假日支援活動、請假要寫假單找主管簽核。這季你去查才發現，整年不但沒有一塊錢雇主 6% 勞退提撥、每筆超過兩萬還被扣 2.11% 二代健保，萬一職災或資遣完全零保障。',
    choices: [
      {
        id: 'demand_regular_status',
        label: '保留出勤打卡與交辦截圖，要求組織依「從屬性事實」改簽正式勞動契約並補齊勞退',
        sublabel: '正視勞動權益轉回正職受僱，組織關係緊繃但拿回法定保障',
        effect: {
          changeEmploymentType: 'regular',
          salaryDelta: -1000,
          statsDelta: { energy: -7, purpose: 6, capital: 8, life: 6, impactScore: 11 },
          boardClimate: 'factional',
          setFlag: 'labor_dispute_hit',
          milestoneTag: '主張從屬性打破假承攬取得正職勞健保',
        },
        outcomeText:
          '主管臉色很難看說「你這樣我們以後人事費很難編」，但知道勞動局認定從屬性絕對輸，最後還是乖乖補辦加保與正職聘書。',
      },
      {
        id: 'endure_contractor_gap',
        label: '擔心鬧翻沒工作也沒圈內推薦信，繼續吞下承攬契約並自行去工會加保',
        sublabel: '維持表面和諧，內心對「民間組織比企業更懂法卻帶頭違法」感到深沉倦怠',
        effect: {
          statsDelta: { energy: -5, purpose: -11, capital: 1, life: -5 },
          setFlag: 'labor_dispute_hit',
        },
        outcomeText:
          '每個月匯出兩千多塊職業工會保費那天，看著組織粉專正在轉貼「保障弱勢勞動權益」的貼文，你只能苦笑關掉網頁。',
      },
    ],
  },
  {
    id: 'labor_salary_kickback',
    title: '帳面四萬二、實領三萬六：機構要求簽「自願樂捐同意書」',
    category: 'work',
    tag: '薪資回捐爭議',
    weight: 20,
    conditions: {
      excludeOutsideNPO: true,
      excludeOrgTypes: ['industrial_union', 'occupational_union', 'corp_intl_ngo', 'academic_society'],
    },
    narrative:
      '新年度政府標案規定專職人員須依衛福部或計畫標準給薪，但領薪水前一天會計卻拿來一張「員工自願定期捐款授權書」，低聲說：「大家都一樣啦，帳戶進去後每個月自動轉五千塊回來當機構急難備用金，這樣明年組織才撐得下去。」',
    choices: [
      {
        id: 'refuse_kickback_report',
        label: '當場拒簽並秘密錄音保存匯款憑證，拒絕成為共犯結構的一環',
        sublabel: '保住實領 $5,000 與原則，但馬上被列入主管眼中的頭痛人物',
        effect: {
          statsDelta: { energy: -8, purpose: 8, capital: 6, life: 3, impactScore: 14 },
          boardClimate: 'factional',
          setFlag: 'labor_dispute_hit',
          milestoneTag: '當面拒簽薪資回捐同意書並保留證據',
        },
        outcomeText:
          '主管冷處理了你一整季、把最難搞的偏遠據點都排給你，但也因為怕你真的檢舉整份標案被追回補助款，不敢真的少發你一毛薪水。',
      },
      {
        id: 'comply_temporarily',
        label: '看著資深同事都默默簽了不敢當出頭鳥，忍痛配合每月回捐兩年',
        sublabel: '每月實領形同減少 $4,000（年少近五萬），理想與自我認同嚴重受創',
        effect: {
          savingsDelta: -24000,
          statsDelta: { energy: -5, purpose: -15, life: -7 },
          setFlag: 'labor_dispute_hit',
        },
        outcomeText:
          '拿到扣繳憑單那天看到上面寫著年薪五十幾萬要繳稅，實際進口袋卻少了好幾萬，那股說不出口的委屈成了壓垮熱情的重石。',
      },
    ],
  },
  {
    id: 'labor_unpaid_overtime_comp',
    title: '「做功德」的潛規則：累積 64 小時補休年底自動歸零',
    category: 'work',
    tag: '無償加班爭議',
    weight: 18,
    conditions: { excludeOutsideNPO: true, minTenure: 1 },
    narrative:
      '這一年為了{weekendTask}與趕不完的業務，你照表申請了 64 小時加班補休，卻因為案量太重根本請不完。12 月底行政突然發信通知：「依組織內規，未休畢之補休視同放棄、不得折算加班費。」而且主管還暗示出勤系統只準打早上九點到下午六點。',
    choices: [
      {
        id: 'demand_overtime_pay_law',
        label: '搬出《勞基法》第 32-1 條要求未休補休依法折發加班費，拒絕造假打卡紀錄',
        sublabel: '拿回辛苦汗水錢 $16,000，同時把「依法排班」議題逼上檯面',
        effect: {
          savingsDelta: 16000,
          statsDelta: { energy: -4, purpose: 5, capital: 6, life: 4, impactScore: 9 },
          setFlag: 'labor_dispute_hit',
        },
        outcomeText:
          '理監事會發現一旦被勞檢將罰款加上違法紀錄會影響明年政府評鑑，只好乖乖核發加班費並從明年起管制週末活動總量。',
      },
      {
        id: 'swallow_zero_out',
        label: '體諒組織經費拮据自己摸摸鼻子簽名歸零，以後工作時間自己摸魚抵回來',
        sublabel: '失去應得加班費，對組織的信任感與投入度明顯降溫',
        effect: {
          statsDelta: { energy: -4, purpose: -11, life: -2 },
          setFlag: 'labor_dispute_hit',
        },
        outcomeText:
          '你沒有吵架，只是從隔天起再也不會在群組主動認領任何額外任務，心裡某一塊熱情悄悄結了霜。',
      },
    ],
  },
  {
    id: 'labor_illegal_termination',
    title: '標案沒續標：秘書長拿「自願離職單」要你體諒機構苦衷',
    category: 'work',
    tag: '非自願離職爭議',
    weight: 16,
    conditions: {
      excludeOutsideNPO: true,
      orgTypes: ['large_welfare', 'grassroots', 'local_foundation'],
      employmentTypes: ['regular'],
      minTenure: 2,
    },
    narrative:
      '年度主力政府方案因為政治或評鑑因素意外落榜，機構沒了預算來源。執行長約談你：「我們明年一定還想再找你回來，但這張上面如果開『非自願離職與資遣費』會讓機構在勞工局留下不良紀錄、影響其他標案，你能不能簽這張自願離職書體諒一下？」',
    choices: [
      {
        id: 'refuse_voluntary_resign',
        label: '嚴正拒絕簽署自願離職書，堅持依法給付資遣費與開立非自願離職證明轉往友會',
        sublabel: '守住 $35,000 資遣費與失業給付資格，順利轉職其他民間組織',
        effect: {
          savingsDelta: 35000,
          changeOrgType: 'local_foundation',
          statsDelta: { energy: -6, purpose: 3, capital: 7, life: 3, impactScore: 8 },
          setFlag: 'labor_dispute_hit',
          milestoneTag: '拒絕被迫自願離職並依法取回資遣保障',
        },
        outcomeText:
          '對方見你熟諳《勞基法》第 11 條與就業保險法不敢硬碰，最終依規核發資遣費與證明。你在喘息兩個月後，也順利帶著完整年資銜接新工作。',
      },
      {
        id: 'sign_to_keep_face',
        label: '念在多年情分簽了自願離職，自己少拿資遣費還失去失業給付資格',
        sublabel: '損失慘重（存款 -$25,000 空窗耗損），深深看清人情背後的算計',
        effect: {
          savingsDelta: -25000,
          changeOrgType: 'grassroots',
          statsDelta: { energy: -7, purpose: -14, life: -8 },
          setFlag: 'labor_dispute_hit',
        },
        outcomeText:
          '後來你輾轉聽說那位執行長對理事會誇稱「團隊都很無私離職幫組織省下數十萬資遣費」，那一刻你徹底清醒了。',
      },
    ],
  },
  {
    id: 'labor_seek_sw_union',
    title: '跨出一步：尋求「島嶼社工人員職業工會」協助',
    category: 'intertwined',
    tag: '社工工會救援',
    weight: 22,
    conditions: {
      excludeOutsideNPO: true,
      orgTypes: ['large_welfare', 'local_foundation'],
      minTenure: 1,
    },
    narrative:
      '長期承受低薪凍漲、回捐壓力或無償超時加班，你終於聯絡了「島嶼社工人員職業工會」的諮詢窗口。下班後在捷運站旁的咖啡廳，工會幹部翻著你的出勤與薪資明細說：「證據非常清楚絕對站得住腳，你想匿名透過工會舉報專案勞檢、還是正式申請勞資調解？」',
    choices: [
      {
        id: 'join_sw_union_mediate',
        label: '正式加入社工工會！由工會幹部陪同出席勞動局調解並申請專案勞檢',
        sublabel: '追回積欠加班費與補繳勞退（進帳 $24,000），替同業撐開勞動底線',
        effect: {
          savingsDelta: 24000,
          changeEmploymentType: 'regular',
          salaryDelta: 2000,
          statsDelta: { energy: -7, purpose: 14, capital: 11, life: 3, impactScore: 18 },
          boardClimate: 'factional',
          clearFlag: 'labor_dispute_hit',
          setFlag: 'joined_npo_union',
          milestoneTag: '透過島嶼社工人員職業工會調解成功討回勞動權益',
        },
        outcomeText:
          '調解桌上，原本態度強硬的機構代表看到工會秘書遞出整疊出勤證據與衛福部補助規範瞬間軟化。這場勝利不只替你討回公道，也逼機構取消了全院的回捐陋習。',
      },
      {
        id: 'sw_union_quiet_audit',
        label: '擔心日後在社福圈求職受阻，請工會協助匿名申訴勞檢並保密協商',
        sublabel: '工會替你扛住曝光風險，討回部分補償 $12,000 並保有轉圜空間',
        effect: {
          savingsDelta: 12000,
          changeEmploymentType: 'regular',
          statsDelta: { energy: -3, purpose: 8, capital: 7, life: 5, impactScore: 12 },
          clearFlag: 'labor_dispute_hit',
          setFlag: 'joined_npo_union',
        },
        outcomeText:
          '工會幹部理解社福圈狹小的顧慮，改由工會出面舉發全院抽檢。一個月後機構悄悄補齊了欠發加班費與正式勞動契約。',
      },
      {
        id: 'hesitate_sw_union',
        label: '諮詢完後仍顧慮機構名聲與督導關係，暫時決定自己再忍一忍',
        sublabel: '維持表面和平，卻在一次次超時訪視與核銷裡感到孤單',
        effect: {
          statsDelta: { energy: -4, purpose: -12, life: -4 },
        },
        outcomeText:
          '工會幹部沒勉強你，只遞給你一張卡片說：「社工不該用自己的健康補破網，隨時需要我們都在。」',
      },
    ],
  },
  {
    id: 'labor_seek_npo_ind_union',
    title: '跨出一步：尋求「福爾摩沙非營利產業工會」協助',
    category: 'intertwined',
    tag: 'NPO 工會救援',
    weight: 22,
    conditions: {
      excludeOutsideNPO: true,
      orgTypes: ['grassroots', 'advocacy_ngo', 'academic_society', 'corp_intl_ngo'],
      minTenure: 1,
    },
    narrative:
      '受夠了多年凍薪、假承攬真僱傭或補休年底歸零，你撥通了「福爾摩沙非營利產業工會」的諮詢專線。工會秘書看完你的契約與對話紀錄後問：「從屬性證據非常充足，你想由工會發函要求團體協商與勞檢、還是先做保密法諮協商？」',
    choices: [
      {
        id: 'join_npo_ind_mediate',
        label: '正式入會！由 NPO 產業工會幹部陪同出席勞動局調解並主張勞動權益',
        sublabel: '追回補休折薪與勞退差額（進帳 $24,000），站出來改寫圈內潛規則',
        effect: {
          savingsDelta: 24000,
          changeEmploymentType: 'regular',
          salaryDelta: 2000,
          statsDelta: { energy: -7, purpose: 14, capital: 11, life: 3, impactScore: 18 },
          boardClimate: 'factional',
          clearFlag: 'labor_dispute_hit',
          setFlag: 'joined_npo_union',
          milestoneTag: '透過福爾摩沙非營利產業工會成功爭取權益',
        },
        outcomeText:
          '原本以為民間組織大家都靠人情解決，沒想到工會出手後理監事會立刻正視法令紅線，正式將契約與工時規範改回合法正軌。',
      },
      {
        id: 'npo_ind_quiet_letter',
        label: '考量民間倡議與學會圈子小，請工會協助匿名檢舉勞檢或保密和解',
        sublabel: '避免正面撕破臉，討回部分差額 $12,000 並保住同業口碑',
        effect: {
          savingsDelta: 12000,
          changeEmploymentType: 'regular',
          statsDelta: { energy: -3, purpose: 8, capital: 7, life: 5, impactScore: 12 },
          clearFlag: 'labor_dispute_hit',
          setFlag: 'joined_npo_union',
        },
        outcomeText:
          '工會替你撐起匿名防護傘，主管機關發函限期改善後，組織終於乖乖幫所有專職補辦正職加保與特休結算。',
      },
      {
        id: 'hesitate_npo_ind',
        label: '還是擔心跟創辦人與理事鬧僵，諮詢後決定暫時按兵不動',
        sublabel: '換得一時職場安靜，內心對結構的無力感卻更深了',
        effect: {
          statsDelta: { energy: -4, purpose: -12, life: -4 },
        },
        outcomeText:
          '工會秘書拍拍你肩膀說：「什麼時候準備好不再用熱情交換無償勞動，隨時再聯絡我們。」',
      },
    ],
  },
  {
    id: 'labor_npo_union_solidarity',
    title: '串聯聲援：民團工會發起「反回捐、反假承攬」修法連署',
    category: 'work',
    tag: '圈內勞動覺醒',
    weight: 14,
    conditions: { excludeOutsideNPO: true, minTenure: 2 },
    narrative:
      '幾間大型社福與民團相繼爆出薪資回捐與承攬濫用醜聞，福爾摩沙非營利產業工會與島嶼社工人員職業工會聯合發起「要求衛福部與勞動部把核實給薪與 6% 勞退列為補助審查硬門檻」公開連署與部會外陳情，邀請現職工作者具名或匿名連署發聲。',
    choices: [
      {
        id: 'sign_publicly_and_attend',
        label: '請假出席部會外記者會並具名連署，向大眾喊話「愛心不該建築在工作者的貧窮上」',
        sublabel: '頂著自家組織保守高層的白眼，實質推高集體議價聲量',
        effect: {
          statsDelta: { energy: -6, purpose: 12, capital: 7, life: 1, impactScore: 16 },
          milestoneTag: '具名參與 NPO 反回捐與反假承攬集體行動',
        },
        outcomeText:
          '新聞畫面裡有你舉牌的背影。隔天雖然被理事長關切了一下，但幾位別團的朋友私訊你「終於有人敢站出來說真話了」。',
      },
      {
        id: 'anonymous_share_survey',
        label: '填寫匿名勞動條件問卷並私下轉給所有同溫層群組，用數據當工會的子彈',
        sublabel: '安全不曝光，同時替全體工作者累積實證談判籌碼',
        effect: {
          statsDelta: { energy: -2, purpose: 6, capital: 4, life: 2, impactScore: 9 },
        },
        outcomeText:
          '工會三個月後公布的《民間組織勞動現況白皮書》裡面有一條正是你填的血淚數字，連主管機關也不得不發新聞稿回應。',
      },
    ],
  },
  {
    id: 'labor_long_freeze_talk',
    title: '連續多年零調薪：帶著工作實績敲開{bossTitle}辦公室的門',
    category: 'work',
    tag: '低薪凍漲撞牆',
    weight: 22,
    conditions: { excludeOutsideNPO: true, minTenure: 3 },
    narrative:
      '在{orgNoun}待了好幾年，物價跟房租早不知漲了多少輪，你的本薪卻幾乎原地踏步，甚至比剛進來的新進人員還低。你整理好過去一年的實績紀錄與業務成果，決定找{bossTitle}正式談一次調薪。對方聽完沉吟半晌說：「我們知道你很辛苦，但今年組織真的沒多餘財源……」',
    choices: [
      {
        id: 'firm_negotiate_or_leave',
        label: '不接受空洞的「明年一定優先考慮」，要求在理監事會排入具體調薪時程或職等調整',
        sublabel: '有機會打破長期凍薪（成功調薪 $2,000）或看清沒有留下的必要',
        effect: {
          salaryDelta: 2000,
          statsDelta: { energy: -5, purpose: 2, capital: 7, life: 3, impactScore: 7 },
        },
        outcomeText:
          '你把「如果明年再不調整，離職重新聘一個新人的招募成本只會更高」的帳算給理事看，最終總算撬開微薄卻具象徵意義的兩千元調薪。',
      },
      {
        id: 'accept_no_raise_reality',
        label: '看著主管也愁眉苦臉，不好意思繼續逼問只好默默退回座位',
        sublabel: '再度接受一年零調薪，對職涯經濟前景與熱情的磨損加劇',
        effect: {
          statsDelta: { energy: -3, purpose: -12, life: -5 },
        },
        outcomeText:
          '走出主管辦公室那天，你打開 104 更新了聯絡方式；不是不愛這個領域，而是真的養不起再一個五年了。',
      },
    ],
  },
];
