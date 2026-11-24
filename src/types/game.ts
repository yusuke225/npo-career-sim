export type OrgTypeId =
  | 'grassroots'
  | 'large_welfare'
  | 'local_foundation'
  | 'advocacy_ngo'
  | 'academic_society'
  | 'industrial_union'
  | 'occupational_union'
  | 'corp_intl_ngo';

export type RoleId =
  | 'social_worker'
  | 'project_exec'
  | 'advocacy_researcher'
  | 'fundraiser_pr'
  | 'admin_finance'
  | 'society_secretary'
  | 'society_event_pub'
  | 'union_organizer'
  | 'union_admin'
  | 'corp_esg_officer';

export type RegionId = 'taipei_metro' | 'other_six' | 'non_six_rural';

export type FocusId = 'fieldwork' | 'growth' | 'recovery' | 'finance' | 'advocacy';

export type BackgroundTierId = 'privileged' | 'independent' | 'tight' | 'burdened';

export type PaceMode = 'standard' | 'compact';

export type ThemeMode = 'light' | 'dark';

export type HousingType = 'shared_room' | 'studio_rent' | 'with_parents' | 'mortgage';

export type RelationshipStatus = 'single' | 'dating' | 'married';

export type ParentCareStatus = 'healthy' | 'allowance' | 'long_term_care';

export type BoardClimate = 'trusting' | 'bureaucratic' | 'factional' | 'transition';

export type EmploymentType = 'regular' | 'multi_employment' | 'contractor';

export interface LifeStatus {
  housing: HousingType;
  relationship: RelationshipStatus;
  hasChild: boolean;
  childAge: number | null;
  parentCare: ParentCareStatus;
  parentAge: number;
  studentLoanRemaining: number; // 剩餘學貸總額（NTD）
  monthlyStudentLoan: number; // 每月固定償還（NTD）
  monthlyFilialAllowance: number; // 每月固定孝親費（NTD）
  hasProfessionalCert: boolean; // 證照或碩士學歷加給資格
  healthAlert: boolean; // 健檢紅字警告
  partTimeReduced: boolean; // 是否曾因照顧減班／轉兼職
}

export interface OrgState {
  type: OrgTypeId;
  name: string;
  issueArea: string;
  sizeLabel: string;
  fundingModel: string;
  financeLevel: 1 | 2 | 3 | 4; // 1: 瀕臨斷炊, 2: 吃緊, 3: 尚可, 4: 充裕
  boardClimate: BoardClimate;
  yearsInCurrentOrg: number;
  isOutsideNPO: boolean; // 是否暫時/正式轉出至企業 ESG 或公部門
  outsideOrgLabel?: string;
}

export interface Stats {
  energy: number; // 身心能量 0-100
  purpose: number; // 理想意義 0-100
  capital: number; // 專業與人脈 0-100
  life: number; // 生活與關係 0-100
  impactScore: number; // 累計社會影響力分數
}

export type StatDeltaMap = Partial<Record<'energy' | 'purpose' | 'capital' | 'life' | 'impactScore', number>>;

export type PeerStatus =
  | 'active'
  | 'promoted'
  | 'pivoted'
  | 'resting'
  | 'founded'
  | 'studying';

export interface PeerWorker {
  id: string;
  name: string;
  age: number;
  startOrgLabel: string;
  startRoleLabel: string;
  orgType: OrgTypeId;
  currentStatus: PeerStatus;
  currentLabel: string;
  latestNote: string;
  salaryEstimate: number;
  history: string[];
}

export interface EventConditions {
  orgTypes?: OrgTypeId[];
  startOrgTypes?: OrgTypeId[];
  excludeOrgTypes?: OrgTypeId[];
  roles?: RoleId[];
  employmentTypes?: EmploymentType[];
  excludeOutsideNPO?: boolean;
  onlyOutsideNPO?: boolean;
  minAge?: number;
  maxAge?: number;
  minTenure?: number; // 總年資
  maxTenure?: number;
  minOrgYears?: number; // 現職年資
  minRoleLevel?: number;
  maxRoleLevel?: number;
  relationship?: RelationshipStatus[];
  hasChild?: boolean;
  parentCare?: ParentCareStatus[];
  housing?: HousingType[];
  regions?: RegionId[];
  maxEnergy?: number;
  maxPurpose?: number;
  minCapital?: number;
  maxSavings?: number;
  minSavings?: number;
  requiresStudentLoan?: boolean;
  requiresNoCert?: boolean;
  requiredFlag?: string;
  forbiddenFlag?: string;
  yearRange?: [number, number];
}

export interface ChoiceEffect {
  statsDelta?: StatDeltaMap;
  salaryDelta?: number; // 月薪直接增減 (NTD)
  salaryMultiplier?: number; // 例如 1.15
  savingsDelta?: number; // 存款一次增減 (NTD)
  roleLevelDelta?: number; // 升遷 (+1) 或降載
  changeRole?: RoleId;
  changeOrgType?: OrgTypeId;
  changeOrgName?: string;
  changeEmploymentType?: EmploymentType;
  orgFinanceDelta?: number;
  boardClimate?: BoardClimate;
  relationship?: RelationshipStatus;
  housing?: HousingType;
  hasChild?: boolean;
  childAge?: number | null;
  parentCare?: ParentCareStatus;
  monthlyFilialDelta?: number;
  hasProfessionalCert?: boolean;
  healthAlert?: boolean;
  partTimeReduced?: boolean;
  moveRegion?: RegionId;
  enterOutsideNPO?: {
    orgName: string;
    role: RoleId;
    newSalary: number;
  };
  returnToNPO?: {
    orgType: OrgTypeId;
    role: RoleId;
    newSalary: number;
  };
  setFlag?: string;
  clearFlag?: string;
  endGameReason?: CareerEndReason;
  milestoneTag?: string;
}

