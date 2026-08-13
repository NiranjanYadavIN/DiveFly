import { PlayerStats } from '../types';
import { DEFAULT_SUBMARINES, INITIAL_ACHIEVEMENTS } from './constants';

const STORAGE_KEY = 'divefly_player_stats';

export const getDefaultStats = (): PlayerStats => ({
  highScore: 0,
  totalCoins: 0,
  gamesPlayed: 0,
  bestCombo: 0,
  totalDistance: 0,
  selectedSubId: 'nautilus',
  unlockedSubIds: ['nautilus'],
  achievements: [],
  soundEnabled: true,
  musicEnabled: true,
});

export const loadPlayerStats = (): PlayerStats => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultStats();
    const parsed = JSON.parse(raw);
    return { ...getDefaultStats(), ...parsed };
  } catch (e) {
    console.error('Error loading DiveFly stats from localStorage', e);
    return getDefaultStats();
  }
};

export const savePlayerStats = (stats: PlayerStats) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Error saving DiveFly stats to localStorage', e);
  }
};
