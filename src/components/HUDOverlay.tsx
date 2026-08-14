import React, { useState, useEffect } from 'react';
import { Pause, Zap, Shield, Navigation } from 'lucide-react';
import { soundEngine } from '../utils/sound';

interface HUDOverlayProps {
  score: number;        // Flappy Pipe Score
  distance: number;     // Continuous Distance Traveled in meters
  highScore: number;
  coins: number;
  combo: number;
  hasShield: boolean;
  isMagnetActive?: boolean;
  sonicCharge: number;
  onPause: () => void;
  onTriggerSonic: () => void;
  onThrustStart: () => void;
  onThrustEnd: () => void;
}

interface TouchRipple {
  id: number;
  x: number;
  y: number;
}

export const HUDOverlay: React.FC<HUDOverlayProps> = ({
  score,
  distance,
  highScore,
  coins,
  combo,
  hasShield,
  isMagnetActive = false,
  sonicCharge,
  onPause,
  onTriggerSonic,
  onThrustStart,
  onThrustEnd,
}) => {
  const [showTouchHint, setShowTouchHint] = useState(true);
  const [ripples, setRipples] = useState<TouchRipple[]>([]);

  // Auto hide touch hint after 3.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTouchHint(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // If user clicked inside a HUD button, do not start thrusting
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }

    if (showTouchHint) setShowTouchHint(false);
    soundEngine.playTap();
    onThrustStart();

    // Create a visual touch feedback ripple that disappears almost instantly (250ms)
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now() + Math.random();

    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 250);

    // Device haptic vibration feedback for mobile
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch {
        // Ignore if restricted
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    onThrustEnd();
  };

  return (
    <div
      className="absolute inset-0 flex flex-col justify-between p-4 z-20 select-none touch-none cursor-pointer"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={onThrustEnd}
      onPointerLeave={onThrustEnd}
    >
      {/* Touch Visual Ripples */}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute w-16 h-16 -ml-8 -mt-8 rounded-full border-2 border-cyan-400 bg-cyan-400/20 pointer-events-none animate-ping opacity-75"
          style={{ left: r.x, top: r.y }}
        />
      ))}

      {/* Top Header Row */}
      <div className="flex items-center justify-between w-full pointer-events-auto gap-1 sm:gap-2">
        {/* Distance Traveled Continuous Counter */}
        <div className="flex items-center gap-1.5 shrink min-w-0">
          <div className="bg-slate-900/85 backdrop-blur-md border border-cyan-500/50 rounded-xl sm:rounded-2xl h-9 sm:h-11 px-2.5 sm:px-3.5 flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg shadow-cyan-950/50 shrink min-w-0 max-w-[42vw] sm:max-w-none whitespace-nowrap overflow-hidden">
            <span className="text-[9px] sm:text-[10px] font-bold text-cyan-400 tracking-wider uppercase font-game shrink-0">DIST</span>
            <span className="text-sm sm:text-lg font-black text-white font-display tabular-nums shrink min-w-0 truncate">
              {distance.toLocaleString()} <span className="text-[10px] sm:text-xs font-semibold text-cyan-300">m</span>
            </span>
          </div>

          {/* High Score Best */}
          {highScore > 0 && (
            <div className="hidden md:flex bg-slate-900/60 backdrop-blur-sm border border-amber-500/30 rounded-2xl h-10 sm:h-11 px-3 items-center justify-center gap-1 text-xs text-amber-300 shrink-0 whitespace-nowrap">
              <span className="font-semibold font-game">BEST:</span>
              <span className="font-bold font-display tabular-nums">{highScore.toLocaleString()} m</span>
            </div>
          )}
        </div>

        {/* CENTER STAGE BIG FLAPPY BIRD PIPE SCORE */}
        <div className="flex flex-col items-center justify-center -mt-0.5 shrink-0 px-1">
          <div className="text-3xl sm:text-5xl font-black text-amber-300 font-display tracking-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] tabular-nums">
            {score}
          </div>
          <span className="text-[8px] sm:text-[9px] font-black text-cyan-300/80 font-game tracking-widest uppercase -mt-1 drop-shadow-md whitespace-nowrap">
            PIPES
          </span>
        </div>

        {/* Coins & Status Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Shield Status Badge */}
          {hasShield && (
            <div className="flex bg-cyan-500/20 border border-cyan-400/60 rounded-lg sm:rounded-xl px-1.5 sm:px-2 py-0.5 sm:py-1 items-center gap-1 text-cyan-300 animate-pulse">
              <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400" />
              <span className="text-[8px] sm:text-[10px] font-bold font-game uppercase">SHIELD</span>
            </div>
          )}

          {/* Magnet Status Badge */}
          {isMagnetActive && (
            <div className="flex bg-purple-500/20 border border-purple-400/60 rounded-lg sm:rounded-xl px-1.5 sm:px-2 py-0.5 sm:py-1 items-center gap-1 text-purple-300 animate-pulse">
              <span className="text-[10px] sm:text-xs">🧲</span>
              <span className="text-[8px] sm:text-[10px] font-bold font-game uppercase">MAGNET</span>
            </div>
          )}

          {/* Coins Counter */}
          <div className="bg-slate-900/85 backdrop-blur-md border border-amber-500/40 rounded-xl sm:rounded-2xl h-9 sm:h-11 px-2.5 sm:px-3 flex items-center gap-1 sm:gap-1.5 shadow-lg shrink-0 whitespace-nowrap">
            <span className="text-amber-400 text-sm sm:text-base">🪙</span>
            <span className="text-sm sm:text-base font-bold text-amber-200 font-display tabular-nums">
              {coins.toLocaleString()}
            </span>
          </div>

          {/* Pause Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundEngine.playClick();
              onPause();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="w-9 h-9 sm:w-11 sm:h-11 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-600 rounded-xl sm:rounded-2xl text-white shadow-lg transition active:scale-95 pointer-events-auto cursor-pointer flex items-center justify-center shrink-0"
            aria-label="Pause Game"
          >
            <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-300" />
          </button>
        </div>
      </div>

      {/* Dynamic Touch Guidance */}
      <div className="flex flex-col items-center justify-center pointer-events-none gap-2 min-h-[44px]">
        {/* Full-Screen Touch Hint Badge for Mobile */}
        {showTouchHint && (
          <div className="bg-slate-900/80 backdrop-blur-md border border-cyan-400/50 rounded-2xl px-4 py-2 text-cyan-200 font-bold font-game text-xs tracking-wider flex items-center gap-2 shadow-xl animate-pulse">
            <Navigation className="w-4 h-4 text-cyan-400 animate-bounce" />
            <span>TAP & HOLD ANYWHERE TO SWIM UP</span>
          </div>
        )}
      </div>

      {/* Bottom Row - Ultra-Minimal Sonic Blast Powerup & Quick Tip */}
      <div className="flex items-end justify-between w-full pointer-events-auto pb-1">
        {/* Minimal Sonic Blast Powerup Pill */}
        <button
          type="button"
          disabled={sonicCharge < 100}
          onClick={(e) => {
            e.stopPropagation();
            if (sonicCharge >= 100) {
              onTriggerSonic();
            }
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className={`relative overflow-hidden rounded-xl h-8 px-2.5 flex items-center gap-1.5 font-bold transition-all shadow-md text-[11px] font-game ${
            sonicCharge >= 100
              ? 'bg-cyan-400 border border-cyan-200 text-slate-950 shadow-cyan-400/50 animate-pulse cursor-pointer active:scale-95'
              : 'bg-slate-900/80 border border-slate-700/80 text-slate-400 cursor-not-allowed'
          }`}
          title="Sonic Blast Powerup"
        >
          <div
            className="absolute left-0 bottom-0 top-0 bg-cyan-500/30 transition-all duration-300 pointer-events-none"
            style={{ width: `${sonicCharge}%` }}
          />
          <Zap className={`w-3.5 h-3.5 ${sonicCharge >= 100 ? 'text-slate-950 fill-slate-950' : 'text-cyan-400'}`} />
          <span className="tabular-nums font-mono text-[10px]">
            {sonicCharge >= 100 ? 'BLAST' : `${sonicCharge}%`}
          </span>
        </button>

        {/* Small Touch Indicator Icon */}
        <div className="hidden sm:flex items-center gap-1.5 bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl px-2.5 py-1 text-[10px] text-slate-300 font-game">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>TOUCH TO DIVE</span>
        </div>
      </div>
    </div>
  );
};
