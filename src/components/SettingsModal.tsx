import React from 'react';
import { X, Volume2, VolumeX, Music, HelpCircle, Gamepad2 } from 'lucide-react';
import { PlayerStats } from '../types';
import { soundEngine } from '../utils/sound';

interface SettingsModalProps {
  stats: PlayerStats;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  stats,
  onToggleSound,
  onToggleMusic,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl flex flex-col text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-2xl font-black font-game text-cyan-400">SETTINGS & HELP</h2>
            <p className="text-xs text-slate-400 font-display">Audio and controls setup</p>
          </div>
          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audio Toggles */}
        <div className="my-4 flex flex-col gap-3">
          <div className="flex items-center justify-between p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl">
            <div className="flex items-center gap-3">
              {stats.soundEnabled ? <Volume2 className="w-5 h-5 text-cyan-400" /> : <VolumeX className="w-5 h-5 text-rose-400" />}
              <div className="text-left">
                <div className="font-bold font-display text-sm">SOUND EFFECTS</div>
                <div className="text-[11px] text-slate-400">Sonar pings, engine hums, chimes</div>
              </div>
            </div>
            <button
              onClick={() => {
                soundEngine.playClick();
                onToggleSound();
              }}
              className={`px-3.5 py-1.5 rounded-xl font-bold font-game uppercase text-xs transition ${
                stats.soundEnabled ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {stats.soundEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl">
            <div className="flex items-center gap-3">
              <Music className={`w-5 h-5 ${stats.musicEnabled ? 'text-amber-400' : 'text-slate-500'}`} />
              <div className="text-left">
                <div className="font-bold font-display text-sm">UNDERWATER BGM</div>
                <div className="text-[11px] text-slate-400">Ambient hydro-drone synth melody</div>
              </div>
            </div>
            <button
              onClick={() => {
                soundEngine.playClick();
                onToggleMusic();
              }}
              className={`px-3.5 py-1.5 rounded-xl font-bold font-game uppercase text-xs transition ${
                stats.musicEnabled ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {stats.musicEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Game How To Play Guide */}
        <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl text-left flex flex-col gap-2">
          <div className="text-xs font-bold text-cyan-400 font-game uppercase flex items-center gap-1.5">
            <Gamepad2 className="w-4 h-4 text-cyan-400" /> HOW TO PLAY DIVEFLY
          </div>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside font-display leading-relaxed">
            <li><strong className="text-white">TAP / SPACEBAR / CLICK:</strong> Thrust submarine upwards against water density gravity.</li>
            <li><strong className="text-white">RELEASE:</strong> Sink downwards to control depth through cavern gaps.</li>
            <li><strong className="text-white">COLLECT PEARLS:</strong> Earn coin credits to unlock sub skins in Hangar.</li>
            <li><strong className="text-white">POWER-UPS:</strong> Shields absorb obstacle crashes; Magnets pull coins; Sonic Wave blasts screen obstacles!</li>
          </ul>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="w-full mt-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 font-bold font-game uppercase text-xs text-slate-300 transition"
        >
          DONE
        </button>
      </div>
    </div>
  );
};
