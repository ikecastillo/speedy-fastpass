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
    />
  );
} 