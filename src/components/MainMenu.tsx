import React from 'react';
import { Play, Anchor, Award, Settings as SettingsIcon, Shield, Zap, Sparkles, Heart } from 'lucide-react';
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
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-sky-950/80 via-cyan-950/40 to-slate-950/90 backdrop-blur-sm text-white overflow-y-auto">
      {/* Top Bar with Pearls & Best Score */}
      <div className="w-full max-w-md flex items-center justify-between gap-2">
        {/* Best Score Badge */}
        <div className="bg-slate-900/90 border-2 border-cyan-400/40 rounded-2xl px-3.5 py-1.5 flex items-center gap-2 shadow-lg shadow-cyan-950/40">
          <span className="text-lg animate-pulse">🏆</span>
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-bold text-cyan-300 font-game uppercase tracking-wider">BEST DIVE</span>
            <span className="text-sm font-black text-white font-display">{stats.highScore} m</span>
          </div>
        </div>

        {/* Shiny Pearls Counter */}
        <div className="bg-slate-900/90 border-2 border-amber-400/50 rounded-2xl px-3.5 py-1.5 flex items-center gap-2 shadow-lg shadow-amber-950/40">
          <span className="text-xl animate-bounce">✨</span>
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-bold text-amber-300 font-game uppercase tracking-wider">PEARL COINS</span>
            <span className="text-sm font-black text-amber-300 font-display">🪙 {stats.totalCoins}</span>
          </div>
        </div>
      </div>

      {/* Main Hero Header */}
      <div className="flex flex-col items-center text-center my-auto py-4 max-w-md w-full">
        {/* Animated Submarine Title Icon with Happy Bubble Ring */}
        <div className="relative mb-2 animate-float">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-400 via-cyan-400 to-blue-500 p-1 shadow-2xl shadow-cyan-500/50 flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[20px] flex items-center justify-center relative overflow-hidden p-2">
              <SubmarineIcon color={selectedSub.color} secondaryColor={selectedSub.secondaryColor} accentColor={selectedSub.accentColor} className="w-16 h-16" />
              <div className="absolute inset-0 bg-cyan-400/10 animate-pulse pointer-events-none" />
            </div>
          </div>
          <div className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 text-[10px] font-black font-game px-2.5 py-0.5 rounded-full border-2 border-white uppercase shadow-md animate-bounce">
            SUPER FUN!
          </div>
        </div>

        {/* Cheerful Logo Text */}
        <h1 className="text-5xl sm:text-6xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-cyan-200 to-sky-400 font-game drop-shadow-[0_4px_20px_rgba(56,189,248,0.6)]">
          DIVEFLY
        </h1>
        <p className="text-cyan-200 text-xs sm:text-sm font-bold mt-0.5 tracking-wide font-display flex items-center justify-center gap-1">
          <span>🌊 Happy Ocean Submarine Adventure! 🐬</span>
        </p>

        {/* Selected Submarine Card Preview */}
        <div className="w-full mt-5 bg-slate-900/90 border-2 border-cyan-500/40 hover:border-cyan-400 rounded-3xl p-3.5 flex items-center justify-between shadow-xl backdrop-blur-md transition">
          <div className="flex items-center gap-3">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center p-1.5 border border-white/20 shadow-md bg-slate-950/80"
            >
              <SubmarineIcon color={selectedSub.color} secondaryColor={selectedSub.secondaryColor} accentColor={selectedSub.accentColor} className="w-11 h-11" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-bold text-amber-300 font-game uppercase tracking-wider flex items-center gap-1">
                <span>⭐ MY HERO SUB</span>
              </div>
              <div className="text-base font-black text-white font-display">{selectedSub.name}</div>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playBubblePop();
              onOpenHangar();
            }}
            className="px-3.5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 border border-cyan-200 rounded-2xl text-xs font-black text-slate-950 font-game uppercase transition active:scale-95 shadow-md"
          >
            CHANGE 🛠️
          </button>
        </div>

        {/* Game Mode Selector with Fun Kids Themes */}
        <div className="w-full mt-4 flex flex-col gap-1.5 text-left">
          <span className="text-[10px] font-black text-cyan-300 font-game uppercase tracking-widest pl-1">
            CHOOSE YOUR ADVENTURE WORLD:
          </span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'classic' as GameMode, name: 'CORAL COVE', icon: '🐠', desc: 'Sunny & Fun', color: 'from-blue-500 to-cyan-500' },
              { id: 'abyss' as GameMode, name: 'STAR OCEAN', icon: '🌟', desc: 'Glow in Dark', color: 'from-indigo-500 to-purple-600' },
              { id: 'minefield' as GameMode, name: 'BUBBLE MAZE', icon: '🫧', desc: 'Super Bouncy', color: 'from-amber-500 to-rose-500' },
            ].map((mode) => {
              const isSelected = selectedMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => {
                    soundEngine.playBubblePop();
                    onSelectMode(mode.id);
                  }}
                  className={`p-2.5 rounded-2xl border-2 flex flex-col items-center justify-center transition active:scale-95 cursor-pointer ${
                    isSelected
                      ? `bg-gradient-to-b ${mode.color} border-white text-white shadow-lg shadow-cyan-500/30 scale-105 font-black`
                      : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <span className="text-2xl mb-1 filter drop-shadow">{mode.icon}</span>
                  <span className="text-[10px] font-black font-game uppercase leading-tight">{mode.name}</span>
                  <span className="text-[8px] font-bold opacity-80">{mode.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Big Juicy PLAY Button */}
        <button
          onClick={() => {
            soundEngine.playCelebration();
            onStartGame();
          }}
          className="w-full mt-5 py-4 rounded-3xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black font-display text-2xl sm:text-3xl tracking-wider uppercase shadow-2xl shadow-yellow-500/50 hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-3 border-4 border-white cursor-pointer animate-pulse"
        >
          <Play className="w-8 h-8 fill-slate-950 stroke-slate-950" />
          LET'S DIVE! 🚀
        </button>
      </div>

      {/* Footer Navigation Buttons */}
      <div className="w-full max-w-md grid grid-cols-3 gap-2.5 pt-2">
        <button
          onClick={() => {
            soundEngine.playBubblePop();
            onOpenHangar();
          }}
          className="py-2.5 bg-slate-900/90 hover:bg-slate-800 border-2 border-amber-400/40 rounded-2xl text-amber-300 text-xs font-black font-game uppercase flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          GARAGE 🚤
        </button>

        <button
          onClick={() => {
            soundEngine.playBubblePop();
            onOpenAchievements();
          }}
          className="py-2.5 bg-slate-900/90 hover:bg-slate-800 border-2 border-cyan-400/40 rounded-2xl text-cyan-300 text-xs font-black font-game uppercase flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md"
        >
          <Award className="w-4 h-4 text-cyan-400" />
          BADGES 🌟
        </button>

        <button
          onClick={() => {
            soundEngine.playBubblePop();
            onOpenSettings();
          }}
          className="py-2.5 bg-slate-900/90 hover:bg-slate-800 border-2 border-slate-600 rounded-2xl text-slate-200 text-xs font-black font-game uppercase flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md"
        >
          <SettingsIcon className="w-4 h-4 text-slate-400" />
          SOUNDS 🎵
        </button>
      </div>
    </div>
  );
};

