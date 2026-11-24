import { useEffect, useState } from 'react';
import {
  Archive,
  ChevronDown,
  ChevronUp,
  Dices,
  Play,
  SlidersHorizontal,
  Smartphone,
  Trash2,
} from 'lucide-react';
import faviconImg from '../assets/favicon.png';
import heroMainImg from '../assets/hero-main.webp';
import {
  BACKGROUND_TIERS,
  EMPLOYMENT_TYPES,
  ORG_TYPES,
  ORG_TYPE_LIST,
  REGIONS,
  ROLES,
} from '../data/organizations';
import { getRoleDisplayTitle } from '../engine/simulation';
import type {
  BackgroundTierId,
  EmploymentType,
  OrgTypeId,
  PaceMode,
  RegionId,
  RoleId,
  SimulationState,
  StartConfigInput,
  ThemeMode,
} from '../types/game';
import { BgmToggle } from './BgmToggle';
import { ThemeToggle } from './ThemeToggle';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const RELEASE_CHANGELOG: Array<{ version: string; tag: string; summary: string }> = [
  {
    version: 'v0.22',
    tag: '最新',
    summary:
      '新增結算結局圖徽、收支長條＋四維指標折線圖、理想意義×身心能量軌跡象限圖與紀念卡 PNG 下載；加入背景音樂、擴充 24 間組織樣本與 64 組隨機姓名，並微調數值封頂與同梯營利事業去向／薪資對照。',
  },
  {
    version: 'v0.21',
    tag: '平衡更新',
    summary:
      '支援玩家自訂或修改姓名，依 2025 年物價重整日常開銷與生活事件，新增 NPO／勞研所在職進修及工會聯誼／勞教事件，並於結算頁加入臺灣非營利組織產業工會（NPOIU）關注連結。',
  },
  {
    version: 'v0.2',
    tag: '體驗優化',
    summary:
      '手機版新增頂部進度欄、事件／狀態雙分頁與加到主畫面提示；修正組織法制與工會用語、補齊 16 則各類型組織專屬事件，並規範全職獎金發放條件。',
  },
  {
    version: 'v0.121',
    tag: '事件校對',
    summary:
      '收斂各類組織專屬事件的觸發範圍，修正同梯夥伴薪資進程與「最終月薪／離職前月薪」標示，並建立自動化模擬驗證流程。',
  },
  {
    version: 'v0.12',
    tag: '制度修正',
    summary:
      '優化首頁排版與說明文案，並依台灣法制修正多元就業／自然人承攬無雇主 6% 勞退提撥規則。',
  },
  {
    version: 'v0.1',
    tag: '初版上線',
    summary:
      '建立 8 類台灣非營利與人民團體組織模型、四大職涯核心指標、季度收支與房租／扶養結構，以及多結局職涯紀事系統。',
  },
];

interface LandingScreenProps {
  theme: ThemeMode;
  bgmOn: boolean;
  pace: PaceMode;
  playerName: string;
  archiveCount: number;
  savedCareer: SimulationState | null;
  onToggleTheme: () => void;
  onToggleBgm: () => void;
  onChangePace: (pace: PaceMode) => void;
  onChangePlayerName: (name: string) => void;
  onStartRandom: () => void;
  onStartCustom: (config: StartConfigInput) => void;
  onResumeCareer: () => void;
  onDiscardSavedCareer: () => void;
  onOpenArchive: () => void;
}

