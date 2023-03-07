import React, { useState, useEffect } from "react";
import TextToSpeech from "../TextToSpeech/TextToSpeech";

interface VoiceRecorderProps {}

declare global {
  interface Window {
    stream: MediaStream;
  }
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = () => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [answer, setAnswer] = useState<string>("");

  const handleStartRecording = () => {
    setRecording(true);
    setAudioURL("");
    const recorder = new MediaRecorder(window.stream);
    setMediaRecorder(recorder);
    const audioChunks: BlobPart[] = [];
    recorder.addEventListener("dataavailable", (event) => {
      audioChunks.push(event.data);
    });
    recorder.addEventListener("stop", () => {
      const audioBlob = new Blob(audioChunks);
      const audioURL = URL.createObjectURL(audioBlob);
      setAudioBlob(audioBlob);
      setAudioURL(audioURL);
      setRecording(false);
      sendAudio(audioBlob);
    });
    recorder.start();
  };

  console.log("Times...");

  const sendAudio = async (blob: Blob) => {
    const formData = new FormData();
    formData.append("audio", blob, "recording.webm");

    try {
      const response = await fetch("http://localhost:3005/api/v1/google/chat", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Audio sent successfully!");

        const data = await response.json();

        setAnswer(data.answer);
      } else {
        console.log("Failed to send audio.");
      }
    } catch (error) {
      console.error("Failed to send audio:", error);
    }
  };

  const handleStopRecording = () => {
    mediaRecorder?.stop();
  };

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      window.stream = stream;
    });
  }, []);

  return (
    <div>
      <button
        className={`p-4 rounded-full shadow-lg transition-all duration-500 w-64 h-64 ${
          recording ? "bg-red-500 ring-red-500 animate-pulse" : "bg-green-500"
        } hover:shadow-2xl hover:bg-opacity-90`}
        onClick={recording ? handleStopRecording : handleStartRecording}
      >
        <span className="text-8xl">🎙</span>
      </button>
      {/* {audioURL && (
        <audio controls autoPlay style={{ display: "none" }}>
          <source src={audioURL} />
        </audio>
      )} */}
      <TextToSpeech text={answer} />
    </div>
  );
};

export default VoiceRecorder;
