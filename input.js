let ac = new AudioContext();
let analyser;

let currentPitch = 0, currentVolume = 0;
let smoothing = 2;
let volumeThreshold = 30;
let MIN_VOL_THRESHOLD = 75;
let PITCH_THRESHOLD = 300;
let above = false;

let currentVolText = document.getElementById("vol");

async function init() {
    const volThresholdInput = document.getElementById("volThreshold");
    volThresholdInput.value = MIN_VOL_THRESHOLD;
    volThresholdInput.addEventListener("input", e => MIN_VOL_THRESHOLD = e.target.value);

    const pitchThresholdInput = document.getElementById("pitchThreshold");
    pitchThresholdInput.value = PITCH_THRESHOLD;
    pitchThresholdInput.addEventListener("input", e => PITCH_THRESHOLD = e.target.value);

    analyser = ac.createAnalyser();
    analyser.fftSize = 2048;
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

    tick();
}

function smooth(current, next) {
    return current + ((next - current) / smoothing);
}


function analyse() {
    const bufferLength = analyser.frequencyBinCount;
    const buffer = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(buffer);

    let maxFrequency = (ac.sampleRate / 2);
    let binWidth = maxFrequency / bufferLength;

    let maxVol = 0;
    let pitch = 0;
    for (let i=1; i<bufferLength-1; i++) {
        let slidingWindow = (buffer[i-1] + buffer[i] + buffer[i+1]) / 3;
        if (slidingWindow > volumeThreshold) {
            if (slidingWindow > maxVol) {
                maxVol = slidingWindow;
                pitch = i * binWidth;
            }
        }
    }

    currentPitch = smooth(currentPitch, pitch);
    currentVolume = smooth(currentVolume, maxVol);

    currentVolText.innerHTML = currentVolume.toFixed(1);

    if (currentVolume > MIN_VOL_THRESHOLD) {
        if (!above) window.dispatchEvent(new CustomEvent("noiseStart", { detail: { highPitch : currentPitch >= PITCH_THRESHOLD }}));
        above = true;
    } else {
        if (currentVolume <= MIN_VOL_THRESHOLD) {
            if (above) window.dispatchEvent(new Event("noiseStop"));
            above = false;
        }
    }
}


function tick() {
    analyse();

    requestAnimationFrame(tick);
}

await init();