export interface EventChoice {
  id: string;
  label: string;
  sublabel: string;
  effect: ChoiceEffect;
  outcomeText: string;
}

export type EventCategory = 'work' | 'life' | 'intertwined' | 'era';

export interface GameEvent {
  id: string;
  title: string;
  category: EventCategory;
  tag: string;
  weight?: number;
  isEraEvent?: boolean;
  conditions?: EventConditions;
  narrative: string;
  choices: EventChoice[];
}

export interface ChronicleEntry {
  id: string;
  year: number;
  quarter: 1 | 2 | 3 | 4;
  age: number;
  kind: 'routine' | 'event' | 'era' | 'milestone' | 'crisis';
  tag: string;
  title: string;
  text: string;
  outcomeText?: string;
  deltaSummary?: string;
}

export interface ExpenseBreakdown {
  housing: number;
  living: number;
  studentLoan: number;
  filialCare: number;
  childCare: number;
  longTermCare: number;
  payrollDeduction: number;
  selfPaidInsurance: number;
  inflationFactor: number;
  totalMonthly: number;
}

export type CareerEndReason =
  | 'completed_horizon'
  | 'retired_gracefully'
  | 'burnout_exit'
  | 'financial_exit'
  | 'meaning_exit'
  | 'pivoted_to_corp'
  | 'manual_close';

export interface CareerHistoryPoint {
  year: number;
  age: number;
  salary: number;
  monthlyExpense: number;
  energy?: number;
  purpose?: number;
  capital?: number;
  life?: number;
}

export interface CareerArchiveRecord {
  id: string;
  completedAtIso: string;
  docNumber: string;
  playerName: string;
  title: string;
  stampLabel: string;
  epilogue: string;
  endReason: CareerEndReason;
  startYear: number;
  endYear: number;
  startAge: number;
  endAge: number;
  totalYears: number;
  startOrgType: OrgTypeId;
  startOrgLabel: string;
  startEmploymentType: EmploymentType;
  endOrgType: OrgTypeId;
  endOrgLabel: string;
  endOrgName: string;
  endEmploymentType: EmploymentType;
  endRoleLabel: string;
  regionLabel: string;
  startSalary: number;
  endSalary: number;
  peakSalary: number;
  finalSavings: number;
  laborPensionTotal: number;
  impactScore: number;
  finalStats: Stats;
  milestones: string[];
  peers: PeerWorker[];
  historyPoints?: CareerHistoryPoint[];
  statisticalNote: string;
  shareText: string;
}

export interface StartConfigInput {
  orgType: OrgTypeId;
  role: RoleId;
  region: RegionId;
  background: BackgroundTierId;
  employmentType?: EmploymentType;
  startAge: number;
  pace: PaceMode;
  playerName?: string;
}

export interface SimulationState {
  docNumber: string;
  playerName: string;
  pace: PaceMode;
  maxYears: number;
  startYear: number;
  currentYear: number;
  currentQuarter: 1 | 2 | 3 | 4;
  totalQuartersElapsed: number;
  startAge: number;
  age: number;
  region: RegionId;
  backgroundTier: BackgroundTierId;
  backgroundLabel: string;
  backgroundSummary: string;
  rarityPercentileText: string;

  startOrgType: OrgTypeId;
  startOrgLabel: string;
  startRoleLabel: string;
  startSalary: number;
  startEmploymentType: EmploymentType;

  org: OrgState;
  role: RoleId;
  roleLevel: 0 | 1 | 2 | 3; // 0: 專員/基層, 1: 資深/督導, 2: 組長/副秘書長, 3: 秘書長/執行長/理事長顧問
  employmentType: EmploymentType;
  consecutiveFreezeYears: number;
  monthlySalary: number;
  peakSalary: number;
  savings: number;
  laborPensionTotal: number; // 勞退 6% 專戶累計
  lastQuarterlyNet: number;
  lastExpenseBreakdown: ExpenseBreakdown;

  focus: FocusId;
  stats: Stats;
  lastStatDelta: StatDeltaMap;
  lifeStatus: LifeStatus;
  peers: PeerWorker[];

  seenEventIds: string[];
  eraEventsSeenCount: number;
  flags: string[];
  milestones: string[];
  chronicle: ChronicleEntry[];
  historyPoints?: CareerHistoryPoint[];
  pendingEvent: GameEvent | null;
  quartersSinceLastEvent: number;
  lowEnergyStreak: number;
  lowPurposeStreak: number;
  debtStreak: number;
  eraNote: string;

  isEnded: boolean;
  endReason: CareerEndReason | null;
  archiveRecord: CareerArchiveRecord | null;
}
