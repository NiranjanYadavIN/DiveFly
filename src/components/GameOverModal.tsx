import React, { useMemo } from 'react';
import { RotateCcw, Home, Trophy, Sparkles, Anchor, Star, Heart } from 'lucide-react';
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

const ENCOURAGING_MESSAGES = [
  "Good try, Captain! 🌟",
  "Nice dive underwater! 🚀",
  "Getting better every run! ⚡",
  "Great attempt, ready for next round? 🏆",
];

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
  const cheerMessage = useMemo(() => {
    if (isNewHighScore) return "NEW RECORD ACHIVED! 🏆";
    return ENCOURAGING_MESSAGES[Math.floor(Math.random() * ENCOURAGING_MESSAGES.length)];
  }, [isNewHighScore]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm bg-slate-900 border-2 border-cyan-400/50 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center text-white relative overflow-hidden">
        {/* Floating background decorative bubbles */}
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />

        {/* New High Score Confetti Badge */}
        {isNewHighScore ? (
          <div className="mb-2 bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 text-slate-950 text-xs font-black font-game px-4 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-yellow-500/40 border-2 border-white animate-bounce">
            <Trophy className="w-4 h-4 fill-slate-950 stroke-slate-950" /> NEW RECORD!
          </div>
        ) : (
          <div className="mb-1 text-xs font-black text-cyan-300 font-game uppercase tracking-widest flex items-center gap-1">
            <span>DIVE COMPLETE</span>
          </div>
        )}

        {/* Header Title */}
        <h2 className="text-3xl sm:text-4xl font-black font-game text-white tracking-wide drop-shadow-md">
          {isNewHighScore ? "NEW BEST!" : "DIVE FINISHED"}
        </h2>
        <p className="text-xs sm:text-sm font-bold text-amber-300 font-display mt-1">
          {cheerMessage}
        </p>

        {/* Score & Stats Card */}
        <div className="w-full my-4 bg-slate-950/80 border-2 border-slate-800 rounded-2xl p-4 flex flex-col gap-2.5 shadow-inner">
          {/* Depth Distance */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-cyan-300 font-game uppercase flex items-center gap-1.5">
              <span>🌊</span> DIVE DISTANCE
            </span>
            <span className="text-2xl font-black text-cyan-200 font-display">{distance} m</span>
          </div>

          {/* Pipes Passed */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-game uppercase flex items-center gap-1">
              <span>🐠</span> GATES CLEARED
            </span>
            <span className="font-black text-emerald-400 font-display text-base">{score}</span>
          </div>

          {/* Best Distance High Score */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-game uppercase flex items-center gap-1">
              <span>🏆</span> BEST SCORE
            </span>
            <span className="font-bold text-amber-300 font-display">{highScore} m</span>
          </div>

          {/* Pearls / Coins Earned */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-game uppercase flex items-center gap-1">
              <span>✨</span> PEARLS COLLECTED
            </span>
            <span className="font-black text-amber-300 font-display text-sm flex items-center gap-1">
              <span>🪙</span> +{coinsEarned}
            </span>
          </div>

          {/* Max Combo */}
          {maxCombo > 1 && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-game uppercase flex items-center gap-1">
                <span>🔥</span> STREAK COMBO
              </span>
              <span className="font-black text-orange-400 font-display">{maxCombo}x</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          {/* Big Bubbly Retry Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundEngine.playCelebration();
              onRetry();
            }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black font-display text-xl uppercase shadow-xl shadow-yellow-500/40 hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2 border-2 border-white cursor-pointer animate-pulse"
          >
            <RotateCcw className="w-6 h-6 stroke-[3]" /> DIVE AGAIN! 🚀
          </button>

          {/* Garage & Menu Row */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                soundEngine.playBubblePop();
                onOpenHangar();
              }}
              className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-amber-500/40 text-amber-300 font-black font-game uppercase text-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shadow-md"
            >
              <Sparkles className="w-4 h-4 text-amber-400" /> GARAGE 🚤
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                soundEngine.playBubblePop();
                onMenu();
              }}
              className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-black font-game uppercase text-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shadow-md"
            >
              <Home className="w-4 h-4 text-slate-400" /> MENU 🏠
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

