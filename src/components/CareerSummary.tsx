import { useState } from 'react';
import { Archive, Check, Copy, Dices, Home } from 'lucide-react';
import { EMPLOYMENT_TYPES } from '../data/organizations';
import { getPeerStatusBadge } from '../data/peers';
import type { CareerArchiveRecord, ThemeMode } from '../types/game';
import { ThemeToggle } from './ThemeToggle';

interface CareerSummaryProps {
  record: CareerArchiveRecord;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onPlayAgain: () => void;
  onOpenArchive: () => void;
  onBackHome: () => void;
}

export function CareerSummary({
  record,
  theme,
  onToggleTheme,
  onPlayAgain,
  onOpenArchive,
  onBackHome,
}: CareerSummaryProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(record.shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // ignore clipboard fallback failure in restricted environments
    }
  };

  return (
    <div className="summary-shell">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button type="button" className="btn btn-sm" onClick={onBackHome}>
          <Home size={14} />
          <span>回到首頁</span>
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" className="btn btn-sm" onClick={onOpenArchive}>
            <Archive size={14} />
            <span>職涯檔案櫃</span>
          </button>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </div>

      <article className="card summary-main">
        <div className="cert-header">
          <div>
            <div className="cert-doc-no">
              結案歸檔字號：{record.docNumber} ｜ {record.startYear}–{record.endYear}（共{' '}
              {record.totalYears} 年）
            </div>
            <h1 style={{ fontSize: 30, marginBottom: 6 }}>{record.title}</h1>
            <div style={{ fontSize: 14, color: 'var(--ink-secondary)' }}>
              {record.playerName}（{record.startAge} → {record.endAge} 歲）｜起點：{record.startOrgLabel}
              【{EMPLOYMENT_TYPES[record.startEmploymentType ?? 'regular'].shortLabel}】
              （NT$ {record.startSalary.toLocaleString()}）→ 終點：{record.endOrgName} ·{' '}
              {record.endRoleLabel}【{EMPLOYMENT_TYPES[record.endEmploymentType ?? 'regular'].shortLabel}】
            </div>
          </div>
          <div className="stamp-box">{record.stampLabel}</div>
        </div>

        <p style={{ fontSize: 16, lineHeight: 1.8, margin: '0 0 18px' }}>{record.epilogue}</p>

        <div className="summary-kpi-grid">
          <div className="kpi-box">
            <div className="kpi-label">終點月薪 / 職涯峰值</div>
            <div className="kpi-value">
              NT$ {record.endSalary.toLocaleString()}
            </div>
            <div className="font-mono" style={{ fontSize: 11, color: 'var(--ink-muted)' }}>
              峰值 NT$ {record.peakSalary.toLocaleString()}
            </div>
          </div>

          <div className="kpi-box">
            <div className="kpi-label">最終個人存款</div>
            <div
              className="kpi-value"
              style={{
                color: record.finalSavings < 0 ? 'var(--accent-crimson)' : 'var(--accent-teal)',
              }}
            >
              NT$ {record.finalSavings.toLocaleString()}
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-muted)' }}>{record.regionLabel}</div>
          </div>

          <div className="kpi-box">
            <div className="kpi-label">勞退 6% 專戶累計</div>
            <div className="kpi-value">NT$ {record.laborPensionTotal.toLocaleString()}</div>
            <div style={{ fontSize: 11, color: 'var(--ink-muted)' }}>
              {record.endAge >= 60
                ? '已滿 60 歲・符合勞退請領資格'
                : `未滿 60 歲暫封存（還差 ${60 - record.endAge} 年始得請領）`}
            </div>
          </div>

          <div className="kpi-box">
            <div className="kpi-label">累計社會影響力</div>
            <div className="kpi-value" style={{ color: 'var(--accent-amber)' }}>
              {record.impactScore} pts
            </div>
            <div className="font-mono" style={{ fontSize: 11, color: 'var(--ink-muted)' }}>
              能量 {Math.round(record.finalStats.energy)} / 意義{' '}
              {Math.round(record.finalStats.purpose)} / 資本{' '}
              {Math.round(record.finalStats.capital)} / 生活 {Math.round(record.finalStats.life)}
            </div>
          </div>
        </div>

        <div className="cert-percentile">
          <strong>台灣統計結構對照：</strong>
          {record.statisticalNote}
        </div>

        <section style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 17, marginBottom: 8 }}>重大職涯與人生節點</h2>
          <ul className="milestone-list">
            {record.milestones.map((m, idx) => (
              <li key={idx}>{m}</li>
            ))}
          </ul>
        </section>

        <section style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 17, marginBottom: 10 }}>同梯入行夥伴最終對照</h2>
          <div className="peer-preview-list">
            {record.peers.map((peer) => {
              const badge = getPeerStatusBadge(peer.currentStatus);
              return (
                <div key={peer.id} className="peer-mini">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <strong>
                      {peer.name}（{peer.age} 歲）
                    </strong>
                    <span className={`tag tag-${badge.tone === 'neutral' ? 'teal' : badge.tone}`}>
                      {badge.label}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--accent-teal)', marginBottom: 3 }}>
                    {peer.currentLabel}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-secondary)', marginBottom: 4 }}>
                    {peer.latestNote}
                  </div>
                  <div className="font-mono" style={{ fontSize: 11, color: 'var(--ink-muted)' }}>
                    估計月薪 NT$ {peer.salaryEstimate.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: 12,
            paddingTop: 18,
            borderTop: '1px solid var(--border-hairline)',
          }}
        >
          <button type="button" className="btn" onClick={handleCopy}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? '已複製純文字摘要！' : '複製職涯結算摘要'}</span>
          </button>

          <button type="button" className="btn btn-primary hero-cta-main" onClick={onPlayAgain}>
            <Dices size={18} />
            <span>再抽一段新的職涯</span>
          </button>
        </div>
      </article>
    </div>
  );
}
