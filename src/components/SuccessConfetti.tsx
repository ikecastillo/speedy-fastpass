"use client";

import dynamic from "next/dynamic";
import { useWindowSize } from "@uidotdev/usehooks";

const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

export default function SuccessConfetti() {
  const { width, height } = useWindowSize();
  
  return (
    <Confetti 
      width={width || 0} 
      height={height || 0} 
      recycle={false}
      aria-hidden="true"
      colors={['#1e40af', '#FFCC00', '#2563eb', '#FFD700', '#1e3a8a', '#FFC107']}
      numberOfPieces={200}
    />
  );
} 