export function LandingScreen({
  theme,
  bgmOn,
  pace,
  playerName,
  archiveCount,
  savedCareer,
  onToggleTheme,
  onToggleBgm,
  onChangePace,
  onChangePlayerName,
  onStartRandom,
  onStartCustom,
  onResumeCareer,
  onDiscardSavedCareer,
  onOpenArchive,
}: LandingScreenProps) {
  const [showCustom, setShowCustom] = useState(false);
  const [showAllChangelog, setShowAllChangelog] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [orgType, setOrgType] = useState<OrgTypeId>('large_welfare');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const standalone =
      window.matchMedia?.('(display-mode: standalone)').matches ||
      Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
    setIsStandalone(standalone);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    const handleInstalled = () => {
      setDeferredPrompt(null);
      setShowInstallGuide(false);
      setIsStandalone(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const handleAddToHomeScreen = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowInstallGuide(false);
      }
      return;
    }
    setShowInstallGuide((prev) => !prev);
  };

  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const isInAppBrowser = /Line|FBAN|FBAV|Instagram/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const [role, setRole] = useState<RoleId>('social_worker');
  const [region, setRegion] = useState<RegionId>('taipei_metro');
  const [background, setBackground] = useState<BackgroundTierId>('independent');
  const [employmentType, setEmploymentType] = useState<EmploymentType>('regular');
  const [startAge, setStartAge] = useState<number>(25);

  const selectedOrgCfg = ORG_TYPES[orgType];

  const handleOrgTypeChange = (nextOrg: OrgTypeId) => {
    setOrgType(nextOrg);
    const allowed = ORG_TYPES[nextOrg].allowedRoles;
    if (!allowed.includes(role)) {
      setRole(allowed[0]);
    }
  };

  return (
    <div className="landing-shell">
      <header className="top-nav-minimal">
        <div className="brand-mark">
          <img
            src={faviconImg}
            alt="做好事，是份好工作嗎？圖示"
            className="brand-icon"
            width={30}
            height={30}
          />
          <strong className="font-serif" style={{ fontSize: 17 }}>
            做好事，是份好工作嗎？
          </strong>
          <span className="brand-code">1 IN 100,000 · TW-NPO SIM v0.22</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-sm" onClick={onOpenArchive}>
            <Archive size={15} />
            <span>職涯檔案 ({archiveCount})</span>
          </button>
          <BgmToggle enabled={bgmOn} onToggle={onToggleBgm} />
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </header>

      <main className="card landing-hero">
        <div className="hero-visual-banner">
          <img
            src={heroMainImg}
            alt="台灣雨夜街頭裡撐傘走過物資站、騎樓照顧長輩與加班燈火的民間組織工作者"
            className="hero-visual-img"
          />
          <div className="hero-visual-fade" />
          <div className="hero-visual-caption">
            <span className="hero-visual-badge">
              雨夜裡的十萬分之一｜撐傘趕路的工作者、騎樓推輪椅的陪伴與樓上未熄的辦公室燈火
            </span>
          </div>
        </div>
        <div className="hero-kicker">1 IN 100,000 ｜ 非營利組織職涯模擬器</div>
        <h1 className="hero-title">做好事，是份好工作嗎？</h1>
        <p className="hero-subtitle">
          台灣非營利組織促成的每件好事，背後是 10 萬名工作者撐起的日常。現在，讓我們看看其中 10 萬分之一的你。
        </p>
        <p className="hero-lead">
          在台灣的社福機構、基金會、協會、倡議團體、學會與工會裡，有約10萬名專職工作者撐起民間社會的日常運作。入行時你無法決定組織體質、理監事會氣候或家裡有沒有留房給你——按下抽取，走過一段職場與人生壓力交織的真實年歲，並同時對照四位同年入行夥伴的命運分歧。
        </p>

        {savedCareer && !savedCareer.isEnded && (
          <div className="resume-career-box">
            <div className="resume-career-info">
              <div className="resume-career-title">
                未完成的職涯存檔：{savedCareer.playerName}（{savedCareer.age} 歲）｜{' '}
                {savedCareer.org.name} · {getRoleDisplayTitle(savedCareer)}
              </div>
              <div className="resume-career-meta font-mono">
                進度：{savedCareer.currentYear} 年 Q{savedCareer.currentQuarter}（第{' '}
                {savedCareer.totalQuartersElapsed} / {savedCareer.maxYears * 4} 季）｜ 存款 NT${' '}
                {savedCareer.savings.toLocaleString()}
                {savedCareer.pendingEvent ? ' ｜ 待處理事件抉擇' : ''}
              </div>
            </div>
            <div className="resume-career-actions">
              <button type="button" className="btn btn-primary" onClick={onResumeCareer}>
                <Play size={15} />
                <span>繼續職涯</span>
              </button>
              <button
                type="button"
                className="btn btn-sm"
                onClick={onDiscardSavedCareer}
                title="刪除未完成暫存進度"
              >
                <Trash2 size={14} />
                <span>清除暫存</span>
              </button>
            </div>
          </div>
        )}

        <div className="pace-selector" role="radiogroup" aria-label="模擬節奏選擇">
          <button
            type="button"
            className={`pace-pill ${pace === 'standard' ? 'active' : ''}`}
            onClick={() => onChangePace('standard')}
          >
            <div className="pace-pill-title">完整職涯</div>
            <div className="pace-pill-desc">
              橫跨 25 年（100 季），約 20–24 個關鍵抉擇，完整經歷世代交棒與時代變遷（約 12–16 分鐘）
            </div>
          </button>
          <button
            type="button"
            className={`pace-pill ${pace === 'compact' ? 'active' : ''}`}
            onClick={() => onChangePace('compact')}
          >
            <div className="pace-pill-title">快速體驗</div>
            <div className="pace-pill-desc">
              濃縮 16 年（64 季），約 14–16 個核心兩難抉擇，適合單次快速體驗（約 8–10 分鐘）
            </div>
          </button>
        </div>

        <div className="field-group" style={{ marginBottom: 18, maxWidth: 360 }}>
          <label className="field-label" htmlFor="inp-player-name">
            你的姓名／暱稱（選填，留空將隨機命名）
          </label>
          <input
            id="inp-player-name"
            type="text"
            className="field-select"
            maxLength={16}
            value={playerName}
            onChange={(e) => onChangePlayerName(e.target.value)}
            placeholder="例如：林小安（留空則隨機抽取）"
          />
        </div>

        <div className="hero-actions">
          <button type="button" className="btn btn-primary hero-cta-main" onClick={onStartRandom}>
            <Dices size={18} />
            <span>抽取一段職涯</span>
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => setShowCustom((prev) => !prev)}
            aria-expanded={showCustom}
          >
            <SlidersHorizontal size={16} />
            <span>自選組織與起點</span>
            {showCustom ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
          {!isStandalone && (
            <button
              type="button"
              className="btn"
              onClick={handleAddToHomeScreen}
              aria-expanded={showInstallGuide}
              title="將本網站釘選到手機桌面，像 App 一樣快速開啟"
            >
              <Smartphone size={16} />
              <span>加入手機主畫面</span>
            </button>
          )}
        </div>
        {showInstallGuide && !isStandalone && (
          <div
            className="org-preview-box"
            style={{ marginTop: 12, fontSize: 13, lineHeight: 1.7 }}
          >
            <strong>如何將本模擬器加到手機桌面：</strong>
            {isInAppBrowser ? (
              <div>
                目前偵測到您正在 LINE / Facebook / IG 內建瀏覽器開啟。請先點選畫面右上角或右下角選單，選擇「
                <strong>以預設瀏覽器開啟（Safari / Chrome）</strong>」，再執行「加入主畫面」。
              </div>
            ) : isIOS ? (
              <div>
                請點擊 Safari 下方工具列的「<strong>分享（↑）</strong>」按鈕，往下滑選擇「
                <strong>加入主畫面</strong>」，再點右上角「新增」即可在桌面建立捷徑。
              </div>
            ) : (
              <div>
                請點擊瀏覽器右上角「<strong>⋮ 選單</strong>」，選擇「
                <strong>加入主畫面</strong>」或「<strong>安裝應用程式</strong>」即可建立桌面捷徑（iPhone
                請用 Safari 點下方分享鈕 → 加入主畫面）。
              </div>
            )}
          </div>
        )}
        <p style={{ margin: '10px 0 0', fontSize: 12, color: 'var(--ink-muted)' }}>
          註：遊戲可以中途存檔，但同時只能保存一段職涯。推薦以電腦瀏覽器遊玩。
        </p>
      </main>

      {showCustom && (
        <section className="card custom-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 18 }}>入行起點</h2>
            <span className="tag">體驗指定組織／職務生態</span>
          </div>

          <div className="custom-grid">
            <div className="field-group">
              <label className="field-label" htmlFor="sel-org">
                組織類型（共 8 類）
              </label>
              <select
                id="sel-org"
                className="field-select"
                value={orgType}
                onChange={(e) => handleOrgTypeChange(e.target.value as OrgTypeId)}
              >
                {ORG_TYPE_LIST.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}（{o.legalForm}）
                  </option>
                ))}
              </select>
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="sel-role">
                初始職務
              </label>
              <select
                id="sel-role"
                className="field-select"
                value={role}
                onChange={(e) => setRole(e.target.value as RoleId)}
              >
                {selectedOrgCfg.allowedRoles.map((rId) => (
                  <option key={rId} value={rId}>
                    {ROLES[rId].label}
                  </option>
                ))}
              </select>
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="sel-region">
                執業地區
              </label>
              <select
                id="sel-region"
                className="field-select"
                value={region}
                onChange={(e) => setRegion(e.target.value as RegionId)}
              >
                {Object.values(REGIONS).map((reg) => (
                  <option key={reg.id} value={reg.id}>
                    {reg.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="sel-bg">
                個人與家庭經濟背景
              </label>
              <select
                id="sel-bg"
                className="field-select"
                value={background}
                onChange={(e) => setBackground(e.target.value as BackgroundTierId)}
              >
                {Object.values(BACKGROUND_TIERS).map((bg) => (
                  <option key={bg.id} value={bg.id}>
                    {bg.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="sel-emp">
                初始僱用型態
              </label>
              <select
                id="sel-emp"
                className="field-select"
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
              >
                {Object.values(EMPLOYMENT_TYPES).map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="sel-age">
                入行年齡
              </label>
              <select
                id="sel-age"
                className="field-select"
                value={startAge}
                onChange={(e) => setStartAge(Number(e.target.value))}
              >
                <option value={23}>23 歲（應屆畢業新鮮人）</option>
                <option value={25}>25 歲（社會初期轉入）</option>
                <option value={29}>29 歲（業界轉職進入）</option>
                <option value={34}>34 歲（熟齡跨界入行）</option>
                <option value={40}>40 歲（中年跨界轉入民間部門）</option>
              </select>
            </div>
          </div>

          <div className="org-preview-box">
            <strong>{selectedOrgCfg.label}：</strong>
            {selectedOrgCfg.structuralSummary}（規模：{selectedOrgCfg.sizeLabel}｜財源：
            {selectedOrgCfg.fundingModel}）
            <div style={{ marginTop: 6, color: 'var(--ink-muted)' }}>
              <strong>聘僱型態說明（{EMPLOYMENT_TYPES[employmentType].shortLabel}）：</strong>
              {EMPLOYMENT_TYPES[employmentType].description}
            </div>
          </div>

          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                onStartCustom({
                  orgType,
                  role,
                  region,
                  background,
                  employmentType,
                  startAge,
                  pace,
                  playerName,
                })
              }
            >
              以此自訂設定領取任職登記卡
            </button>
          </div>
        </section>
      )}

      <section className="card ecology-strip">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 16 }}>抽樣權重</h2>
        </div>
        <div className="ecology-grid">
          {ORG_TYPE_LIST.map((o) => (
            <div key={o.id} className="ecology-chip">
              <div className="ecology-chip-head">
                <span>{o.shortLabel}</span>
                <span className="font-mono" style={{ fontSize: 12, color: 'var(--accent-teal)' }}>
                  {o.weight}%
                </span>
              </div>
              <div className="ecology-chip-desc">{o.sizeLabel}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="card ecology-strip" aria-label="更新日誌">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 10,
            flexWrap: 'wrap',
          }}
        >
          <h2 style={{ fontSize: 16 }}>更新日誌</h2>
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => setShowAllChangelog((prev) => !prev)}
          >
            <span>{showAllChangelog ? '收合較早版本' : '展開完整版號'}</span>
            {showAllChangelog ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            marginTop: 14,
          }}
        >
          {(showAllChangelog ? RELEASE_CHANGELOG : RELEASE_CHANGELOG.slice(0, 2)).map((item) => (
            <div
              key={item.version}
              style={{
                padding: '10px 12px',
                borderRadius: 6,
                border: '1px solid var(--border-hairline)',
                background: 'var(--bg-elevated)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 4,
                  flexWrap: 'wrap',
                }}
              >
                <span
                  className="font-mono"
                  style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-teal)' }}
                >
                  {item.version}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    padding: '1px 7px',
                    borderRadius: 999,
                    border: '1px solid var(--border-hairline)',
                    color: 'var(--ink-secondary)',
                  }}
                >
                  {item.tag}
                </span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--ink-secondary)', lineHeight: 1.6, margin: 0 }}>
                {item.summary}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ fontSize: 12, color: 'var(--ink-muted)', textAlign: 'center', lineHeight: 1.8 }}>
        <div>
          向《80億分之1》（1in8b.life）帶給我們的感動致敬，本作所有組織與案例是基於實務處境以虛構呈現，數據僅存於您自己的瀏覽器。
        </div>
        <div>
          v0.22｜via{' '}
          <a
            href="mailto:yusuke225@gmail.com"
            style={{ color: 'var(--accent-teal)', textDecoration: 'underline', textUnderlineOffset: '3px' }}
          >
            Yihan
          </a>{' '}
          (
          <a
            href="https://www.facebook.com/NPOWIU/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--accent-teal)', textDecoration: 'underline', textUnderlineOffset: '3px' }}
          >
            NPOIU
          </a>
          )
        </div>
      </footer>
    </div>
  );
}
