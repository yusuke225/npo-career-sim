import {
  BACKGROUND_TIERS,
  EMPLOYMENT_TYPES,
  ERA_NOTES,
  FOCUS_OPTIONS,
  ORG_CONTEXT_TOKENS,
  ORG_TYPES,
  ORG_TYPE_LIST,
  PLAYER_NAME_POOL,
  REGIONS,
  ROLES,
  pickRandom,
  pickWeighted,
  randomInt,
} from '../data/organizations';
import { advancePeersForYear, generateCohortPeers } from '../data/peers';
import { pickRoutineLine } from '../data/chronicles';
import { ORG_EVENTS } from '../data/eventsOrg';
import { LIFE_AND_ERA_EVENTS } from '../data/eventsLife';
import type {
  CareerArchiveRecord,
  CareerEndReason,
  CareerHistoryPoint,
  ChronicleEntry,
  EmploymentType,
  ExpenseBreakdown,
  GameEvent,
  IncomeBreakdown,
  OrgState,
  OrgTypeId,
  PaceMode,
  RegionId,
  RoleId,
  SimulationState,
  StartConfigInput,
  StatDeltaMap,
  Stats,
} from '../types/game';

export const ALL_ENDING_CATALOG: Array<{
  title: string;
  stampLabel: string;
  category: 'burnout' | 'financial' | 'pivot' | 'legacy' | 'milestone';
}> = [
  { title: '燃燒殆盡前的緊急撤離', stampLabel: '身心停損', category: 'burnout' },
  { title: '敗給都會帳單的理想者', stampLabel: '財務離場', category: 'financial' },
  { title: '離開現場卻還不知去向的人', stampLabel: '中途離場', category: 'burnout' },
  { title: '理想磨損後的安靜轉身', stampLabel: '意義歸零', category: 'burnout' },
  { title: '走進審查端的前線翻譯者', stampLabel: '轉戰公部門', category: 'pivot' },
  { title: '帶著現場記憶的跨界翻譯者', stampLabel: '跨界轉場', category: 'pivot' },
  { title: '人民團體的不動記憶庫', stampLabel: '制度守門人', category: 'legacy' },
  { title: '從零刻出印章的拓荒者', stampLabel: '自立門戶', category: 'milestone' },
  { title: '走完長路的現場長青樹', stampLabel: '圓滿交棒', category: 'legacy' },
  { title: '撐住中生代斷層的現場骨幹', stampLabel: '中堅留任', category: 'legacy' },
  { title: '在縫隙中補網的實務者', stampLabel: '在場證明', category: 'milestone' },
];

export const ARCHIVE_STORAGE_KEY = 'npo_1in100k_archives_v1';
export const ACTIVE_SAVE_STORAGE_KEY = 'npo_1in100k_active_save_v1';
export const ALL_EVENTS: GameEvent[] = [...ORG_EVENTS, ...LIFE_AND_ERA_EVENTS];

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

function roundToHundred(value: number): number {
  return Math.round(value / 100) * 100;
}

function generateDocNumber(orgType: OrgTypeId, startYear: number, rng: () => number): string {
  const rocYear = startYear - 1911;
  const serial = randomInt(100214, 989412, rng);
  if (orgType === 'industrial_union' || orgType === 'occupational_union') {
    return `勞職組字第 ${rocYear}0${serial} 號`;
  }
  if (orgType === 'academic_society' || orgType === 'grassroots' || orgType === 'advocacy_ngo') {
    return `台內團字第 ${rocYear}0${serial} 號`;
  }
  return `衛部救字第 ${rocYear}0${serial} 號`;
}

function getEraNote(year: number): string {
  const match = ERA_NOTES.find((e) => year >= e.minYear && year <= e.maxYear);
  return match ? match.text : ERA_NOTES[ERA_NOTES.length - 1].text;
}

export function getRoleDisplayTitle(state: SimulationState): string {
  if (state.customRoleTitle) return state.customRoleTitle;
  const roleCfg = ROLES[state.role];
  return roleCfg.titles[state.roleLevel] || roleCfg.label;
}

export function calculateMonthlyIncome(
  state: Pick<
    SimulationState,
    'monthlySalary' | 'roleLevel' | 'employmentType' | 'org' | 'focus' | 'currentQuarter' | 'stats' | 'flags'
  >
): IncomeBreakdown {
  const baseSalary = state.monthlySalary;
  let managementAllowance = 0;
  if (state.employmentType === 'regular') {
    if (state.org.isOutsideNPO) {
      if (state.roleLevel >= 2) managementAllowance = 5000;
    } else if (state.roleLevel >= 3) {
      managementAllowance = 7000;
    } else if (state.roleLevel === 2) {
      managementAllowance = 3500;
    }
  }

  let overtimePay = 0;
  let overtimeNote: string | undefined;
  const isBusy =
    state.focus === 'fieldwork' ||
    state.currentQuarter === 3 ||
    state.currentQuarter === 4 ||
    state.stats.energy < 55;
  if (isBusy && state.employmentType === 'regular') {
    const paysOvertime =
      state.org.isOutsideNPO ||
      state.org.type === 'corp_intl_ngo' ||
      state.org.type === 'industrial_union' ||
      state.flags.includes('defended_healthy_boundary') ||
      state.org.financeLevel >= 4;
    if (paysOvertime) {
      overtimePay =
        (state.focus === 'fieldwork' ? 1800 : 1000) +
        (state.stats.energy < 48 ? 1400 : 600) +
        (state.currentQuarter >= 3 ? 800 : 0);
    } else {
      overtimeNote = '責任制／補休';
    }
  }

  const sideIncome =
    state.focus === 'finance'
      ? roundToHundred(2200 + Math.min(1800, state.stats.capital * 18))
      : 0;

  return {
    baseSalary,
    managementAllowance,
    overtimePay,
    overtimeNote,
    sideIncome,
    grossMonthly: baseSalary + managementAllowance + overtimePay + sideIncome,
  };
}

export function getQuarterLabel(q: 1 | 2 | 3 | 4): string {
  switch (q) {
    case 1:
      return '1–3 月';
    case 2:
      return '4–6 月';
    case 3:
      return '7–9 月';
    case 4:
      return '10–12 月';
  }
}

function getSalaryCap(
  roleLevel: 0 | 1 | 2 | 3,
  isOutsideNPO: boolean,
  yearsElapsed = 0
): number {
  const eraScale = Math.min(1.35, 1 + Math.max(0, yearsElapsed) * 0.015);
  if (isOutsideNPO) return Math.round(85000 * Math.min(1.2, 1 + Math.max(0, yearsElapsed) * 0.01));
  switch (roleLevel) {
    case 0:
      return roundToHundred(43000 * eraScale);
    case 1:
      return roundToHundred(50000 * eraScale);
    case 2:
      return roundToHundred(58000 * eraScale);
    case 3:
      return roundToHundred(72000 * eraScale);
  }
}

function drawEmploymentTypeForOrg(orgType: OrgTypeId, rng: () => number): EmploymentType {
  const roll = rng();
  if (orgType === 'corp_intl_ngo') {
    return roll < 0.05 ? 'contractor' : 'regular';
  }
  if (orgType === 'grassroots' || orgType === 'local_foundation') {
    if (roll < 0.22) return 'multi_employment';
    if (roll < 0.40) return 'contractor';
    return 'regular';
  }
  if (orgType === 'academic_society' || orgType === 'advocacy_ngo') {
    if (roll < 0.12) return 'multi_employment';
    if (roll < 0.30) return 'contractor';
    return 'regular';
  }
  if (roll < 0.12) return 'multi_employment';
  if (roll < 0.20) return 'contractor';
  return 'regular';
}

