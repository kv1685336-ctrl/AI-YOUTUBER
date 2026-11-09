
import * as PiperTTS from
  "https://esm.sh/@mintplex-labs/piper-tts-web@1.0.5";

const MAKORA_VOICE = "en_US-ryan-medium";

let generatedAudio = null;
let generatedAudioURL = null;

export async function generateMakoraAudio(text, onProgress) {
  if (!text || !text.trim()) {
    throw new Error("Please enter some text.");
  }

  onProgress?.("Loading Piper voice...");

  const wav = await PiperTTS.predict(
    {
      text: text.trim(),
      voiceId: MAKORA_VOICE
    },
    progress => {
      if (progress?.loaded && progress?.total) {
        const percent = Math.round(
          progress.loaded / progress.total * 100
        );
        onProgress?.(`Loading voice: ${percent}%`);
      }
    }
  );

  if (!(wav instanceof Blob)) {
    throw new Error("Piper did not return an audio file.");
  }

  if (generatedAudioURL) {
    URL.revokeObjectURL(generatedAudioURL);
  }

  generatedAudio = wav;
  generatedAudioURL = URL.createObjectURL(wav);

  return generatedAudioURL;
}

export function downloadMakoraAudio() {
  if (!generatedAudio) {
    throw new Error("Generate audio first.");
  }

  const link = document.createElement("a");
  link.href = generatedAudioURL;
  link.download = "Makora-Audio.wav";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function stopMakoraAudio() {
  // Playback will be controlled by the audio player.
}
