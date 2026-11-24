import { ArrowLeft, CheckCircle2, Dices } from 'lucide-react';
import { EMPLOYMENT_TYPES, ORG_TYPES, REGIONS, ROLES } from '../data/organizations';
import type { SimulationState, ThemeMode } from '../types/game';
import { BgmToggle } from './BgmToggle';
import { ThemeToggle } from './ThemeToggle';

interface IntakeCertificateProps {
  state: SimulationState;
  theme: ThemeMode;
  bgmOn: boolean;
  onToggleTheme: () => void;
  onToggleBgm: () => void;
  onChangePlayerName: (name: string) => void;
  onConfirmStart: () => void;
  onReroll: () => void;
  onBackHome: () => void;
}

export function IntakeCertificate({
  state,
  theme,
  bgmOn,
  onToggleTheme,
  onToggleBgm,
  onChangePlayerName,
  onConfirmStart,
  onReroll,
  onBackHome,
}: IntakeCertificateProps) {
  const orgCfg = ORG_TYPES[state.org.type];
  const roleCfg = ROLES[state.role];
  const regionCfg = REGIONS[state.region];

  return (
    <div className="certificate-shell">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <button type="button" className="btn btn-sm" onClick={onBackHome}>
          <ArrowLeft size={14} />
          <span>返回首頁</span>
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          <BgmToggle enabled={bgmOn} onToggle={onToggleBgm} />
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </div>

      <article className="card certificate-doc">
        <div className="cert-header">
          <div>
            <div className="cert-doc-no">檔案編號：{state.docNumber}</div>
            <h1 style={{ fontSize: 26, marginBottom: 4 }}>非營利與人民團體任職登記卡</h1>
            <div style={{ fontSize: 13, color: 'var(--ink-secondary)' }}>
              模擬長度：{state.pace === 'standard' ? '標準 25 年（100 季）' : '精簡 16 年（64 季）'}
            </div>
          </div>
          <div className="stamp-box">核定報到</div>
        </div>

        <div className="cert-table">
          <div className="cert-cell">
            <label className="cert-cell-label" htmlFor="cert-player-name">
              受僱者姓名（可修改）／報到年齡
            </label>
            <div className="cert-cell-value" style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <input
                id="cert-player-name"
                type="text"
                className="field-select"
                maxLength={16}
                value={state.playerName}
                onChange={(e) => onChangePlayerName(e.target.value)}
                style={{ width: 150, padding: '4px 8px', fontSize: 14 }}
                aria-label="受僱者姓名"
              />
              <span>（{state.startAge} 歲 · {state.startYear} 年入行）</span>
            </div>
          </div>

          <div className="cert-cell">
            <div className="cert-cell-label">任職組織與法定屬性</div>
            <div className="cert-cell-value">{state.org.name}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>
              {orgCfg.label}（{orgCfg.legalForm} · {orgCfg.sizeLabel}）
            </div>
          </div>

          <div className="cert-cell">
            <div className="cert-cell-label">職務、聘僱型態與起始月薪</div>
            <div className="cert-cell-value">
              {roleCfg.label} ·{' '}
              <span className="font-mono" style={{ color: 'var(--accent-teal)' }}>
                NT$ {state.monthlySalary.toLocaleString()}
              </span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>
              聘僱：{EMPLOYMENT_TYPES[state.employmentType].label} ｜ 議題：{state.org.issueArea}
            </div>
          </div>

          <div className="cert-cell">
            <div className="cert-cell-label">執業區域與首月估計支出</div>
            <div className="cert-cell-value">
              {regionCfg.label}（月開銷約{' '}
              <span className="font-mono">
                NT$ {state.lastExpenseBreakdown.totalMonthly.toLocaleString()}
              </span>
              ）
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>
              居住型態：
              {state.lifeStatus.housing === 'with_parents'
                ? '暫住家中'
                : state.lifeStatus.housing === 'studio_rent'
                  ? '獨立小套房租屋'
                  : '分租雅房'}
            </div>
          </div>

          <div className="cert-cell">
            <div className="cert-cell-label">個人財務起點</div>
            <div className="cert-cell-value">{state.backgroundLabel}</div>
            <div className="font-mono" style={{ fontSize: 12, color: 'var(--ink-muted)' }}>
              初始存款 NT$ {state.savings.toLocaleString()}
              {state.lifeStatus.studentLoanRemaining > 0
                ? ` ｜ 學貸 NT$ ${state.lifeStatus.studentLoanRemaining.toLocaleString()}`
                : ' ｜ 無學貸'}
              {state.lifeStatus.monthlyFilialAllowance > 0
                ? ` ｜ 孝親費 ${state.lifeStatus.monthlyFilialAllowance.toLocaleString()}/月`
                : ''}
            </div>
          </div>

          <div className="cert-cell">
            <div className="cert-cell-label">組織財源結構</div>
            <div className="cert-cell-value" style={{ fontSize: 14 }}>
              {state.org.fundingModel}
            </div>
          </div>
        </div>

        <div className="cert-percentile">
          <strong>結構位置備註：</strong>
          {state.rarityPercentileText} {state.backgroundSummary}
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
            同年踏入非營利／人民團體生態的 4 位同梯夥伴（將在右側欄同步追蹤）：
          </div>
          <div className="peer-preview-list">
            {state.peers.map((peer) => (
              <div key={peer.id} className="peer-mini">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                  <span>
                    {peer.name}（{peer.age} 歲）
                  </span>
                  <span className="font-mono" style={{ fontSize: 11, color: 'var(--ink-muted)' }}>
                    NT$ {peer.salaryEstimate.toLocaleString()}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--accent-teal)', marginBottom: 2 }}>
                  {peer.currentLabel}
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-secondary)' }}>{peer.latestNote}</div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: 12,
            paddingTop: 16,
            borderTop: '1px solid var(--border-hairline)',
          }}
        >
          <button type="button" className="btn" onClick={onReroll}>
            <Dices size={16} />
            <span>再重抽一次開局</span>
          </button>
          <button type="button" className="btn btn-primary hero-cta-main" onClick={onConfirmStart}>
            <CheckCircle2 size={18} />
            <span>正式報到，開始模擬職涯</span>
          </button>
        </div>
      </article>
    </div>
  );
}
