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

function roundToHundred(value: number): number {
  return Math.round(value / 100) * 100;
}

type PeerTrack = 'corporate' | 'public' | 'npo_stay' | 'transition';

interface EvolutionOutcome {
  id: string;
  track: PeerTrack;
  status: PeerStatus;
  getStatus?: (peer: PeerWorker) => PeerStatus;
  label: (peer: PeerWorker) => string;
  note: string;
  salaryDelta?: number;
  targetSalaryRange?: [number, number];
  minSalaryAfter?: number;
  maxSalaryAfter?: number;
  minYears: number;
  maxYears?: number;
  weight: number;
  orgFilter?: OrgTypeId[];
  isEligible?: (peer: PeerWorker) => boolean;
}

function getPeerTrack(peer: PeerWorker): PeerTrack {
  if (peer.currentStatus === 'pivoted') {
    if (
      peer.currentLabel.includes('縣市政府') ||
      peer.currentLabel.includes('地方政府') ||
      peer.currentLabel.includes('中央部會')
    ) {
      return 'public';
    }
    return 'corporate';
  }
  if (peer.currentStatus === 'resting' || peer.currentStatus === 'studying') {
    return 'transition';
  }
  return 'npo_stay';
}

const EVOLUTIONS: EvolutionOutcome[] = [
  {
    id: 'promoted_senior_supervisor',
    track: 'npo_stay',
    status: 'promoted',
    label: (p) => `${p.startOrgLabel} · 資深專員暨督導`,
    note: '熬過前輩離職潮成為組織台柱，薪水調升但也扛起新人教育與評鑑。',
    salaryDelta: 5500,
    minSalaryAfter: 41000,
    maxSalaryAfter: 56000,
    minYears: 3,
    weight: 16,
    isEligible: (p) =>
      (p.currentStatus === 'active' || p.currentStatus === 'promoted') &&
      !p.currentLabel.includes('資深專員暨督導') &&
      !p.currentLabel.includes('秘書長') &&
      !p.currentLabel.includes('總幹事'),
  },
  {
    id: 'promoted_society_sg',
    track: 'npo_stay',
    status: 'promoted',
    label: () => '全國性專業學會 · 專任秘書長',
    note: '理事長換了兩屆還是只有其熟悉內政部人團法與學分系統，默默升為專任秘書長。',
    salaryDelta: 8500,
    minSalaryAfter: 46000,
    maxSalaryAfter: 62000,
    minYears: 5,
    weight: 20,
    orgFilter: ['academic_society'],
    isEligible: (p) =>
      (p.currentStatus === 'active' || p.currentStatus === 'promoted') &&
      !p.currentLabel.includes('秘書長'),
  },
  {
    id: 'promoted_union_director',
    track: 'npo_stay',
    status: 'promoted',
    label: () => '跨廠區聯合工會 · 總幹事',
    note: '接連打贏兩件不當勞動行為裁決案後，轉任總幹事並兼顧勞教培訓。',
    salaryDelta: 7500,
    minSalaryAfter: 45000,
    maxSalaryAfter: 60000,
    minYears: 4,
    weight: 20,
    orgFilter: ['industrial_union', 'occupational_union'],
    isEligible: (p) =>
      (p.currentStatus === 'active' || p.currentStatus === 'promoted') &&
      !p.currentLabel.includes('總幹事'),
  },
  {
    id: 'pivoted_corp_esg',
    track: 'corporate',
    status: 'pivoted',
    label: () => '星辰科技聯盟 · ESG 永續管理師',
    note: '憑藉政策研究與跨界專案經驗轉戰上市企業永續部門，月薪顯著調升且準時下班，偶爾仍會關心老戰友動態。',
    targetSalaryRange: [62000, 78000],
    minYears: 4,
    weight: 14,
    orgFilter: ['corp_intl_ngo', 'advocacy_ngo', 'local_foundation', 'academic_society'],
    isEligible: (p) => p.currentStatus !== 'pivoted' && p.currentStatus !== 'founded',
  },
  {
    id: 'pivoted_corp_pr',
    track: 'corporate',
    status: 'pivoted',
    label: () => '跨國整合行銷公關公司 · 品牌公關顧問',
    note: '把過去在民間團體寫新聞稿、辦大型活動與危機溝通的實戰力帶進商業公關圈，節奏極快但年薪與獎金跳升一截。',
    targetSalaryRange: [56000, 70000],
    minYears: 3,
    weight: 13,
    orgFilter: ['advocacy_ngo', 'corp_intl_ngo', 'grassroots', 'local_foundation'],
    isEligible: (p) => p.currentStatus !== 'pivoted' && p.currentStatus !== 'founded',
  },
  {
    id: 'pivoted_corp_er',
    track: 'corporate',
    status: 'pivoted',
    label: () => '上市科技製造業 · 員工關係（ER）專員',
    note: '帶著工會與勞資現場的法規底氣轉戰企業人資部門處理勞資溝通與制度合規，不再得為了組織經費四處奔走。',
    targetSalaryRange: [58000, 72000],
    minYears: 3,
    weight: 15,
    orgFilter: ['industrial_union', 'occupational_union', 'large_welfare'],
    isEligible: (p) => p.currentStatus !== 'pivoted' && p.currentStatus !== 'founded',
  },
  {
    id: 'pivoted_private_care_ops',
    track: 'corporate',
    status: 'pivoted',
    label: () => '民營健康照護事業 · 營運暨專案副理',
    note: '看清傳統補助標案的薪資天花板後，轉往民營銀髮與健康照護產業負責營運管理，待遇與分紅明確許多。',
    targetSalaryRange: [54000, 66000],
    minYears: 4,
    weight: 13,
    orgFilter: ['large_welfare', 'grassroots', 'occupational_union'],
    isEligible: (p) => p.currentStatus !== 'pivoted' && p.currentStatus !== 'founded',
  },
  {
    id: 'pivoted_sme_hr',
    track: 'corporate',
    status: 'pivoted',
    label: () => '民間商業企業 · 營運行政暨人資經理',
    note: '厭倦長期加班卻低薪凍漲，轉往一般營利事業領固定年終與績效獎金，終於過上單純的朝九晚六生活。',
    targetSalaryRange: [52000, 64000],
    minYears: 3,
    weight: 12,
    isEligible: (p) => p.currentStatus !== 'pivoted' && p.currentStatus !== 'founded',
  },
  {
    id: 'pivoted_public_sw',
    track: 'public',
    status: 'pivoted',
    label: () => '縣市政府社福中心 · 約聘社工督導',
    note: '考進公部門社政體系，福利與年終終於穩定，改從政府補助審查端看過去自己貼過的核銷單據。',
    targetSalaryRange: [45000, 52000],
    minYears: 4,
    weight: 9,
    orgFilter: ['large_welfare', 'grassroots', 'local_foundation'],
    isEligible: (p) => p.currentStatus !== 'pivoted' && p.currentStatus !== 'founded',
  },
  {
    id: 'pivoted_labor_bureau',
    track: 'public',
    status: 'pivoted',
    label: () => '地方政府勞動局 · 勞資爭議調解專員',
    note: '帶著工會與勞動法規實戰資歷轉任公部門調解與勞動行政職，工時與保障比基層現場穩定許多。',
    targetSalaryRange: [42000, 49000],
    minYears: 4,
    weight: 9,
    orgFilter: ['industrial_union', 'occupational_union'],
    isEligible: (p) => p.currentStatus !== 'pivoted' && p.currentStatus !== 'founded',
  },
  {
    id: 'pivoted_public_policy_admin',
    track: 'public',
    status: 'pivoted',
    label: () => '中央部會或地方局處 · 約聘研究暨計畫專員',
    note: '透過公職考試或部會專案職缺轉入行政體系，從民間監督與會務角色轉換為公部門承辦窗口。',
    targetSalaryRange: [43000, 51000],
    minYears: 4,
    weight: 8,
    orgFilter: ['academic_society', 'advocacy_ngo', 'corp_intl_ngo', 'local_foundation'],
    isEligible: (p) => p.currentStatus !== 'pivoted' && p.currentStatus !== 'founded',
  },
  {
    id: 'studying_grad_school',
    track: 'transition',
    status: 'studying',
    label: () => '在職進修 · 社福公衛或勞工研究碩士班',
    note: '暫時退出全職高壓工作，邊念研究所邊接研究助理案，想替自己的職涯換口氣。',
    targetSalaryRange: [26000, 32000],
    minYears: 2,
    maxYears: 12,
    weight: 5,
    isEligible: (p) =>
      p.currentStatus !== 'studying' && p.currentStatus !== 'pivoted' && p.currentStatus !== 'founded',
  },
  {
    id: 'resting_career_gap',
    track: 'transition',
    status: 'resting',
    label: () => '離職轉行摸索中 · 去向未定',
    note: '還沒到能退休的年紀卻已撐不下去，遞出辭呈後暫時離開民間組織圈，仍在摸索下一步去向（此處保留離職前薪資）。',
    minYears: 2,
    maxYears: 16,
    weight: 6,
    isEligible: (p) =>
      p.currentStatus !== 'resting' && p.currentStatus !== 'pivoted' && p.currentStatus !== 'founded',
  },
  {
    id: 'founded_new_npo',
    track: 'npo_stay',
    status: 'founded',
    label: () => '新創民間公益組織 · 共同發起人',
    note: '不滿舊組織科層僵化，與幾位戰友湊齊三十位發起人立案成立新協會，重回月領三萬二的草創期。',
    targetSalaryRange: [31000, 35000],
    minYears: 6,
    maxYears: 18,
    weight: 4,
    isEligible: (p) => p.currentStatus === 'active' || p.currentStatus === 'promoted',
  },
  {
    id: 'active_steady_grind',
    track: 'npo_stay',
    status: 'active',
    getStatus: (p) => (p.currentStatus === 'promoted' ? 'promoted' : 'active'),
    label: (p) => p.currentLabel,
    note: '仍在原崗位迎戰今年度大會與日常庶務，笑稱自己已經練成「對突發狀況面無表情」的體質。',
    salaryDelta: 1200,
    minSalaryAfter: 32000,
    maxSalaryAfter: 62000,
    minYears: 1,
    weight: 22,
    isEligible: (p) => p.currentStatus === 'active' || p.currentStatus === 'promoted',
  },
  {
    id: 'active_return_to_field',
    track: 'npo_stay',
    status: 'active',
    label: (p) => `${p.startOrgLabel} · 調整步調後重返現場`,
    note: '經過休養或進修重新整隊出發，換了更有制度的單位繼續留在民間部門。',
    targetSalaryRange: [35000, 43000],
    minYears: 3,
    weight: 24,
    isEligible: (p) => p.currentStatus === 'resting' || p.currentStatus === 'studying',
  },
];