export function computeMonthlyExpense(
  state: Pick<
    SimulationState,
    'region' | 'lifeStatus' | 'currentYear' | 'startYear' | 'monthlySalary' | 'employmentType' | 'age'
  >,
  managementAllowance = 0
): ExpenseBreakdown {
  const regionCfg = REGIONS[state.region];
  const yearsElapsed = Math.max(0, state.currentYear - state.startYear);
  const inflationFactor = Number(Math.min(1.55, 1 + yearsElapsed * 0.02).toFixed(3));

  let housing = 0;
  switch (state.lifeStatus.housing) {
    case 'with_parents':
      housing = 3000;
      break;
    case 'shared_room':
      housing = regionCfg.rentShared;
      break;
    case 'studio_rent':
      housing = regionCfg.rentStudio;
      break;
    case 'mortgage':
      housing = regionCfg.mortgageMonthly;
      break;
  }

  let ageLivingAdj = state.age > 30 ? Math.min(3600, (state.age - 30) * 150) : 0;
  if (state.lifeStatus.studentLoanRemaining > 0) {
    ageLivingAdj = Math.round(ageLivingAdj * 0.5);
  }
  const living = regionCfg.baseLiving + ageLivingAdj;
  const studentLoan =
    state.lifeStatus.studentLoanRemaining > 0
      ? Math.min(state.lifeStatus.monthlyStudentLoan, state.lifeStatus.studentLoanRemaining)
      : 0;
  const carLoan =
    state.lifeStatus.carLoanRemaining > 0
      ? Math.min(state.lifeStatus.monthlyCarLoan, state.lifeStatus.carLoanRemaining)
      : 0;
  const filialCare = state.lifeStatus.monthlyFilialAllowance;

  let childCare = 0;
  if (state.lifeStatus.hasChild) {
    const cAge = state.lifeStatus.childAge ?? 0;
    if (cAge < 6) childCare = 8500;
    else if (cAge < 18) childCare = 6500;
    else childCare = 2000;
  }

  const longTermCare =
    state.lifeStatus.parentCare === 'long_term_care'
      ? state.lifeStatus.partTimeReduced
        ? 6000
        : 12000
      : 0;

  const insurableSalary = state.monthlySalary + managementAllowance;
  let payrollDeduction = 0;
  let selfPaidInsurance = 0;
  if (state.employmentType === 'contractor') {
    selfPaidInsurance =
      2600 + (insurableSalary >= 20000 ? Math.round(insurableSalary * 0.0211) : 0);
  } else if (state.employmentType === 'multi_employment') {
    // 多元方案有勞保（含職災）與健保，但不適用就業保險法與勞退提撥
    payrollDeduction = Math.round(insurableSalary * 0.068);
  } else {
    payrollDeduction = Math.round(insurableSalary * 0.08);
  }

  const inflatedCore = Math.round((housing + living + childCare + longTermCare) * inflationFactor);
  const totalMonthly =
    inflatedCore + studentLoan + carLoan + filialCare + payrollDeduction + selfPaidInsurance;

  return {
    housing: Math.round(housing * inflationFactor),
    living: Math.round(living * inflationFactor),
    studentLoan,
    carLoan,
    filialCare,
    childCare: Math.round(childCare * inflationFactor),
    longTermCare: Math.round(longTermCare * inflationFactor),
    payrollDeduction,
    selfPaidInsurance,
    inflationFactor,
    totalMonthly,
  };
}

function pickRoleForOrg(orgType: OrgTypeId, rng: () => number): RoleId {
  const allowed = ORG_TYPES[orgType].allowedRoles;
  const swChance =
    orgType === 'large_welfare'
      ? 0.65
      : orgType === 'grassroots'
        ? 0.5
        : orgType === 'local_foundation'
          ? 0.4
          : 0;
  if (swChance > 0 && allowed.includes('social_worker')) {
    if (rng() < swChance) return 'social_worker';
    const others = allowed.filter((r) => r !== 'social_worker');
    if (others.length > 0) return pickRandom(others, rng);
  }
  return pickRandom(allowed, rng);
}

export function generateRandomStart(
  pace: PaceMode,
  rng = Math.random,
  customPlayerName?: string
): SimulationState {
  const orgCfg = pickWeighted(ORG_TYPE_LIST, rng);
  const role = pickRoleForOrg(orgCfg.id, rng);
  const regionCfg = pickWeighted(Object.values(REGIONS), rng);
  const bgCfg = pickWeighted(Object.values(BACKGROUND_TIERS), rng);
  const employmentType = drawEmploymentTypeForOrg(orgCfg.id, rng);
  const startAge =
    pace === 'compact'
      ? rng() < 0.2
        ? randomInt(39, 44, rng)
        : randomInt(28, 36, rng)
      : rng() < 0.22
        ? randomInt(34, 40, rng)
        : rng() < 0.72
          ? randomInt(23, 27, rng)
          : randomInt(28, 33, rng);

  return buildStateFromConfig(
    {
      orgType: orgCfg.id,
      role,
      region: regionCfg.id,
      background: bgCfg.id,
      employmentType,
      startAge,
      pace,
      playerName: customPlayerName,
    },
    true,
    rng
  );
}

export function buildStateFromConfig(
  input: StartConfigInput,
  _isRandom: boolean,
  rng = Math.random
): SimulationState {
  const orgCfg = ORG_TYPES[input.orgType];
  const validRole: RoleId = orgCfg.allowedRoles.includes(input.role)
    ? input.role
    : orgCfg.allowedRoles[0];
  const roleCfg = ROLES[validRole];
  const regionCfg = REGIONS[input.region];
  const bgCfg = BACKGROUND_TIERS[input.background];
  const employmentType: EmploymentType = input.employmentType ?? 'regular';

  const startYear = randomInt(2014, 2019, rng);
  const maxYears = input.pace === 'standard' ? 25 : 16;

  let monthlySalary: number;
  if (employmentType === 'multi_employment') {
    monthlySalary = Math.max(28590, roundToHundred(randomInt(28590, 31500, rng)));
  } else {
    const rawSalary =
      randomInt(roleCfg.baseSalaryRange[0], roleCfg.baseSalaryRange[1], rng) +
      orgCfg.salaryBonus +
      regionCfg.salaryAdj +
      (employmentType === 'contractor' ? 1000 : 0);
    monthlySalary = Math.max(28590, roundToHundred(rawSalary));
  }

  let initialSavings = roundToHundred(
    randomInt(bgCfg.initialSavingsRange[0], bgCfg.initialSavingsRange[1], rng)
  );
  const studentLoanRemaining = roundToHundred(
    randomInt(bgCfg.studentLoanRange[0], bgCfg.studentLoanRange[1], rng)
  );
  const livesWithParents = rng() < bgCfg.withParentsChance;
  const housing = livesWithParents
    ? 'with_parents'
    : input.background === 'privileged'
      ? 'studio_rent'
      : 'shared_room';

  const lifeStatus = {
    housing: housing as SimulationState['lifeStatus']['housing'],
    relationship: (rng() < 0.32 ? 'dating' : 'single') as SimulationState['lifeStatus']['relationship'],
    hasChild: false,
    childAge: null,
    parentCare: (bgCfg.monthlyFilialAllowance > 0 ? 'allowance' : 'healthy') as SimulationState['lifeStatus']['parentCare'],
    parentAge: input.startAge + randomInt(26, 33, rng),
    studentLoanRemaining,
    monthlyStudentLoan: studentLoanRemaining > 0 ? bgCfg.monthlyStudentLoan : 0,
    mortgageMonthsRemaining: 0,
    carLoanRemaining: 0,
    monthlyCarLoan: 0,
    monthlyFilialAllowance: bgCfg.monthlyFilialAllowance,
    hasProfessionalCert: validRole === 'social_worker' && rng() < 0.45,
    healthAlert: false,
    partTimeReduced: false,
  };

  // 依據組織型態與背景計算起始四大數值
  let energy = 74;
  let purpose = 70;
  let capital = 34;
  let life = 68;

  if (orgCfg.id === 'advocacy_ngo' || orgCfg.id === 'industrial_union') {
    purpose += 12;
    energy -= 6;
  } else if (orgCfg.id === 'corp_intl_ngo') {
    capital += 10;
    purpose -= 8;
    energy += 4;
  } else if (orgCfg.id === 'academic_society' || orgCfg.id === 'occupational_union') {
    capital += 6;
    purpose -= 2;
  } else if (orgCfg.id === 'grassroots') {
    purpose += 9;
    energy -= 5;
  }

  if (input.background === 'privileged') {
    life += 9;
  } else if (input.background === 'tight') {
    life -= 6;
    energy -= 3;
  } else if (input.background === 'burdened') {
    life -= 12;
    energy -= 6;
  }

  const stats: Stats = {
    energy: clamp(energy, 25, 95),
    purpose: clamp(purpose, 25, 95),
    capital: clamp(capital, 18, 85),
    life: clamp(life, 25, 95),
    impactScore: 10,
  };

  const orgName = pickRandom(orgCfg.namePool, rng);
  const issueArea = pickRandom(orgCfg.issuePool, rng);
  const boardClimate = pickRandom(orgCfg.boardClimates, rng);
  const customName = input.playerName?.trim().slice(0, 16);
  const playerName = customName || pickRandom(PLAYER_NAME_POOL, rng);
  const docNumber = generateDocNumber(orgCfg.id, startYear, rng);

  // 估算結構稀有度文句（與台灣整體生態對照）
  const empCfg = EMPLOYMENT_TYPES[employmentType];
  const salaryRankHint =
    monthlySalary >= 40000
      ? '前 20% 高起薪區間'
      : monthlySalary >= 34000
        ? '中位數區間'
        : '基層低薪起跑區間（占生態多數）';
  const rarityPercentileText = `本起點落於「${orgCfg.label}（結構占比 ${orgCfg.weight}%）× ${regionCfg.label}」，聘僱型態為【${empCfg.shortLabel}】，初始月薪 NT$ ${monthlySalary.toLocaleString()} 位於同業${salaryRankHint}。`;

  const peers = generateCohortPeers(input.startAge, orgCfg.id, startYear, playerName, rng);

  const initialOrgState: OrgState = {
    type: orgCfg.id,
    name: orgName,
    issueArea,
    sizeLabel: orgCfg.sizeLabel,
    fundingModel: orgCfg.fundingModel,
    financeLevel: orgCfg.defaultFinanceLevel,
    boardClimate,
    yearsInCurrentOrg: 0,
    isOutsideNPO: false,
  };

  const income = calculateMonthlyIncome({
    monthlySalary,
    roleLevel: 0,
    employmentType,
    org: initialOrgState,
    focus: 'fieldwork',
    currentQuarter: 1,
    stats,
    flags: [],
  });

  const draftForExpense = {
    region: input.region,
    lifeStatus,
    currentYear: startYear,
    startYear,
    monthlySalary,
    employmentType,
    age: input.startAge,
  };
  let expense = computeMonthlyExpense(draftForExpense, income.managementAllowance);
  if (expense.totalMonthly - income.grossMonthly > 3500) {
    if (employmentType === 'multi_employment' && lifeStatus.housing !== 'with_parents') {
      lifeStatus.housing = 'with_parents';
      expense = computeMonthlyExpense(draftForExpense, income.managementAllowance);
    }
    const remainingDeficit = expense.totalMonthly - income.grossMonthly;
    if (remainingDeficit > 3500) {
      initialSavings = Math.max(initialSavings, roundToHundred(remainingDeficit * 18));
    }
  }

  const initialChronicle: ChronicleEntry = {
    id: `chr_init_${startYear}_1`,
    year: startYear,
    quarter: 1,
    age: input.startAge,
    kind: 'milestone',
    tag: '正式報到',
    title: `加入「${orgName}」（${empCfg.shortLabel}）`,
    text: `你在 ${startYear} 年春天踏入台灣民間組織現場，以【${empCfg.label}】擔任${roleCfg.label}。桌上擺著前任留下的一疊卷宗與組織章程，發薪日還有二十五天。`,
  };

  return {
    docNumber,
    playerName,
    pace: input.pace,
    maxYears,
    startYear,
    currentYear: startYear,
    currentQuarter: 1,
    totalQuartersElapsed: 0,
    startAge: input.startAge,
    age: input.startAge,
    region: input.region,
    backgroundTier: input.background,
    backgroundLabel: bgCfg.label,
    backgroundSummary: bgCfg.description,
    rarityPercentileText,

    startOrgType: orgCfg.id,
    startOrgLabel: orgCfg.label,
    startRoleLabel: roleCfg.label,
    startSalary: monthlySalary,
    startEmploymentType: employmentType,

    org: initialOrgState,
    role: validRole,
    roleLevel: 0,
    employmentType,
    consecutiveFreezeYears: 0,
    monthlySalary,
    peakSalary: monthlySalary,
    savings: initialSavings,
    laborPensionTotal: 0,
    lastQuarterlyNet: income.grossMonthly * 3 - expense.totalMonthly * 3,
    lastIncomeBreakdown: income,
    lastExpenseBreakdown: expense,

    focus: 'fieldwork',
    stats,
    lastStatDelta: {},
    lifeStatus,
    peers,

    seenEventIds: [],
    eraEventsSeenCount: 0,
    flags: [],
    milestones: [`${startYear} 入行於${orgName}`],
    chronicle: [initialChronicle],
    historyPoints: [
      {
        year: startYear,
        age: input.startAge,
        salary: monthlySalary,
        monthlyExpense: expense.totalMonthly,
        energy: Math.round(stats.energy),
        purpose: Math.round(stats.purpose),
        capital: Math.round(stats.capital),
        life: Math.round(stats.life),
      },
    ],
    pendingEvent: null,
    quartersSinceLastEvent: 0,
    lowEnergyStreak: 0,
    lowPurposeStreak: 0,
    debtStreak: 0,
    eraNote: getEraNote(startYear),

    isEnded: false,
    endReason: null,
    archiveRecord: null,
  };
}

