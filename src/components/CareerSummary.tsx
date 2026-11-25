import { useState } from 'react';
import { Archive, Check, Copy, Dices, Download, Home } from 'lucide-react';
import { EMPLOYMENT_TYPES } from '../data/organizations';
import { getPeerStatusBadge } from '../data/peers';
import type { CareerArchiveRecord, CareerHistoryPoint, ThemeMode } from '../types/game';
import { BgmToggle } from './BgmToggle';
import { ThemeToggle } from './ThemeToggle';

interface CareerSummaryProps {
  record: CareerArchiveRecord;
  theme: ThemeMode;
  bgmOn: boolean;
  onToggleTheme: () => void;
  onToggleBgm: () => void;
  onPlayAgain: () => void;
  onOpenArchive: () => void;
  onBackHome: () => void;
}

function getEndingVisualCategory(record: CareerArchiveRecord): 'burnout' | 'financial' | 'pivot' | 'founder' | 'legacy' {
  if (record.endReason === 'financial_exit') return 'financial';
  if (
    record.endReason === 'burnout_exit' ||
    record.endReason === 'meaning_exit' ||
    record.stampLabel === '中途離場'
  ) {
    return 'burnout';
  }
  if (record.endReason === 'pivoted_to_corp' || record.stampLabel === '轉戰公部門' || record.stampLabel === '跨界轉場') {
    return 'pivot';
  }
  if (record.stampLabel === '自立門戶') return 'founder';
  return 'legacy';
}

