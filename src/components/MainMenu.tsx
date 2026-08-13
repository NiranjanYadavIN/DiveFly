import React from 'react';
import { Play, Anchor, Award, Settings as SettingsIcon, Shield, Zap, Sparkles } from 'lucide-react';
import { GameMode, PlayerStats, SubmarineConfig } from '../types';
import { soundEngine } from '../utils/sound';
import { SubmarineIcon } from './SubmarineIcon';

interface MainMenuProps {
  stats: PlayerStats;
  selectedSub: SubmarineConfig;
  selectedMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  onStartGame: () => void;
  onOpenHangar: () => void;
  onOpenAchievements: () => void;
  onOpenSettings: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  stats,
  selectedSub,
  selectedMode,
  onSelectMode,
  onStartGame,
  onOpenHangar,
  onOpenAchievements,
  onOpenSettings,
}) => {
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-between p-6 bg-gradient-to-b from-slate-950/80 via-cyan-950/40 to-slate-950/90 backdrop-blur-sm text-white overflow-y-auto">
      {/* Top Bar with Coins & High Score */}
      <div className="w-full max-w-lg flex items-center justify-between">
        {/* High Score Badge */}
        <div className="bg-slate-900/80 border border-cyan-500/30 rounded-2xl px-4 py-2 flex items-center gap-2 shadow-lg">
          <Anchor className="w-4 h-4 text-cyan-400" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 font-game uppercase">BEST DEPTH</span>
            <span className="text-sm font-bold text-cyan-300 font-display">{stats.highScore} m</span>
          </div>
        </div>

        {/* Coins Counter */}
        <div className="bg-slate-900/80 border border-amber-500/40 rounded-2xl px-4 py-2 flex items-center gap-2 shadow-lg">
          <span className="text-xl">🪙</span>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 font-game uppercase">PEARL COINS</span>
            <span className="text-sm font-bold text-amber-300 font-display">{stats.totalCoins}</span>
          </div>
        </div>
      </div>

      {/* Main Hero Header */}
      <div className="flex flex-col items-center text-center my-auto py-6 max-w-md w-full">
        {/* Animated Submarine Title Icon */}
        <div className="relative mb-3 animate-float">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-2xl shadow-cyan-500/40 flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center relative overflow-hidden p-2">
              <SubmarineIcon color={selectedSub.color} secondaryColor={selectedSub.secondaryColor} accentColor={selectedSub.accentColor} className="w-14 h-14" />
              <div className="absolute inset-0 bg-cyan-400/10 animate-pulse" />
            </div>
          </div>
          <div className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-black font-game px-2 py-0.5 rounded-full border border-amber-200 uppercase">
            ARCADE
          </div>
        </div>

        {/* Logo Text */}
        <h1 className="text-5xl sm:text-6xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-400 font-game drop-shadow-[0_0_25px_rgba(56,189,248,0.5)]">
          DIVEFLY
        </h1>
        <p className="text-cyan-200/80 text-xs sm:text-sm font-medium mt-1 tracking-wide font-display">
          Underwater Submarine Navigation Odyssey
        </p>

        {/* Selected Submarine Card Preview */}
        <div className="w-full mt-6 bg-slate-900/90 border border-slate-700/80 hover:border-cyan-500/50 rounded-2xl p-4 flex items-center justify-between shadow-xl backdrop-blur-md transition">
          <div className="flex items-center gap-3">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center p-1.5 border border-white/20 shadow-md bg-slate-950/80"
            >
              <SubmarineIcon color={selectedSub.color} secondaryColor={selectedSub.secondaryColor} accentColor={selectedSub.accentColor} className="w-11 h-11" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-slate-400 font-game uppercase">SELECTED SUB</div>
              <div className="text-base font-bold text-white font-display">{selectedSub.name}</div>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenHangar();
            }}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-cyan-500/40 rounded-xl text-xs font-bold text-cyan-300 font-game uppercase transition active:scale-95"
          >
            HANGAR
          </button>
        </div>

        {/* Game Mode Selector */}
        <div className="w-full mt-4 flex flex-col gap-1.5 text-left">
          <span className="text-[10px] font-bold text-cyan-400 font-game uppercase tracking-widest pl-1">
            SELECT OCEAN TRENCH MODE
          </span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'classic' as GameMode, name: 'CLASSIC', icon: '🌊', color: 'from-blue-600 to-cyan-600' },
              { id: 'abyss' as GameMode, name: 'ABYSS', icon: '🌌', color: 'from-indigo-600 to-slate-800' },
              { id: 'minefield' as GameMode, name: 'MINEFIELD', icon: '💣', color: 'from-rose-600 to-amber-600' },
            ].map((mode) => {
              const isSelected = selectedMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => {
                    soundEngine.playClick();
                    onSelectMode(mode.id);
                  }}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition active:scale-95 ${
                    isSelected
                      ? `bg-gradient-to-b ${mode.color} border-white text-white shadow-lg font-bold`
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xl mb-1">{mode.icon}</span>
                  <span className="text-[11px] font-bold font-game uppercase">{mode.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Big PLAY Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onStartGame();
          }}
          className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 text-slate-950 font-black font-display text-2xl tracking-wider uppercase shadow-2xl shadow-cyan-500/40 hover:brightness-110 active:scale-98 transition flex items-center justify-center gap-3 border-2 border-cyan-200"
        >
          <Play className="w-7 h-7 fill-slate-950" />
          START DIVE
        </button>
      </div>

      {/* Footer Navigation Buttons */}
      <div className="w-full max-w-md grid grid-cols-3 gap-3 pt-4">
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenHangar();
          }}
          className="py-2.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-xs font-bold font-game uppercase flex items-center justify-center gap-1.5 transition active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          HANGAR
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenAchievements();
          }}
          className="py-2.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-xs font-bold font-game uppercase flex items-center justify-center gap-1.5 transition active:scale-95"
        >
          <Award className="w-4 h-4 text-cyan-400" />
          BADGES
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenSettings();
          }}
          className="py-2.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-xs font-bold font-game uppercase flex items-center justify-center gap-1.5 transition active:scale-95"
        >
          <SettingsIcon className="w-4 h-4 text-slate-400" />
          SETUP
        </button>
      </div>
    </div>
  );
};
