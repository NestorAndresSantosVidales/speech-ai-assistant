import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import VoiceRecorder from "./components/VoiceRecorder/VoiceRecorder";

export default function Home() {
  return (
    <>
      <Head>
        <title>RIC - AI Assitant (By ChatGPT)</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex items-center justify-center h-screen flex-col bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
        <main className="items-center flex justify-center w-full text-center flex-1">
          <VoiceRecorder></VoiceRecorder>
        </main>
        <footer className="py-8">
          <h1 className="text-slate-200">RIC - AI Assitant (By ChatGPT)</h1>
        </footer>
      </div>
    </>
  );
}
