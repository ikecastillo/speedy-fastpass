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
      colors={['#0050FF', '#FFCC00', '#0066FF', '#FFD700', '#004DCC', '#FFC107']}
      numberOfPieces={200}
    />
  );
} 