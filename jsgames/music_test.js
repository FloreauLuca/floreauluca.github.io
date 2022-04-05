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
    this.oscillatorModule.frequency.value = this.gain;
  }

  setNote(note) {
    let f0 = 261.6; // C4
    let a = 1.05946309435;
    let octaveDiff = parseInt(charAt(1)) - 4;
    let semiTone = charCodeAt(charAt(0)) - charCodeAt(C);
    // TODO
  }
}

var btnPlay = document.getElementById("playBtn");
btnPlay.addEventListener('click', playBtn);
document.getElementById("loadBtn").addEventListener('click', load);

var module = null;
var o, g, context;
function load() {
  var real = [];
  var imag = [];
  context = new AudioContext()
  o = context.createOscillator()
  g = context.createGain()
  o.connect(g)
  g.connect(context.destination)

  real[0] = 1;
  imag[0] = 0;
  real[1] = 0.1;
  imag[1] = 0;
  real[2] = 0.4;
  imag[2] = 0;
  real[3] = 0.05;
  imag[3] = 0;
  real[4] = 0.05;
  imag[4] = 0;
  real[5] = 0.05;
  imag[5] = 0;

  console.log(real);
  console.log(imag);
  onde = context.createPeriodicWave(real, imag, { disableNormalization: true });

  o.setPeriodicWave(onde);

  o.start(0)
  g.gain.setValueAtTime(0, context.currentTime);
}

var isPlaying = false;

function playBtn() {
  if (!isPlaying) {
    isPlaying = true;
    g.gain.exponentialRampToValueAtTime(1.0, context.currentTime + 0.1);
  } else {
    isPlaying = false;
    g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1)
  }
  if (module == null)
    return;
  if (module.isPlaying) {
    module.stop();
    console.log("sound.stop");
  } else {
    module.play();
    console.log("sound.play");
  }
}

draw();

var timestamp, deltaTime, lastTimestamp;

function draw() {
  requestAnimationFrame(draw);
  timestamp = Date.now();

  if (module != null) {
    //module.setFrequency(440.0 + Math.sin(timestamp * 0.01) * 200);
  }

  deltaTime = 1000 / (timestamp - lastTimestamp);
  lastTimestamp = timestamp;
}