function EndingEmblem({ record }: { record: CareerArchiveRecord }) {
  const kind = getEndingVisualCategory(record);
  const bgMap = {
    burnout: 'var(--accent-crimson-soft)',
    financial: 'var(--accent-amber-soft)',
    pivot: 'var(--accent-teal-soft)',
    founder: 'var(--accent-green-soft)',
    legacy: 'var(--accent-rose-soft)',
  } as const;
  const strokeMap = {
    burnout: 'var(--accent-crimson)',
    financial: 'var(--accent-amber)',
    pivot: 'var(--accent-teal)',
    founder: 'var(--accent-green)',
    legacy: 'var(--accent-rose)',
  } as const;

  return (
    <div
      aria-hidden="true"
      style={{
        width: 56,
        height: 56,
        borderRadius: 12,
        background: bgMap[kind],
        border: `1px solid ${strokeMap[kind]}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        {kind === 'burnout' && (
          <>
            <path
              d="M16 4C11 10 8 14.5 8 19a8 8 0 0 0 16 0c0-4.5-3-9-8-15Z"
              stroke={strokeMap[kind]}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path d="M12 21c1.2 1.8 2.8 2.5 4 2.5s2.8-.7 4-2.5" stroke={strokeMap[kind]} strokeWidth="2" strokeLinecap="round" />
          </>
        )}
        {kind === 'financial' && (
          <>
            <rect x="5" y="8" width="22" height="16" rx="2.5" stroke={strokeMap[kind]} strokeWidth="2" />
            <circle cx="16" cy="16" r="3.5" stroke={strokeMap[kind]} strokeWidth="2" />
            <path d="M9 12h1M22 20h1" stroke={strokeMap[kind]} strokeWidth="2" strokeLinecap="round" />
          </>
        )}
        {kind === 'pivot' && (
          <>
            <path d="M6 21h10l7-10" stroke={strokeMap[kind]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18 11h5v5" stroke={strokeMap[kind]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="8" cy="21" r="2" fill={strokeMap[kind]} />
          </>
        )}
        {kind === 'founder' && (
          <>
            <rect x="10" y="6" width="12" height="10" rx="2" stroke={strokeMap[kind]} strokeWidth="2" />
            <path d="M16 16v4M9 20h14v5H9z" stroke={strokeMap[kind]} strokeWidth="2" strokeLinejoin="round" />
          </>
        )}
        {kind === 'legacy' && (
          <>
            <path d="M16 26V13" stroke={strokeMap[kind]} strokeWidth="2" strokeLinecap="round" />
            <path
              d="M16 16c-5 0-8-3-8-8 5 0 8 3 8 8ZM16 14c5 0 8-3 8-8-5 0-8 3-8 8Z"
              stroke={strokeMap[kind]}
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </>
        )}
      </svg>
    </div>
  );
}

function CareerTrendChart({ points }: { points: CareerHistoryPoint[] }) {
  const [mode, setMode] = useState<'all' | 'finance' | 'stats'>('all');
  const hasStats = points.some(
    (p) =>
      p.energy !== undefined &&
      p.purpose !== undefined &&
      p.capital !== undefined &&
      p.life !== undefined
  );
  const showBars = mode === 'all' || mode === 'finance';
  const showLines = hasStats && (mode === 'all' || mode === 'stats');

  const width = 700;
  const height = 240;
  const padL = 52;
  const padR = 44;
  const padT = 18;
  const padB = 34;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const allFinance = points.flatMap((p) => [p.salary, p.monthlyExpense]);
  const maxFin = Math.max(40000, Math.ceil((Math.max(...allFinance) + 4000) / 10000) * 10000);

  const slotW = plotW / Math.max(1, points.length);
  const barW = Math.max(3, Math.min(12, slotW * 0.32));
  const centerX = (idx: number) => padL + (idx + 0.5) * slotW;
  const toFinY = (val: number) => padT + plotH - (Math.max(0, val) / maxFin) * plotH;
  const toStatY = (val: number) => padT + plotH - (Math.max(0, Math.min(100, val)) / 100) * plotH;

  const buildStatPath = (key: 'energy' | 'purpose' | 'capital' | 'life') =>
    points
      .map((p, i) => {
        const v = p[key];
        if (v === undefined) return '';
        return `${i === 0 ? 'M' : 'L'}${centerX(i).toFixed(1)},${toStatY(v).toFixed(1)}`;
      })
      .filter(Boolean)
      .join(' ');

  const statSeries: Array<{
    key: 'energy' | 'purpose' | 'capital' | 'life';
    label: string;
    color: string;
  }> = [
    { key: 'energy', label: '身心能量', color: 'var(--accent-green)' },
    { key: 'purpose', label: '理想意義', color: 'var(--accent-teal)' },
    { key: 'capital', label: '專業資本', color: 'var(--accent-amber)' },
    { key: 'life', label: '生活關係', color: 'var(--accent-rose)' },
  ];

  const first = points[0];
  const last = points[points.length - 1];
  const midIdx = Math.floor((points.length - 1) / 2);

  return (
    <section
      style={{
        marginBottom: 20,
        padding: '14px 16px',
        borderRadius: 8,
        border: '1px solid var(--border-hairline)',
        background: 'var(--bg-subtle)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 8,
          marginBottom: 10,
        }}
      >
        <h2 style={{ fontSize: 15 }}>職涯收支長條＋四維指標折線走勢圖</h2>
        {hasStats && (
          <div className="speed-group" role="group" aria-label="走勢圖顯示模式">
            {(
              [
                { id: 'all', label: '全部（長條＋折線）' },
                { id: 'finance', label: '僅看收支' },
                { id: 'stats', label: '僅看四維指標' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`speed-btn ${mode === tab.id ? 'active' : ''}`}
                onClick={() => setMode(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px 14px',
          fontSize: 12,
          color: 'var(--ink-secondary)',
          marginBottom: 8,
        }}
      >
        {showBars && (
          <>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  background: 'var(--accent-teal)',
                  opacity: 0.42,
                  display: 'inline-block',
                }}
              />
              月薪長條（NT$ {last.salary.toLocaleString()}）
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  background: 'var(--accent-crimson)',
                  opacity: 0.36,
                  display: 'inline-block',
                }}
              />
              每月開銷長條（NT$ {last.monthlyExpense.toLocaleString()}）
            </span>
          </>
        )}
        {showLines &&
          statSeries.map((s) => (
            <span key={s.key} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 14, height: 3, background: s.color, display: 'inline-block' }} />
              {s.label}
            </span>
          ))}
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        role="img"
        aria-label="職涯收支長條圖與四維指標折線圖"
      >
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = padT + plotH * (1 - t);
          const finTick = Math.round((maxFin * t) / 1000);
          const statTick = Math.round(100 * t);
          return (
            <g key={t}>
              <line
                x1={padL}
                x2={width - padR}
                y1={y}
                y2={y}
                stroke="var(--border-hairline)"
                strokeDasharray="3 3"
              />
              {showBars && (
                <text
                  x={padL - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="var(--ink-muted)"
                  fontFamily="var(--font-mono)"
                >
                  {finTick}k
                </text>
              )}
              {showLines && (
                <text
                  x={width - padR + 8}
                  y={y + 4}
                  textAnchor="start"
                  fontSize="11"
                  fill="var(--ink-muted)"
                  fontFamily="var(--font-mono)"
                >
                  {statTick}
                </text>
              )}
            </g>
          );
        })}

        {showBars &&
          points.map((p, idx) => {
            const cx = centerX(idx);
            const salY = toFinY(p.salary);
            const expY = toFinY(p.monthlyExpense);
            const baseY = padT + plotH;
            return (
              <g key={`bar_${p.year}`}>
                <rect
                  x={cx - barW - 1}
                  y={salY}
                  width={barW}
                  height={Math.max(1, baseY - salY)}
                  rx={1.5}
                  fill="var(--accent-teal)"
                  fillOpacity={mode === 'all' ? 0.34 : 0.72}
                />
                <rect
                  x={cx + 1}
                  y={expY}
                  width={barW}
                  height={Math.max(1, baseY - expY)}
                  rx={1.5}
                  fill="var(--accent-crimson)"
                  fillOpacity={mode === 'all' ? 0.28 : 0.65}
                />
              </g>
            );
          })}

        {showLines &&
          statSeries.map((s) => {
            const d = buildStatPath(s.key);
            if (!d) return null;
            return (
              <g key={s.key}>
                <path d={d} fill="none" stroke={s.color} strokeWidth="2.3" strokeLinejoin="round" />
                {points.map((p, idx) => {
                  const v = p[s.key];
                  if (v === undefined) return null;
                  return <circle key={`${s.key}_${p.year}`} cx={centerX(idx)} cy={toStatY(v)} r="2.6" fill={s.color} />;
                })}
              </g>
            );
          })}

        <text x={centerX(0)} y={height - 8} textAnchor="start" fontSize="11" fill="var(--ink-muted)" fontFamily="var(--font-mono)">
          {first.year}（{first.age}歲）
        </text>
        {points.length >= 4 && (
          <text x={centerX(midIdx)} y={height - 8} textAnchor="middle" fontSize="11" fill="var(--ink-muted)" fontFamily="var(--font-mono)">
            {points[midIdx].year}（{points[midIdx].age}歲）
          </text>
        )}
        <text
          x={centerX(points.length - 1)}
          y={height - 8}
          textAnchor="end"
          fontSize="11"
          fill="var(--ink-muted)"
          fontFamily="var(--font-mono)"
        >
          {last.year}（{last.age}歲）
        </text>
      </svg>
    </section>
  );
}

function IdealVsEnergyQuadrantChart({ record }: { record: CareerArchiveRecord }) {
  const finalEnergy = Math.max(0, Math.min(100, Math.round(record.finalStats.energy)));
  const finalPurpose = Math.max(0, Math.min(100, Math.round(record.finalStats.purpose)));

  const trailPoints = (record.historyPoints ?? [])
    .filter((p) => p.energy !== undefined && p.purpose !== undefined)
    .map((p) => ({
      year: p.year,
      age: p.age,
      energy: Math.max(0, Math.min(100, Math.round(p.energy!))),
      purpose: Math.max(0, Math.min(100, Math.round(p.purpose!))),
    }));

  const firstPt = trailPoints[0];
  const hasTrail = trailPoints.length >= 2;
  const startEnergy = firstPt ? firstPt.energy : null;
  const startPurpose = firstPt ? firstPt.purpose : null;

  const getQuadrantMeta = (energy: number, purpose: number) => {
    if (purpose >= 50 && energy >= 50) {
      return { name: '永續實踐', desc: '高理想 × 高能量：守住了使命感，同時保有充沛的身心續航力。', tone: 'tag-green' };
    }
    if (purpose >= 50 && energy < 50) {
      return { name: '燃燒奉獻', desc: '高理想 × 低能量：使命感強烈，但身心正長期透支、瀕臨耗竭。', tone: 'tag-amber' };
    }
    if (purpose < 50 && energy >= 50) {
      return { name: '務實生存', desc: '低理想 × 高能量：保持著體力與界線，對體制熱情轉趨務實冷靜。', tone: 'tag-teal' };
    }
    return { name: '雙重耗損', desc: '低理想 × 低能量：組織內耗磨損了初衷，身心也處於疲憊警戒區。', tone: 'tag-crimson' };
  };

  const quad = getQuadrantMeta(finalEnergy, finalPurpose);

  const width = 340;
  const padX = 42;
  const padT = 18;
  const padB = 54;
  const plot = width - padX * 2;
  const height = padT + plot + padB;
  const toX = (v: number) => padX + (v / 100) * plot;
  const toY = (v: number) => padT + plot - (v / 100) * plot;
  const midX = padX + plot / 2;
  const midY = padT + plot / 2;

  const endPxX = toX(finalEnergy);
  const endPxY = toY(finalPurpose);
  const clampLabelX = (x: number) => Math.max(padX + 22, Math.min(padX + plot - 22, x));
  const endLabelY = finalPurpose > 78 ? endPxY + 19 : endPxY - 11;

  const startPxX = startEnergy !== null ? toX(startEnergy) : 0;
  const startPxY = startPurpose !== null ? toY(startPurpose) : 0;
  const startNearEnd =
    startEnergy !== null &&
    startPurpose !== null &&
    Math.abs(startPxX - endPxX) < 38 &&
    Math.abs(startPxY - endPxY) < 28;
  const startLabelY =
    startPurpose !== null
      ? startNearEnd
        ? startPxY >= endPxY
          ? Math.min(padT + plot - 8, startPxY + 18)
          : Math.max(padT + 14, startPxY - 12)
        : startPurpose > 78
          ? startPxY + 18
          : startPxY - 10
      : 0;

  const trailPath = hasTrail
    ? trailPoints
        .map((pt, i) => `${i === 0 ? 'M' : 'L'}${toX(pt.energy).toFixed(1)},${toY(pt.purpose).toFixed(1)}`)
        .join(' ')
    : '';

  return (
    <section
      style={{
        marginBottom: 22,
        padding: '14px 16px',
        borderRadius: 8,
        border: '1px solid var(--border-hairline)',
        background: 'var(--bg-subtle)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 8,
          marginBottom: 10,
        }}
      >
        <h2 style={{ fontSize: 15 }}>理想意義 × 身心能量 職涯落點象限圖</h2>
        <span className={`tag ${quad.tone}`}>落點：{quad.name}</span>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', maxWidth: 320, height: 'auto', display: 'block' }}
          role="img"
          aria-label="理想意義與身心能量職涯象限圖"
        >
          <rect x={padX} y={padT} width={plot / 2} height={plot / 2} fill="var(--accent-amber-soft)" fillOpacity="0.45" />
          <rect x={midX} y={padT} width={plot / 2} height={plot / 2} fill="var(--accent-green-soft)" fillOpacity="0.55" />
          <rect x={padX} y={midY} width={plot / 2} height={plot / 2} fill="var(--accent-crimson-soft)" fillOpacity="0.45" />
          <rect x={midX} y={midY} width={plot / 2} height={plot / 2} fill="var(--accent-teal-soft)" fillOpacity="0.4" />

          <rect x={padX} y={padT} width={plot} height={plot} fill="none" stroke="var(--border-strong)" />
          <line x1={midX} x2={midX} y1={padT} y2={padT + plot} stroke="var(--ink-muted)" strokeDasharray="4 4" />
          <line x1={padX} x2={padX + plot} y1={midY} y2={midY} stroke="var(--ink-muted)" strokeDasharray="4 4" />

          <text
            x={midX - 10}
            y={midY - 10}
            textAnchor="end"
            fontSize="11.5"
            fontWeight="600"
            fill="var(--accent-amber)"
            fillOpacity="0.65"
          >
            燃燒奉獻
          </text>
          <text
            x={midX + 10}
            y={midY - 10}
            textAnchor="start"
            fontSize="11.5"
            fontWeight="600"
            fill="var(--accent-green)"
            fillOpacity="0.65"
          >
            永續實踐
          </text>
          <text
            x={midX - 10}
            y={midY + 20}
            textAnchor="end"
            fontSize="11.5"
            fontWeight="600"
            fill="var(--accent-crimson)"
            fillOpacity="0.65"
          >
            雙重耗損
          </text>
          <text
            x={midX + 10}
            y={midY + 20}
            textAnchor="start"
            fontSize="11.5"
            fontWeight="600"
            fill="var(--accent-teal)"
            fillOpacity="0.65"
          >
            務實生存
          </text>

          <text x={midX} y={padT + plot + 22} textAnchor="middle" fontSize="11" fill="var(--ink-secondary)">
            縱軸：理想意義 0 → 100
          </text>
          <text x={midX} y={padT + plot + 40} textAnchor="middle" fontSize="11" fill="var(--ink-secondary)">
            橫軸：身心能量 0 → 100
          </text>

          {hasTrail && (
            <>
              <path
                d={trailPath}
                fill="none"
                stroke="var(--ink-secondary)"
                strokeWidth="1.6"
                strokeOpacity="0.55"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {trailPoints.slice(1, -1).map((pt, idx) => {
                const progress = (idx + 1) / Math.max(1, trailPoints.length - 1);
                return (
                  <circle
                    key={`trail_${pt.year}_${idx}`}
                    cx={toX(pt.energy)}
                    cy={toY(pt.purpose)}
                    r="2.4"
                    fill="var(--accent-teal)"
                    fillOpacity={0.3 + progress * 0.55}
                  />
                );
              })}
            </>
          )}

          {startEnergy !== null && startPurpose !== null && (
            <>
              <circle
                cx={startPxX}
                cy={startPxY}
                r="5"
                fill="var(--bg-surface)"
                stroke="var(--ink-secondary)"
                strokeWidth="2"
              />
              <text
                x={clampLabelX(startPxX)}
                y={startLabelY}
                textAnchor="middle"
                fontSize="10"
                fontWeight="600"
                fill="var(--ink-secondary)"
                stroke="var(--bg-surface)"
                strokeWidth="3.5"
                paintOrder="stroke"
              >
                起點
              </text>
            </>
          )}

          <circle cx={endPxX} cy={endPxY} r="11" fill="var(--accent-rose)" fillOpacity="0.22" />
          <circle
            cx={endPxX}
            cy={endPxY}
            r="6"
            fill="var(--accent-rose)"
            stroke="#ffffff"
            strokeWidth="2"
          />
          <text
            x={clampLabelX(endPxX)}
            y={endLabelY}
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill="var(--ink-primary)"
            stroke="var(--bg-surface)"
            strokeWidth="4"
            paintOrder="stroke"
          >
            終點
          </text>
        </svg>

        <div style={{ flex: '1 1 220px', fontSize: 13, lineHeight: 1.75, color: 'var(--ink-secondary)' }}>
          <div style={{ fontWeight: 600, color: 'var(--ink-primary)', marginBottom: 6 }}>
            你的位置：{quad.name}
          </div>
          <p style={{ margin: '0 0 10px' }}>{quad.desc}</p>
          <div className="font-mono" style={{ fontSize: 12, color: 'var(--ink-muted)' }}>
            身心能量：{finalEnergy} / 100 ｜ 理想意義：{finalPurpose} / 100
          </div>
          {startEnergy !== null && startPurpose !== null && (
            <div className="font-mono" style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 4 }}>
              入行起點：({startEnergy}, {startPurpose}) → 終點：({finalEnergy}, {finalPurpose})（逐年軌跡共 {trailPoints.length} 個節點）
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  let line = '';
  let currY = y;
  for (const ch of text) {
    const testLine = line + ch;
    if (ctx.measureText(testLine).width > maxWidth && line.length > 0) {
      ctx.fillText(line, x, currY);
      line = ch;
      currY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) {
    ctx.fillText(line, x, currY);
    currY += lineHeight;
  }
  return currY;
}

function downloadShareCardPng(record: CareerArchiveRecord) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background paper
  ctx.fillStyle = '#faf6f9';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Inner document card
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#d4c2d3';
  ctx.lineWidth = 3;
  ctx.fillRect(56, 56, 968, 1238);
  ctx.strokeRect(56, 56, 968, 1238);

  // Top rose bar
  ctx.fillStyle = '#c86d8a';
  ctx.fillRect(56, 56, 968, 12);

  // Kicker & doc number
  ctx.fillStyle = '#7b5b8e';
  ctx.font = '600 22px "JetBrains Mono", monospace';
  ctx.fillText('1 IN 100,000 ｜ 做好事，是份好工作嗎？', 104, 126);

  ctx.fillStyle = '#88788e';
  ctx.font = '500 20px "JetBrains Mono", monospace';
  ctx.fillText(
    `歸檔字號：${record.docNumber}  ｜  ${record.startYear}–${record.endYear}（共 ${record.totalYears} 年）`,
    104,
    166
  );

  // Stamp box
  ctx.save();
  ctx.translate(880, 148);
  ctx.rotate(-0.04);
  ctx.strokeStyle = '#c65872';
  ctx.lineWidth = 4;
  ctx.strokeRect(-90, -32, 180, 64);
  ctx.fillStyle = '#c65872';
  ctx.font = '700 28px "Noto Serif TC", serif';
  ctx.textAlign = 'center';
  ctx.fillText(record.stampLabel, 0, 10);
  ctx.restore();

  // Title
  ctx.fillStyle = '#2a212d';
  ctx.font = '700 48px "Noto Serif TC", serif';
  ctx.fillText(record.title, 104, 250);

  // Player journey subtitle
  ctx.fillStyle = '#5e5063';
  ctx.font = '500 24px "Noto Sans TC", sans-serif';
  const journey = `${record.playerName}（${record.startAge} → ${record.endAge} 歲）｜ ${record.startOrgLabel} → ${record.endOrgName} · ${record.endRoleLabel}`;
  let nextY = wrapCanvasText(ctx, journey, 104, 304, 872, 36);

  // Epilogue quote
  nextY += 16;
  ctx.fillStyle = '#f3ebf2';
  ctx.fillRect(104, nextY, 872, 184);
  ctx.fillStyle = '#c86d8a';
  ctx.fillRect(104, nextY, 8, 184);
  ctx.fillStyle = '#2a212d';
  ctx.font = '400 24px "Noto Sans TC", sans-serif';
  wrapCanvasText(ctx, record.epilogue, 132, nextY + 42, 820, 38);

  // KPI 2x2 grid
  const kpiY = nextY + 220;
  const kpis = [
    { label: '最終月薪（峰值）', value: `NT$ ${record.endSalary.toLocaleString()}`, sub: `峰值 NT$ ${record.peakSalary.toLocaleString()}` },
    { label: '最終個人存款', value: `NT$ ${record.finalSavings.toLocaleString()}`, sub: record.regionLabel },
    {
      label: '勞退 6% 專戶累計',
      value: `NT$ ${record.laborPensionTotal.toLocaleString()}`,
      sub: record.endAge >= 60 ? '已滿 60 歲可請領' : `還差 ${60 - record.endAge} 年始得請領`,
    },
    { label: '累計社會影響力', value: `${record.impactScore} pts`, sub: `起點月薪 NT$ ${record.startSalary.toLocaleString()}` },
  ];

  kpis.forEach((k, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const bx = 104 + col * 446;
    const by = kpiY + row * 150;
    ctx.fillStyle = '#fdfbfd';
    ctx.strokeStyle = '#e8dce7';
    ctx.lineWidth = 2;
    ctx.fillRect(bx, by, 426, 128);
    ctx.strokeRect(bx, by, 426, 128);

    ctx.fillStyle = '#88788e';
    ctx.font = '500 20px "Noto Sans TC", sans-serif';
    ctx.fillText(k.label, bx + 24, by + 36);

    ctx.fillStyle = '#2a212d';
    ctx.font = '700 32px "JetBrains Mono", monospace';
    ctx.fillText(k.value, bx + 24, by + 80);

    ctx.fillStyle = '#5e5063';
    ctx.font = '400 18px "Noto Sans TC", sans-serif';
    ctx.fillText(k.sub, bx + 24, by + 110);
  });

  // Four stats bars
  const statY = kpiY + 332;
  ctx.fillStyle = '#2a212d';
  ctx.font = '600 24px "Noto Serif TC", serif';
  ctx.fillText('四維職涯狀態指標', 104, statY);

  const statsList = [
    { label: '身心能量', val: record.finalStats.energy, color: '#5b8c7a' },
    { label: '理想意義', val: record.finalStats.purpose, color: '#7b5b8e' },
    { label: '專業資本', val: record.finalStats.capital, color: '#b87b64' },
    { label: '生活關係', val: record.finalStats.life, color: '#c86d8a' },
  ];

  statsList.forEach((s, i) => {
    const sy = statY + 46 + i * 48;
    ctx.fillStyle = '#5e5063';
    ctx.font = '500 21px "Noto Sans TC", sans-serif';
    ctx.fillText(s.label, 104, sy);

    ctx.fillStyle = '#f3ebf2';
    ctx.fillRect(220, sy - 18, 660, 20);
    ctx.fillStyle = s.color;
    ctx.fillRect(220, sy - 18, Math.max(0, Math.min(100, s.val)) * 6.6, 20);

    ctx.fillStyle = '#2a212d';
    ctx.font = '600 21px "JetBrains Mono", monospace';
    ctx.fillText(String(Math.round(s.val)), 902, sy);
  });

  // Footer
  ctx.fillStyle = '#88788e';
  ctx.font = '400 20px "Noto Sans TC", sans-serif';
  ctx.fillText('做好事，是份好工作嗎？ v0.232｜台灣非營利組織職涯模擬器', 104, 1244);

  const link = document.createElement('a');
  link.download = `npo-career-${record.docNumber}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export function CareerSummary({
  record,
  theme,
  bgmOn,
  onToggleTheme,
  onToggleBgm,
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
          <BgmToggle enabled={bgmOn} onToggle={onToggleBgm} />
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <EndingEmblem record={record} />
            <div className="stamp-box">{record.stampLabel}</div>
          </div>
        </div>

        <p style={{ fontSize: 16, lineHeight: 1.8, margin: '0 0 18px' }}>{record.epilogue}</p>

        <div className="summary-kpi-grid">
          <div className="kpi-box">
            <div className="kpi-label">最終月薪</div>
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

        {record.historyPoints && record.historyPoints.length >= 2 && (
          <CareerTrendChart points={record.historyPoints} />
        )}

        <IdealVsEnergyQuadrantChart record={record} />

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
                    {peer.currentStatus === 'resting' ? '最終月薪（離職前）' : '最終月薪'} NT${' '}
                    {peer.salaryEstimate.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="cert-percentile" style={{ marginBottom: 18 }}>
          <strong>這只是十萬分之一的其中一種可能。</strong>
          <br />
          想體驗不同組織、地區與人生處境的交織，歡迎點擊下方「再抽一段新的職涯」；如果你也在關注非營利組織工作者的真實勞動處境，歡迎追蹤{' '}
          <a
            href="https://www.facebook.com/NPOWIU/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--accent-teal)',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              fontWeight: 600,
            }}
          >
            非營利組織產業工會
          </a>{' '}
          臉書專頁，也歡迎報名{' '}
          <a
            href="https://www.facebook.com/FJUNPO"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--accent-teal)',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              fontWeight: 600,
            }}
          >
            輔大非營利組織管理碩士學程（在職班）
          </a>
          ，認識更多NPO工作者。
        </div>

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
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <button type="button" className="btn" onClick={handleCopy}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? '已複製純文字摘要！' : '複製職涯結算摘要'}</span>
            </button>
            <button type="button" className="btn" onClick={() => downloadShareCardPng(record)}>
              <Download size={16} />
              <span>下載結算紀念卡（PNG）</span>
            </button>
          </div>

          <button type="button" className="btn btn-primary hero-cta-main" onClick={onPlayAgain}>
            <Dices size={18} />
            <span>再抽一段新的職涯</span>
          </button>
        </div>
      </article>
    </div>
  );
}
