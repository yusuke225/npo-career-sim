import type { OrgTypeId, PeerStatus, PeerWorker } from '../types/game';
import { ORG_TYPES, randomInt } from './organizations';

export const PEER_NAME_POOL: string[] = [
  '陳宥廷', '林舒涵', '張哲瑋', '黃詩婷', '李冠宇',
  '吳佩珊', '王柏翰', '劉雅筑', '蔡承恩', '楊佳穎',
  '許家豪', '鄭心怡', '謝政達', '郭芳瑜', '洪子軒',
  '邱郁婷', '曾威廷', '廖婉君', '賴彥廷', '徐筱涵',
  '周明哲', '葉思妤', '蘇建宏', '莊雅雯', '呂宗翰',
  '江怡安', '何俊傑', '蕭雅婷', '羅翊軒', '高千惠',
  '潘志豪', '簡毓珊', '朱庭毅', '彭馨儀', '詹凱文',
  '施雅玲', '沈柏均', '余采潔', '盧建志', '戴妤庭',
];

function shuffleWithRng<T>(arr: T[], rng: () => number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

interface PeerTemplate {
  orgType: OrgTypeId;
  startOrgLabel: string;
  startRoleLabel: string;
  baseSalary: number;
  initialNote: string;
}

const PEER_POOL: PeerTemplate[] = [
  {
    orgType: 'large_welfare',
    startOrgLabel: '北區晴光兒少社福基金會',
    startRoleLabel: '高風險家庭社工員',
    baseSalary: 38500,
    initialNote: '剛接手 28 案，每天騎機車跑訪視跑到忘記吃午餐。',
  },
  {
    orgType: 'academic_society',
    startOrgLabel: '島嶼臨床照護研究學會',
    startRoleLabel: '專職會務秘書',
    baseSalary: 34000,
    initialNote: '辦公室只有一人，正一邊核對兩百張收據一邊被理事催年會手冊。',
  },
  {
    orgType: 'industrial_union',
    startOrgLabel: '北區晶圓製造業產業工會',
    startRoleLabel: '工會組織秘書',
    baseSalary: 35000,
    initialNote: '下班後蹲在工業區大門外發傳單，手機裡全是廠區輪班大夜的申訴訊息。',
  },
  {
    orgType: 'advocacy_ngo',
    startOrgLabel: '島嶼氣候與環境倡議聯盟',
    startRoleLabel: '倡議暨社群專員',
    baseSalary: 35500,
    initialNote: '為了這週立院審查，連續三天在辦公室吃便當寫懶人包。',
  },
  {
    orgType: 'occupational_union',
    startOrgLabel: '都會區海風餐飲職業工會',
    startRoleLabel: '會務行政專員',
    baseSalary: 32500,
    initialNote: '每天早上九點前就被會員加退保電話打爆，正在學怎麼安撫急著辦職災給付的師傅。',
  },
  {
    orgType: 'grassroots',
    startOrgLabel: '山海巷弄社區共好協會',
    startRoleLabel: '駐點專案企劃',
    baseSalary: 31500,
    initialNote: '身兼司機、美編與核銷會計，但社區阿嬤每天早上都會塞熱地瓜鼓勵同仁。',
  },
  {
    orgType: 'corp_intl_ngo',
    startOrgLabel: '星辰科技永續公益基金會',
    startRoleLabel: '公益專案專員',
    baseSalary: 44000,
    initialNote: '簡報配色講究、福利不錯，但週末要配合母公司辦千人淨灘家庭日。',
  },
  {
    orgType: 'local_foundation',
    startOrgLabel: '溪南地方文史公益基金會',
    startRoleLabel: '教育與展覽執行',
    baseSalary: 34500,
    initialNote: '忙著跟地方公所和老校長搏感情，試著把青年導覽員留在家鄉。',
  },
];

export function generateCohortPeers(
  playerStartAge: number,
  playerOrgType: OrgTypeId,
  startYear: number,
  playerName: string,
  rng = Math.random
): PeerWorker[] {
  // 確保至少包含學會、工會、大型社福或倡議代表，同時每次隨機抽換夥伴姓名與組合
  const candidates = shuffleWithRng(
    PEER_POOL.filter((p) => p.orgType !== playerOrgType),
    rng
  );
  const selected: PeerTemplate[] = [];

  const ensureTypes: OrgTypeId[] = ['large_welfare', 'academic_society', 'industrial_union', 'advocacy_ngo'];
  for (const targetType of ensureTypes) {
    if (selected.length >= 4) break;
    if (targetType === playerOrgType) continue;
    const match = candidates.find((c) => c.orgType === targetType && !selected.includes(c));
    if (match) selected.push(match);
  }

  for (const c of candidates) {
    if (selected.length >= 4) break;
    if (!selected.includes(c)) selected.push(c);
  }

  const availableNames = shuffleWithRng(
    PEER_NAME_POOL.filter((name) => name !== playerName),
    rng
  );

  return selected.slice(0, 4).map((tpl, idx) => {
    const ageOffset = randomInt(-1, 2, rng);
    const age = Math.max(22, playerStartAge + ageOffset);
    const name = availableNames[idx] || `夥伴${idx + 1}`;
    return {
      id: `peer_${idx + 1}`,
      name,
      age,
      startOrgLabel: tpl.startOrgLabel,
      startRoleLabel: tpl.startRoleLabel,
      orgType: tpl.orgType,
      currentStatus: 'active',
      currentLabel: `${tpl.startOrgLabel} · ${tpl.startRoleLabel}`,
      latestNote: tpl.initialNote,
      salaryEstimate: tpl.baseSalary + randomInt(-1000, 1500, rng),
      history: [`${startYear} 入行於${tpl.startOrgLabel}`],
    };
  });
}

interface EvolutionOutcome {
  status: PeerStatus;
  label: (peer: PeerWorker) => string;
  note: string;
  salaryDelta: number;
  minYears: number;
  weight: number;
  orgFilter?: OrgTypeId[];
}

const EVOLUTIONS: EvolutionOutcome[] = [
  {
    status: 'promoted',
    label: (p) => `${p.startOrgLabel} · 資深專員暨督導`,
    note: '熬過前輩離職潮成為組織台柱，薪水微調但扛起所有新人教育與評鑑。',
    salaryDelta: 5500,
    minYears: 3,
    weight: 18,
  },
  {
    status: 'promoted',
    label: () => '全國性專業學會 · 專任秘書長',
    note: '理事長換了兩屆還是只有其熟悉內政部人團法與學分系統，默默升為專任秘書長。',
    salaryDelta: 9000,
    minYears: 5,
    weight: 22,
    orgFilter: ['academic_society'],
  },
  {
    status: 'promoted',
    label: () => '跨廠區聯合工會 · 總幹事',
    note: '接連打贏兩件不當勞動行為裁決案後，轉任總幹事並兼顧勞教培訓。',
    salaryDelta: 7500,
    minYears: 4,
    weight: 24,
    orgFilter: ['industrial_union', 'occupational_union'],
  },
  {
    status: 'pivoted',
    label: () => '星辰科技聯盟 · ESG 永續管理師',
    note: '憑藉長期政策研究與企業募款對接經驗轉戰企業 ESG 部門，月薪顯著調升且準時下班，偶爾仍會關注老戰友動態。',
    salaryDelta: 14000,
    minYears: 5,
    weight: 6,
    orgFilter: ['corp_intl_ngo', 'advocacy_ngo', 'local_foundation'],
  },
  {
    status: 'pivoted',
    label: () => '縣市政府社福中心 · 約聘社工督導',
    note: '考進公部門社政體系，福利與年終終於穩定，改從政府補助審查端看過去自己貼過的核銷單據。',
    salaryDelta: 7500,
    minYears: 4,
    weight: 10,
    orgFilter: ['large_welfare', 'grassroots', 'local_foundation'],
  },
  {
    status: 'pivoted',
    label: () => '地方政府勞動局 · 勞資爭議調解專員',
    note: '帶著工會與勞動法規實戰資歷轉任公部門調解與勞動行政職，工時比工運現場正常許多。',
    salaryDelta: 6500,
    minYears: 4,
    weight: 9,
    orgFilter: ['industrial_union', 'occupational_union'],
  },
  {
    status: 'pivoted',
    label: () => '一般中小企業 · 行政人資暨專案管理',
    note: '厭倦換屆改選內耗與低薪凍漲，決定轉回一般商業辦公室領固定年終、過單純的朝九晚六生活。',
    salaryDelta: 5500,
    minYears: 3,
    weight: 9,
    orgFilter: ['academic_society', 'grassroots', 'occupational_union'],
  },
  {
    status: 'studying',
    label: () => '在職進修 · 社福公衛碩士班',
    note: '暫時退出全職高壓工作，邊念研究所邊接研究助理案，想替自己的職涯換口氣。',
    salaryDelta: -8000,
    minYears: 2,
    weight: 11,
  },
  {
    status: 'resting',
    label: () => '離職轉行摸索中 · 去向未定',
    note: '還沒到能退休的年紀卻已撐不下去，遞出辭呈後暫時離開非營利圈，還在摸索下一步該轉行去哪裡。',
    salaryDelta: -18000,
    minYears: 2,
    weight: 14,
  },
  {
    status: 'founded',
    label: () => '新創民間公益組織 · 共同發起人',
    note: '不滿舊組織科層僵化，與幾位戰友湊了登記資本額自己立案，重回月領三萬二的草創期。',
    salaryDelta: -4000,
    minYears: 6,
    weight: 10,
  },
  {
    status: 'active',
    label: (p) => p.currentLabel,
    note: '仍在原崗位迎戰今年度大會與核銷季，笑稱自己已經練成「對突發狀況面無表情」的體質。',
    salaryDelta: 800,
    minYears: 1,
    weight: 20,
  },
  {
    status: 'active',
    label: (p) => `${p.startOrgLabel} · 調整步調後重返現場`,
    note: '經過休養或進修重新整隊出發，換了更有制度的單位繼續留在民間部門。',
    salaryDelta: 3500,
    minYears: 3,
    weight: 16,
  },
];

export function advancePeersForYear(
  peers: PeerWorker[],
  currentYear: number,
  yearsElapsed: number,
  rng = Math.random
): PeerWorker[] {
  return peers.map((peer) => {
    const nextAge = peer.age + 1;
    // 約 42% 機率今年發生可見動向更新，其餘保持穩定
    if (rng() > 0.45) {
      return {
        ...peer,
        age: nextAge,
      };
    }

    const eligible = EVOLUTIONS.filter((ev) => {
      if (yearsElapsed < ev.minYears) return false;
      if (ev.orgFilter && !ev.orgFilter.includes(peer.orgType)) return false;
      // 防止狀態與職稱文字錯位殘留
      if (ev.note.startsWith('仍在原崗位') && peer.currentStatus !== 'active' && peer.currentStatus !== 'promoted') {
        return false;
      }
      if (ev.note.startsWith('經過休養或進修') && peer.currentStatus !== 'resting' && peer.currentStatus !== 'studying') {
        return false;
      }
      // 已轉出至企業的不容易突然變回學會秘書長
      if (peer.currentStatus === 'pivoted' && ev.status === 'promoted') return false;
      if (peer.currentStatus === 'founded' && ev.status === 'resting') return false;
      return true;
    });

    if (eligible.length === 0) {
      return { ...peer, age: nextAge };
    }

    const totalW = eligible.reduce((s, e) => s + e.weight, 0);
    let r = rng() * totalW;
    let chosen = eligible[eligible.length - 1];
    for (const item of eligible) {
      r -= item.weight;
      if (r <= 0) {
        chosen = item;
        break;
      }
    }

    const nextLabel = chosen.label(peer);
    const nextSalary = Math.max(27470, Math.min(92000, peer.salaryEstimate + chosen.salaryDelta));
    const historyEntry = `${currentYear}｜${nextLabel}`;
    const nextHistory =
      peer.history[peer.history.length - 1] === historyEntry
        ? peer.history
        : [...peer.history.slice(-3), historyEntry];

    const extraTag =
      chosen.status === 'pivoted' && peer.orgType !== 'corp_intl_ngo'
        ? `（原${ORG_TYPES[peer.orgType].shortLabel}）`
        : '';

    return {
      ...peer,
      age: nextAge,
      currentStatus: chosen.status,
      currentLabel: nextLabel,
      latestNote: `${chosen.note}${extraTag}`,
      salaryEstimate: nextSalary,
      history: nextHistory,
    };
  });
}

export function getPeerStatusBadge(status: PeerStatus): { label: string; tone: 'neutral' | 'teal' | 'amber' | 'crimson' | 'green' } {
  switch (status) {
    case 'promoted':
      return { label: '深耕升遷', tone: 'teal' };
    case 'pivoted':
      return { label: '跨界轉職', tone: 'amber' };
    case 'resting':
      return { label: '離職摸索', tone: 'crimson' };
    case 'founded':
      return { label: '自行立案', tone: 'green' };
    case 'studying':
      return { label: '進修充電', tone: 'neutral' };
    default:
      return { label: '第一線堅守', tone: 'neutral' };
  }
}
