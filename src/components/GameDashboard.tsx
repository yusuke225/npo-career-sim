import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Bot,
  FastForward,
  Flag,
  Home,
  Pause,
  Play,
} from 'lucide-react';
import { EMPLOYMENT_TYPES, FOCUS_OPTIONS, ORG_TYPES, REGIONS } from '../data/organizations';
import { getPeerStatusBadge } from '../data/peers';
import { calculateMonthlyIncome, getQuarterLabel, getRoleDisplayTitle } from '../engine/simulation';
import type { BoardClimate, FocusId, SimulationState, ThemeMode } from '../types/game';
import { BgmToggle } from './BgmToggle';
import { ThemeToggle } from './ThemeToggle';

interface GameDashboardProps {
  state: SimulationState;
  theme: ThemeMode;
  bgmOn: boolean;
  isPlaying: boolean;
  speed: 1 | 2 | 4 | 8;
  autoDecide: boolean;
  onToggleTheme: () => void;
  onToggleBgm: () => void;
  onTogglePlay: () => void;
  onChangeSpeed: (s: 1 | 2 | 4 | 8) => void;
  onFastForwardToEvent: () => void;
  onToggleAutoDecide: () => void;
  onChangeFocus: (focus: FocusId) => void;
  onChooseEvent: (index: number) => void;
  onSaveAndHome: () => void;
  onManualFinish: () => void;
}

const CLIMATE_LABELS: Record<BoardClimate, string> = {
  trusting: '理監事信任授權',
  bureaucratic: '科層公文重視程序',
  factional: '派系角力張力偏高',
  transition: '換屆過渡磨合期',
};

const HOUSING_LABELS = {
  with_parents: '暫住家裡',
  shared_room: '合租雅房',
  studio_rent: '獨立租屋',
  mortgage: '自購背房貸',
} as const;

const REL_LABELS = {
  single: '單身',
  dating: '交往中',
  married: '已婚成家',
} as const;

