class SoundModule {
  constructor(autoPlay = false, frequency = 440.0, gain = 1.0, waveType = "sine") {
    this.isPlaying = false;
    this.frequency = frequency;
    this.gain = gain;
    this.waveType = waveType;
    this.load();
    if (autoPlay) {
      this.play();
    } else {
      this.stop();
    }
  }

  load() {
    this.context = new AudioContext();
    this.oscillatorModule = this.context.createOscillator();
    this.gainModule = this.context.createGain();
    this.oscillatorModule.connect(this.gainModule);
    this.gainModule.connect(this.context.destination);

    this.oscillatorModule.type = this.waveType;
    this.oscillatorModule.frequency.value = this.frequency;
    this.gainModule.gain.value = this.gain;
    this.oscillatorModule.start();
  }

  play() {
    this.gainModule.gain.value = this.gain;
    this.isPlaying = true;
  }

  stop() {
    this.gainModule.gain.value = 0.000001;
    this.isPlaying = false;
  }

  setFrequency(frequency) {
    this.frequency = frequency;
    this.oscillatorModule.frequency.value = this.frequency;
  }

  setGain(gain) {
    this.gain = gain;
    this.gainModule.gain.value = this.gain;
  }

  setWaveType(type) {
    this.waveType = type;
    this.oscillatorModule.type = this.waveType;
  }

  setNote(note) {
    let f0 = 261.6; // C4
    let a = 1.05946309435;
    let octaveDiff = parseInt(charAt(1)) - 4;
    let semiTone = charCodeAt(charAt(0)) - charCodeAt(C);
    // TODO
  }
}
