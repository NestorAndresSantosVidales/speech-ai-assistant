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
  const [processing, setProcessing] = useState<boolean>(false);

  const handleStartRecording = () => {
    setRecording(true);
    setAudioURL("");
    setAnswer("");
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
      setProcessing(true);
    });
    recorder.start();
  };

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
    } finally {
      setProcessing(false);
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

  const showSpinner = () => {
    return (
      <div role="status">
        <svg
          aria-hidden="true"
          className="w-36 h-36 mr-2 text-gray-100 animate-spin dark:text-gray-200 fill-cyan-400"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    );
  };

  const showButtonToRecord = () => {
    return (
      <button
        className={`p-4 rounded-full shadow-lg transition-all duration-500 w-64 h-64 ${
          recording ? "bg-cyan-400 animate-pulse" : "bg-slate-300"
        } hover:shadow-2xl hover:bg-opacity-80`}
        onClick={recording ? handleStopRecording : handleStartRecording}
      >
        <span className="text-8xl">🎙</span>
      </button>
    );
  };

  return (
    <div>
      {processing ? showSpinner() : showButtonToRecord()}
      <TextToSpeech text={answer} />
    </div>
  );
};

export default VoiceRecorder;
