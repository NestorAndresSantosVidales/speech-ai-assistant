import React, { useEffect } from "react";

interface Props {
  text: string;
}

function TextToSpeech({ text }: Props): null {
  useEffect(() => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";

    synth.speak(utterance);
  }, [text]);

  return null;
}

export default TextToSpeech;
