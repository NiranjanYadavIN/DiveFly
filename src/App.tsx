import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GameMode, GameState, PlayerStats, SubmarineConfig } from './types';
import { DEFAULT_SUBMARINES } from './utils/constants';
import { loadPlayerStats, savePlayerStats } from './utils/storage';
import { soundEngine } from './utils/sound';

import { GameCanvas } from './components/GameCanvas';
import { HUDOverlay } from './components/HUDOverlay';
import { MainMenu } from './components/MainMenu';
import { SubHangarModal } from './components/SubHangarModal';
import { GameOverModal } from './components/GameOverModal';
import { AchievementsModal } from './components/AchievementsModal';
import { SettingsModal } from './components/SettingsModal';
import { PauseOverlay } from './components/PauseOverlay';

export default function App() {
  const [stats, setStats] = useState<PlayerStats>(loadPlayerStats);
  const [gameState, setGameState] = useState<GameState>('menu');
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [gameId, setGameId] = useState(0);

  // Active Modals
  const [showHangar, setShowHangar] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Active Gameplay Live State
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [runCoins, setRunCoins] = useState(0);
  const [combo, setCombo] = useState(1);
  const [maxCombo, setMaxCombo] = useState(1);
  const [hasShield, setHasShield] = useState(false);
  const [isMagnetActive, setIsMagnetActive] = useState(false);
  const [sonicCharge, setSonicCharge] = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  // Control inputs
  const [isThrusting, setIsThrusting] = useState(false);
  const [triggerSonicWave, setTriggerSonicWave] = useState(false);

  // Sync sound settings with audio engine
  useEffect(() => {
    soundEngine.setSoundEnabled(stats.soundEnabled);
    soundEngine.setMusicEnabled(stats.musicEnabled);
  }, [stats.soundEnabled, stats.musicEnabled]);

  // Manage BGM according to gameState and musicEnabled
  useEffect(() => {
    if (gameState === 'playing' && stats.musicEnabled) {
      soundEngine.startAmbientBGM();
    } else if (gameState !== 'playing') {
      soundEngine.stopAmbientBGM();
    }
  }, [gameState, stats.musicEnabled]);

  // Selected submarine object
  const selectedSub = useMemo(() => {
    return DEFAULT_SUBMARINES.find((s) => s.id === stats.selectedSubId) || DEFAULT_SUBMARINES[0];
  }, [stats.selectedSubId]);

  // Handle Keyboard Controls (Space / ArrowUp to thrust)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        soundEngine.resumeAudio();
        if (gameState === 'playing') {
          setIsThrusting(true);
        } else if (gameState === 'menu') {
          startGame();
        }
      } else if (e.code === 'KeyP' && gameState === 'playing') {
        setGameState('paused');
      } else if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        if (sonicCharge >= 100) {
          setTriggerSonicWave(true);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        setIsThrusting(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, sonicCharge, stats.musicEnabled]);

  // Start a new DiveFly game run
  const startGame = () => {
    soundEngine.resumeAudio();
    setScore(0);
    setDistance(0);
    setRunCoins(0);
    setCombo(1);
    setMaxCombo(1);
    setHasShield(false);
    setSonicCharge(0);
    setIsNewHighScore(false);
    setIsThrusting(false);
    setTriggerSonicWave(false);
    setGameId((prev) => prev + 1);
    setGameState('playing');
  };

  // Live score updates from GameCanvas engine
  const handleScoreUpdate = useCallback(
    (newScore: number, newCombo: number, newCoins: number, shieldActive: boolean, newSonic: number, newDistance: number, magnetActive: boolean) => {
      setScore(newScore);
      setDistance(newDistance);
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);
      setRunCoins(newCoins);
      setHasShield(shieldActive);
      setIsMagnetActive(magnetActive);
      setSonicCharge(newSonic);
    },
    [maxCombo]
  );

  // Game Over Handler
  const handleGameOver = useCallback(
    (finalScore: number, finalCoins: number, finalMaxCombo: number, finalDistance: number) => {
      soundEngine.stopAmbientBGM();

      const newHigh = finalDistance > stats.highScore;
      setIsNewHighScore(newHigh);

      const updatedStats: PlayerStats = {
        ...stats,
        highScore: Math.max(stats.highScore, finalDistance),
        totalCoins: stats.totalCoins + finalCoins,
        gamesPlayed: stats.gamesPlayed + 1,
        bestCombo: Math.max(stats.bestCombo, finalMaxCombo),
        totalDistance: stats.totalDistance + finalDistance,
      };

      setStats(updatedStats);
      savePlayerStats(updatedStats);
      setGameState('gameover');
    },
    [stats]
  );

  // Select submarine in hangar
  const handleSelectSub = (sub: SubmarineConfig) => {
    const updated = { ...stats, selectedSubId: sub.id };
    setStats(updated);
    savePlayerStats(updated);
  };

  // Unlock submarine in hangar
  const handleUnlockSub = (subId: string, cost: number) => {
    if (stats.totalCoins >= cost && !stats.unlockedSubIds.includes(subId)) {
      const updated: PlayerStats = {
        ...stats,
        totalCoins: stats.totalCoins - cost,
        unlockedSubIds: [...stats.unlockedSubIds, subId],
        selectedSubId: subId,
      };
      setStats(updated);
      savePlayerStats(updated);
    }
  };

  // Claim achievement reward
  const handleClaimReward = (achievementId: string, rewardCoins: number) => {
    if (!stats.achievements.includes(achievementId)) {
      const updated: PlayerStats = {
        ...stats,
        totalCoins: stats.totalCoins + rewardCoins,
        achievements: [...stats.achievements, achievementId],
      };
      setStats(updated);
      savePlayerStats(updated);
    }
  };

  // Sound/Music toggles
  const handleToggleSound = () => {
    const updated = { ...stats, soundEnabled: !stats.soundEnabled };
    setStats(updated);
    savePlayerStats(updated);
  };

  const handleToggleMusic = () => {
    const updated = { ...stats, musicEnabled: !stats.musicEnabled };
    setStats(updated);
    savePlayerStats(updated);
    if (!updated.musicEnabled) soundEngine.stopAmbientBGM();
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none touch-none">
      {/* HTML5 Game Canvas Layer */}
      <GameCanvas
        gameId={gameId}
        gameState={gameState}
        gameMode={gameMode}
        selectedSub={selectedSub}
        onGameOver={handleGameOver}
        onScoreUpdate={handleScoreUpdate}
        isThrusting={isThrusting}
        triggerSonicWave={triggerSonicWave}
        onSonicWaveTriggered={() => setTriggerSonicWave(false)}
      />

      {/* Main Menu Screen */}
      {gameState === 'menu' && (
        <MainMenu
          stats={stats}
          selectedSub={selectedSub}
          selectedMode={gameMode}
          onSelectMode={(mode) => setGameMode(mode)}
          onStartGame={startGame}
          onOpenHangar={() => setShowHangar(true)}
          onOpenAchievements={() => setShowAchievements(true)}
          onOpenSettings={() => setShowSettings(true)}
        />
      )}

      {/* Playing Active HUD Overlay */}
      {gameState === 'playing' && (
        <HUDOverlay
          score={score}
          distance={distance}
          highScore={stats.highScore}
          coins={runCoins}
          combo={combo}
          hasShield={hasShield}
          isMagnetActive={isMagnetActive}
          sonicCharge={sonicCharge}
          onPause={() => setGameState('paused')}
          onTriggerSonic={() => setTriggerSonicWave(true)}
          onThrustStart={() => setIsThrusting(true)}
          onThrustEnd={() => setIsThrusting(false)}
        />
      )}

      {/* Pause Screen Overlay */}
      {gameState === 'paused' && (
        <PauseOverlay
          score={score}
          coins={runCoins}
          soundEnabled={stats.soundEnabled}
          musicEnabled={stats.musicEnabled}
          onResume={() => setGameState('playing')}
          onRestart={startGame}
          onQuit={() => {
            soundEngine.stopAmbientBGM();
            setGameState('menu');
          }}
          onToggleSound={handleToggleSound}
          onToggleMusic={handleToggleMusic}
        />
      )}

      {/* Game Over Modal */}
      {gameState === 'gameover' && (
        <GameOverModal
          score={score}
          distance={distance}
          highScore={stats.highScore}
          isNewHighScore={isNewHighScore}
          coinsEarned={runCoins}
          maxCombo={maxCombo}
          onRetry={startGame}
          onMenu={() => setGameState('menu')}
          onOpenHangar={() => setShowHangar(true)}
        />
      )}

      {/* Submarine Hangar Garage Modal */}
      {showHangar && (
        <SubHangarModal
          stats={stats}
          selectedSub={selectedSub}
          onSelectSub={handleSelectSub}
          onUnlockSub={handleUnlockSub}
          onClose={() => setShowHangar(false)}
        />
      )}

      {/* Achievements / Badges Modal */}
      {showAchievements && (
        <AchievementsModal
          stats={stats}
          onClaimReward={handleClaimReward}
          onClose={() => setShowAchievements(false)}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          stats={stats}
          onToggleSound={handleToggleSound}
          onToggleMusic={handleToggleMusic}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
