import { SubmarineConfig, Achievement } from '../types';

export const DEFAULT_SUBMARINES: SubmarineConfig[] = [
  {
    id: 'nautilus',
    name: 'Sunny Sub 💛',
    description: 'The cheerful yellow explorer! Super smooth, friendly, and easy to steer.',
    cost: 0,
    unlocked: true,
    color: '#fbbf24', // Sunny Bright Yellow
    secondaryColor: '#d97706',
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
    name: 'Aqua Dolphin 🐬',
    description: 'Zippy ocean speedster with bubble hydro-boosters and extra bounce!',
    cost: 120,
    unlocked: false,
    color: '#0ea5e9', // Ocean Sky Blue
    secondaryColor: '#0284c7',
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
    name: 'Cosmic Sparkle ✨',
    description: 'Magic neon sub with glowing rainbow lights and a built-in pearl magnet!',
    cost: 280,
    unlocked: false,
    color: '#c084fc', // Bright Lilac Purple
    secondaryColor: '#9333ea',
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
    name: 'Captain Robo 🤖',
    description: 'Super-strong heroic sub with tough bubble shields for giant adventures!',
    cost: 500,
    unlocked: false,
    color: '#f43f5e', // Fun Bubble Red / Rose
    secondaryColor: '#e11d48',
    accentColor: '#fb923c',
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
    title: 'First Splash! 🌊',
    description: 'Start your very first submarine dive adventure',
    icon: '🤿',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    rewardCoins: 25,
  },
  {
    id: 'depth_100',
    title: 'Deep Sea Star ⭐',
    description: 'Dive down 100 meters into the coral ocean',
    icon: '🌟',
    unlocked: false,
    progress: 0,
    maxProgress: 100,
    rewardCoins: 50,
  },
  {
    id: 'coin_50',
    title: 'Pearl Collector 🦪',
    description: 'Collect 50 shiny gold coins and magic pearls',
    icon: '✨',
    unlocked: false,
    progress: 0,
    maxProgress: 50,
    rewardCoins: 75,
  },
  {
    id: 'mine_dodger',
    title: 'Bubble Champ 🫧',
    description: 'Pass through 25 coral gates in one awesome run',
    icon: '🏆',
    unlocked: false,
    progress: 0,
    maxProgress: 25,
    rewardCoins: 100,
  },
  {
    id: 'sub_collector',
    title: 'Sub Fleet Hero 🚤',
    description: 'Unlock 2 cool submarines in your Garage',
    icon: '🚀',
    unlocked: false,
    progress: 0,
    maxProgress: 2,
    rewardCoins: 150,
  },
];

