import React, { useRef, useEffect, useCallback } from 'react';
import { GameMode, GameState, SubmarineConfig, Obstacle, Collectible, Particle, Seaweed, BackgroundFish } from '../types';
import { soundEngine } from '../utils/sound';

interface GameCanvasProps {
  gameId: number;
  gameState: GameState;
  gameMode: GameMode;
  selectedSub: SubmarineConfig;
  onGameOver: (score: number, coins: number, maxCombo: number, distance: number) => void;
  onScoreUpdate: (score: number, combo: number, coins: number, shieldActive: boolean, sonicCharge: number, distance: number, magnetActive: boolean) => void;
  isThrusting: boolean;
  triggerSonicWave: boolean;
  onSonicWaveTriggered: () => void;
}

interface SpeedLine {
  x: number;
  y: number;
  length: number;
  speed: number;
  alpha: number;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  gameId,
  gameState,
  gameMode,
  selectedSub,
  onGameOver,
  onScoreUpdate,
  isThrusting,
  triggerSonicWave,
  onSonicWaveTriggered,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Game Engine State Refs (to avoid re-renders during 60FPS loop)
  const engineRef = useRef({
    score: 0,              // Flappy Pipes cleared count
    distanceMeters: 0,     // Continuous distance traveled
    coins: 0,
    combo: 1,
    maxCombo: 1,
    subX: 130,
    subY: 250,
    subVy: 0,
    subAngle: 0,
    wasThrusting: false,
    shields: 0, // Always start at 0; protected layer is earned by collecting Shield Orbs (🛡️) in-game!
    sonicCharge: 0, // 0 to 100%
    isSonicActive: false,
    sonicWaveRadius: 0,
    magnetTimer: 0,
    
    // Snappy Arcade Flappy Physics
    gravity: 0.36,
    flapImpulse: -7.0 * (selectedSub.stats.buoyancy / 3),
    speed: 5.5 * (selectedSub.stats.speed / 3),
    
    obstacles: [] as Obstacle[],
    collectibles: [] as Collectible[],
    particles: [] as Particle[],
    seaweeds: [] as Seaweed[],
    fishList: [] as BackgroundFish[],
    speedLines: [] as SpeedLine[],
    
    frame: 0,
    lastSpawnX: 0,
    propellerAngle: 0,
    causticsOffset: 0,
    parallaxOffset1: 0,
    parallaxOffset2: 0,
  });

