class TextToSpeechApp {
    constructor() {
        this.elements = {
            textInput: document.getElementById('textInput'),
            voiceSelect: document.getElementById('voiceSelect'),
            speedControl: document.getElementById('speedControl'),
            pitchControl: document.getElementById('pitchControl'),
            synthesizeBtn: document.getElementById('synthesizeBtn'),
            clearBtn: document.getElementById('clearBtn'),
            status: document.getElementById('status'),
            loading: document.getElementById('loading'),
            audioContainer: document.getElementById('audioContainer'),
            audioPlayer: document.getElementById('audioPlayer'),
            charCount: document.getElementById('charCount'),
            speedValue: document.getElementById('speedValue'),
            pitchValue: document.getElementById('pitchValue')
        };

        this.init();
    }

    init() {
        this.attachEventListeners();
        this.updateCharCount();
        console.log('✓ TextToSpeechApp initialized');
    }

    attachEventListeners() {
        this.elements.synthesizeBtn.addEventListener('click', () => this.synthesize());
        this.elements.clearBtn.addEventListener('click', () => this.clear());
        this.elements.textInput.addEventListener('input', () => this.updateCharCount());
        this.elements.speedControl.addEventListener('input', (e) => {
            this.elements.speedValue.textContent = e.target.value;
        });
        this.elements.pitchControl.addEventListener('input', (e) => {
            this.elements.pitchValue.textContent = e.target.value;
        });
    }

    updateCharCount() {
        const count = this.elements.textInput.value.length;
        this.elements.charCount.textContent = count;

        const charCountDiv = this.elements.charCount.parentElement;
        charCountDiv.classList.remove('warning', 'error');

        if (count > 4500) {
            charCountDiv.classList.add('error');
        } else if (count > 4000) {
            charCountDiv.classList.add('warning');
        }
    }

    async synthesize() {
        const text = this.elements.textInput.value.trim();

        if (!text) {
            this.showStatus('Please enter text to synthesize', 'error');
            return;
        }

        if (text.length > 5000) {
            this.showStatus('Text exceeds 5000 character limit', 'error');
            return;
        }

        this.setLoading(true);
        this.elements.synthesizeBtn.disabled = true;

        try {
            const response = await fetch('/api/synthesize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text,
                    voiceName: this.elements.voiceSelect.value,
                    speakingRate: parseFloat(this.elements.speedControl.value),
                    pitch: parseFloat(this.elements.pitchControl.value)
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Synthesis failed');
            }

            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);

            this.elements.audioPlayer.src = audioUrl;
            this.elements.audioContainer.style.display = 'block';

            this.showStatus('✓ Audio synthesized successfully!', 'success');
            console.log('Audio synthesized:', audioUrl);
        } catch (error) {
            console.error('Synthesis error:', error);
            this.showStatus(`Error: ${error.message}`, 'error');
        } finally {
            this.setLoading(false);
            this.elements.synthesizeBtn.disabled = false;
        }
    }

    clear() {
        this.elements.textInput.value = '';
        this.elements.audioPlayer.src = '';
        this.elements.audioContainer.style.display = 'none';
        this.updateCharCount();
        this.showStatus('Cleared', 'info');
    }

    setLoading(isLoading) {
        this.elements.loading.style.display = isLoading ? 'block' : 'none';
        this.elements.synthesizeBtn.disabled = isLoading;
    }

    showStatus(message, type) {
        this.elements.status.textContent = message;
        this.elements.status.className = `status show ${type}`;

        setTimeout(() => {
            this.elements.status.classList.remove('show');
        }, 5000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TextToSpeechApp();
});