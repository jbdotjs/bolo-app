// initializing API
const synth = window.speechSynthesis;

const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const voiceSelect = document.querySelector('#voice-select');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');
const body = document.querySelector('body');


let voices = [];

const getVoices = () => {
    voices = synth.getVoices();
    // enter voices into DOM
    voices.forEach(voice => {
        const option = document.createElement('option');
        option.textContent = `${voice.name} '(${voice.lang})'`;
        option.setAttribute('data-lang', voice.lang);
        option.setAttribute('data-name', voice.name);
        voiceSelect.appendChild(option);
    });
}

getVoices();
if(synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = getVoices;
}

const speak = () => {
    
    if(synth.speaking){
        console.error('Already Speaking...');
        return;
    }
    if(textInput.value !=='') {
        // Add bg animation
        body.style.background = 'url(./img/wave.gif)';
        body.style.backgroundRepeat = 'repeat-x';
        body.style.backgroundSize = '100% 100%';
    
        const speakText = new SpeechSynthesisUtterance(textInput.value);
        speakText.onend = e => {
            console.log('done speaking...');
            body.style.background= '#141414';
        };
        
        speakText.onerror = e => {
            alert('API is not working.');
        }
        
        // loop over voices to choose selected voice
        const selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');
        voices.forEach(voice => {
            if(voice.name == selectedVoice){
                speakText.voice = voice;
            }
        });

        // set pitch & rate
        speakText.rate = rate.value;
        speakText.pitch = pitch.value;

        // speak
        synth.speak(speakText);
    }
    
}

/* EVENT LISTNERS */


textForm.addEventListener('submit', e => {
    e.preventDefault();
    speak();
    textInput.blur();
});

rate.addEventListener('change', e => rateValue.textContent = rate.value);
pitch.addEventListener('change', e => pitchValue.textContent = pitch.value);

voiceSelect.addEventListener('change', e => speak());