function interpolateText(text: string, state: SimulationState): string {
  const tokens = ORG_CONTEXT_TOKENS[state.org.type];
  return text
    .replaceAll('{orgNoun}', tokens.orgNoun)
    .replaceAll('{targetNoun}', tokens.targetNoun)
    .replaceAll('{weekendTask}', tokens.weekendTask)
    .replaceAll('{fieldMove}', tokens.fieldMove)
    .replaceAll('{certGoal}', tokens.certGoal)
    .replaceAll('{lectureTopic}', tokens.lectureTopic)
    .replaceAll('{hometownOrg}', tokens.hometownOrg)
    .replaceAll('{bossTitle}', tokens.bossTitle)
    .replaceAll('{boardNoun}', tokens.boardNoun)
    .replaceAll('{sectorFocus}', tokens.sectorFocus);
}

function interpolateEventForState(event: GameEvent, state: SimulationState): GameEvent {
  return {
    ...event,
    title: interpolateText(event.title, state),
    narrative: interpolateText(event.narrative, state),
    choices: event.choices.map((ch) => ({
      ...ch,
      label: interpolateText(ch.label, state),
      sublabel: interpolateText(ch.sublabel, state),
      outcomeText: interpolateText(ch.outcomeText, state),
      effect: ch.effect.milestoneTag
        ? {
            ...ch.effect,
            milestoneTag: interpolateText(ch.effect.milestoneTag, state),
          }
        : ch.effect,
    })),
  };
}

function isEventEligible(event: GameEvent, state: SimulationState): boolean {
  if (state.seenEventIds.includes(event.id)) return false;
  if (event.isEraEvent && state.eraEventsSeenCount >= 2) return false;

  const c = event.conditions;
  if (!c) return true;

  if (c.excludeOutsideNPO && state.org.isOutsideNPO) return false;
  if (c.onlyOutsideNPO && !state.org.isOutsideNPO) return false;
  if (c.startOrgTypes && !c.startOrgTypes.includes(state.startOrgType)) return false;
  if (c.orgTypes && !c.orgTypes.includes(state.org.type)) return false;
  if (c.excludeOrgTypes && c.excludeOrgTypes.includes(state.org.type)) return false;
  if (c.roles && !c.roles.includes(state.role)) return false;
  if (c.employmentTypes && !c.employmentTypes.includes(state.employmentType)) return false;
  if (c.minAge !== undefined && state.age < c.minAge) return false;
  if (c.maxAge !== undefined && state.age > c.maxAge) return false;

  const tenureYears = state.totalQuartersElapsed / 4;
  if (c.minTenure !== undefined && tenureYears < c.minTenure) return false;
  if (c.maxTenure !== undefined && tenureYears > c.maxTenure) return false;
  if (c.minOrgYears !== undefined && state.org.yearsInCurrentOrg < c.minOrgYears) return false;
  if (c.maxOrgYears !== undefined && state.org.yearsInCurrentOrg > c.maxOrgYears) return false;
  if (c.minRoleLevel !== undefined && state.roleLevel < c.minRoleLevel) return false;
  if (c.maxRoleLevel !== undefined && state.roleLevel > c.maxRoleLevel) return false;

  if (c.relationship && !c.relationship.includes(state.lifeStatus.relationship)) return false;
  if (c.hasChild !== undefined && state.lifeStatus.hasChild !== c.hasChild) return false;
  if (c.parentCare && !c.parentCare.includes(state.lifeStatus.parentCare)) return false;
  if (c.housing && !c.housing.includes(state.lifeStatus.housing)) return false;
  if (c.regions && !c.regions.includes(state.region)) return false;

  if (c.maxEnergy !== undefined && state.stats.energy > c.maxEnergy) return false;
  if (c.maxPurpose !== undefined && state.stats.purpose > c.maxPurpose) return false;
  if (c.minCapital !== undefined && state.stats.capital < c.minCapital) return false;
  if (c.maxSavings !== undefined && state.savings > c.maxSavings) return false;
  if (c.minSavings !== undefined && state.savings < c.minSavings) return false;

  if (c.requiresStudentLoan && state.lifeStatus.studentLoanRemaining <= 0) return false;
  if (c.requiresNoCert && state.lifeStatus.hasProfessionalCert) return false;
  if (c.requiredFlag && !state.flags.includes(c.requiredFlag)) return false;
  if (c.forbiddenFlag && state.flags.includes(c.forbiddenFlag)) return false;
  if (
    c.yearRange &&
    (state.currentYear < c.yearRange[0] || state.currentYear > c.yearRange[1])
  ) {
    return false;
  }

  return true;
}

