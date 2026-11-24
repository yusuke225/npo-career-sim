import { Trash2, X } from 'lucide-react';
import { ORG_TYPE_LIST } from '../data/organizations';
import { ALL_ENDING_CATALOG } from '../engine/simulation';
import type { CareerArchiveRecord } from '../types/game';

interface ArchiveDrawerProps {
  open: boolean;
  records: CareerArchiveRecord[];
  onClose: () => void;
  onSelectRecord: (record: CareerArchiveRecord) => void;
  onClearAll: () => void;
}

export function ArchiveDrawer({
  open,
  records,
  onClose,
  onSelectRecord,
  onClearAll,
}: ArchiveDrawerProps) {
  if (!open) return null;

  const experiencedOrgTypes = new Set<string>();
  const unlockedEndings = new Set<string>();
  records.forEach((r) => {
    experiencedOrgTypes.add(r.startOrgType);
    experiencedOrgTypes.add(r.endOrgType);
    unlockedEndings.add(r.title);
  });

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: 12,
            borderBottom: '1px solid var(--border-hairline)',
          }}
        >
          <div>
            <h2 style={{ fontSize: 20 }}>歷次職涯檔案櫃</h2>
            <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>
              僅存於本機瀏覽器 · 共收錄 {records.length} 份結算報告
            </div>
          </div>
          <button type="button" className="btn btn-icon" onClick={onClose} aria-label="關閉檔案櫃">
            <X size={16} />
          </button>
        </div>

        <section>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
            八大組織生態蒐集進度（{experiencedOrgTypes.size} / {ORG_TYPE_LIST.length}）
          </div>
          <div className="collection-grid">
            {ORG_TYPE_LIST.map((org) => {
              const unlocked = experiencedOrgTypes.has(org.id);
              return (
                <div key={org.id} className={`collection-cell ${unlocked ? 'unlocked' : ''}`}>
                  <span>{org.shortLabel}</span>
                  <span className="font-mono" style={{ fontSize: 11 }}>
                    {unlocked ? '已入行' : '未抽中'}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
            11 種結局稱號蒐集進度（{unlockedEndings.size} / {ALL_ENDING_CATALOG.length}）
          </div>
          <div className="collection-grid">
            {ALL_ENDING_CATALOG.map((end) => {
              const unlocked = unlockedEndings.has(end.title);
              return (
                <div key={end.title} className={`collection-cell ${unlocked ? 'unlocked' : ''}`}>
                  <span>{unlocked ? end.title : '？？？'}</span>
                  <span className="font-mono" style={{ fontSize: 11 }}>
                    {unlocked ? end.stampLabel : '未解鎖'}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section style={{ flex: 1 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600 }}>已歸檔職涯紀錄</span>
            {records.length > 0 && (
              <button type="button" className="btn btn-sm btn-crimson" onClick={onClearAll}>
                <Trash2 size={13} />
                清空本機紀錄
              </button>
            )}
          </div>

          {records.length === 0 ? (
            <div
              className="card"
              style={{ padding: 20, textAlign: 'center', color: 'var(--ink-muted)', fontSize: 13 }}
            >
              尚無完成歸檔的職涯。完成一局模擬後，系統會自動在此保存你的紀錄與稱號。
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {records.map((rec) => (
                <button
                  key={rec.id}
                  type="button"
                  className="card"
                  onClick={() => onSelectRecord(rec)}
                  style={{
                    textAlign: 'left',
                    padding: '12px 14px',
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 4,
                    }}
                  >
                    <span className="font-mono" style={{ fontSize: 11, color: 'var(--ink-muted)' }}>
                      {rec.docNumber}
                    </span>
                    <span className="tag tag-teal">{rec.stampLabel}</span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 3 }}>{rec.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-secondary)' }}>
                    {rec.startYear}–{rec.endYear}（{rec.totalYears} 年）｜{rec.startOrgLabel} →{' '}
                    {rec.endRoleLabel}
                  </div>
                  <div
                    className="font-mono"
                    style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 4 }}
                  >
                    最終月薪 NT$ {rec.endSalary.toLocaleString()} · 存款 NT${' '}
                    {rec.finalSavings.toLocaleString()}
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
