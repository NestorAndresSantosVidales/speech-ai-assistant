import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import VoiceRecorder from "./components/VoiceRecorder/VoiceRecorder";

export default function Home() {
  return (
    <>
      <Head>
        <title>Tailwind CSS Center Image</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex items-center justify-center h-screen bg-black text-green-400">
        <main className="w-full text-center">
          <h1 className="text-3xl">AI Assistant with Chat GPT</h1>

          <VoiceRecorder></VoiceRecorder>
        </main>
      </div>
    </>
  );
}
