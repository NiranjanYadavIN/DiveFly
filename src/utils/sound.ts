// Web Audio API Synth Engine for DiveFly
class SoundEngine {
  private ctx: AudioContext | null = null;
  private bgmOsc1: OscillatorNode | null = null;
  private bgmOsc2: OscillatorNode | null = null;
  private bgmOsc3: OscillatorNode | null = null;
  private bgmLfo: OscillatorNode | null = null;
  private bgmGain: GainNode | null = null;
  private bgmInterval: number | null = null;
  private isBgmPlaying = false;

  private soundEnabled = true;
  private musicEnabled = true;

  constructor() {
    // Lazy init audio context on first user interaction
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (!enabled && this.isBgmPlaying) {
      this.stopAmbientBGM();
    }
  }

  // Button click
  public playClick() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // Submarine Thrust (Engine bubble hum)
  public playThrust() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    // Low bubble pitch with frequency modulation
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
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

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  // Coin / Pearl Pickup
  public playCoin() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.5, now + 0.06); // E6

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  // Powerup Pickup
  public playPowerup() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.25);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  // Sonic Wave Blast Triggered
  public playSonicWave() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.4);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  // Shield hit deflection
  public playShieldHit() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(500, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.2);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  // Crash / Game Over
  public playCrash() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.5);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  // Start background underwater ambient music loop
  public startAmbientBGM() {
    if (!this.musicEnabled || this.isBgmPlaying) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      this.isBgmPlaying = true;
      const now = this.ctx.currentTime;

      // Lowpass Filter for authentic underwater damping
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);

      // Main Chord Nodes (A2 = 110Hz, E3 = 164.81Hz, C#4 = 277.18Hz) - Audible on all speakers
      this.bgmOsc1 = this.ctx.createOscillator();
      this.bgmOsc1.type = 'triangle';
      this.bgmOsc1.frequency.setValueAtTime(110, now);

      this.bgmOsc2 = this.ctx.createOscillator();
      this.bgmOsc2.type = 'sine';
      this.bgmOsc2.frequency.setValueAtTime(164.81, now);

      this.bgmOsc3 = this.ctx.createOscillator();
      this.bgmOsc3.type = 'sine';
      this.bgmOsc3.frequency.setValueAtTime(277.18, now);

      // LFO for slow 0.25Hz ocean wave swell
      this.bgmLfo = this.ctx.createOscillator();
      this.bgmLfo.type = 'sine';
      this.bgmLfo.frequency.setValueAtTime(0.25, now);

      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(0.04, now);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.08, now);

      // Connect LFO to gain for organic breathing effect
      this.bgmLfo.connect(lfoGain);
      lfoGain.connect(this.bgmGain.gain);

      this.bgmOsc1.connect(filter);
      this.bgmOsc2.connect(filter);
      this.bgmOsc3.connect(filter);
      filter.connect(this.bgmGain);
      this.bgmGain.connect(this.ctx.destination);

      this.bgmOsc1.start(now);
      this.bgmOsc2.start(now);
      this.bgmOsc3.start(now);
      this.bgmLfo.start(now);

      // Periodic underwater pentatonic melody notes
      const notes = [440, 554.37, 659.25, 880, 659.25, 554.37];
      let noteIdx = 0;

      this.bgmInterval = window.setInterval(() => {
        if (!this.isBgmPlaying || !this.ctx || !this.musicEnabled) return;
        try {
          const t = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const noteGain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(notes[noteIdx % notes.length], t);
          noteIdx++;

          noteGain.gain.setValueAtTime(0.035, t);
          noteGain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

          osc.connect(noteGain);
          noteGain.connect(filter);

          osc.start(t);
          osc.stop(t + 1.2);
        } catch {}
      }, 2200);

    } catch {
      this.isBgmPlaying = false;
    }
  }

  public stopAmbientBGM() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
    if (this.bgmOsc1) {
      try { this.bgmOsc1.stop(); } catch {}
      this.bgmOsc1 = null;
    }
    if (this.bgmOsc2) {
      try { this.bgmOsc2.stop(); } catch {}
      this.bgmOsc2 = null;
    }
    if (this.bgmOsc3) {
      try { this.bgmOsc3.stop(); } catch {}
      this.bgmOsc3 = null;
    }
    if (this.bgmLfo) {
      try { this.bgmLfo.stop(); } catch {}
      this.bgmLfo = null;
    }
    this.isBgmPlaying = false;
  }
}

export const soundEngine = new SoundEngine();