function selectNextEvent(state: SimulationState, rng: () => number): GameEvent | null {
  const eligible = ALL_EVENTS.filter((ev) => isEventEligible(ev, state));
  if (eligible.length === 0) return null;

  // 若有緊急身心／意義警報，優先於其他一般事件觸發
  const urgent = eligible.filter(
    (e) => e.id === 'life_all_burnout_alarm' || e.id === 'life_all_meaning_crisis'
  );
  if (urgent.length > 0 && state.quartersSinceLastEvent >= 2) {
    return interpolateEventForState(pickRandom(urgent, rng), state);
  }

  // 時代事件在特定年份觸發（每局最多 2 次，避免開局前幾年被洗版）
  const eraCandidates = eligible.filter((e) => e.isEraEvent);
  if (
    state.eraEventsSeenCount < 2 &&
    eraCandidates.length > 0 &&
    state.quartersSinceLastEvent >= 4 &&
    rng() < 0.38
  ) {
    return interpolateEventForState(pickRandom(eraCandidates, rng), state);
  }

  // 控制事件觸發頻率：確保 100 季大約 20–24 個事件，64 季大約 14–16 個事件
  const minGap = 4;
  if (state.quartersSinceLastEvent < minGap) {
    return null;
  }
  const triggerChance = state.quartersSinceLastEvent >= 5 ? 1.0 : 0.65;
  if (rng() > triggerChance) {
    return null;
  }

  // 加權抽取：組織專屬事件與勞資爭議／工會求助優先度提升
  const weightedPool = eligible.map((ev) => {
    let w = ev.weight ?? 12;
    if (ev.conditions?.orgTypes?.includes(state.org.type)) {
      w *= 1.55;
    }
    if (ev.conditions?.startOrgTypes?.includes(state.startOrgType)) {
      w *= 1.45;
    }
    if (
      (ev.id === 'labor_seek_sw_union' || ev.id === 'labor_seek_npo_ind_union') &&
      (state.flags.includes('labor_dispute_hit') || state.employmentType !== 'regular')
    ) {
      w *= 1.9;
    }
    if (ev.conditions?.employmentTypes?.includes(state.employmentType)) {
      w *= 2.8;
    }
    if (ev.category === 'life' || ev.category === 'intertwined') {
      w *= 1.15;
    }
    if (ev.id === 'life40_parent_ltc_crisis') {
      if (state.age >= 55) {
        w *= 3.8;
      } else if (state.age >= 50) {
        w *= 3.0;
      } else if (state.age >= 45) {
        w *= 2.1;
      } else if (state.age >= 40) {
        w *= 1.4;
      }
    }
    return { item: ev, weight: w };
  });

  const totalW = weightedPool.reduce((acc, p) => acc + p.weight, 0);
  let r = rng() * totalW;
  for (const p of weightedPool) {
    r -= p.weight;
    if (r <= 0) return interpolateEventForState(p.item, state);
  }
  return interpolateEventForState(weightedPool[weightedPool.length - 1].item, state);
}

function applyStatDelta(
  current: Stats,
  delta?: StatDeltaMap,
  isQuarterlyDrift = false
): { next: Stats; applied: StatDeltaMap } {
  if (!delta) return { next: { ...current }, applied: {} };
  const scalePurpose = (cur: number, d?: number) => {
    if (!d) return 0;
    if (d < 0) return isQuarterlyDrift ? d : d * 1.3;
    if (cur >= 88) return d * 0.15;
    if (cur >= 75) return d * 0.35;
    if (cur >= 60) return d * 0.6;
    return d;
  };
  const scaleCapital = (cur: number, d?: number) => {
    if (!d || d <= 0) return d ?? 0;
    if (cur >= 92) return d * 0.08;
    if (cur >= 85) return d * 0.15;
    if (cur >= 75) return d * 0.3;
    if (cur >= 60) return d * 0.55;
    return d;
  };
  const scaleLife = (cur: number, d?: number) => {
    if (!d || d <= 0) return d ?? 0;
    if (cur >= 88) return d * 0.25;
    if (cur >= 75) return d * 0.5;
    return d;
  };
  const next: Stats = {
    energy: clamp(current.energy + (delta.energy ?? 0), 0, 100),
    purpose: clamp(current.purpose + scalePurpose(current.purpose, delta.purpose), 0, 100),
    capital: clamp(current.capital + scaleCapital(current.capital, delta.capital), 0, 100),
    life: clamp(current.life + scaleLife(current.life, delta.life), 0, 100),
    impactScore: Math.max(0, Math.round(current.impactScore + (delta.impactScore ?? 0))),
  };
  return { next, applied: delta };
}

function formatDeltaSummary(delta?: StatDeltaMap, salaryDelta?: number, savingsDelta?: number): string {
  const parts: string[] = [];
  if (delta?.energy) parts.push(`能量 ${delta.energy > 0 ? '+' : ''}${Math.round(delta.energy)}`);
  if (delta?.purpose) parts.push(`意義 ${delta.purpose > 0 ? '+' : ''}${Math.round(delta.purpose)}`);
  if (delta?.capital) parts.push(`資本 ${delta.capital > 0 ? '+' : ''}${Math.round(delta.capital)}`);
  if (delta?.life) parts.push(`生活 ${delta.life > 0 ? '+' : ''}${Math.round(delta.life)}`);
  if (delta?.impactScore) parts.push(`影響力 +${Math.round(delta.impactScore)}`);
  if (salaryDelta) parts.push(`月薪 ${salaryDelta > 0 ? '+' : ''}${salaryDelta.toLocaleString()}`);
  if (savingsDelta) parts.push(`存款 ${savingsDelta > 0 ? '+' : ''}${savingsDelta.toLocaleString()}`);
  return parts.join(' · ');
}

