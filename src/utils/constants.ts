import { SubmarineConfig, Achievement } from '../types';

export const DEFAULT_SUBMARINES: SubmarineConfig[] = [
  {
    id: 'nautilus',
    name: 'Yellow Nautilus',
    description: 'Classic yellow explorer sub. Reliable and balanced handling.',
    cost: 0,
    unlocked: true,
    color: '#eab308', // Yellow
    secondaryColor: '#ca8a04',
    accentColor: '#38bdf8',
    stats: {
      speed: 3,
      buoyancy: 3,
      extraShields: 0,
      coinMultiplier: 1.0,
    },
  },
  {
    id: 'kraken',
    name: 'Kraken Blue',
    description: 'Deep abyssal sub with twin hydro-thrusters and extra buoyancy.',
    cost: 150,
    unlocked: false,
    color: '#0284c7', // Sky Blue
    secondaryColor: '#0369a1',
    accentColor: '#38bdf8',
    stats: {
      speed: 4,
      buoyancy: 4,
      extraShields: 0,
      coinMultiplier: 1.25,
    },
  },
  {
    id: 'cybersub',
    name: 'Cyber Neon',
    description: 'Futuristic sub equipped with magnetic coin field and glowing trim.',
    cost: 350,
    unlocked: false,
    color: '#a855f7', // Purple
    secondaryColor: '#7e22ce',
    accentColor: '#22d3ee',
    stats: {
      speed: 4,
      buoyancy: 3,
      extraShields: 1,
      coinMultiplier: 1.5,
    },
  },
  {
    id: 'titan',
    name: 'Titan Red',
    description: 'Heavy armored deep trench submarine with reinforced shield hull.',
    cost: 600,
    unlocked: false,
    color: '#ef4444', // Red
    secondaryColor: '#b91c1c',
    accentColor: '#f97316',
    stats: {
      speed: 3,
      buoyancy: 5,
      extraShields: 2,
      coinMultiplier: 1.8,
    },
  },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_dive',
    title: 'First Dive',
    description: 'Start your first DiveFly underwater mission',
    icon: '⚓',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    rewardCoins: 25,
  },
  {
    id: 'depth_100',
    title: 'Deep Trencher',
    description: 'Reach a depth score of 100 meters',
    icon: '🌊',
    unlocked: false,
    progress: 0,
    maxProgress: 100,
    rewardCoins: 50,
  },
  {
    id: 'coin_50',
    title: 'Pearl Hunter',
    description: 'Collect a total of 50 sea coins/pearls',
    icon: '🪙',
    unlocked: false,
    progress: 0,
    maxProgress: 50,
    rewardCoins: 75,
  },
  {
    id: 'mine_dodger',
    title: 'Naval Ace',
    description: 'Pass through 25 obstacle gaps in a single run',
    icon: '💣',
    unlocked: false,
    progress: 0,
    maxProgress: 25,
    rewardCoins: 100,
  },
  {
    id: 'sub_collector',
    title: 'Fleet Commander',
    description: 'Unlock 2 submarine models in the Hangar',
    icon: '🚤',
    unlocked: false,
    progress: 0,
    maxProgress: 2,
    rewardCoins: 150,
  },
];
