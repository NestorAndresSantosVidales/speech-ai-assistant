import React, { useState, useEffect } from "react";

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
    });
    recorder.start();
  };

  const sendAudio = async () => {
    if (audioBlob) {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      try {
        const response = await fetch("http://localhost:3005/api/v1/chat", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          console.log("Audio sent successfully!");
        } else {
          console.log("Failed to send audio.");
        }
      } catch (error) {
        console.error("Failed to send audio:", error);
      }
    }
  };

  const handleStopRecording = () => {
    mediaRecorder?.stop();
    sendAudio();
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
      {audioURL && (
        <audio controls autoPlay style={{ display: "none" }}>
          <source src={audioURL} />
        </audio>
      )}
    </div>
  );
};

export default VoiceRecorder;
