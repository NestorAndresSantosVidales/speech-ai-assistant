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

      <div className="flex items-center justify-center h-screen bg-black text-green-400 flex-col">
        <main className="items-center flex justify-center w-full text-center flex-1">
          <VoiceRecorder></VoiceRecorder>
        </main>
        <footer className="py-8">
          <h1 className="">AI Assistant with Chat GPT</h1>
        </footer>
      </div>
    </>
  );
}
