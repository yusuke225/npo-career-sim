import { useCallback, useEffect, useState } from 'react';
import { ArchiveDrawer } from './components/ArchiveDrawer';
import { CareerSummary } from './components/CareerSummary';
import { GameDashboard } from './components/GameDashboard';
import { IntakeCertificate } from './components/IntakeCertificate';
import { LandingScreen } from './components/LandingScreen';
import { PLAYER_NAME_POOL, pickRandom } from './data/organizations';
import { startJazzBgm, stopJazzBgm } from './engine/jazzAudio';
import {
  ARCHIVE_STORAGE_KEY,
  advanceQuarter,
  buildStateFromConfig,
  clearActiveCareer,
  finalizeCareer,
  generateRandomStart,
  loadActiveCareer,
  loadArchiveRecords,
  pickAutoChoiceIndex,
  resolveEventChoice,
  saveActiveCareer,
} from './engine/simulation';
import type {
  CareerArchiveRecord,
  FocusId,
  PaceMode,
  SimulationState,
  StartConfigInput,
  ThemeMode,
} from './types/game';

type ScreenMode = 'landing' | 'intake' | 'playing' | 'summary';

const THEME_STORAGE_KEY = 'npo_1in100k_theme_v1';

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
  return saved === 'dark' ? 'dark' : 'light';
}

