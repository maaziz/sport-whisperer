const ELEVENLABS_API_KEY = "sk_0ebd761b1d7ed4fce0014bb595b0005454aa15065a33fb19";

export const VOICE_OPTIONS = [
  { id: "nPczCjzI2devNBz1zQrb", name: "English (US)", description: "American English", langCode: "en" },
  { id: "onwK4e9ZLuTAKqWW03F9", name: "English (UK)", description: "British English", langCode: "en" },
  { id: "9BWtsMINqrJLrRacOk9x", name: "Spanish", description: "Español", langCode: "es" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "French", description: "Français", langCode: "fr" },
  { id: "JBFqnCBsd6RMkjVDRZzb", name: "German", description: "Deutsch", langCode: "de" },
  { id: "XB0fDUnXU5powFXDhCwa", name: "Italian", description: "Italiano", langCode: "it" },
  { id: "pFZP5JQG7iQjIQuC4Bku", name: "Portuguese", description: "Português", langCode: "pt" },
  { id: "CwhRBWXzGAHq8TQ4Fs17", name: "Hindi", description: "हिन्दी", langCode: "hi" },
];

// Cache for translations to avoid re-translating the same text
const translationCache = new Map<string, string>();

async function translateText(text: string, targetLang: string): Promise<string> {
  // Skip translation for English
  if (targetLang === "en") {
    return text;
  }

  // Check cache first
  const cacheKey = `${text}|${targetLang}`;
  const cached = translationCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
    );
    
    if (!response.ok) {
      // Translation API error - fall back to original text
      return text;
    }

    const data = await response.json();
    const translatedText = data.responseData.translatedText || text;
    
    // Cache the translation
    translationCache.set(cacheKey, translatedText);
    
    return translatedText;
  } catch (error) {
    // Translation failed - fall back to original text
    return text; // Fallback to original text if translation fails
  }
}

export async function textToSpeech(text: string, voiceId: string = VOICE_OPTIONS[0].id): Promise<void> {
  try {
    // Find the language code for the selected voice
    const selectedVoice = VOICE_OPTIONS.find(v => v.id === voiceId);
    const targetLang = selectedVoice?.langCode || "en";
    
    // Translate text if needed
    const translatedText = await translateText(text, targetLang);
    
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: translatedText,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    await audio.play();
    
    // Clean up the object URL after playback
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
    };
  } catch (error) {
    // Text-to-speech failed
    throw error;
  }
}
