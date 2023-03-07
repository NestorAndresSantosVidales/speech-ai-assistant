import React, { useEffect } from "react";

interface Props {
  text: string;
}

function TextToSpeech({ text }: Props): null {
  useEffect(() => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    utterance.pitch = 1.3;
    utterance.rate = 1.3;

    const voices = synth.getVoices().filter((voice) => voice.name === "Jorge");
    if (voices.length > 0) {
      utterance.voice = voices[0];
    }

    synth.speak(utterance);
  }, [text]);

  return null;
}

export default TextToSpeech;
