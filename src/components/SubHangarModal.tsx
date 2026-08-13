import React from 'react';
import { X, Check, Lock, Shield, Zap, Coins } from 'lucide-react';
import { PlayerStats, SubmarineConfig } from '../types';
import { DEFAULT_SUBMARINES } from '../utils/constants';
import { soundEngine } from '../utils/sound';
import { SubmarineIcon } from './SubmarineIcon';

interface SubHangarModalProps {
  stats: PlayerStats;
  selectedSub: SubmarineConfig;
  onSelectSub: (sub: SubmarineConfig) => void;
  onUnlockSub: (subId: string, cost: number) => void;
  onClose: () => void;
}

export const SubHangarModal: React.FC<SubHangarModalProps> = ({
  stats,
  selectedSub,
  onSelectSub,
  onUnlockSub,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-2xl font-black font-game text-cyan-400">SUBMARINE HANGAR</h2>
            <p className="text-xs text-slate-400 font-display">Upgrade your fleet with coin rewards</p>
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

        {/* Total Coins Header */}
        <div className="my-4 bg-slate-950/60 border border-amber-500/30 rounded-2xl p-3 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 font-game uppercase">AVAILABLE COINS</span>
          <div className="flex items-center gap-1.5 text-amber-300 font-bold font-display text-lg">
            <span>🪙</span>
            <span>{stats.totalCoins}</span>
          </div>
        </div>

        {/* Submarine Cards Grid */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 my-2">
          {DEFAULT_SUBMARINES.map((sub) => {
            const isUnlocked = stats.unlockedSubIds.includes(sub.id);
            const isSelected = selectedSub.id === sub.id;
            const canAfford = stats.totalCoins >= sub.cost;

            return (
              <div
                key={sub.id}
                className={`p-4 rounded-2xl border transition relative flex flex-col gap-3 ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-400 shadow-lg shadow-cyan-950/50'
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Top Title & Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center p-1 border border-white/20 shadow-md bg-slate-950/80"
                    >
                      <SubmarineIcon color={sub.color} secondaryColor={sub.secondaryColor} accentColor={sub.accentColor} className="w-11 h-11" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white font-display text-base">{sub.name}</h3>
                      <p className="text-[11px] text-slate-400 leading-tight max-w-[200px]">{sub.description}</p>
                    </div>
                  </div>

                  {/* Selected Badge */}
                  {isSelected && (
                    <span className="bg-cyan-500 text-slate-950 text-[10px] font-black font-game px-2.5 py-1 rounded-full flex items-center gap-1 uppercase">
                      <Check className="w-3 h-3 stroke-[3]" /> ACTIVE
                    </span>
                  )}
                </div>

                {/* Submarine Stats Progress */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 font-game uppercase">BUOYANCY SPEED</span>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full ${
                            i < sub.stats.buoyancy ? 'bg-cyan-400' : 'bg-slate-800'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 font-game uppercase">COIN MULTIPLIER</span>
                    <span className="font-bold text-amber-300 font-display">{sub.stats.coinMultiplier}x</span>
                  </div>

                  <div className="flex flex-col gap-1 col-span-2">
                    <span className="text-[10px] text-slate-400 font-game uppercase">STARTING SHIELDS</span>
                    <div className="flex items-center gap-1 text-cyan-300 font-bold font-display">
                      <Shield className="w-3.5 h-3.5" />
                      <span>{sub.stats.extraShields} Shields</span>
                    </div>
                  </div>
                </div>

                {/* Unlock or Select Button */}
                {!isUnlocked ? (
                  <button
                    disabled={!canAfford}
                    onClick={() => {
                      if (canAfford) {
                        soundEngine.playPowerup();
                        onUnlockSub(sub.id, sub.cost);
                      }
                    }}
                    className={`w-full py-2.5 rounded-xl font-bold font-game uppercase text-xs flex items-center justify-center gap-2 transition ${
                      canAfford
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 shadow-md cursor-pointer'
                        : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                    UNLOCK FOR 🪙 {sub.cost}
                  </button>
                ) : !isSelected ? (
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      onSelectSub(sub);
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-cyan-500/40 text-cyan-300 font-bold font-game uppercase text-xs transition active:scale-95"
                  >
                    EQUIP SUBMARINE
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>

        {/* Footer Close */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="w-full mt-3 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 font-bold font-game uppercase text-xs text-slate-300 transition"
        >
          BACK TO MENU
        </button>
      </div>
    </div>
  );
};