export function advancePeersForYear(
  peers: PeerWorker[],
  currentYear: number,
  yearsElapsed: number,
  rng = Math.random
): PeerWorker[] {
  const updated = peers.map((p) => ({ ...p }));
  const order = shuffleWithRng(
    updated.map((_, idx) => idx),
    rng
  );

  for (const idx of order) {
    const peer = updated[idx];
    const nextAge = peer.age + 1;

    // 約 52% 機率今年發生可見動向更新，其餘依現況反映緩步調薪或凍薪
    if (rng() > 0.52) {
      let passiveSalary = peer.salaryEstimate;
      if (peer.currentStatus === 'pivoted') {
        const isCorp = getPeerTrack(peer) === 'corporate';
        const cap = isCorp ? 110000 : 88000;
        const chance = isCorp ? 0.7 : 0.65;
        const rate = isCorp ? 1.03 : 1.022;
        if (rng() < chance && passiveSalary < cap) {
          passiveSalary = Math.min(cap, roundToHundred(passiveSalary * rate));
        }
      } else if (peer.currentStatus !== 'resting' && peer.currentStatus !== 'studying') {
        const cap = peer.currentStatus === 'promoted' ? 66000 : 56000;
        if (rng() < 0.35 && passiveSalary < cap) {
          passiveSalary = Math.min(cap, Math.max(28590, roundToHundred(passiveSalary * 1.015)));
        }
      }
      updated[idx] = {
        ...peer,
        age: nextAge,
        salaryEstimate: passiveSalary,
      };
      continue;
    }

    const others = updated.filter((_, i) => i !== idx);
    const otherCorpCount = others.filter((o) => getPeerTrack(o) === 'corporate').length;
    const otherPublicCount = others.filter((o) => getPeerTrack(o) === 'public').length;
    const otherNpoStayCount = others.filter((o) => getPeerTrack(o) === 'npo_stay').length;
    const otherLabels = new Set(others.map((o) => o.currentLabel));
    const currentTrack = getPeerTrack(peer);

    const eligible = EVOLUTIONS.filter((ev) => {
      if (yearsElapsed < ev.minYears) return false;
      if (ev.maxYears !== undefined && yearsElapsed > ev.maxYears) return false;
      if (ev.orgFilter && !ev.orgFilter.includes(peer.orgType)) return false;
      if (ev.isEligible && !ev.isEligible(peer)) return false;
      // 避免四位夥伴轉職後撞成完全相同的去向名稱
      if (ev.track === 'corporate' || ev.track === 'public' || ev.id === 'founded_new_npo') {
        if (otherLabels.has(ev.label(peer))) return false;
      }
      return true;
    }).map((ev) => {
      let adjWeight = ev.weight;

      // 保持多樣性：營利事業比例最高（多數佔 1–2 席），公職最多 1 席，並盡量保留至少 1 位留任 NPO
      if (ev.track === 'corporate') {
        if (otherCorpCount >= 2) adjWeight = 0;
        else if (otherCorpCount === 0) adjWeight *= yearsElapsed >= 4 ? 2.4 : 1.4;
        else adjWeight *= yearsElapsed >= 6 ? 1.5 : 0.9;
      } else if (ev.track === 'public') {
        if (otherPublicCount >= 1) adjWeight = 0;
        else adjWeight *= yearsElapsed >= 5 ? 1.35 : 0.9;
      }

      if (currentTrack === 'npo_stay' && otherNpoStayCount === 0 && ev.track !== 'npo_stay') {
        adjWeight *= 0.1;
      }

      return { ev, adjWeight };
    }).filter((item) => item.adjWeight > 0);

    if (eligible.length === 0) {
      updated[idx] = { ...peer, age: nextAge };
      continue;
    }

    const totalW = eligible.reduce((s, item) => s + item.adjWeight, 0);
    let r = rng() * totalW;
    let chosen = eligible[eligible.length - 1].ev;
    for (const item of eligible) {
      r -= item.adjWeight;
      if (r <= 0) {
        chosen = item.ev;
        break;
      }
    }

    const nextStatus = chosen.getStatus ? chosen.getStatus(peer) : chosen.status;
    const nextLabel = chosen.label(peer);
    let nextSalary = peer.salaryEstimate;
    if (chosen.targetSalaryRange) {
      nextSalary = roundToHundred(
        randomInt(chosen.targetSalaryRange[0], chosen.targetSalaryRange[1], rng)
      );
    } else if (chosen.salaryDelta !== undefined) {
      nextSalary = roundToHundred(peer.salaryEstimate + chosen.salaryDelta);
    }
    if (chosen.minSalaryAfter !== undefined) {
      nextSalary = Math.max(chosen.minSalaryAfter, nextSalary);
    }
    if (chosen.maxSalaryAfter !== undefined) {
      nextSalary = Math.min(chosen.maxSalaryAfter, nextSalary);
    }
    const overallFloor = nextStatus === 'studying' ? 22000 : 28590;
    const overallCeil = chosen.track === 'corporate' ? 115000 : 92000;
    nextSalary = Math.max(overallFloor, Math.min(overallCeil, nextSalary));

    const historyEntry = `${currentYear}｜${nextLabel}`;
    const nextHistory =
      peer.history[peer.history.length - 1] === historyEntry
        ? peer.history
        : [...peer.history.slice(-3), historyEntry];

    const extraTag =
      nextStatus === 'pivoted' && peer.orgType !== 'corp_intl_ngo'
        ? `（原${ORG_TYPES[peer.orgType].shortLabel}）`
        : '';

    updated[idx] = {
      ...peer,
      age: nextAge,
      currentStatus: nextStatus,
      currentLabel: nextLabel,
      latestNote: `${chosen.note}${extraTag}`,
      salaryEstimate: nextSalary,
      history: nextHistory,
    };
  }

  return updated;
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
