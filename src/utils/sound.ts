// Web Audio API Synth Engine for DiveFly
class SoundEngine {
  private ctx: AudioContext | null = null;
  private bgmMasterGain: GainNode | null = null;
  private bgmFilter: BiquadFilterNode | null = null;
  private nextNoteTime = 0;
  private currentStep = 0;
  private scheduleTimer: number | null = null;
  private isBgmPlaying = false;

  private soundEnabled = true;
  private musicEnabled = true;

  constructor() {
    // Lazy init audio context on first user interaction
  }

  public initCtx(): AudioContext | null {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch {}
    return this.ctx;
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (!enabled) {
      this.stopAmbientBGM();
    }
  }

  // Quick crisp screen tap sound
  public playTap() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.06);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {}
  }

  // Button click
  public playClick() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {}
  }

  // Submarine Thrust (Engine bubble hum + tap pop) - soft, pleasant, non-intrusive
  public playThrust() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.08);

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {}
  }

  // Sonar Ping for Obstacle Passed
  public playSonarPing() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1046.5, now); // C6 note
    osc.frequency.exponentialRampToValueAtTime(1318.5, now + 0.08); // E6

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  // Coin / Pearl Pickup (Crisp sweet chime)
  public playCoin() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.5, now + 0.05); // E6

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  }

  // Powerup Pickup
  public playPowerup() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(1100, now + 0.22);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  // Sonic Wave Blast Triggered
  public playSonicWave() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(500, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.35);

    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  // Shield hit deflection
  public playShieldHit() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.18);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  }

  // Soft Bubbly Splash (Fun & friendly rather than harsh crash)
  public playCrash() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Layer 1: Water splash "Bloop"
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.15);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.35);

    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);

    // Layer 2: Soft bubble pop flutter
    try {
      const popOsc = this.ctx.createOscillator();
      const popGain = this.ctx.createGain();
      popOsc.type = 'triangle';
      popOsc.frequency.setValueAtTime(600, now + 0.05);
      popOsc.frequency.exponentialRampToValueAtTime(200, now + 0.2);
      popGain.gain.setValueAtTime(0.08, now + 0.05);
      popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      popOsc.connect(popGain);
      popGain.connect(this.ctx.destination);
      popOsc.start(now + 0.05);
      popOsc.stop(now + 0.2);
    } catch {}
  }

  // Kid Celebration / Milestone Fanfare (Super rewarding dopamine chime!)
  public playCelebration() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (Bright Major Arpeggio)
    
    notes.forEach((freq, index) => {
      try {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const noteTime = now + index * 0.07;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.12, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.25);
      } catch {}
    });
  }

  // Bubble Pop Sound
  public playBubblePop() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(750, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.04);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {}
  }

  // Start background joyful, upbeat underwater arcade music loop
  public startAmbientBGM() {
    this.stopAmbientBGM(); // Clean up any existing instance first
    if (!this.musicEnabled) return;
    const audioCtx = this.initCtx();
    if (!audioCtx) return;

    if (audioCtx.state === 'suspended') {
      audioCtx.resume().then(() => {
        if (this.musicEnabled && !this.isBgmPlaying) {
          this.startAmbientBGM();
        }
      }).catch(() => {});
    }

    try {
      this.isBgmPlaying = true;
      const now = audioCtx.currentTime;

      // Master BGM Gain & Warm Lowpass Filter (keeps sound smooth, warm & pleasant)
      this.bgmFilter = audioCtx.createBiquadFilter();
      this.bgmFilter.type = 'lowpass';
      this.bgmFilter.frequency.setValueAtTime(3600, now);

      this.bgmMasterGain = audioCtx.createGain();
      this.bgmMasterGain.gain.setValueAtTime(0.001, now);
      // Gentle fade in to clear, full volume
      this.bgmMasterGain.gain.exponentialRampToValueAtTime(0.28, now + 0.3);

      this.bgmFilter.connect(this.bgmMasterGain);
      this.bgmMasterGain.connect(audioCtx.destination);

      // Web Audio Lookahead Step Scheduler
      this.nextNoteTime = audioCtx.currentTime + 0.02;
      this.currentStep = 0;

      // 32-step cheerful aquatic melody (Tempo: 120 BPM, step = 0.125s)
      const stepDuration = 0.125;

      // Joyful, catchy tropical/oceanic lead melody (C Major -> G Major -> A Minor -> F Major)
      const melodyNotes = [
        // Measure 1: C Major (Bouncy playful opening)
        523.25, 0, 659.25, 783.99,  1046.5, 0, 783.99, 659.25,
        // Measure 2: G Major (Playful rhythmic bounce)
        587.33, 0, 783.99, 880.00,  987.77, 880.00, 783.99, 0,
        // Measure 3: A Minor (Sweet oceanic flow)
        440.00, 0, 523.25, 659.25,  880.00, 0, 783.99, 659.25,
        // Measure 4: F Major (Uplifting resolution)
        349.23, 523.25, 659.25, 783.99,  880.00, 783.99, 659.25, 523.25
      ];

      // Warm acoustic-style rhythmic bassline (soft, bouncy, punchy)
      const bassNotes = [
        // C
        130.81, 0, 0, 0, 196.00, 0, 130.81, 0,
        // G
        98.00, 0, 0, 0, 146.83, 0, 98.00, 0,
        // A
        110.00, 0, 0, 0, 164.81, 0, 110.00, 0,
        // F
        87.31, 0, 0, 0, 130.81, 0, 174.61, 0
      ];

      // Sparkling high ocean bubble chimes
      const sparkleNotes = [
        1046.5, 0, 1318.5, 0, 1567.98, 0, 1318.5, 0,
        1174.66, 0, 1567.98, 0, 1760.00, 0, 1567.98, 0,
        880.00, 0, 1046.5, 0, 1318.5, 0, 1046.5, 0,
        698.46, 0, 1046.5, 0, 1318.5, 0, 1567.98, 0
      ];

      const scheduleStep = () => {
        if (!this.isBgmPlaying || !this.ctx || !this.musicEnabled || !this.bgmFilter) return;

        const scheduleAheadTime = 0.25;
        while (this.nextNoteTime < this.ctx.currentTime + scheduleAheadTime) {
          const step = this.currentStep % 32;
          const t = this.nextNoteTime;

          // 1. Play Lead Marimba / Aquatic Pluck (clear, melodious)
          const melodyFreq = melodyNotes[step];
          if (melodyFreq > 0) {
            const osc = this.ctx.createOscillator();
            const noteGain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(melodyFreq, t);
            osc.frequency.exponentialRampToValueAtTime(melodyFreq * 1.01, t + 0.02);
            osc.frequency.exponentialRampToValueAtTime(melodyFreq, t + 0.08);

            noteGain.gain.setValueAtTime(0.18, t);
            noteGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);

            osc.connect(noteGain);
            noteGain.connect(this.bgmFilter);

            osc.start(t);
            osc.stop(t + 0.2);
          }

          // 2. Play Bouncy Bass Note (warm punchy rhythm)
          const bassFreq = bassNotes[step];
          if (bassFreq > 0) {
            const bassOsc = this.ctx.createOscillator();
            const bassGain = this.ctx.createGain();

            bassOsc.type = 'triangle';
            bassOsc.frequency.setValueAtTime(bassFreq, t);

            bassGain.gain.setValueAtTime(0.16, t);
            bassGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

            bassOsc.connect(bassGain);
            bassGain.connect(this.bgmFilter);

            bassOsc.start(t);
            bassOsc.stop(t + 0.22);
          }

          // 3. Play Light Ocean Sparkle (every 2nd beat offbeat)
          const sparkleFreq = sparkleNotes[step];
          if (sparkleFreq > 0 && step % 4 === 2) {
            const sparkOsc = this.ctx.createOscillator();
            const sparkGain = this.ctx.createGain();

            sparkOsc.type = 'sine';
            sparkOsc.frequency.setValueAtTime(sparkleFreq, t);

            sparkGain.gain.setValueAtTime(0.08, t);
            sparkGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);

            sparkOsc.connect(sparkGain);
            sparkGain.connect(this.bgmFilter);

            sparkOsc.start(t);
            sparkOsc.stop(t + 0.28);
          }

          // 4. Soft rhythmic bubble shaker (every upbeat)
          if (step % 2 === 1) {
            const clickOsc = this.ctx.createOscillator();
            const clickGain = this.ctx.createGain();

            clickOsc.type = 'sine';
            clickOsc.frequency.setValueAtTime(1800, t);
            clickOsc.frequency.exponentialRampToValueAtTime(3200, t + 0.02);

            clickGain.gain.setValueAtTime(0.03, t);
            clickGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);

            clickOsc.connect(clickGain);
            clickGain.connect(this.bgmFilter);

            clickOsc.start(t);
            clickOsc.stop(t + 0.035);
          }

          this.nextNoteTime += stepDuration;
          this.currentStep++;
        }
      };

      // Run scheduler smoothly
      this.scheduleTimer = window.setInterval(scheduleStep, 40);

    } catch {
      this.isBgmPlaying = false;
    }
  }

  public stopAmbientBGM() {
    this.isBgmPlaying = false;

    if (this.scheduleTimer !== null) {
      clearInterval(this.scheduleTimer);
      this.scheduleTimer = null;
    }

    if (this.bgmMasterGain && this.ctx) {
      try {
        const gainNode = this.bgmMasterGain;
        const filterNode = this.bgmFilter;
        const now = this.ctx.currentTime;
        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.setValueAtTime(gainNode.gain.value, now);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
        setTimeout(() => {
          try {
            gainNode.disconnect();
            filterNode?.disconnect();
          } catch {}
        }, 90);
      } catch {}
      this.bgmMasterGain = null;
      this.bgmFilter = null;
    } else {
      this.bgmMasterGain = null;
      this.bgmFilter = null;
    }
  }

  // Ensure AudioContext is active upon any tap/key/click
  public resumeAudio() {
    this.initCtx();
  }
}

export const soundEngine = new SoundEngine();