export function GameDashboard({
  state,
  theme,
  bgmOn,
  isPlaying,
  speed,
  autoDecide,
  onToggleTheme,
  onToggleBgm,
  onTogglePlay,
  onChangeSpeed,
  onFastForwardToEvent,
  onToggleAutoDecide,
  onChangeFocus,
  onChooseEvent,
  onSaveAndHome,
  onManualFinish,
}: GameDashboardProps) {
  const [mobileTab, setMobileTab] = useState<'events' | 'status'>('events');
  const pendingEventId = state.pendingEvent?.id ?? null;

  useEffect(() => {
    if (pendingEventId) {
      setMobileTab('events');
    }
  }, [pendingEventId]);

  const handleConfirmManualFinish = () => {
    const actionLabel = state.age >= 55 ? '屆齡退休結算' : '中途離職結算';
    if (window.confirm(`確定要提前「${actionLabel}」並結束本段職涯模擬嗎？`)) {
      onManualFinish();
    }
  };

  const maxQuarters = state.maxYears * 4;
  const progressPct = Math.min(100, Math.round((state.totalQuartersElapsed / maxQuarters) * 100));
  const yearsText = (state.totalQuartersElapsed / 4).toFixed(1);
  const roleTitle = getRoleDisplayTitle(state);
  const exp = state.lastExpenseBreakdown;
  const inc = state.lastIncomeBreakdown ?? calculateMonthlyIncome(state);
  const monthlyNet = inc.grossMonthly - exp.totalMonthly;
  const yearEndBonus =
    state.currentQuarter === 4
      ? Math.max(0, Math.round(state.lastQuarterlyNet - monthlyNet * 3))
      : 0;
  const mortgageYearsLeft = Math.max(1, Math.ceil((state.lifeStatus.mortgageMonthsRemaining || 360) / 12));

  const statItems: Array<{
    key: 'energy' | 'purpose' | 'capital' | 'life';
    label: string;
    value: number;
    color: string;
  }> = [
    { key: 'energy', label: '身心能量', value: state.stats.energy, color: 'var(--accent-green)' },
    { key: 'purpose', label: '理想意義', value: state.stats.purpose, color: 'var(--accent-teal)' },
    { key: 'capital', label: '專業資本', value: state.stats.capital, color: 'var(--accent-amber)' },
    { key: 'life', label: '生活關係', value: state.stats.life, color: 'var(--accent-rose)' },
  ];

  const getEventCategoryMeta = (cat: string) => {
    switch (cat) {
      case 'work':
        return { label: '職場內壓力', cls: 'tag-teal' };
      case 'life':
        return { label: '職場外現實', cls: 'tag-amber' };
      case 'era':
        return { label: '台灣時代浪潮', cls: 'tag-crimson' };
      default:
        return { label: '職場內外交織', cls: 'tag-crimson' };
    }
  };

  return (
    <div className="dashboard-root">
      <header className="control-bar">
        <div className="control-bar-inner">
          <div className="time-readout">
            <span className="time-year">
              {state.currentYear} · {getQuarterLabel(state.currentQuarter)}
            </span>
            <span className="time-meta">
              {state.playerName}（{state.age} 歲 · 入行第 {yearsText} 年）｜ {state.org.name} ·{' '}
              <strong>{roleTitle}</strong>
            </span>
          </div>

          <div className="control-actions">
            <button
              type="button"
              className={`btn btn-sm ${isPlaying && !state.pendingEvent ? 'btn-primary' : ''}`}
              onClick={onTogglePlay}
              disabled={Boolean(state.pendingEvent)}
              title={
                state.pendingEvent
                  ? '請先完成當前事件抉擇（已自動存檔）'
                  : '暫停並保存目前進度至本機瀏覽器'
              }
            >
              {isPlaying && !state.pendingEvent ? <Pause size={14} /> : <Play size={14} />}
              <span>
                {state.pendingEvent
                  ? '等待抉擇（已存檔）'
                  : isPlaying
                    ? '暫停（存檔）'
                    : '已暫停（點此繼續）'}
              </span>
            </button>

            <div className="speed-group" role="group" aria-label="模擬速度">
              {([1, 2, 4, 8] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`speed-btn ${speed === s ? 'active' : ''}`}
                  onClick={() => onChangeSpeed(s)}
                  title={s === 1 ? '1x（每段文字間隔約 5 秒）' : `${s}x 推進速度`}
                >
                  {s}x
                </button>
              ))}
            </div>

            <button
              type="button"
              className="btn btn-sm"
              onClick={onFastForwardToEvent}
              disabled={Boolean(state.pendingEvent)}
              title="直接推進時間直到下一個關鍵事件或結算"
            >
              <FastForward size={14} />
              <span>快轉至下個事件</span>
            </button>

            <button
              type="button"
              className={`btn btn-sm ${autoDecide ? 'btn-primary' : ''}`}
              onClick={onToggleAutoDecide}
              title="開啟後，系統會在遇到抉擇時自動協助選擇"
            >
              <Bot size={14} />
              <span>自動抉擇：{autoDecide ? '開' : '關'}</span>
            </button>

            <BgmToggle enabled={bgmOn} onToggle={onToggleBgm} />
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />

            <button
              type="button"
              className="btn btn-sm"
              onClick={onSaveAndHome}
              title="保留目前進度並返回首頁，下次可點擊「繼續職涯」續玩"
            >
              <Home size={13} />
              <span>存檔回首頁</span>
            </button>

            <button type="button" className="btn btn-sm btn-crimson" onClick={handleConfirmManualFinish}>
              <Flag size={13} />
              <span>{state.age >= 55 ? '屆齡退休結算' : '中途離職結算'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 手機版頂部常駐職涯進度與「事件／狀態」雙分頁切換 */}
      <div className="mobile-top-hud">
        <section className="card horizon-bar-wrap">
          <div className="horizon-meta">
            <span>
              職涯進度：第 {state.totalQuartersElapsed * 3} / {maxQuarters * 3} 個月（{progressPct}%）
            </span>
            <span className="font-mono">{state.docNumber}</span>
          </div>
          <div className="stat-track">
            <div
              className="stat-fill"
              style={{ width: `${progressPct}%`, backgroundColor: 'var(--accent-teal)' }}
            />
          </div>
          <div className="era-banner">
            <strong>時代脈動：</strong>
            {state.eraNote}
          </div>
        </section>

        <div className="mobile-tab-bar" role="tablist" aria-label="手機版檢視分頁">
          <button
            type="button"
            role="tab"
            aria-selected={mobileTab === 'events'}
            className={`mobile-tab-btn ${mobileTab === 'events' ? 'active' : ''}`}
            onClick={() => setMobileTab('events')}
          >
            <span>事件</span>
            {state.pendingEvent && <span className="mobile-tab-badge">待抉擇</span>}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mobileTab === 'status'}
            className={`mobile-tab-btn ${mobileTab === 'status' ? 'active' : ''}`}
            onClick={() => setMobileTab('status')}
          >
            <span>狀態</span>
          </button>
        </div>
      </div>

      <div className="dashboard-grid" data-mobile-tab={mobileTab}>
        {/* 左欄：個人狀態、真實財務拆解、組織與重心 */}
        <aside className="stack-col col-status">
          <section className="card panel-card">
            <div className="panel-heading">
              <span>個人身心與資本指標</span>
              <span className="tag tag-teal font-mono">影響力 {state.stats.impactScore}</span>
            </div>

            {statItems.map((st) => {
              const delta = state.lastStatDelta[st.key];
              const isDanger = st.value <= 25;
              return (
                <div key={st.key} className="stat-row">
                  <div className="stat-row-top">
                    <span>
                      {st.label}
                      {isDanger && (
                        <AlertTriangle
                          size={12}
                          style={{
                            display: 'inline',
                            marginLeft: 5,
                            color: 'var(--accent-crimson)',
                          }}
                        />
                      )}
                    </span>
                    <span>
                      <strong
                        className="font-mono"
                        style={{ color: isDanger ? 'var(--accent-crimson)' : undefined }}
                      >
                        {Math.round(st.value)}
                      </strong>
                      {delta !== undefined && delta !== 0 && (
                        <span
                          className={`stat-delta ${delta > 0 ? 'delta-pos' : 'delta-neg'}`}
                        >
                          {delta > 0 ? `+${delta}` : delta}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="stat-track">
                    <div
                      className="stat-fill"
                      style={{
                        width: `${Math.max(0, Math.min(100, st.value))}%`,
                        backgroundColor: isDanger ? 'var(--accent-crimson)' : st.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}

            {(state.lowEnergyStreak >= 2 || state.lowPurposeStreak >= 2) && (
              <div
                style={{
                  marginTop: 10,
                  padding: '8px 10px',
                  borderRadius: 5,
                  background: 'var(--accent-crimson-soft)',
                  color: 'var(--accent-crimson)',
                  fontSize: 12,
                }}
              >
                {state.lowEnergyStreak >= 2
                  ? '警告：身心能量連續偏低，再未休養將觸發職業倦怠退場。'
                  : '警告：理想意義感持續耗損，離職倒數計時正在逼近。'}
              </div>
            )}
          </section>

          <section className="card panel-card">
            <div className="panel-heading">
              <span>真實收支與勞退帳本</span>
              <span className="font-mono" style={{ fontSize: 11 }}>
                通膨 ×{exp.inflationFactor.toFixed(2)}
              </span>
            </div>

            <div className="finance-line">
              <span>表定本薪</span>
              <strong className="font-mono" style={{ color: 'var(--accent-teal)' }}>
                NT$ {inc.baseSalary.toLocaleString()}
              </strong>
            </div>
            {inc.managementAllowance > 0 && (
              <div className="finance-subline">
                <span>主管加給</span>
                <span className="font-mono" style={{ color: 'var(--accent-teal)' }}>
                  + NT$ {inc.managementAllowance.toLocaleString()}
                </span>
              </div>
            )}
            {(inc.overtimePay > 0 || inc.overtimeNote) && (
              <div className="finance-subline">
                <span>加班費收入</span>
                <span
                  className="font-mono"
                  style={{
                    color: inc.overtimePay > 0 ? 'var(--accent-teal)' : 'var(--ink-muted)',
                  }}
                >
                  {inc.overtimePay > 0
                    ? `+ NT$ ${inc.overtimePay.toLocaleString()}`
                    : `NT$ 0（${inc.overtimeNote}）`}
                </span>
              </div>
            )}
            {inc.sideIncome > 0 && (
              <div className="finance-subline">
                <span>兼差／外快收入</span>
                <span className="font-mono" style={{ color: 'var(--accent-teal)' }}>
                  + NT$ {inc.sideIncome.toLocaleString()}
                </span>
              </div>
            )}
            <div className="finance-line">
              <span>實領預估淨薪（扣勞健保）</span>
              <span className="font-mono">
                NT$ {(inc.grossMonthly - exp.payrollDeduction - exp.selfPaidInsurance).toLocaleString()}
              </span>
            </div>
            <div className="finance-line">
              <span>每月總流出（含扣繳）</span>
              <span className="font-mono">NT$ {exp.totalMonthly.toLocaleString()}</span>
            </div>
            <div className="finance-line">
              <span>每月淨結餘</span>
              <span
                className="font-mono"
                style={{
                  color: monthlyNet >= 0 ? 'var(--accent-green)' : 'var(--accent-crimson)',
                }}
              >
                {monthlyNet >= 0 ? '+' : ''}
                {monthlyNet.toLocaleString()}
              </span>
            </div>
            {yearEndBonus > 0 && (
              <div className="finance-subline">
                <span>10–12 月年終入帳</span>
                <span className="font-mono" style={{ color: 'var(--accent-green)' }}>
                  + NT$ {yearEndBonus.toLocaleString()}
                </span>
              </div>
            )}

            <div className="finance-divider" />

            {exp.payrollDeduction > 0 && (
              <div className="finance-subline">
                <span>
                  {state.employmentType === 'multi_employment'
                    ? '勞健保自付額（無就保／無勞退）'
                    : '勞健保自付額（受僱扣繳）'}
                </span>
                <span className="font-mono">{exp.payrollDeduction.toLocaleString()}</span>
              </div>
            )}
            {exp.selfPaidInsurance > 0 && (
              <div className="finance-subline">
                <span style={{ color: 'var(--accent-crimson)' }}>承攬自付工會勞健保＋補充保費</span>
                <span className="font-mono" style={{ color: 'var(--accent-crimson)' }}>
                  {exp.selfPaidInsurance.toLocaleString()}
                </span>
              </div>
            )}
            <div className="finance-subline">
              <span>
                {state.lifeStatus.housing === 'mortgage'
                  ? `房屋貸款月繳（餘 ${mortgageYearsLeft} 年）`
                  : `居住（${HOUSING_LABELS[state.lifeStatus.housing]}）`}
              </span>
              <span className="font-mono">{exp.housing.toLocaleString()}</span>
            </div>
            <div className="finance-subline">
              <span>生活、交通與保險雜支</span>
              <span className="font-mono">{exp.living.toLocaleString()}</span>
            </div>
            {exp.carLoan > 0 && (
              <div className="finance-subline">
                <span>
                  車貸月繳（餘 {Math.round(state.lifeStatus.carLoanRemaining / 1000)}k）
                </span>
                <span className="font-mono">{exp.carLoan.toLocaleString()}</span>
              </div>
            )}
            {exp.studentLoan > 0 && (
              <div className="finance-subline">
                <span>
                  學貸月繳（餘 {Math.round(state.lifeStatus.studentLoanRemaining / 1000)}k）
                </span>
                <span className="font-mono">{exp.studentLoan.toLocaleString()}</span>
              </div>
            )}
            {exp.filialCare > 0 && (
              <div className="finance-subline">
                <span>孝親家用補貼</span>
                <span className="font-mono">{exp.filialCare.toLocaleString()}</span>
              </div>
            )}
            {exp.childCare > 0 && (
              <div className="finance-subline">
                <span>育兒／教育費</span>
                <span className="font-mono">{exp.childCare.toLocaleString()}</span>
              </div>
            )}
            {exp.longTermCare > 0 && (
              <div className="finance-subline">
                <span>雙親長照自付額</span>
                <span className="font-mono" style={{ color: 'var(--accent-crimson)' }}>
                  {exp.longTermCare.toLocaleString()}
                </span>
              </div>
            )}

            <div className="finance-divider" />

            <div className="finance-line">
              <span>個人存款餘額</span>
              <strong
                className="font-mono"
                style={{
                  color: state.savings < 0 ? 'var(--accent-crimson)' : 'var(--ink-primary)',
                }}
              >
                NT$ {state.savings.toLocaleString()}
              </strong>
            </div>
            <div className="finance-line">
              <span>勞退 6% 專戶（滿60歲領）</span>
              <span className="font-mono">
                NT$ {state.laborPensionTotal.toLocaleString()}
                {state.employmentType === 'contractor'
                  ? '（承攬 0%）'
                  : state.employmentType === 'multi_employment'
                    ? '（多元 0%）'
                    : ''}
              </span>
            </div>
          </section>

          <section className="card panel-card">
            <div className="panel-heading">
              <span>組織體質與人生近況</span>
              <span className="tag">{REGIONS[state.region].label}</span>
            </div>
            <div style={{ fontSize: 13, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div>
                <span style={{ color: 'var(--ink-muted)' }}>組織類型：</span>
                <strong>
                  {state.org.isOutsideNPO ? '企業永續／體制外部門' : ORG_TYPES[state.org.type].label}
                </strong>
              </div>
              <div>
                <span style={{ color: 'var(--ink-muted)' }}>契約型態：</span>
                <strong
                  style={{
                    color:
                      state.employmentType !== 'regular' ? 'var(--accent-crimson)' : undefined,
                  }}
                >
                  {EMPLOYMENT_TYPES[state.employmentType].label}
                </strong>
              </div>
              <div>
                <span style={{ color: 'var(--ink-muted)' }}>組織財力：</span>
                <span className="font-mono">
                  {'■'.repeat(state.org.financeLevel)}
                  {'□'.repeat(4 - state.org.financeLevel)}
                </span>{' '}
                <span style={{ fontSize: 12, color: 'var(--ink-secondary)' }}>
                  （{CLIMATE_LABELS[state.org.boardClimate]}）
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                <span className="tag">{REL_LABELS[state.lifeStatus.relationship]}</span>
                {state.consecutiveFreezeYears >= 2 && (
                  <span className="tag tag-crimson">已連續凍薪 {state.consecutiveFreezeYears} 年</span>
                )}
                {state.lifeStatus.hasChild && (
                  <span className="tag tag-amber">育兒中（{state.lifeStatus.childAge ?? 0} 歲）</span>
                )}
                {state.lifeStatus.parentCare === 'long_term_care' && (
                  <span className="tag tag-crimson">長照三明治期</span>
                )}
                {state.lifeStatus.hasProfessionalCert && (
                  <span className="tag tag-green">具證照／碩士加給</span>
                )}
                {state.lifeStatus.healthAlert && (
                  <span className="tag tag-crimson">健檢慢性紅字</span>
                )}
              </div>
            </div>
          </section>

          <section className="card panel-card">
            <div className="panel-heading">
              <span>近期生活與工作重心</span>
              <span style={{ fontSize: 11, color: 'var(--ink-muted)' }}>隨時切換</span>
            </div>
            <div className="focus-list">
              {FOCUS_OPTIONS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`focus-item ${state.focus === f.id ? 'active' : ''}`}
                  onClick={() => onChangeFocus(f.id)}
                >
                  <div className="focus-item-title">{f.label}</div>
                  <div className="focus-item-desc">{f.shortDesc}</div>
                </button>
              ))}
            </div>
          </section>
        </aside>

        {/* 中欄：職涯進度、當前關鍵抉擇卡片、紀事年表 */}
        <main className="stack-col col-events">
          <section className="card horizon-bar-wrap desktop-horizon-card">
            <div className="horizon-meta">
              <span>
                職涯進度：第 {state.totalQuartersElapsed * 3} / {maxQuarters * 3} 個月（{progressPct}%）
              </span>
              <span className="font-mono">{state.docNumber}</span>
            </div>
            <div className="stat-track">
              <div
                className="stat-fill"
                style={{ width: `${progressPct}%`, backgroundColor: 'var(--accent-teal)' }}
              />
            </div>
            <div className="era-banner">
              <strong>時代脈動：</strong>
              {state.eraNote}
            </div>
          </section>

          {state.pendingEvent && (
            <section
              className={`card event-card category-${state.pendingEvent.category}`}
              aria-live="polite"
            >
              <div className="event-header">
                <span className={`tag ${getEventCategoryMeta(state.pendingEvent.category).cls}`}>
                  {getEventCategoryMeta(state.pendingEvent.category).label}
                </span>
                <span className="tag">{state.pendingEvent.tag}</span>
                <span className="font-mono" style={{ fontSize: 12, color: 'var(--ink-muted)' }}>
                  {state.currentYear} 年 {getQuarterLabel(state.currentQuarter)} · {state.age} 歲
                </span>
              </div>

              <h2 className="event-title">{state.pendingEvent.title}</h2>
              <p className="event-narrative">{state.pendingEvent.narrative}</p>

              <div className="choice-list">
                {state.pendingEvent.choices.map((ch, idx) => (
                  <button
                    key={ch.id}
                    type="button"
                    className="choice-btn"
                    onClick={() => onChooseEvent(idx)}
                  >
                    <div className="choice-label">{ch.label}</div>
                    <div className="choice-sub">{ch.sublabel}</div>
                  </button>
                ))}
              </div>
            </section>
          )}

          <section className="card chronicle-card">
            <div className="panel-heading">
              <span>職涯紀事年表（由新至舊）</span>
              <span style={{ fontSize: 11, color: 'var(--ink-muted)' }}>
                重大抉擇 {state.seenEventIds.length} 次
              </span>
            </div>

            <div className="chronicle-list">
              {state.chronicle.map((item) => (
                <article key={item.id} className={`chronicle-item kind-${item.kind}`}>
                  <div className="chronicle-head">
                    <span className="chronicle-date">
                      {item.year} 年 {getQuarterLabel(item.quarter)}（{item.age} 歲）
                    </span>
                    <span className="tag">{item.tag}</span>
                  </div>
                  <div className="chronicle-title">{item.title}</div>
                  <p className="chronicle-text">{item.text}</p>
                  {item.outcomeText && (
                    <div className="chronicle-outcome">{item.outcomeText}</div>
                  )}
                  {item.deltaSummary && (
                    <div className="chronicle-delta">{item.deltaSummary}</div>
                  )}
                </article>
              ))}
            </div>
          </section>
        </main>

        {/* 右欄：同年入行的夥伴對照欄 */}
        <aside className="stack-col col-peers">
          <section className="card panel-card">
            <div className="panel-heading">
              <span>同年入行的夥伴</span>
              <span style={{ fontSize: 11, color: 'var(--ink-muted)' }}>同梯命運對照</span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 0, marginBottom: 12 }}>
              與你在 {state.startYear} 年前後同期踏入台灣非營利與人民團體的 4 位專職夥伴，隨著年歲推移各自走向不同分岔：
            </p>

            {state.peers.map((peer) => {
              const badge = getPeerStatusBadge(peer.currentStatus);
              return (
                <div key={peer.id} className="peer-card">
                  <div className="peer-head">
                    <span className="peer-name">
                      {peer.name}（{peer.age} 歲）
                    </span>
                    <span className={`tag tag-${badge.tone === 'neutral' ? 'teal' : badge.tone}`}>
                      {badge.label}
                    </span>
                  </div>
                  <div className="peer-role">{peer.currentLabel}</div>
                  <p className="peer-note">{peer.latestNote}</p>
                  <div className="peer-foot">
                    {peer.currentStatus === 'resting' ? '離職前月薪' : '估計月薪'} NT${' '}
                    {peer.salaryEstimate.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </section>
        </aside>
      </div>
    </div>
  );
}
