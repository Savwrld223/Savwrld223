class GoogleCloudTTSService {
    constructor() {
        this.client = new TextToSpeechClient();
    }

    async synthesizeSpeech(text, languageCode = 'en-US') {
        try {
            const request = {
                input: { text },
                voice: { languageCode, ssmlGender: 'NEUTRAL' },
                audioConfig: { audioEncoding: 'MP3' },
            };

            const [response] = await this.client.synthesizeSpeech(request);
            console.log('Speech synthesized successfully.');
            return response.audioContent;
        } catch (error) {
            console.error('Error during speech synthesis:', error);
            throw new Error('Failed to synthesize speech');
        }
    }
}

module.exports = GoogleCloudTTSService;
