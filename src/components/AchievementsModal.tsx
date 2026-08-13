import React from 'react';
import { X, Award, CheckCircle2, Coins } from 'lucide-react';
import { Achievement, PlayerStats } from '../types';
import { INITIAL_ACHIEVEMENTS } from '../utils/constants';
import { soundEngine } from '../utils/sound';

interface AchievementsModalProps {
  stats: PlayerStats;
  onClaimReward: (achievementId: string, rewardCoins: number) => void;
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  stats,
  onClaimReward,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[85vh] text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-2xl font-black font-game text-cyan-400">NAVAL BADGES</h2>
            <p className="text-xs text-slate-400 font-display">Complete missions for coin rewards</p>
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

        {/* Badges List */}
        <div className="flex-1 overflow-y-auto space-y-3 my-4 pr-1">
          {INITIAL_ACHIEVEMENTS.map((ach) => {
            let currentVal = 0;
            if (ach.id === 'first_dive') currentVal = stats.gamesPlayed > 0 ? 1 : 0;
            else if (ach.id === 'depth_100') currentVal = stats.highScore;
            else if (ach.id === 'coin_50') currentVal = stats.totalCoins;
            else if (ach.id === 'sub_collector') currentVal = stats.unlockedSubIds.length;
            else if (ach.id === 'mine_dodger') currentVal = stats.bestCombo;

            const isCompleted = currentVal >= ach.maxProgress;
            const isClaimed = stats.achievements.includes(ach.id);

            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                  isClaimed
                    ? 'bg-slate-950/40 border-slate-800 text-slate-400'
                    : isCompleted
                    ? 'bg-cyan-950/40 border-cyan-400/80'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl p-2 bg-slate-950 rounded-xl border border-slate-800">
                    {ach.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold font-display text-sm text-white">{ach.title}</h3>
                    <p className="text-xs text-slate-400 leading-snug">{ach.description}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-400 rounded-full"
                          style={{ width: `${Math.min(100, (currentVal / ach.maxProgress) * 100)}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 font-game">
                        {Math.min(currentVal, ach.maxProgress)} / {ach.maxProgress}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Claim or Claimed State */}
                {isClaimed ? (
                  <span className="text-emerald-400 text-xs font-bold font-game uppercase flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> DONE
                  </span>
                ) : isCompleted ? (
                  <button
                    onClick={() => {
                      soundEngine.playPowerup();
                      onClaimReward(ach.id, ach.rewardCoins);
                    }}
                    className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-bold font-game text-xs uppercase rounded-xl shadow-md transition active:scale-95"
                  >
                    CLAIM 🪙{ach.rewardCoins}
                  </button>
                ) : (
                  <span className="text-slate-500 text-xs font-bold font-game uppercase">
                    🪙 {ach.rewardCoins}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 font-bold font-game uppercase text-xs text-slate-300 transition"
        >
          CLOSE
        </button>
      </div>
    </div>
  );
};
