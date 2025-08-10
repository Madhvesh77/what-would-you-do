import React from "react";
import EndingScreen from "./EndingScreen";
import { Ending, Archetype } from "../types/story";

interface EndingViewProps {
  ending: Ending;
  archetype: Archetype;
  onReplay: () => void;
}

export default function EndingView({ ending, archetype, onReplay }: EndingViewProps) {
  return (
    <EndingScreen
      ending={ending}
      archetype={archetype}
      onReplay={onReplay}
    />
  );
}
    