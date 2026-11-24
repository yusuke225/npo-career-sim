import { Volume2, VolumeX } from 'lucide-react';

interface BgmToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export function BgmToggle({ enabled, onToggle }: BgmToggleProps) {
  return (
    <button
      type="button"
      className={`btn btn-sm ${enabled ? 'btn-primary' : ''}`}
      onClick={onToggle}
      aria-pressed={enabled}
      aria-label={enabled ? '關閉背景音樂' : '開啟背景音樂'}
      title={enabled ? '點擊靜音背景音樂' : '點擊播放背景音樂'}
    >
      {enabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
      <span>{enabled ? '音樂' : '靜音'}</span>
    </button>
  );
}