export function advanceQuarter(state: SimulationState, rng = Math.random): SimulationState {
  if (state.isEnded || state.pendingEvent) {
    return state;
  }

  let nextQuarter = (state.currentQuarter + 1) as 1 | 2 | 3 | 4 | 5;
  let nextYear = state.currentYear;
  let crossedNewYear = false;

  if (nextQuarter > 4) {
    nextQuarter = 1;
    nextYear += 1;
    crossedNewYear = true;
  }

  const totalQuartersElapsed = state.totalQuartersElapsed + 1;
  let nextAge = state.age;
  let nextOrgYears = state.org.yearsInCurrentOrg;
  let nextLifeStatus = { ...state.lifeStatus };
  let nextPeers = state.peers;
  let nextSalary = state.monthlySalary;
  let nextRoleLevel = state.roleLevel;
  let nextFreezeYears = state.consecutiveFreezeYears;

  if (crossedNewYear) {
    nextAge += 1;
    nextOrgYears += 1;
    nextLifeStatus.parentAge += 1;
    if (nextLifeStatus.childAge !== null) {
      nextLifeStatus.childAge += 1;
    }

    // 自然老化：父母 74 歲後若尚未提供孝親費，部分開始出現醫療／日常補貼需求
    if (
      nextLifeStatus.parentAge >= 74 &&
      nextLifeStatus.parentCare === 'healthy' &&
      rng() < 0.28
    ) {
      nextLifeStatus.parentCare = 'allowance';
      nextLifeStatus.monthlyFilialAllowance += 3000;
    }

    // 年度同梯夥伴推進
    const yearsElapsed = nextYear - state.startYear;
    nextPeers = advancePeersForYear(state.peers, nextYear, yearsElapsed, rng);

    // 任職滿 5 年且為正職基層者，自然晉升資深專職（不再永久卡在 0 級薪資天花板）
    if (
      state.employmentType === 'regular' &&
      !state.org.isOutsideNPO &&
      yearsElapsed >= 5 &&
      nextRoleLevel === 0
    ) {
      nextRoleLevel = 1;
    }

    // 每年 1–3 月：最低工資連動調整（0%–5%，貼近通膨、低薪者優先跟漲）與凍薪／天花板模型
    const cap = getSalaryCap(nextRoleLevel, state.org.isOutsideNPO, yearsElapsed);
    const minWageRate = ((rng() + rng()) / 2) * 0.05;
    const minWageInflation = Math.min(1.55, 1 + yearsElapsed * 0.02);
    const minWageFloor = Math.min(42000, roundToHundred(28590 * minWageInflation));
    let minWageLiftRate = 0;

    if (nextSalary < minWageFloor) {
      nextSalary = Math.min(cap, minWageFloor);
      minWageLiftRate = minWageRate;
    } else if (!state.org.isOutsideNPO && nextSalary < cap) {
      if (nextSalary <= 34000 && rng() < 0.85) {
        minWageLiftRate = minWageRate;
      } else if (nextSalary <= 40000 && rng() < 0.55) {
        minWageLiftRate = minWageRate * 0.75;
      } else if (nextSalary <= 46000 && rng() < 0.25) {
        minWageLiftRate = minWageRate * 0.5;
      }
      if (minWageLiftRate > 0) {
        nextSalary = Math.min(cap, roundToHundred(nextSalary * (1 + minWageLiftRate)));
      }
    }

    if (state.employmentType === 'multi_employment' || state.employmentType === 'contractor') {
      if (minWageLiftRate < 0.02) nextFreezeYears += 1;
    } else if (state.org.isOutsideNPO) {
      if (rng() < 0.75 && nextSalary < cap) {
        nextSalary = Math.min(cap, roundToHundred(nextSalary * 1.025));
        nextFreezeYears = 0;
      } else {
        nextFreezeYears += 1;
      }
    } else if (state.org.financeLevel >= 3) {
      if (rng() < 0.35 && nextSalary < cap) {
        nextSalary = Math.min(cap, roundToHundred(nextSalary * 1.018));
        nextFreezeYears = 0;
      } else if (minWageLiftRate >= 0.02) {
        nextFreezeYears = 0;
      } else {
        nextFreezeYears += 1;
      }
    } else if (state.org.financeLevel === 2) {
      if (rng() < 0.18 && nextSalary < cap) {
        nextSalary = Math.min(cap, roundToHundred(nextSalary * 1.014));
        nextFreezeYears = 0;
      } else if (minWageLiftRate >= 0.02) {
        nextFreezeYears = 0;
      } else {
        nextFreezeYears += 1;
      }
    } else if (minWageLiftRate < 0.02) {
      nextFreezeYears += 1;
    }
  }

  const income = calculateMonthlyIncome({
    monthlySalary: nextSalary,
    roleLevel: nextRoleLevel,
    employmentType: state.employmentType,
    org: state.org,
    focus: state.focus,
    currentQuarter: nextQuarter as 1 | 2 | 3 | 4,
    stats: state.stats,
    flags: state.flags,
  });

  const peakSalary = Math.max(state.peakSalary, nextSalary + income.managementAllowance);

  // 本季收支結算（3 個月）
  const expense = computeMonthlyExpense(
    {
      region: state.region,
      lifeStatus: nextLifeStatus,
      currentYear: nextYear,
      startYear: state.startYear,
      monthlySalary: nextSalary,
      employmentType: state.employmentType,
      age: nextAge,
    },
    income.managementAllowance
  );

  const focusCfg = FOCUS_OPTIONS.find((f) => f.id === state.focus) || FOCUS_OPTIONS[0];
  let quarterlyIncome = income.grossMonthly * 3;

  // Q4 年終獎金（依僱用型態與組織財力寫實發放）
  if (nextQuarter === 4) {
    const orgCfg = ORG_TYPES[state.org.type];
    let bonusMonths = 0;
    if (state.employmentType === 'contractor') {
      bonusMonths = 0;
    } else if (state.employmentType === 'multi_employment') {
      bonusMonths = rng() < 0.35 ? 0.2 : 0;
    } else if (state.org.isOutsideNPO) {
      bonusMonths = 1.8;
    } else if (state.org.financeLevel === 4) {
      bonusMonths = Math.min(1.5, orgCfg.maxYearEndMonths);
    } else if (state.org.financeLevel === 3) {
      bonusMonths = Math.min(1.0, orgCfg.maxYearEndMonths);
    } else if (state.org.financeLevel === 2) {
      bonusMonths = 0.5;
    }
    quarterlyIncome += Math.round((nextSalary + income.managementAllowance) * bonusMonths);
  }

  const quarterlyNet = quarterlyIncome - expense.totalMonthly * 3;
  const nextSavings = Math.round(state.savings + quarterlyNet);

  // 償還學貸本金
  if (nextLifeStatus.studentLoanRemaining > 0 && expense.studentLoan > 0) {
    nextLifeStatus.studentLoanRemaining = Math.max(
      0,
      nextLifeStatus.studentLoanRemaining - expense.studentLoan * 3
    );
    if (nextLifeStatus.studentLoanRemaining === 0) {
      nextLifeStatus.monthlyStudentLoan = 0;
    }
  }

  // 償還房貸期數與車貸本金
  if (nextLifeStatus.housing === 'mortgage' && nextLifeStatus.mortgageMonthsRemaining > 0) {
    nextLifeStatus.mortgageMonthsRemaining = Math.max(0, nextLifeStatus.mortgageMonthsRemaining - 3);
  }
  if (nextLifeStatus.carLoanRemaining > 0 && expense.carLoan > 0) {
    nextLifeStatus.carLoanRemaining = Math.max(0, nextLifeStatus.carLoanRemaining - expense.carLoan * 3);
    if (nextLifeStatus.carLoanRemaining === 0) {
      nextLifeStatus.monthlyCarLoan = 0;
    }
  }

  // 勞退 6% 提撥累計（多元就業方案屬公法救助關係、自然人承攬非僱傭，皆無雇主 6% 勞退提撥！）
  const pensionContrib =
    state.employmentType === 'contractor' || state.employmentType === 'multi_employment'
      ? 0
      : Math.round((nextSalary + income.managementAllowance) * 0.06 * 3);
  let nextPension = state.laborPensionTotal + pensionContrib;
  if (nextQuarter === 4) {
    nextPension = Math.round(nextPension * 1.022);
  }

  // 計算當季數值自然漂移
  let dEnergy = focusCfg.energyDelta;
  let dPurpose = focusCfg.purposeDelta;
  let dCapital = focusCfg.capitalDelta;
  let dLife = focusCfg.lifeDelta;
  let dImpact = focusCfg.impactDelta;

  if (state.org.financeLevel === 1) {
    dEnergy -= 0.4;
    dPurpose -= 0.45;
  }
  if (state.org.boardClimate === 'factional' || state.org.boardClimate === 'bureaucratic') {
    dPurpose -= 0.35;
  }
  if (state.org.boardClimate === 'factional') {
    dEnergy -= 0.35;
  }
  if (nextFreezeYears >= 2 && !state.org.isOutsideNPO) {
    dPurpose -= 0.7;
    dEnergy -= 0.2;
  }
  if (state.employmentType !== 'regular') {
    dPurpose -= 0.6;
    dLife -= 0.3;
  }
  if (nextLifeStatus.healthAlert) {
    dEnergy -= 0.6;
  }
  if (nextSavings < 0) {
    dLife -= 1.0;
    dEnergy -= 0.5;
  }
  if (state.org.isOutsideNPO) {
    dPurpose -= 0.45;
    dLife += 0.6;
    dImpact *= 0.6;
  }

  // 高分區與常態磨損、技能折舊，以及疲憊拖累生活連動
  if (state.stats.purpose > 75) {
    dPurpose -= 0.8;
  } else if (state.stats.purpose > 50) {
    dPurpose -= 0.45;
  }
  if (
    state.stats.purpose > 50 &&
    (state.org.boardClimate === 'bureaucratic' || state.org.boardClimate === 'factional' || state.org.isOutsideNPO)
  ) {
    dPurpose -= 0.2;
  }
  if (dPurpose < 0 && state.stats.purpose < 32) {
    dPurpose *= 0.35;
  }
  if (state.stats.capital > 75) {
    dCapital -= 0.75;
  } else if (state.stats.capital > 55) {
    dCapital -= 0.45;
  }
  if (state.stats.energy < 25) {
    dLife -= 1.2;
  } else if (state.stats.energy < 40) {
    dLife -= 0.5;
  }

  // 每季自然修復微調（避免非極端情境下線性墜谷）
  if (state.focus !== 'recovery' && state.stats.energy < 45) {
    dEnergy += 0.9;
  }

  const statDelta: StatDeltaMap = {
    energy: Number(dEnergy.toFixed(1)),
    purpose: Number(dPurpose.toFixed(1)),
    capital: Number(dCapital.toFixed(1)),
    life: Number(dLife.toFixed(1)),
    impactScore: Math.round(dImpact),
  };

  const { next: nextStats } = applyStatDelta(state.stats, statDelta, true);

  const lowEnergyStreak = nextStats.energy < 14 ? state.lowEnergyStreak + 1 : 0;
  const lowPurposeStreak = nextStats.purpose < 14 ? state.lowPurposeStreak + 1 : 0;
  const debtStreak = nextSavings < -40000 ? state.debtStreak + 1 : 0;

  const baseHistory = state.historyPoints ?? [];
  const nextHistoryPoints: CareerHistoryPoint[] = crossedNewYear
    ? [
        ...baseHistory,
        {
          year: nextYear,
          age: nextAge,
          salary: nextSalary + income.managementAllowance,
          monthlyExpense: expense.totalMonthly,
          energy: Math.round(nextStats.energy),
          purpose: Math.round(nextStats.purpose),
          capital: Math.round(nextStats.capital),
          life: Math.round(nextStats.life),
        },
      ]
    : baseHistory;

  let nextState: SimulationState = {
    ...state,
    currentYear: nextYear,
    currentQuarter: nextQuarter as 1 | 2 | 3 | 4,
    totalQuartersElapsed,
    age: nextAge,
    org: {
      ...state.org,
      yearsInCurrentOrg: nextOrgYears,
    },
    roleLevel: nextRoleLevel,
    consecutiveFreezeYears: nextFreezeYears,
    monthlySalary: nextSalary,
    peakSalary,
    savings: nextSavings,
    laborPensionTotal: nextPension,
    lastQuarterlyNet: quarterlyNet,
    lastIncomeBreakdown: income,
    lastExpenseBreakdown: expense,
    stats: nextStats,
    lastStatDelta: statDelta,
    lifeStatus: nextLifeStatus,
    peers: nextPeers,
    historyPoints: nextHistoryPoints,
    quartersSinceLastEvent: state.quartersSinceLastEvent + 1,
    lowEnergyStreak,
    lowPurposeStreak,
    debtStreak,
    eraNote: getEraNote(nextYear),
  };

  // 檢查結束條件（時程屆滿或危急退場）
  const maxQuarters = state.maxYears * 4;
  let endReason: CareerEndReason | null = null;

  if (nextStats.energy <= 0 || lowEnergyStreak >= 4) {
    endReason = 'burnout_exit';
  } else if (nextStats.purpose <= 0 || lowPurposeStreak >= 5) {
    endReason = 'meaning_exit';
  } else if (totalQuartersElapsed >= 8 && (nextSavings <= -120000 || debtStreak >= 6)) {
    endReason = 'financial_exit';
  } else if (nextAge >= 65) {
    endReason = 'retired_gracefully';
  } else if (totalQuartersElapsed >= maxQuarters) {
    endReason = 'completed_horizon';
  }

  if (endReason) {
    return finalizeCareer(nextState, endReason);
  }

  // 挑選是否觸發關鍵抉擇事件
  const triggeredEvent = selectNextEvent(nextState, rng);
  if (triggeredEvent) {
    return {
      ...nextState,
      pendingEvent: triggeredEvent,
      quartersSinceLastEvent: 0,
    };
  }

  // 無大事件時追加一筆具台灣現場感的季度紀事
  const recentTitles = new Set(state.chronicle.slice(0, 6).map((c) => c.title));
  let line = pickRoutineLine(nextState, rng);
  for (let i = 0; i < 4 && recentTitles.has(line.title); i++) {
    line = pickRoutineLine(nextState, rng);
  }

  const entry: ChronicleEntry = {
    id: `chr_${nextYear}_q${nextQuarter}_${totalQuartersElapsed}`,
    year: nextYear,
    quarter: nextQuarter as 1 | 2 | 3 | 4,
    age: nextAge,
    kind: 'routine',
    tag: line.tag,
    title: line.title,
    text: line.text,
  };

  return {
    ...nextState,
    chronicle: [entry, ...nextState.chronicle].slice(0, 120),
  };
}

