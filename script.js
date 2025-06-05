const textarea = document.querySelector("textarea");
const voiceSelect = document.querySelector("select");
const button = document.querySelector("button");
const rateRange = document.getElementById("rateRange");
const rateValue = document.getElementById("rateValue");

let voices = [];

rateRange.addEventListener("input", () => {
    rateValue.textContent = rateRange.value;
});

function loadVoicesProperly(callback) {
    let tries = 0;
    const maxTries = 50;

    const checkVoices = () => {
        voices = speechSynthesis.getVoices();
        if (voices.length > 0 || tries >= maxTries) {
            callback();
        } else {
            tries++;
            setTimeout(checkVoices, 100);
        }
    };

    checkVoices();
}

function populateVoices() {
    voiceSelect.innerHTML = '';
    voices.forEach((voice, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = `${voice.name} (${voice.lang})`;
        voiceSelect.appendChild(option);
    });
}

loadVoicesProperly(() => {
    populateVoices();
});

speechSynthesis.onvoiceschanged = () => {
    voices = speechSynthesis.getVoices();
    populateVoices();
};

button.addEventListener("click", () => {
    const text = textarea.value.trim();
    if (!text) return;

    const selectedVoiceIndex = voiceSelect.value;
    const selectedVoice = voices[selectedVoiceIndex];

    speechSynthesis.cancel();

    setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }
        utterance.rate = parseFloat(rateRange.value); // Set the speed
        speechSynthesis.speak(utterance);
    }, 200);
});
