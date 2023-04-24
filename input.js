const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");
let analyser;
const ac = new AudioContext();
let acResumed = null;
let currentVolume = 0;
let currentPitch = 0;
let smoothing = 4;
let volumeThreshold = 50;
let MIN_VOL_THRESHOLD = 100;
let PITCH_THRESHOLD = 450;
let above = false;

init();

async function init() {

    analyser = ac.createAnalyser();
    analyser.fftSize = 4096;
    analyser.minDecibels = -90;
    analyser.maxDecibels = -10;
    analyser.smoothingTimeConstant = 0.05;

    let source = await navigator.mediaDevices.getUserMedia({
        audio: {
            latency: 0.02,
            echoCancellation: false,
            mozNoiseSuppression: false,
            noiseSuppression: false,
            mozAutoGainControl: false,
            autoGainControl: false,
            sampleRate: 22500
        }
    });

    let lowPass = new BiquadFilterNode(ac, { frequency : 6000, type: "lowpass" });
    let highPass = new BiquadFilterNode(ac, { frequency : 10, type: "highpass" });

    let stream = ac.createMediaStreamSource(source);
    stream.connect(lowPass);
    lowPass.connect(highPass);
    highPass.connect(analyser);
}

function smooth(current, next) {
    return current + ((next - current) / smoothing);
}

function analyseAudioTick() {
  const bufferLength = analyser.frequencyBinCount;
  const buffer = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(buffer);

  let maxFrequency = ac.sampleRate / 2;
  let binWidth = maxFrequency / bufferLength;

  let maxVol = 0;
  let pitch = 0;
  for (let i = 1; i < bufferLength - 1; i++) {
    let slidingWindow =
      (buffer[i - 2] +
        buffer[i - 1] +
        buffer[i] +
        buffer[i + 1] +
        buffer[i + 2]) /
      5;
    if (slidingWindow > volumeThreshold) {
      if (slidingWindow > maxVol) {
        maxVol = slidingWindow;
        pitch = i * binWidth;
      }
    }
  }

  currentPitch = smooth(currentPitch, pitch);
  currentVolume = smooth(currentVolume, maxVol);

  if (currentVolume > MIN_VOL_THRESHOLD) {
    if (!above)
      window.dispatchEvent(
        new CustomEvent("noiseStart", {
          detail: { highPitch: currentPitch >= PITCH_THRESHOLD },
        })
      );
    above = true;
  } else {
    if (currentVolume <= MIN_VOL_THRESHOLD) {
      if (above) window.dispatchEvent(new Event("noiseStop"));
      above = false;
    }
  }
}

const handleX = canvas.width / 2 + 15
const handleY = 80;
const handleHeight = 20;
const handleWidth = canvas.width/2 - 30;
function drawAudioControl() {
  ctx.textAlign='start';
  ctx.font = '20px slkscr';
  ctx.fillStyle = "White";
  ctx.fillText("Volume threshold", handleX, handleY - 20);

  ctx.fillStyle = "grey";
  ctx.fillRect(handleX, handleY, handleWidth, handleHeight);
  ctx.fillStyle = "white";
  ctx.fillRect(handleX, handleY, currentVolume, handleHeight);
  ctx.fillStyle = "red";
  ctx.fillRect(handleX + MIN_VOL_THRESHOLD - 2, handleY - 5, 4, handleHeight + 10);

  if (acResumed) return;
  ctx.font = '14px slkscr';
  ctx.fillText("Waiting for audio startup", handleX, handleY + handleHeight + 30);
}

function audioCanvasTouchHandler({x, y}) {
  if (x >= handleX && x <= handleX + handleWidth && y >= handleY && y <= handleY + handleHeight) {
    MIN_VOL_THRESHOLD = x - handleX;
  }
  if (acResumed === null) {
    acResumed = false;
    ac.resume().then(_ => {
      acResumed = true;
    });
  }
}

export { analyseAudioTick, drawAudioControl, audioCanvasTouchHandler };