  // Reset engine when starting game
  const resetEngine = useCallback(() => {
    const canvas = canvasRef.current;
    const height = canvas ? canvas.height : 600;
    const width = canvas ? canvas.width : 800;

    engineRef.current = {
      score: 0,
      distanceMeters: 0,
      coins: 0,
      combo: 1,
      maxCombo: 1,
      subX: Math.min(140, width * 0.22),
      subY: height / 2,
      subVy: 0,
      subAngle: 0,
      wasThrusting: false,
      shields: 0, // Always start fresh with 0 shields
      sonicCharge: 0,
      isSonicActive: false,
      sonicWaveRadius: 0,
      magnetTimer: 0,

      // Smooth, Forgiving Flappy Control Physics
      gravity: 0.22,
      flapImpulse: -4.8 * (selectedSub.stats.buoyancy / 3),
      speed: 2.2 * (selectedSub.stats.speed / 3),

      obstacles: [],
      collectibles: [],
      particles: [],
      seaweeds: Array.from({ length: 22 }, (_, i) => ({
        x: i * 45 + Math.random() * 20,
        height: 22 + Math.random() * 22, // Shorter, sleeker grass! (22px to 44px)
        width: 5 + Math.random() * 4,    // Sleeker width
        swaySpeed: 0.025 + Math.random() * 0.02,
        swayOffset: Math.random() * Math.PI * 2,
        color: Math.random() > 0.5 ? '#22c55e' : Math.random() > 0.25 ? '#10b981' : '#34d399',
      })),
      fishList: Array.from({ length: 10 }, () => ({
        x: Math.random() * width,
        y: 80 + Math.random() * (height - 180),
        speed: 0.8 + Math.random() * 1.5,
        size: 10 + Math.random() * 16,
        direction: Math.random() > 0.5 ? 1 : -1,
        color: Math.random() > 0.6 ? '#38bdf8' : Math.random() > 0.3 ? '#f43f5e' : '#fbbf24',
        type: Math.random() > 0.8 ? 'jellyfish' : 'small',
      })),
      speedLines: Array.from({ length: 15 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        length: 25 + Math.random() * 40,
        speed: 4 + Math.random() * 4,
        alpha: 0.12 + Math.random() * 0.18,
      })),

      frame: 0,
      lastSpawnX: 0, // Starts at 0 so first pipe spawns after initial distance
      propellerAngle: 0,
      causticsOffset: 0,
      parallaxOffset1: 0,
      parallaxOffset2: 0,
    };
  }, [selectedSub]);

  // Reset engine whenever gameId changes or gameState transitions to playing
  useEffect(() => {
    if (gameState === 'playing') {
      resetEngine();
    }
  }, [gameId, gameState, resetEngine]);

  // Handle Sonic Wave activation
  useEffect(() => {
    if (triggerSonicWave && engineRef.current.sonicCharge >= 100 && gameState === 'playing') {
      engineRef.current.sonicCharge = 0;
      engineRef.current.isSonicActive = true;
      engineRef.current.sonicWaveRadius = 10;
      soundEngine.playSonicWave();

      // Create burst particles
      for (let i = 0; i < 35; i++) {
        const angle = (Math.PI * 2 * i) / 35;
        engineRef.current.particles.push({
          x: engineRef.current.subX,
          y: engineRef.current.subY,
          vx: Math.cos(angle) * 10,
          vy: Math.sin(angle) * 10,
          size: 6 + Math.random() * 6,
          alpha: 1,
          color: '#22d3ee',
          life: 0,
          maxLife: 35,
          type: 'sonicWave',
        });
      }

      onSonicWaveTriggered();
    }
  }, [triggerSonicWave, gameState, onSonicWaveTriggered]);

  // Main canvas render and physics loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        engineRef.current.subX = Math.min(140, canvas.width * 0.22);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    if (gameState === 'playing' && engineRef.current.frame === 0) {
      resetEngine();
    }

    const render = () => {
      const engine = engineRef.current;
      const width = canvas.width;
      const height = canvas.height;

      // --- PROGRESSIVE DYNAMIC SPEED SCALING ---
      // Game speed starts at submarine base speed (~2.2 - 2.5) and smoothly increases gently
      const baseSpeed = engine.speed;
      const scoreSpeedBoost = engine.score * 0.035;
      const distanceSpeedBoost = (engine.distanceMeters / 1000) * 0.18;
      const currentSpeed = Math.min(4.2, baseSpeed + scoreSpeedBoost + distanceSpeedBoost);

      // --- 1. CLEAR & DRAW BACKGROUND GRADIENT ---
      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      if (gameMode === 'abyss') {
        bgGradient.addColorStop(0, '#020617');
        bgGradient.addColorStop(0.5, '#0f172a');
        bgGradient.addColorStop(1, '#000000');
      } else {
        bgGradient.addColorStop(0, '#0284c7');
        bgGradient.addColorStop(0.35, '#0369a1');
        bgGradient.addColorStop(0.7, '#0f172a');
        bgGradient.addColorStop(1, '#020617');
      }
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // --- 2. PARALLAX LAYER 1: DISTANT ABYSS MOUNTAIN SILHOUETTES ---
      if (gameState === 'playing') {
        engine.parallaxOffset1 = (engine.parallaxOffset1 + currentSpeed * 0.15) % 400;
        engine.parallaxOffset2 = (engine.parallaxOffset2 + currentSpeed * 0.45) % 600;
      }

      ctx.fillStyle = '#0f2b48';
      ctx.beginPath();
      ctx.moveTo(0, height - 80);
      for (let x = -400; x <= width + 400; x += 100) {
        const drawX = x - (engine.parallaxOffset1 % 400);
        const hillY = height - 120 - Math.sin((x + 100) * 0.01) * 45;
        ctx.lineTo(drawX, hillY);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.fill();

      // --- 3. PARALLAX LAYER 2: MIDGROUND SUNKEN RUINS & CORAL ---
      ctx.fillStyle = '#0d3d56';
      ctx.beginPath();
      ctx.moveTo(0, height - 60);
      for (let x = -600; x <= width + 600; x += 150) {
        const drawX = x - (engine.parallaxOffset2 % 600);
        const hillY = height - 70 - Math.cos((x + 50) * 0.02) * 35;
        ctx.lineTo(drawX, hillY);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.fill();

      // --- 4. OCEAN LIGHT CAUSTICS RAYS ---
      engine.causticsOffset += 0.015;
      ctx.save();
      ctx.globalAlpha = 0.12;
      for (let i = 0; i < 6; i++) {
        const rayX = (i * width) / 5 + Math.sin(engine.causticsOffset + i) * 35;
        const rayGrad = ctx.createLinearGradient(rayX, 0, rayX + 70, height);
        rayGrad.addColorStop(0, '#ffffff');
        rayGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = rayGrad;
        ctx.beginPath();
        ctx.moveTo(rayX, 0);
        ctx.lineTo(rayX + 90, 0);
        ctx.lineTo(rayX - 50, height);
        ctx.lineTo(rayX - 140, height);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // --- 5. HIGH-SPEED WATER STREAKS ---
      engine.speedLines.forEach((line) => {
        if (gameState === 'playing') {
          line.x -= line.speed + currentSpeed * 0.5;
          if (line.x < -line.length) {
            line.x = width + Math.random() * 100;
            line.y = Math.random() * (height - 60);
          }
        }
        ctx.strokeStyle = `rgba(255, 255, 255, ${line.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(line.x, line.y);
        ctx.lineTo(line.x + line.length, line.y);
        ctx.stroke();
      });

      // --- 6. BACKGROUND FISH & JELLYFISH ---
      engine.fishList.forEach((fish) => {
        if (gameState === 'playing') {
          fish.x -= fish.speed * fish.direction;
          if (fish.x < -40) fish.x = width + 40;
          if (fish.x > width + 40) fish.x = -40;
        }

        ctx.save();
        ctx.globalAlpha = 0.45;
        if (fish.type === 'jellyfish') {
          ctx.fillStyle = '#f43f5e';
          ctx.beginPath();
          ctx.arc(fish.x, fish.y, fish.size, Math.PI, 0, false);
          ctx.fill();
          ctx.strokeStyle = '#fda4af';
          ctx.lineWidth = 1.5;
          for (let t = -2; t <= 2; t++) {
            ctx.beginPath();
            ctx.moveTo(fish.x + t * 4, fish.y);
            ctx.lineTo(fish.x + t * 4 + Math.sin(engine.frame * 0.1 + t) * 4, fish.y + fish.size * 1.5);
            ctx.stroke();
          }
        } else {
          ctx.fillStyle = fish.color;
          ctx.beginPath();
          ctx.ellipse(fish.x, fish.y, fish.size, fish.size * 0.5, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // --- 7. GAME PLAYING PHYSICS UPDATE ---
      if (gameState === 'playing') {
        engine.frame++;
        engine.propellerAngle += 0.5;

        // Continuous Distance Meters Counter!
        engine.distanceMeters += currentSpeed * 0.18;

        // SNAPPY & STABLE FLAPPY BIRD CONTROLS
        const isNewTap = isThrusting && !engine.wasThrusting;
        engine.wasThrusting = isThrusting;

        if (isNewTap) {
          // Instant Crisp Flap Pop UP!
          engine.subVy = engine.flapImpulse;
          soundEngine.playThrust();

          // Spawn subtle burst bubble trail (short life, fast fade)
          for (let b = 0; b < 2; b++) {
            engine.particles.push({
              x: engine.subX - 20,
              y: engine.subY + (Math.random() * 6 - 3),
              vx: -2 - Math.random() * 2,
              vy: (Math.random() - 0.5) * 1.5,
              size: 2.5 + Math.random() * 3,
              alpha: 0.7,
              color: '#38bdf8',
              life: 0,
              maxLife: 9, // Disappears in ~150ms!
              type: 'bubble',
            });
          }
        } else if (isThrusting) {
          // Smooth, capped upward float when holding touch (prevents skyrocketing/losing balance)
          engine.subVy = Math.max(engine.flapImpulse, engine.subVy - 0.08);
        }

        // Apply Gentle Ocean Gravity with Adaptive High-Speed Damping
        const speedDampingFactor = Math.max(0.78, 1 - (currentSpeed - 2.2) * 0.05);
        engine.subVy += engine.gravity * speedDampingFactor;
        // Cap terminal velocity for perfectly stable, predictable movement at any speed
        const maxFallSpeed = Math.min(5.2, 4.5 + currentSpeed * 0.15);
        engine.subVy = Math.max(-5.0, Math.min(maxFallSpeed, engine.subVy));
        engine.subY += engine.subVy;

        // Perfectly Balanced Submarine Pitch & Tilt Stabilization!
        // Smooth linear mapping (-18° to +22°) prevents twitching or losing angle balance
        const targetAngle = Math.max(-0.32, Math.min(0.38, engine.subVy * 0.075));
        engine.subAngle += (targetAngle - engine.subAngle) * 0.12;

        // Soft Ceiling & Seabed Boundaries
        const topBound = 22;
        const bottomBound = height - 42;
        if (engine.subY < topBound) {
          engine.subY = topBound;
          engine.subVy = Math.max(0, engine.subVy);
        }
        if (engine.subY > bottomBound) {
          // Crash on seabed!
          soundEngine.playCrash();
          onGameOver(engine.score, engine.coins, engine.maxCombo, Math.floor(engine.distanceMeters));
          return;
        }

        // Send continuous distance and score updates to HUD
        onScoreUpdate(
          engine.score,
          engine.combo,
          engine.coins,
          engine.shields > 0,
          engine.sonicCharge,
          Math.floor(engine.distanceMeters),
          engine.magnetTimer > 0
        );

        // --- SONIC WAVE EXPANSION ---
        if (engine.isSonicActive) {
          engine.sonicWaveRadius += 18;
          if (engine.sonicWaveRadius > width * 1.3) {
            engine.isSonicActive = false;
          }
        }

        // --- MAGNET TIMER ---
        if (engine.magnetTimer > 0) {
          engine.magnetTimer--;
        }

        // --- DYNAMIC OBSTACLE & CHALLENGE SCALING ---
        engine.lastSpawnX -= currentSpeed; // Update spawn tracker with game movement!
        // Generous vertical gap: Starts at 225px and gently settles at a spacious 175px minimum
        const minGap = Math.max(175, 225 - Math.floor(engine.score * 0.8) - Math.floor(engine.distanceMeters / 2500));
        
        // SPACIOUS SPEED-COMPENSATED SPAWN DISTANCE:
        // Maintains comfortable breathing room between consecutive pipes even at higher score & speed!
        const baseSpawnDist = Math.max(290, 350 - Math.floor(engine.score * 0.8));
        const speedCompensation = (currentSpeed - 2.2) * 32; // Expands distance generously as speed increases
        const spawnDistance = baseSpawnDist + speedCompensation;

        if (width - engine.lastSpawnX >= spawnDistance || engine.obstacles.length === 0) {
          engine.lastSpawnX = width;

          // CALCULATE GUARANTEED REACHABLE TOP HEIGHT FOR CONSECUTIVE PIPES:
          // Smooth, gradual height transitions between consecutive pipes
          const minTopH = 50;
          const maxTopH = height - minGap - 120;
          let desiredTopH = minTopH + Math.random() * (maxTopH - minTopH);

          if (engine.obstacles.length > 0) {
            const lastObs = engine.obstacles[engine.obstacles.length - 1];
            const lastGapCenter = lastObs.initialTopHeight + lastObs.gapSize / 2;
            
            // Calculate max physically possible vertical shift based on travel time between pipes
            const framesToNextPipe = spawnDistance / currentSpeed;
            // Cap max vertical delta at ~120px for comfortable, natural submarine maneuvers
            const maxVerticalShift = Math.min(120, framesToNextPipe * 2.2);

            const desiredGapCenter = desiredTopH + minGap / 2;
            const clampedGapCenter = Math.max(
              lastGapCenter - maxVerticalShift,
              Math.min(lastGapCenter + maxVerticalShift, desiredGapCenter)
            );

            desiredTopH = clampedGapCenter - minGap / 2;
            // Ensure within absolute canvas boundaries
            desiredTopH = Math.max(minTopH, Math.min(maxTopH, desiredTopH));
          }

          const topH = desiredTopH;

          let obstacleType: 'coral' | 'pipe' | 'green_pipe' | 'moving_pipe' | 'laser_gate' | 'minefield' | 'vortex' = 'green_pipe';

          if (gameMode === 'minefield') {
            obstacleType = 'minefield';
          } else {
            const rand = Math.random();
            // Dynamic Hazard Ramp-Up:
            // Score 0-3: Beginner friendly (classic pipes & coral)
            // Score 4-9: Intermediate (introduces moving hydro-pipes)
            // Score 10+: Advanced (fast moving pipes, laser gates, whirlpools, mine chains)
            if (engine.score < 4) {
              obstacleType = rand < 0.85 ? 'green_pipe' : 'coral';
            } else if (engine.score < 10) {
              if (rand < 0.55) obstacleType = 'green_pipe';
              else if (rand < 0.80) obstacleType = 'moving_pipe';
              else obstacleType = 'coral';
            } else {
              if (rand < 0.35) obstacleType = 'green_pipe';
              else if (rand < 0.62) obstacleType = 'moving_pipe';
              else if (rand < 0.78) obstacleType = 'laser_gate';
              else if (rand < 0.90) obstacleType = 'vortex';
              else obstacleType = 'coral';
            }
          }

          engine.obstacles.push({
            id: `obs_${engine.frame}`,
            x: width + 50,
            topHeight: topH,
            bottomHeight: height - topH - minGap,
            gapSize: minGap,
            width: 72,
            passed: false,
            type: obstacleType,
            hasMineChain: gameMode === 'minefield' || (engine.score > 5 && Math.random() > 0.65),
            initialTopHeight: topH,
            oscillationPhase: Math.random() * Math.PI * 2,
            oscillationSpeed: 0.03 + Math.min(0.035, engine.score * 0.002) + Math.random() * 0.02,
            oscillationAmplitude: 20 + Math.min(22, engine.score * 0.6) + Math.random() * 10,
          });

          // Spawn Collectibles (Pearls / Coins / Powerups) right inside gap!
          const gapCenterY = topH + minGap / 2;
          const randType = Math.random();

          // High chance to spawn Shiny Pink Pearl or Gold Coin, plus dynamic Shield & Sonic Orbs at high speed!
          let cType: 'coin' | 'pearl' | 'shield' | 'magnet' | 'sonic' = 'pearl';
          const isHighSpeed = engine.score > 8 || currentSpeed > 3.2;
          const shieldBonusThreshold = (selectedSub.stats.extraShields || 0) * 0.04;
          const shieldThreshold = Math.max(0.85, (isHighSpeed ? 0.90 : 0.95) - shieldBonusThreshold);
          
          // Shield can ONLY spawn if player does NOT currently have a shield active (max 1 shield rule)!
          if (engine.shields < 1 && randType > shieldThreshold) cType = 'shield';
          else if (randType > (isHighSpeed ? 0.85 : 0.91)) cType = 'magnet';  // Up to 5% chance for Magnet
          else if (randType > (isHighSpeed ? 0.81 : 0.88)) cType = 'sonic';   // Up to 4% chance for Sonic Blast item
          else if (randType > 0.42) cType = 'pearl';   // Pearl!
          else cType = 'coin';

          engine.collectibles.push({
            id: `col_${engine.frame}`,
            x: width + 50 + 36,
            y: gapCenterY + (Math.random() * 30 - 15),
            type: cType,
            radius: cType === 'pearl' ? 14 : cType === 'coin' ? 11 : 13,
            collected: false,
            pulsePhase: Math.random() * Math.PI * 2,
          });

          // Also spawn trailing coins/pearls behind the pipe gap!
          if (Math.random() > 0.4) {
            engine.collectibles.push({
              id: `col_trail_${engine.frame}`,
              x: width + 50 + 110,
              y: gapCenterY + (Math.random() * 40 - 20),
              type: Math.random() > 0.5 ? 'pearl' : 'coin',
              radius: 12,
              collected: false,
              pulsePhase: Math.random() * Math.PI * 2,
            });
          }
        }

        // Move Obstacles & Check Collisions
        engine.obstacles.forEach((obs) => {
          obs.x -= currentSpeed;

          // Moving Pipe Challenge: Freeze height movement when player is near or passing through!
          if (obs.type === 'moving_pipe' && obs.initialTopHeight !== undefined) {
            const isNearSub = Math.abs((obs.x + obs.width / 2) - engine.subX) < 140;
            if (!isNearSub) {
              const osc = Math.sin(engine.frame * (obs.oscillationSpeed || 0.03) + (obs.oscillationPhase || 0)) * (obs.oscillationAmplitude || 20);
              obs.topHeight = Math.max(50, Math.min(height - obs.gapSize - 50, obs.initialTopHeight + osc));
              obs.bottomHeight = height - obs.topHeight - obs.gapSize;
            }
          }

          // Sonic Wave destroys obstacles in path!
          if (engine.isSonicActive && Math.abs(obs.x - engine.subX) < engine.sonicWaveRadius) {
            obs.passed = true;
            obs.x = -200; // Destroyed
          }

          // Precision Forgiving Collision Hitbox
          if (!obs.passed) {
            const pipeLeft = obs.x + 6;
            const pipeRight = obs.x + obs.width - 6;
            const subCoreLeft = engine.subX - 10;
            const subCoreRight = engine.subX + 10;

            if (subCoreRight > pipeLeft && subCoreLeft < pipeRight) {
              let collided = false;

              // Check top and bottom pipe boundaries (giving 8px safety margin)
              const subTop = engine.subY - 8;
              const subBottom = engine.subY + 8;

              if (subTop < obs.topHeight || subBottom > height - obs.bottomHeight) {
                collided = true;
              }

              if (collided) {
                if (engine.shields > 0) {
                  engine.shields--;
                  obs.passed = true;
                  obs.x = -200;
                  soundEngine.playShieldHit();
                  for (let i = 0; i < 15; i++) {
                    engine.particles.push({
                      x: engine.subX,
                      y: engine.subY,
                      vx: (Math.random() - 0.5) * 6,
                      vy: (Math.random() - 0.5) * 6,
                      size: 4 + Math.random() * 4,
                      alpha: 1,
                      color: '#38bdf8',
                      life: 0,
                      maxLife: 20,
                      type: 'spark',
                    });
                  }
                } else {
                  soundEngine.playCrash();
                  onGameOver(engine.score, engine.coins, engine.maxCombo, Math.floor(engine.distanceMeters));
                  return;
                }
              }
            }
          }

          // Passed obstacle point score!
          if (!obs.passed && obs.x + obs.width < engine.subX) {
            obs.passed = true;
            engine.score++;
            soundEngine.playSonarPing();

            engine.combo++;
            if (engine.combo > engine.maxCombo) {
              engine.maxCombo = engine.combo;
            }

            if (engine.sonicCharge < 100) {
              engine.sonicCharge = Math.min(100, engine.sonicCharge + 4);
            }
          }
        });

        engine.obstacles = engine.obstacles.filter((obs) => obs.x > -100);

        // Collectibles Update
        engine.collectibles.forEach((item) => {
          item.x -= currentSpeed;
          item.pulsePhase += 0.08;

          if (engine.magnetTimer > 0) {
            const dx = engine.subX - item.x;
            const dy = engine.subY - item.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 220) {
              item.x += (dx / dist) * 8;
              item.y += (dy / dist) * 8;
            }
          }

          if (!item.collected) {
            const dx = engine.subX - item.x;
            const dy = engine.subY - item.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Strict physical touch collection radius (only collects when sub snout/hull touches item)
            if (dist < item.radius + 7) {
              item.collected = true;

              if (item.type === 'coin') {
                const addCoins = Math.round(1 * selectedSub.stats.coinMultiplier);
                engine.coins += addCoins;
                soundEngine.playCoin();
              } else if (item.type === 'pearl') {
                const addCoins = Math.round(5 * selectedSub.stats.coinMultiplier);
                engine.coins += addCoins;
                soundEngine.playCoin();
              } else if (item.type === 'shield') {
                engine.shields = 1; // Strictly cap at max 1 active shield (no stacking)
                soundEngine.playPowerup();
              } else if (item.type === 'magnet') {
                engine.magnetTimer = 360;
                soundEngine.playPowerup();
              } else if (item.type === 'sonic') {
                engine.sonicCharge = Math.min(100, engine.sonicCharge + 25);
                soundEngine.playPowerup();
              }

              for (let p = 0; p < 8; p++) {
                engine.particles.push({
                  x: item.x,
                  y: item.y,
                  vx: (Math.random() - 0.5) * 4,
                  vy: (Math.random() - 0.5) * 4,
                  size: 3 + Math.random() * 3,
                  alpha: 1,
                  color: item.type === 'coin' ? '#eab308' : item.type === 'pearl' ? '#f472b6' : '#38bdf8',
                  life: 0,
                  maxLife: 20,
                  type: 'spark',
                });
              }
            }
          }
        });

        engine.collectibles = engine.collectibles.filter((item) => !item.collected && item.x > -50);
      }

      // --- 8. RENDER OBSTACLES (HIGH-QUALITY FLAPPY GREEN PIPES) ---
      engine.obstacles.forEach((obs) => {
        const gapCenterY = obs.topHeight + obs.gapSize / 2;

        if (obs.type === 'green_pipe' || obs.type === 'pipe') {
          // --- CLASSIC FLAPPY BIRD GREEN PIPES ---
          const pipeGrad = ctx.createLinearGradient(obs.x, 0, obs.x + obs.width, 0);
          pipeGrad.addColorStop(0, '#15803d');
          pipeGrad.addColorStop(0.2, '#22c55e');
          pipeGrad.addColorStop(0.5, '#4ade80');
          pipeGrad.addColorStop(0.8, '#16a34a');
          pipeGrad.addColorStop(1, '#052e16');

          // Dark outline
          ctx.strokeStyle = '#052e16';
          ctx.lineWidth = 3;

          // Top Pipe Body
          ctx.fillStyle = pipeGrad;
          ctx.fillRect(obs.x, 0, obs.width, obs.topHeight - 26);
          ctx.strokeRect(obs.x, 0, obs.width, obs.topHeight - 26);

          // Top Pipe Lip Cap (Thicker 3D Rim)
          ctx.beginPath();
          ctx.roundRect(obs.x - 7, obs.topHeight - 28, obs.width + 14, 28, 4);
          ctx.fill();
          ctx.stroke();

          // Bottom Pipe Body
          ctx.fillRect(obs.x, height - obs.bottomHeight + 26, obs.width, obs.bottomHeight - 26);
          ctx.strokeRect(obs.x, height - obs.bottomHeight + 26, obs.width, obs.bottomHeight - 26);

          // Bottom Pipe Lip Cap
          ctx.beginPath();
          ctx.roundRect(obs.x - 7, height - obs.bottomHeight, obs.width + 14, 28, 4);
          ctx.fill();
          ctx.stroke();

          // Vertical Shine Strip Reflection
          ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
          ctx.fillRect(obs.x + 10, 0, 7, obs.topHeight - 28);
          ctx.fillRect(obs.x + 10, height - obs.bottomHeight + 28, 7, obs.bottomHeight - 28);

        } else if (obs.type === 'moving_pipe') {
          // --- MOVING HYDRO-PILLAR CHALLENGE ---
          const cyanGrad = ctx.createLinearGradient(obs.x, 0, obs.x + obs.width, 0);
          cyanGrad.addColorStop(0, '#155e75');
          cyanGrad.addColorStop(0.3, '#06b6d4');
          cyanGrad.addColorStop(0.7, '#22d3ee');
          cyanGrad.addColorStop(1, '#083344');

          ctx.fillStyle = cyanGrad;
          ctx.strokeStyle = '#083344';
          ctx.lineWidth = 3;

          ctx.fillRect(obs.x, 0, obs.width, obs.topHeight - 28);
          ctx.strokeRect(obs.x, 0, obs.width, obs.topHeight - 28);

          ctx.beginPath();
          ctx.roundRect(obs.x - 7, obs.topHeight - 28, obs.width + 14, 28, 6);
          ctx.fill();
          ctx.stroke();

          ctx.fillRect(obs.x, height - obs.bottomHeight + 28, obs.width, obs.bottomHeight - 28);
          ctx.strokeRect(obs.x, height - obs.bottomHeight + 28, obs.width, obs.bottomHeight - 28);

          ctx.beginPath();
          ctx.roundRect(obs.x - 7, height - obs.bottomHeight, obs.width + 14, 28, 6);
          ctx.fill();
          ctx.stroke();

          // Yellow Hazard Stripes
          ctx.fillStyle = '#facc15';
          for (let s = 0; s < 3; s++) {
            ctx.fillRect(obs.x + s * 22, obs.topHeight - 24, 10, 20);
            ctx.fillRect(obs.x + s * 22, height - obs.bottomHeight + 4, 10, 20);
          }

        } else if (obs.type === 'laser_gate') {
          // --- SCI-FI LASER GATE ---
          ctx.fillStyle = '#334155';
          ctx.beginPath();
          ctx.roundRect(obs.x, 0, obs.width, obs.topHeight, [0, 0, 12, 12]);
          ctx.roundRect(obs.x, height - obs.bottomHeight, obs.width, obs.bottomHeight, [12, 12, 0, 0]);
          ctx.fill();
          ctx.strokeStyle = '#0284c7';
          ctx.lineWidth = 3;
          ctx.stroke();

          const laserCycle = engine.frame % 90;
          const isLaserOn = laserCycle < 60;

          if (isLaserOn) {
            ctx.strokeStyle = 'rgba(34, 211, 238, 0.5)';
            ctx.lineWidth = 20;
            ctx.beginPath();
            ctx.moveTo(obs.x + obs.width / 2, obs.topHeight);
            ctx.lineTo(obs.x + obs.width / 2, height - obs.bottomHeight);
            ctx.stroke();

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(obs.x + obs.width / 2, obs.topHeight);
            ctx.lineTo(obs.x + obs.width / 2, height - obs.bottomHeight);
            ctx.stroke();
          }

        } else if (obs.type === 'vortex') {
          // --- WHIRLPOOL VORTEX ---
          const coralGrad = ctx.createLinearGradient(obs.x, 0, obs.x + obs.width, 0);
          coralGrad.addColorStop(0, '#881337');
          coralGrad.addColorStop(0.5, '#f43f5e');
          coralGrad.addColorStop(1, '#4c0519');

          ctx.fillStyle = coralGrad;
          ctx.beginPath();
          ctx.roundRect(obs.x, 0, obs.width, obs.topHeight, [0, 0, 14, 14]);
          ctx.roundRect(obs.x, height - obs.bottomHeight, obs.width, obs.bottomHeight, [14, 14, 0, 0]);
          ctx.fill();

          ctx.save();
          ctx.translate(obs.x + obs.width / 2, gapCenterY);
          ctx.rotate(engine.frame * 0.08);

          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 3;
          ctx.beginPath();
          for (let a = 0; a < Math.PI * 4; a += 0.2) {
            const r = a * 4;
            const x = Math.cos(a) * r;
            const y = Math.sin(a) * r;
            if (a === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
          ctx.restore();

        } else {
          // --- CORAL REEF ---
          const coralGrad = ctx.createLinearGradient(obs.x, 0, obs.x + obs.width, 0);
          coralGrad.addColorStop(0, '#065f46');
          coralGrad.addColorStop(0.5, '#10b981');
          coralGrad.addColorStop(1, '#047857');

          ctx.fillStyle = coralGrad;
          ctx.beginPath();
          ctx.roundRect(obs.x, 0, obs.width, obs.topHeight, [0, 0, 12, 12]);
          ctx.roundRect(obs.x, height - obs.bottomHeight, obs.width, obs.bottomHeight, [12, 12, 0, 0]);
          ctx.fill();
        }

        // Suspended Mine Chain
        if (obs.hasMineChain) {
          const mineY = obs.topHeight + obs.gapSize / 2 + Math.sin(engine.frame * 0.05) * 15;
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(obs.x + obs.width / 2, obs.topHeight);
          ctx.lineTo(obs.x + obs.width / 2, mineY);
          ctx.stroke();

          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          ctx.arc(obs.x + obs.width / 2, mineY, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = engine.frame % 30 < 15 ? '#ef4444' : '#7f1d1d';
          ctx.beginPath();
          ctx.arc(obs.x + obs.width / 2, mineY, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // --- 9. RENDER COLLECTIBLES ---
      engine.collectibles.forEach((item) => {
        const pulse = Math.sin(item.pulsePhase) * 2;
        ctx.save();
        ctx.translate(item.x, item.y);

        if (item.type === 'coin') {
          ctx.fillStyle = '#eab308';
          ctx.beginPath();
          ctx.arc(0, 0, item.radius + pulse, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.fillStyle = '#854d0e';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('$', 0, 1);
        } else if (item.type === 'pearl') {
          // --- SHINY IRIDESCENT OCEAN PEARL ---
          // Outer Glow
          ctx.fillStyle = 'rgba(244, 114, 182, 0.35)';
          ctx.beginPath();
          ctx.arc(0, 0, item.radius + 6 + pulse, 0, Math.PI * 2);
          ctx.fill();

          // Pearl Body Radial Gradient
          const pearlGrad = ctx.createRadialGradient(-3, -3, 1, 0, 0, item.radius + pulse);
          pearlGrad.addColorStop(0, '#ffffff');
          pearlGrad.addColorStop(0.3, '#fbcfe8');
          pearlGrad.addColorStop(0.7, '#f472b6');
          pearlGrad.addColorStop(1, '#db2777');

          ctx.fillStyle = pearlGrad;
          ctx.beginPath();
          ctx.arc(0, 0, item.radius + pulse, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Specular White Highlight Spot
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(-4, -4, 3, 0, Math.PI * 2);
          ctx.fill();
        } else if (item.type === 'shield') {
          ctx.fillStyle = '#0284c7';
          ctx.beginPath();
          ctx.arc(0, 0, item.radius + pulse, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2.5;
          ctx.stroke();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🛡️', 0, 1);
        } else if (item.type === 'magnet') {
          ctx.fillStyle = '#9333ea';
          ctx.beginPath();
          ctx.arc(0, 0, item.radius + pulse, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#c084fc';
          ctx.lineWidth = 2.5;
          ctx.stroke();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🧲', 0, 1);
        } else if (item.type === 'sonic') {
          ctx.fillStyle = '#06b6d4';
          ctx.beginPath();
          ctx.arc(0, 0, item.radius + pulse, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#67e8f9';
          ctx.lineWidth = 2.5;
          ctx.stroke();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('⚡', 0, 1);
        }

        ctx.restore();
      });

      // --- 10. RENDER DETAILED SUBMARINE PLAYER ---
      ctx.save();
      ctx.translate(engine.subX, engine.subY);
      ctx.rotate(engine.subAngle);

      // Headlight Beam
      const lightGrad = ctx.createRadialGradient(28, 0, 4, 240, 0, 160);
      lightGrad.addColorStop(0, 'rgba(254, 240, 138, 0.60)');
      lightGrad.addColorStop(0.5, 'rgba(254, 240, 138, 0.22)');
      lightGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');

      ctx.fillStyle = lightGrad;
      ctx.beginPath();
      ctx.moveTo(28, -5);
      ctx.lineTo(250, -60);
      ctx.lineTo(250, 60);
      ctx.lineTo(28, 5);
      ctx.closePath();
      ctx.fill();

      // Shield Bubble Aura
      if (engine.shields > 0) {
        ctx.strokeStyle = engine.frame % 20 < 10 ? '#38bdf8' : '#7dd3fc';
        ctx.lineWidth = 3.5;
        ctx.shadowColor = '#0284c7';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(2, 0, 36, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Magnet Magnetic Field Aura
      if (engine.magnetTimer > 0) {
        ctx.strokeStyle = engine.frame % 16 < 8 ? '#c084fc' : '#a855f7';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#9333ea';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(2, 0, 44 + Math.sin(engine.frame * 0.2) * 3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // 1. Rear Propeller Shaft & Spinning Blades
      ctx.save();
      ctx.translate(-28, 0);
      // Propeller Hub
      ctx.fillStyle = '#64748b';
      ctx.fillRect(-3, -4, 6, 8);
      // Spinning Brass Blades
      ctx.rotate(engine.propellerAngle);
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.ellipse(0, 0, 3, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // 2. Tail Stabilizer Fins (Rudder)
      ctx.fillStyle = selectedSub.secondaryColor;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      // Top Fin
      ctx.beginPath();
      ctx.moveTo(-24, -10);
      ctx.lineTo(-32, -22);
      ctx.lineTo(-20, -14);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Bottom Fin
      ctx.beginPath();
      ctx.moveTo(-24, 10);
      ctx.lineTo(-32, 22);
      ctx.lineTo(-20, 14);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // 3. Conning Tower / Sail / Bridge (Mounted on top)
      const towerGrad = ctx.createLinearGradient(-5, -28, 12, -14);
      towerGrad.addColorStop(0, selectedSub.color);
      towerGrad.addColorStop(1, selectedSub.secondaryColor);

      ctx.fillStyle = towerGrad;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-6, -14);
      ctx.lineTo(-2, -26);
      ctx.lineTo(12, -26);
      ctx.lineTo(16, -14);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Tower Top Ledge Trim
      ctx.fillStyle = selectedSub.secondaryColor;
      ctx.fillRect(-3, -28, 16, 3);

      // Periscope Masts & Radar
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(4, -28);
      ctx.lineTo(4, -36);
      ctx.lineTo(9, -36); // Forward facing scope lens
      ctx.stroke();

      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, -28);
      ctx.lineTo(0, -34); // Radar antenna
      ctx.stroke();

      // Red Blinking Navigation LED Beacon
      ctx.fillStyle = engine.frame % 30 < 15 ? '#ef4444' : '#7f1d1d';
      ctx.beginPath();
      ctx.arc(0, -35, 2, 0, Math.PI * 2);
      ctx.fill();

      // 4. Hydrodynamic Main Submarine Hull Body
      const hullGrad = ctx.createLinearGradient(-28, -18, 30, 18);
      hullGrad.addColorStop(0, selectedSub.color);
      hullGrad.addColorStop(0.6, selectedSub.color);
      hullGrad.addColorStop(1, selectedSub.secondaryColor);

      ctx.fillStyle = hullGrad;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(-28, 0);
      ctx.bezierCurveTo(-28, -18, -10, -18, 15, -18);
      ctx.bezierCurveTo(28, -18, 32, -10, 32, 0);
      ctx.bezierCurveTo(32, 10, 28, 18, 15, 18);
      ctx.bezierCurveTo(-10, 18, -28, 18, -28, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Top Metallic Sheen Reflection Line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-20, -12);
      ctx.bezierCurveTo(-5, -15, 10, -15, 24, -10);
      ctx.stroke();

      // Center Horizontal Seam Line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-24, 0);
      ctx.lineTo(26, 0);
      ctx.stroke();

      // 5. Front Bow Diving Plane (Wing Fin)
      ctx.fillStyle = selectedSub.secondaryColor;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(14, 2);
      ctx.lineTo(24, 4);
      ctx.lineTo(22, 7);
      ctx.lineTo(12, 5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // 6. Three Glass Illuminated Porthole Windows
      const portholePositions = [-12, 2, 16];
      portholePositions.forEach((px) => {
        // Outer Chrome Ring
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.arc(px, -2, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Inner Glowing Glass
        const glassGrad = ctx.createRadialGradient(px - 1, -3, 0.5, px, -2, 4.5);
        glassGrad.addColorStop(0, '#ffffff');
        glassGrad.addColorStop(0.4, selectedSub.accentColor);
        glassGrad.addColorStop(1, '#0284c7');

        ctx.fillStyle = glassGrad;
        ctx.beginPath();
        ctx.arc(px, -2, 4, 0, Math.PI * 2);
        ctx.fill();

        // Glass Specular Highlight Spot
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(px - 1.5, -3.5, 1.2, 0, Math.PI * 2);
        ctx.fill();
      });

      // 7. Bow Nose Headlight Lens
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(28, 0, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();

      // --- 11. SONIC BLAST RIPPLE EFFECT ---
      if (engine.isSonicActive) {
        ctx.save();
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 6;
        ctx.globalAlpha = Math.max(0, 1 - engine.sonicWaveRadius / (width * 1.3));
        ctx.beginPath();
        ctx.arc(engine.subX, engine.subY, engine.sonicWaveRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // --- 12. PARALLAX LAYER 5: TEXTURED GOLDEN SEABED & SLEEK SEAWEEDS ---
      const sandHeight = 28;
      const sandTop = height - sandHeight;

      // Golden sand seabed gradient
      const sandGrad = ctx.createLinearGradient(0, sandTop, 0, height);
      sandGrad.addColorStop(0, '#eab308');
      sandGrad.addColorStop(0.2, '#ca8a04');
      sandGrad.addColorStop(0.6, '#a16207');
      sandGrad.addColorStop(1, '#451a03');
      ctx.fillStyle = sandGrad;
      ctx.fillRect(0, sandTop, width, sandHeight);

      // Glowing golden sand crest line
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(0, sandTop, width, 2);

      // Organic seabed coral pebbles & shells
      ctx.fillStyle = '#f59e0b';
      for (let p = 0; p < width; p += 35) {
        ctx.beginPath();
        ctx.arc(p + Math.sin(p) * 12, sandTop + 8, 2.5 + (p % 3), 0, Math.PI * 2);
        ctx.fill();
      }

      // Sleek, Compact Organic Seaweed Grass
      engine.seaweeds.forEach((weed) => {
        if (gameState === 'playing') weed.x -= currentSpeed * 0.9;
        if (weed.x < -30) weed.x = width + 30;

        const sway = Math.sin(engine.frame * weed.swaySpeed + weed.swayOffset) * 12;
        ctx.strokeStyle = weed.color;
        ctx.lineWidth = weed.width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(weed.x, sandTop + 2);
        ctx.quadraticCurveTo(
          weed.x + sway * 0.5,
          sandTop - weed.height * 0.5,
          weed.x + sway,
          sandTop - weed.height
        );
        ctx.stroke();
      });

      // --- 13. PARTICLES UPDATE & DRAW ---
      engine.particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        p.alpha = 1 - p.life / p.maxLife;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      engine.particles = engine.particles.filter((p) => p.life < p.maxLife);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [gameState, gameMode, selectedSub, isThrusting, onGameOver, onScoreUpdate, resetEngine]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950">
      <canvas ref={canvasRef} className="block w-full h-full touch-none select-none" />
    </div>
  );
};
