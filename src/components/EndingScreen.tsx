// src/components/EndingScreen.tsx
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import DynamicText from "./DynamicText";
import { Ending, Archetype } from "../types/story";

const ReactConfetti = dynamic(() => import("react-confetti"), { ssr: false });

interface Props {
  ending: Ending;
  archetype: Archetype;
  onReplay: () => void;
}

export default function EndingScreen({ ending, archetype, onReplay }: Props) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [size, setSize] = useState({ width: 0, height: 0 });

  // track viewport size (ReactConfetti needs width/height)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const update = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    // debug log so you can confirm the animationType reaching this component
    // remove or comment out after debugging
    // eslint-disable-next-line no-console
    console.log("[EndingScreen] animationType:", ending?.animationType);

    if (!ending?.animationType) return;

    // enable for both "confetti" & "crying" (we change color set for crying)
    if (ending.animationType === "confetti" || ending.animationType === "crying") {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 5000); // show for 5s
      return () => clearTimeout(t);
    }
  }, [ending?.animationType]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 sm:p-8 relative overflow-hidden">
      {/* Confetti (fixed full-screen overlay) */}
      {showConfetti && typeof window !== "undefined" && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none" }}>
          <ReactConfetti
            width={size.width}
            height={size.height}
            numberOfPieces={ending.animationType === "crying" ? 200 : 350}
            gravity={ending.animationType === "crying" ? 0.6 : 0.3}
            colors={ending.animationType === "crying" ? ["#00BFFF", "#1E90FF", "#87CEFA"] : undefined}
            // you can tune other props here (recycle=false to stop automatically)
            recycle={false}
          />
        </div>
      )}

      {/* Title */}
      <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
        <DynamicText text={ending.title} animation={ending.titleAnimation} />
      </h2>

      {/* Archetype */}
      <div className="mb-6 text-center max-w-xl">
        <p className="text-lg text-gray-300">You exhibited:</p>
        <p className="text-2xl font-semibold text-yellow-400">{archetype.displayName}</p>
        <p className="text-gray-400 mt-2">{archetype.description}</p>
      </div>

      {/* Ending text */}
      <div className="space-y-4 mb-20 max-w-2xl">
        {ending.text.map((t, i) => {
          const text = typeof t === "string" ? t : t.text;
          const animation = typeof t === "string" ? undefined : t.animation;
          return (
            <p key={i} className="leading-relaxed text-gray-200">
              <DynamicText text={text} animation={animation} />
            </p>
          );
        })}
      </div>

      {/* Replay button */}
      <button
        onClick={onReplay}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold fixed bottom-6 right-6 sm:bottom-8 sm:right-8 shadow-lg z-50"
      >
        Replay Story
      </button>
    </div>
  );
}
