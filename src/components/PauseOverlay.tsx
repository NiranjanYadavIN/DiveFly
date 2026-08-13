import React from 'react';
import { Play, RotateCcw, Home, Volume2, VolumeX, Music } from 'lucide-react';
import { soundEngine } from '../utils/sound';

interface PauseOverlayProps {
  score: number;
  coins: number;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
  onToggleSound: () => void;
  onToggleMusic: () => void;
}

export const PauseOverlay: React.FC<PauseOverlayProps> = ({
  score,
  coins,
  soundEnabled,
  musicEnabled,
  onResume,
  onRestart,
  onQuit,
  onToggleSound,
  onToggleMusic,
}) => {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-xs bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center text-white">
        <h2 className="text-2xl font-black font-game text-cyan-400 uppercase tracking-wide">PAUSED</h2>
        <p className="text-xs text-slate-400 font-display mt-0.5">Submarine engines idling</p>

        {/* Current Run Stats */}
        <div className="w-full my-4 bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex justify-around text-xs">
          <div>
            <div className="text-[10px] text-slate-400 font-game uppercase">DEPTH</div>
            <div className="text-lg font-bold text-cyan-300 font-display">{score} m</div>
          </div>
          <div className="w-px bg-slate-800" />
          <div>
            <div className="text-[10px] text-slate-400 font-game uppercase">PEARLS</div>
            <div className="text-lg font-bold text-amber-300 font-display">🪙 {coins}</div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="w-full flex flex-col gap-2.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundEngine.playClick();
              onResume();
            }}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black font-display text-base uppercase shadow-lg shadow-cyan-500/30 hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-slate-950" /> RESUME
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundEngine.playClick();
              onRestart();
            }}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-bold font-game text-xs uppercase flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> RESTART DIVE
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                soundEngine.playClick();
                onToggleSound();
              }}
              className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold font-game text-[11px] uppercase flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-rose-400" />}
              {soundEnabled ? 'SFX ON' : 'SFX OFF'}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                soundEngine.playClick();
                onToggleMusic();
              }}
              className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold font-game text-[11px] uppercase flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              <Music className={`w-3.5 h-3.5 ${musicEnabled ? 'text-amber-400' : 'text-slate-500'}`} />
              {musicEnabled ? 'BGM ON' : 'BGM OFF'}
            </button>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundEngine.playClick();
              onQuit();
            }}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold font-game text-xs uppercase flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
          >
            <Home className="w-4 h-4 text-slate-400" /> QUIT TO MENU
          </button>
        </div>
      </div>
    </div>
  );
};
