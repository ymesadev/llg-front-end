"use client";
import dynamic from "next/dynamic";

const AIChatBot = dynamic(() => import("../AIChatBot/AIChatBot"), { ssr: false });
const OpenReplay = dynamic(() => import("../OpenReplay/OpenReplay"), { ssr: false });

export default function ClientDynamics() {
  return (
    <>
      <OpenReplay />
      <AIChatBot />
    </>
  );
}