export function resolveEventChoice(
  state: SimulationState,
  choiceIndex: number,
  rng = Math.random
): SimulationState {
  const event = state.pendingEvent;
  if (!event || state.isEnded) return state;

  const choice = event.choices[choiceIndex] || event.choices[0];
  const eff = choice.effect;

  const { next: nextStats } = applyStatDelta(state.stats, eff.statsDelta);

  let nextSalary = state.monthlySalary;
  if (eff.salaryMultiplier) {
    nextSalary = Math.max(28590, roundToHundred(nextSalary * eff.salaryMultiplier));
  }
  if (eff.salaryDelta) {
    nextSalary = Math.max(28590, roundToHundred(nextSalary + eff.salaryDelta));
  }

  let nextRole = state.role;
  let nextRoleLevel = state.roleLevel;
  let nextCustomRoleTitle = state.customRoleTitle;
  if (eff.roleLevelDelta) {
    nextRoleLevel = clamp(nextRoleLevel + eff.roleLevelDelta, 0, 3) as 0 | 1 | 2 | 3;
  }

  let nextEmploymentType = state.employmentType;
  if (eff.changeEmploymentType) {
    nextEmploymentType = eff.changeEmploymentType;
  }

  let nextOrg = { ...state.org };
  if (eff.changeOrgType) {
    nextCustomRoleTitle = undefined;
    const newCfg = ORG_TYPES[eff.changeOrgType];
    nextOrg = {
      type: eff.changeOrgType,
      name: eff.changeOrgName || pickRandom(newCfg.namePool, rng),
      issueArea: pickRandom(newCfg.issuePool, rng),
      sizeLabel: newCfg.sizeLabel,
      fundingModel: newCfg.fundingModel,
      financeLevel: newCfg.defaultFinanceLevel,
      boardClimate: eff.boardClimate || pickRandom(newCfg.boardClimates, rng),
      yearsInCurrentOrg: 0,
      isOutsideNPO: false,
    };
  } else if (eff.changeOrgName) {
    nextOrg.name = eff.changeOrgName;
    nextOrg.yearsInCurrentOrg = 0;
  }

  if (eff.changeRole) {
    nextRole = eff.changeRole;
  }
  if (eff.orgFinanceDelta) {
    nextOrg.financeLevel = clamp(nextOrg.financeLevel + eff.orgFinanceDelta, 1, 4) as 1 | 2 | 3 | 4;
  }
  if (eff.boardClimate) {
    nextOrg.boardClimate = eff.boardClimate;
  }

  if (eff.enterOutsideNPO) {
    nextCustomRoleTitle = undefined;
    nextOrg.isOutsideNPO = true;
    nextOrg.outsideOrgLabel = eff.enterOutsideNPO.orgName;
    nextOrg.name = eff.enterOutsideNPO.orgName;
    nextOrg.yearsInCurrentOrg = 0;
    nextRole = eff.enterOutsideNPO.role;
    nextSalary = eff.enterOutsideNPO.newSalary;
    nextEmploymentType = 'regular';
  }

  if (eff.returnToNPO) {
    nextCustomRoleTitle = undefined;
    const targetCfg = ORG_TYPES[eff.returnToNPO.orgType];
    nextOrg = {
      type: eff.returnToNPO.orgType,
      name: pickRandom(targetCfg.namePool, rng),
      issueArea: pickRandom(targetCfg.issuePool, rng),
      sizeLabel: targetCfg.sizeLabel,
      fundingModel: targetCfg.fundingModel,
      financeLevel: targetCfg.defaultFinanceLevel,
      boardClimate: 'trusting',
      yearsInCurrentOrg: 0,
      isOutsideNPO: false,
    };
    nextRole = eff.returnToNPO.role;
    nextSalary = eff.returnToNPO.newSalary;
    nextEmploymentType = 'regular';
  }

  if (eff.setRoleTitle) {
    nextCustomRoleTitle = eff.setRoleTitle;
  }

  const salaryCap = getSalaryCap(
    nextRoleLevel,
    nextOrg.isOutsideNPO,
    Math.max(0, state.currentYear - state.startYear)
  );
  if (nextSalary > salaryCap && !eff.enterOutsideNPO) {
    nextSalary = salaryCap;
  }
  const nextFreezeYears =
    (eff.salaryDelta && eff.salaryDelta > 0) || eff.enterOutsideNPO
      ? 0
      : state.consecutiveFreezeYears;

  const nextLifeStatus = { ...state.lifeStatus };
  if (eff.relationship) nextLifeStatus.relationship = eff.relationship;
  if (eff.housing) {
    nextLifeStatus.housing = eff.housing;
    if (eff.housing === 'mortgage') {
      if ((nextLifeStatus.mortgageMonthsRemaining ?? 0) <= 0) {
        nextLifeStatus.mortgageMonthsRemaining = 360;
      }
    } else {
      nextLifeStatus.mortgageMonthsRemaining = 0;
    }
  }
  if (eff.addCarLoan) {
    nextLifeStatus.carLoanRemaining =
      (nextLifeStatus.carLoanRemaining ?? 0) + eff.addCarLoan.totalAmount;
    nextLifeStatus.monthlyCarLoan = eff.addCarLoan.monthlyPayment;
  }
  if (eff.hasChild !== undefined) nextLifeStatus.hasChild = eff.hasChild;
  if (eff.childAge !== undefined) nextLifeStatus.childAge = eff.childAge;
  if (eff.parentCare) nextLifeStatus.parentCare = eff.parentCare;
  if (eff.monthlyFilialDelta) {
    nextLifeStatus.monthlyFilialAllowance = Math.max(
      0,
      nextLifeStatus.monthlyFilialAllowance + eff.monthlyFilialDelta
    );
  }
  if (eff.hasProfessionalCert !== undefined) nextLifeStatus.hasProfessionalCert = eff.hasProfessionalCert;
  if (eff.healthAlert !== undefined) nextLifeStatus.healthAlert = eff.healthAlert;
  if (eff.partTimeReduced !== undefined) nextLifeStatus.partTimeReduced = eff.partTimeReduced;

  let nextRegion: RegionId = state.region;
  if (eff.moveRegion) {
    nextRegion = eff.moveRegion;
  }

  const nextSavings = Math.round(state.savings + (eff.savingsDelta ?? 0));

  let nextFlags = [...state.flags];
  if (eff.setFlag && !nextFlags.includes(eff.setFlag)) {
    nextFlags.push(eff.setFlag);
  }
  if (eff.clearFlag) {
    nextFlags = nextFlags.filter((f) => f !== eff.clearFlag);
  }

  const nextMilestones = [...state.milestones];
  const orgChanged = nextOrg.name !== state.org.name;
  if (eff.milestoneTag) {
    const tagged = interpolateText(eff.milestoneTag, state);
    const withOrgName =
      orgChanged && !tagged.includes(nextOrg.name) ? `${tagged}（${nextOrg.name}）` : tagged;
    nextMilestones.push(`${state.currentYear}｜${withOrgName}`);
  } else if (orgChanged) {
    nextMilestones.push(`${state.currentYear}｜轉任「${nextOrg.name}」`);
  }

  const deltaSummary = formatDeltaSummary(eff.statsDelta, eff.salaryDelta, eff.savingsDelta);
  const newEntry: ChronicleEntry = {
    id: `chr_ev_${event.id}_${state.totalQuartersElapsed}`,
    year: state.currentYear,
    quarter: state.currentQuarter,
    age: state.age,
    kind: eff.milestoneTag ? 'milestone' : event.isEraEvent ? 'era' : 'event',
    tag: event.tag,
    title: event.title,
    text: `抉擇：${choice.label}`,
    outcomeText: choice.outcomeText,
    deltaSummary,
  };

  const income = calculateMonthlyIncome({
    monthlySalary: nextSalary,
    roleLevel: nextRoleLevel,
    employmentType: nextEmploymentType,
    org: nextOrg,
    focus: state.focus,
    currentQuarter: state.currentQuarter,
    stats: nextStats,
    flags: nextFlags,
  });

  const peakSalary = Math.max(state.peakSalary, nextSalary + income.managementAllowance);

  const expense = computeMonthlyExpense(
    {
      region: nextRegion,
      lifeStatus: nextLifeStatus,
      currentYear: state.currentYear,
      startYear: state.startYear,
      monthlySalary: nextSalary,
      employmentType: nextEmploymentType,
      age: state.age,
    },
    income.managementAllowance
  );

  const updatedState: SimulationState = {
    ...state,
    org: nextOrg,
    role: nextRole,
    roleLevel: nextRoleLevel,
    customRoleTitle: nextCustomRoleTitle,
    employmentType: nextEmploymentType,
    consecutiveFreezeYears: nextFreezeYears,
    region: nextRegion,
    monthlySalary: nextSalary,
    peakSalary,
    savings: nextSavings,
    lastIncomeBreakdown: income,
    lastExpenseBreakdown: expense,
    stats: nextStats,
    lastStatDelta: eff.statsDelta ?? {},
    lifeStatus: nextLifeStatus,
    flags: nextFlags,
    milestones: nextMilestones,
    seenEventIds: [...state.seenEventIds, event.id],
    eraEventsSeenCount: state.eraEventsSeenCount + (event.isEraEvent ? 1 : 0),
    chronicle: [newEntry, ...state.chronicle].slice(0, 120),
    pendingEvent: null,
  };

  if (eff.endGameReason) {
    return finalizeCareer(updatedState, eff.endGameReason);
  }
  if (nextStats.energy <= 0) {
    return finalizeCareer(updatedState, 'burnout_exit');
  }
  if (nextStats.purpose <= 0) {
    return finalizeCareer(updatedState, 'meaning_exit');
  }
  if (state.totalQuartersElapsed >= 8 && nextSavings <= -120000) {
    return finalizeCareer(updatedState, 'financial_exit');
  }

  return updatedState;
}

