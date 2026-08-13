import React from 'react';
import { RotateCcw, Home, Trophy, Sparkles, Anchor, Coins } from 'lucide-react';
import { soundEngine } from '../utils/sound';

interface GameOverModalProps {
  score: number;
  distance: number;
  highScore: number;
  isNewHighScore: boolean;
  coinsEarned: number;
  maxCombo: number;
  onRetry: () => void;
  onMenu: () => void;
  onOpenHangar: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  distance,
  highScore,
  isNewHighScore,
  coinsEarned,
  maxCombo,
  onRetry,
  onMenu,
  onOpenHangar,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center text-white">
        {/* New High Score Confetti Badge */}
        {isNewHighScore ? (
          <div className="mb-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-black font-game px-3.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-orange-500/30 animate-bounce">
            <Trophy className="w-4 h-4 fill-slate-950" /> NEW DEPTH RECORD!
          </div>
        ) : (
          <span className="text-xs font-bold text-rose-400 font-game uppercase tracking-widest mb-1">
            MISSION OVER
          </span>
        )}

        {/* Header Title */}
        <h2 className="text-3xl font-black font-game text-white tracking-wide">
          SUB IMPACT
        </h2>
        <p className="text-xs text-slate-400 font-display mt-0.5">Naval hull breached underwater</p>

        {/* Score & Stats Card */}
        <div className="w-full my-5 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2.5">
          {/* Depth Distance */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-400 font-game uppercase flex items-center gap-1.5">
              <Anchor className="w-4 h-4 text-cyan-400" /> DEPTH DISTANCE
            </span>
            <span className="text-2xl font-black text-cyan-300 font-display">{distance} m</span>
          </div>

          {/* Pipes Passed */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-game uppercase">PIPES PASSED</span>
            <span className="font-bold text-emerald-400 font-display text-sm">{score}</span>
          </div>

          {/* Best Distance High Score */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-game uppercase">BEST RECORD</span>
            <span className="font-bold text-amber-300 font-display">{highScore} m</span>
          </div>

          {/* Coins Earned */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-game uppercase">PEARLS EARNED</span>
            <span className="font-bold text-amber-300 font-display flex items-center gap-1">
              <span>🪙</span> +{coinsEarned}
            </span>
          </div>

          {/* Max Combo */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-game uppercase">MAX COMBO</span>
            <span className="font-bold text-orange-400 font-display">{maxCombo}x</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          {/* Retry Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundEngine.playClick();
              onRetry();
            }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black font-display text-lg uppercase shadow-xl shadow-cyan-500/30 hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2 border border-cyan-300 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5 stroke-[2.5]" /> DIVE AGAIN
          </button>

          {/* Garage & Menu Row */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                soundEngine.playClick();
                onOpenHangar();
              }}
              className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-bold font-game uppercase text-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" /> HANGAR
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                soundEngine.playClick();
                onMenu();
              }}
              className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold font-game uppercase text-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              <Home className="w-4 h-4 text-slate-400" /> MENU
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
