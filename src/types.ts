export type GameMode = 'classic' | 'abyss' | 'minefield';

export type GameState = 'menu' | 'playing' | 'paused' | 'gameover';

export interface SubmarineConfig {
  id: string;
  name: string;
  description: string;
  cost: number;
  unlocked: boolean;
  color: string; // Hex color or primary color theme
  secondaryColor: string;
  accentColor: string;
  stats: {
    speed: number; // 1-5 scale
    buoyancy: number; // 1-5 scale
    extraShields: number; // Starting shields count
    coinMultiplier: number; // e.g. 1.0, 1.25, 1.5
  };
}

export interface PlayerStats {
  highScore: number;
  totalCoins: number;
  gamesPlayed: number;
  bestCombo: number;
  totalDistance: number;
  selectedSubId: string;
  unlockedSubIds: string[];
  achievements: string[];
  soundEnabled: boolean;
  musicEnabled: boolean;
}

export interface Obstacle {
  id: string;
  x: number;
  topHeight: number;
  bottomHeight: number;
  gapSize: number;
  width: number;
  passed: boolean;
  type: 'coral' | 'pipe' | 'green_pipe' | 'moving_pipe' | 'laser_gate' | 'minefield' | 'vortex';
  hasMineChain?: boolean;
  initialTopHeight?: number;
  oscillationPhase?: number;
  oscillationSpeed?: number;
  oscillationAmplitude?: number;
  challengeName?: string;
}

export interface Collectible {
  id: string;
  x: number;
  y: number;
  type: 'coin' | 'pearl' | 'shield' | 'magnet' | 'sonic';
  radius: number;
  collected: boolean;
  pulsePhase: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  life: number;
  maxLife: number;
  type: 'bubble' | 'spark' | 'ring' | 'sonicWave' | 'smoke';
}

export interface Seaweed {
  x: number;
  height: number;
  width: number;
  swaySpeed: number;
  swayOffset: number;
  color: string;
}

export interface BackgroundFish {
  x: number;
  y: number;
  speed: number;
  size: number;
  direction: number; // -1 or 1
  color: string;
  type: 'small' | 'jellyfish' | 'mantaray';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  rewardCoins: number;
}