export function finalizeCareer(state: SimulationState, reason: CareerEndReason): SimulationState {
  if (state.isEnded && state.archiveRecord) return state;

  const archiveRecord = buildCareerArchive(state, reason);
  const endChronicle: ChronicleEntry = {
    id: `chr_end_${state.totalQuartersElapsed}`,
    year: state.currentYear,
    quarter: state.currentQuarter,
    age: state.age,
    kind: reason === 'burnout_exit' || reason === 'financial_exit' ? 'crisis' : 'milestone',
    tag: '檔案結算',
    title: `職涯階段結束：${archiveRecord.title}`,
    text: archiveRecord.epilogue,
  };

  saveArchiveRecord(archiveRecord);
  clearActiveCareer();

  return {
    ...state,
    pendingEvent: null,
    isEnded: true,
    endReason: reason,
    archiveRecord,
    chronicle: [endChronicle, ...state.chronicle].slice(0, 120),
  };
}

export function buildCareerArchive(
  state: SimulationState,
  endReason: CareerEndReason
): CareerArchiveRecord {
  const totalYears = Number((state.totalQuartersElapsed / 4).toFixed(1));
  const endOrgLabel = state.org.isOutsideNPO
    ? state.org.outsideOrgLabel || '企業永續／跨界部門'
    : ORG_TYPES[state.org.type].label;
  const endRoleLabel = getRoleDisplayTitle(state);
  const regionLabel = REGIONS[state.region].label;

  let title = '現場無名螺絲釘';
  let stampLabel = '結案歸檔';
  let epilogue = '';

  if (endReason === 'burnout_exit') {
    title = '燃燒殆盡前的緊急撤離';
    stampLabel = '身心停損';
    epilogue = `你在第 ${totalYears} 年因為長期過勞、情緒勞動與缺乏替手的組織結構，不得不按下了人生的緊急煞車。這不是失敗，而是身體替你做出「拒絕繼續自我消耗」的最後防禦。`;
  } else if (endReason === 'financial_exit') {
    title = '敗給都會帳單的理想者';
    stampLabel = '財務離場';
    epilogue = `在房租、通膨、學貸與家庭照護支出的夾擊下，第 ${totalYears} 年你的帳戶赤字終於觸及警戒線。真正把你推離這個現場的往往不是缺乏熱情，而是結構上長年無法支撐基本生活安全感的薪資線。`;
  } else if (
    state.flags.includes('quit_uncertain_path') ||
    (endReason === 'manual_close' && state.age < 55 && !state.org.isOutsideNPO)
  ) {
    title = '離開現場卻還不知去向的人';
    stampLabel = '中途離場';
    epilogue = `才 ${state.age} 歲的你遠遠還沒到能談退休的年紀，卻已先在第 ${totalYears} 年耗盡了留在組織的力氣。像台灣許多悄然離職的非營利工作者一樣，遞出辭呈的那天你其實還不知道下一步要轉行去哪裡——只知道必須先離開這裡，去外面的世界重新找回呼吸的辦法。`;
  } else if (endReason === 'meaning_exit') {
    title = '理想磨損後的安靜轉身';
    stampLabel = '意義歸零';
    epilogue = `經過 ${totalYears} 年的標案核銷、內部政治與政策撞牆期，你對這個體制徹底失去了感覺。趁著心還沒完全變冷之前離開，去尋找下一種能安頓自己的生活方式。`;
  } else if (state.flags.includes('pivoted_to_public_sector')) {
    title = '走進審查端的前線翻譯者';
    stampLabel = '轉戰公部門';
    epilogue = `經過 ${totalYears} 年民間現場的洗禮，你最終轉赴公部門社政或勞政約聘體系，換到穩定薪點與正常作息，也把真正看過現場痛點的視角帶進體制審查端。`;
  } else if (endReason === 'pivoted_to_corp' || state.org.isOutsideNPO) {
    title = '帶著現場記憶的跨界翻譯者';
    stampLabel = '跨界轉場';
    epilogue = `你在民間組織磨練出對法規、人群與現場痛點的深刻理解，最終轉戰企業 ESG 永續部門。你或許不再領著三四萬塊跑第一線，但仍把現場視角帶進了擁有更多資源的體制核心。`;
  } else if (
    (state.org.type === 'academic_society' ||
      state.org.type === 'industrial_union' ||
      state.org.type === 'occupational_union') &&
    totalYears >= 8
  ) {
    const isUnion = state.org.type === 'industrial_union' || state.org.type === 'occupational_union';
    title = '人民團體的不動記憶庫';
    stampLabel = '制度守門人';
    epilogue = `理事長與理監事換了一屆又一屆，只有你撐起了這間${ORG_TYPES[state.org.type].shortLabel}的帳本、${isUnion ? '工會法' : '人團法'}程序、會員尊嚴與集體記憶。沒有閃光燈照著你，但整個專業社群與會員都在你的日常行政裡受惠。`;
  } else if (state.milestones.some((m) => m.includes('立案'))) {
    title = '從零刻出印章的拓荒者';
    stampLabel = '自立門戶';
    epilogue = `走過既有體制的極限後，你選擇親手立案開創新的組織。這條路既窮又累，卻是你替這座島嶼留下最無法取代的制度作品。`;
  } else if (endReason === 'retired_gracefully' || (state.age >= 55 && state.stats.impactScore >= 140)) {
    title = '走完長路的現場長青樹';
    stampLabel = '圓滿交棒';
    epilogue = `經歷 ${totalYears} 年的高低起伏與數不完的年會、核銷與街頭，你守住了大部分的初衷，也學會照顧好自己與身邊的人，為台灣民間社會留下一段紮實的專業年輪。`;
  } else if (state.age < 55 && state.stats.impactScore >= 140) {
    title = '撐住中生代斷層的現場骨幹';
    stampLabel = '中堅留任';
    epilogue = `${state.age} 歲的你還沒到五十五歲能談退休的年紀，身邊同梯多半早已離職不知轉行去哪裡，你則成為組織裡少數留下的中生代支柱，用 ${totalYears} 年的實務經驗撐住服務不斷線。`;
  } else {
    title = '在縫隙中補網的實務者';
    stampLabel = '在場證明';
    epilogue = `沒有戲劇化的頭條新聞，但你在這 ${totalYears} 年間接過的電話、寫過的案子與陪過的人，都實實在在地改變了某些微小的日常。`;
  }

  const pensionLawNote =
    state.age >= 60
      ? `已年滿 ${state.age} 歲，依法符合勞退新制請領資格`
      : `目前僅 ${state.age} 歲，依法須年滿 60 歲（尚差 ${60 - state.age} 年）始得請領，目前暫封存於勞保局專戶`;

  const retainedLong = totalYears >= 8 && !state.org.isOutsideNPO;
  const statisticalNote = retainedLong
    ? `根據台灣非營利與人民團體人力現況，多數全職專員在入行 3 至 5 年內即離職且往往不知轉行何處，極少有人能真正待到 55 歲以後退休；你累計留在生態內走過 ${totalYears} 年並累積 NT$ ${state.laborPensionTotal.toLocaleString()} 勞退專戶（${pensionLawNote}），屬於極少數撐過中生代斷層的資深留任者。`
    : `在台灣約十萬名社福、倡議、學會與工會受僱者中，低薪、一人多工與照顧壓力使得多數人尚未走到 55 歲退休便悄然離職摸索轉行。你這段長達 ${totalYears} 年的經歷累積 NT$ ${state.laborPensionTotal.toLocaleString()} 勞退專戶（${pensionLawNote}），精準映照了民間部門與人生現實之間的拉鋸。`;

  const shareText = [
    `【做好事，是份好工作嗎？ v0.232｜台灣 NPO 與人民團體職涯結算】`,
    `檔案字號：${state.docNumber}`,
    `最終稱號：${title}（${stampLabel}）`,
    `經歷：${state.startYear}–${state.currentYear}（共 ${totalYears} 年｜${state.startAge} → ${state.age} 歲）`,
    `起點：${state.startOrgLabel} · ${state.startRoleLabel}（NT$ ${state.startSalary.toLocaleString()}）`,
    `終點：${state.org.name} · ${endRoleLabel}（NT$ ${state.monthlySalary.toLocaleString()}）`,
    `存款：NT$ ${state.savings.toLocaleString()} ｜ 勞退專戶：NT$ ${state.laborPensionTotal.toLocaleString()}（${state.age >= 60 ? '已滿60歲可領' : '未滿60歲還無法請領'}） ｜ 社會影響力：${state.stats.impactScore}`,
    `四維指標：能量 ${Math.round(state.stats.energy)} / 意義 ${Math.round(state.stats.purpose)} / 資本 ${Math.round(state.stats.capital)} / 生活 ${Math.round(state.stats.life)}`,
  ].join('\n');

  const rawHistory = state.historyPoints ?? [];
  const finalHistoryPoint: CareerHistoryPoint = {
    year: state.currentYear,
    age: state.age,
    salary: state.monthlySalary + (state.lastIncomeBreakdown?.managementAllowance ?? 0),
    monthlyExpense: state.lastExpenseBreakdown.totalMonthly,
    energy: Math.round(state.stats.energy),
    purpose: Math.round(state.stats.purpose),
    capital: Math.round(state.stats.capital),
    life: Math.round(state.stats.life),
  };
  const lastPoint = rawHistory[rawHistory.length - 1];
  const historyPoints: CareerHistoryPoint[] =
    lastPoint && lastPoint.year === state.currentYear
      ? [...rawHistory.slice(0, -1), finalHistoryPoint]
      : [...rawHistory, finalHistoryPoint];

  return {
    id: `arch_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    completedAtIso: new Date().toISOString(),
    docNumber: state.docNumber,
    playerName: state.playerName,
    title,
    stampLabel,
    epilogue,
    endReason,
    startYear: state.startYear,
    endYear: state.currentYear,
    startAge: state.startAge,
    endAge: state.age,
    totalYears,
    startOrgType: state.startOrgType,
    startOrgLabel: state.startOrgLabel,
    startEmploymentType: state.startEmploymentType,
    endOrgType: state.org.type,
    endOrgLabel,
    endOrgName: state.org.name,
    endEmploymentType: state.employmentType,
    endRoleLabel,
    regionLabel,
    startSalary: state.startSalary,
    endSalary: state.monthlySalary,
    peakSalary: state.peakSalary,
    finalSavings: state.savings,
    laborPensionTotal: state.laborPensionTotal,
    impactScore: state.stats.impactScore,
    finalStats: { ...state.stats },
    milestones: state.milestones,
    peers: state.peers,
    historyPoints,
    statisticalNote,
    shareText,
  };
}

export function loadArchiveRecords(): CareerArchiveRecord[] {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  try {
    const raw = window.localStorage.getItem(ARCHIVE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveArchiveRecord(record: CareerArchiveRecord): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const existing = loadArchiveRecords().filter((r) => r.docNumber !== record.docNumber);
    const updated = [record, ...existing].slice(0, 30);
    window.localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // 忽略 private mode 或容量限制錯誤
  }
}

export function saveActiveCareer(state: SimulationState): void {
  if (typeof window === 'undefined' || !window.localStorage || state.isEnded) return;
  try {
    window.localStorage.setItem(ACTIVE_SAVE_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // 忽略 private mode 或容量限制錯誤
  }
}

export function loadActiveCareer(): SimulationState | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = window.localStorage.getItem(ACTIVE_SAVE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SimulationState;
    if (
      !parsed ||
      parsed.isEnded ||
      typeof parsed.currentYear !== 'number' ||
      !parsed.org ||
      !parsed.stats ||
      !Array.isArray(parsed.peers)
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearActiveCareer(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.removeItem(ACTIVE_SAVE_STORAGE_KEY);
  } catch {
    // ignore storage errors
  }
}

export function pickAutoChoiceIndex(event: GameEvent, state: SimulationState): number {
  // 自動抉擇傾向平衡保住低數值避免直接暴斃，模擬有理性的工作者
  let bestIdx = 0;
  let bestScore = -Infinity;

  event.choices.forEach((choice, idx) => {
    const d = choice.effect.statsDelta || {};
    let score = 0;
    const eWeight = state.stats.energy < 35 ? 2.2 : 1.0;
    const pWeight = state.stats.purpose < 35 ? 2.0 : 1.0;
    const lWeight = state.stats.life < 35 ? 1.8 : 1.0;

    score += (d.energy ?? 0) * eWeight;
    score += (d.purpose ?? 0) * pWeight;
    score += (d.capital ?? 0) * 1.1;
    score += (d.life ?? 0) * lWeight;
    score += (d.impactScore ?? 0) * 0.4;
    score += (choice.effect.salaryDelta ?? 0) / 800;
    score += (choice.effect.savingsDelta ?? 0) / 10000;
    if (choice.effect.endGameReason) score -= 50; // 自動模式盡量跑完整歷程
    if (score > bestScore) {
      bestScore = score;
      bestIdx = idx;
    }
  });

  return bestIdx;
}