export function App() {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
  const [pace, setPace] = useState<PaceMode>('standard');
  const [screen, setScreen] = useState<ScreenMode>('landing');
  const [simState, setSimState] = useState<SimulationState | null>(null);
  const [viewingArchive, setViewingArchive] = useState<CareerArchiveRecord | null>(null);
  const [archives, setArchives] = useState<CareerArchiveRecord[]>(() => loadArchiveRecords());
  const [savedCareer, setSavedCareer] = useState<SimulationState | null>(() => loadActiveCareer());
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<1 | 2 | 4 | 8>(1);
  const [autoDecide, setAutoDecide] = useState(false);
  const [lastCustomConfig, setLastCustomConfig] = useState<StartConfigInput | null>(null);
  const [customPlayerName, setCustomPlayerName] = useState('');
  const [bgmOn, setBgmOn] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const toggleBgm = useCallback(() => {
    setBgmOn((prev) => {
      const next = !prev;
      if (next) {
        startJazzBgm();
      } else {
        stopJazzBgm();
      }
      return next;
    });
  }, []);

  const refreshArchives = useCallback(() => {
    setArchives(loadArchiveRecords());
  }, []);

  const handleStartRandom = useCallback(() => {
    setLastCustomConfig(null);
    const fresh = generateRandomStart(pace, Math.random, customPlayerName);
    setSimState(fresh);
    setViewingArchive(null);
    setScreen('intake');
  }, [pace, customPlayerName]);

  const handleStartCustom = useCallback((config: StartConfigInput) => {
    setLastCustomConfig(config);
    const fresh = buildStateFromConfig(config, false);
    setSimState(fresh);
    setViewingArchive(null);
    setScreen('intake');
  }, []);

  const handleReroll = useCallback(() => {
    const fresh = lastCustomConfig
      ? buildStateFromConfig({ ...lastCustomConfig, playerName: customPlayerName }, false)
      : generateRandomStart(pace, Math.random, customPlayerName);
    setSimState(fresh);
  }, [lastCustomConfig, pace, customPlayerName]);

  const handleChangePlayerName = useCallback((name: string) => {
    const sliced = name.slice(0, 16);
    setCustomPlayerName(sliced);
    setSimState((prev) => (prev ? { ...prev, playerName: sliced } : prev));
  }, []);

  const handleConfirmStart = useCallback(() => {
    setIsPlaying(true);
    setAutoDecide(false);
    setSpeed(1);
    if (simState && !simState.isEnded) {
      const normalizedName = simState.playerName.trim().slice(0, 16) || pickRandom(PLAYER_NAME_POOL);
      const readyState =
        normalizedName === simState.playerName
          ? simState
          : { ...simState, playerName: normalizedName };
      if (readyState !== simState) {
        setSimState(readyState);
      }
      saveActiveCareer(readyState);
      setSavedCareer(readyState);
    }
    setScreen('playing');
  }, [simState]);

  const handleResumeCareer = useCallback(() => {
    const latest = loadActiveCareer();
    if (!latest || latest.isEnded) return;
    setSimState(latest);
    setViewingArchive(null);
    setIsPlaying(true);
    setAutoDecide(false);
    setScreen('playing');
  }, []);

  const handleDiscardSavedCareer = useCallback(() => {
    clearActiveCareer();
    setSavedCareer(null);
  }, []);

  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      const next = !prev;
      if (!next && simState && !simState.isEnded) {
        saveActiveCareer(simState);
        setSavedCareer(simState);
      }
      return next;
    });
  }, [simState]);

  const handleSaveAndHome = useCallback(() => {
    if (simState && !simState.isEnded) {
      saveActiveCareer(simState);
      setSavedCareer(simState);
    }
    setIsPlaying(false);
    setScreen('landing');
  }, [simState]);

  const hasSimState = Boolean(simState);
  const simIsEnded = simState?.isEnded ?? false;
  const pendingEventId = simState?.pendingEvent?.id ?? null;
  const simPace = simState?.pace ?? 'standard';

  // 主計時器推進
  useEffect(() => {
    if (screen !== 'playing' || !hasSimState || simIsEnded || !isPlaying) {
      return;
    }

    if (pendingEventId) {
      if (!autoDecide) return;
      const autoDelay = speed === 8 ? 140 : speed === 4 ? 220 : speed === 2 ? 400 : 620;
      const timer = window.setTimeout(() => {
        setSimState((prev) => {
          if (!prev || !prev.pendingEvent || prev.isEnded) return prev;
          const idx = pickAutoChoiceIndex(prev.pendingEvent, prev);
          return resolveEventChoice(prev, idx);
        });
      }, autoDelay);
      return () => window.clearTimeout(timer);
    }

    const baseMs = 5200;
    const intervalMs = Math.round(baseMs / speed);

    const timer = window.setInterval(() => {
      setSimState((prev) => {
        if (!prev || prev.isEnded || prev.pendingEvent) return prev;
        return advanceQuarter(prev);
      });
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [screen, hasSimState, simIsEnded, pendingEventId, simPace, isPlaying, speed, autoDecide]);

  // 即時保存進行中職涯進度至瀏覽器 localStorage
  useEffect(() => {
    if (screen === 'playing' && simState && !simState.isEnded) {
      saveActiveCareer(simState);
      setSavedCareer(simState);
    }
  }, [screen, simState]);

  // 偵測模擬結束並切換至結算檔案畫面
  useEffect(() => {
    if (screen === 'playing' && simState?.isEnded && simState.archiveRecord) {
      setIsPlaying(false);
      clearActiveCareer();
      setSavedCareer(null);
      setViewingArchive(simState.archiveRecord);
      refreshArchives();
      setScreen('summary');
    }
  }, [screen, simState, refreshArchives]);

  const handleFastForwardToEvent = useCallback(() => {
    setSimState((prev) => {
      if (!prev || prev.isEnded || prev.pendingEvent) return prev;
      let cursor = prev;
      for (let i = 0; i < 40; i++) {
        cursor = advanceQuarter(cursor);
        if (cursor.pendingEvent || cursor.isEnded) break;
      }
      return cursor;
    });
  }, []);

  const handleChangeFocus = useCallback((focus: FocusId) => {
    setSimState((prev) => (prev ? { ...prev, focus } : prev));
  }, []);

  const handleChooseEvent = useCallback((index: number) => {
    setSimState((prev) => {
      if (!prev || !prev.pendingEvent || prev.isEnded) return prev;
      return resolveEventChoice(prev, index);
    });
  }, []);

  const handleManualFinish = useCallback(() => {
    setSimState((prev) => {
      if (!prev || prev.isEnded) return prev;
      return finalizeCareer(prev, 'manual_close');
    });
  }, []);

  const handleClearArchives = useCallback(() => {
    window.localStorage.removeItem(ARCHIVE_STORAGE_KEY);
    setArchives([]);
  }, []);

  const handleSelectArchive = useCallback((record: CareerArchiveRecord) => {
    setViewingArchive(record);
    setDrawerOpen(false);
    setScreen('summary');
  }, []);

  return (
    <>
      {screen === 'landing' && (
        <LandingScreen
          theme={theme}
          bgmOn={bgmOn}
          pace={pace}
          playerName={customPlayerName}
          archiveCount={archives.length}
          savedCareer={savedCareer}
          onToggleTheme={toggleTheme}
          onToggleBgm={toggleBgm}
          onChangePace={setPace}
          onChangePlayerName={setCustomPlayerName}
          onStartRandom={handleStartRandom}
          onStartCustom={handleStartCustom}
          onResumeCareer={handleResumeCareer}
          onDiscardSavedCareer={handleDiscardSavedCareer}
          onOpenArchive={() => setDrawerOpen(true)}
        />
      )}

      {screen === 'intake' && simState && (
        <IntakeCertificate
          state={simState}
          theme={theme}
          bgmOn={bgmOn}
          onToggleTheme={toggleTheme}
          onToggleBgm={toggleBgm}
          onChangePlayerName={handleChangePlayerName}
          onConfirmStart={handleConfirmStart}
          onReroll={handleReroll}
          onBackHome={() => setScreen('landing')}
        />
      )}

      {screen === 'playing' && simState && (
        <GameDashboard
          state={simState}
          theme={theme}
          bgmOn={bgmOn}
          isPlaying={isPlaying}
          speed={speed}
          autoDecide={autoDecide}
          onToggleTheme={toggleTheme}
          onToggleBgm={toggleBgm}
          onTogglePlay={handleTogglePlay}
          onChangeSpeed={setSpeed}
          onFastForwardToEvent={handleFastForwardToEvent}
          onToggleAutoDecide={() => setAutoDecide((a) => !a)}
          onChangeFocus={handleChangeFocus}
          onChooseEvent={handleChooseEvent}
          onSaveAndHome={handleSaveAndHome}
          onManualFinish={handleManualFinish}
        />
      )}

      {screen === 'summary' && viewingArchive && (
        <CareerSummary
          record={viewingArchive}
          theme={theme}
          bgmOn={bgmOn}
          onToggleTheme={toggleTheme}
          onToggleBgm={toggleBgm}
          onPlayAgain={handleStartRandom}
          onOpenArchive={() => setDrawerOpen(true)}
          onBackHome={() => setScreen('landing')}
        />
      )}

      <ArchiveDrawer
        open={drawerOpen}
        records={archives}
        onClose={() => setDrawerOpen(false)}
        onSelectRecord={handleSelectArchive}
        onClearAll={handleClearArchives}
      />
    </>
  );
}

export default App;
