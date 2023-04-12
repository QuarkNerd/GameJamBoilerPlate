let ac = new AudioContext();
let analyser;

let currentPitch = 0, currentVolume = 0;
let smoothing = 2;
let volumeThreshold = 20;
let MIN_VOL_THRESHOLD = 200;
let above = false;

async function init() {
    analyser = ac.createAnalyser();
    analyser.fftSize = 4096;
    analyser.minDecibels = -90;
    analyser.maxDecibels = -10;
    analyser.smoothingTimeConstant = 0.05;

    let source = await navigator.mediaDevices.getUserMedia({ audio: true });

    let lowPass = new BiquadFilterNode(ac, { frequency : 4000, type: "lowpass" });
    let highPass = new BiquadFilterNode(ac, { frequency : 20, type: "highpass" });

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
        let slidingWindow = buffer[i-1] + buffer[i] + buffer[i+1];
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
        if (!above) window.dispatchEvent(new Event("noiseStart"));
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