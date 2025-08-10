import React from "react";
import FuzzyText from "./FuzzyText";

interface DynamicTextProps {
  text: string;
  animation?: string;
}

export default function DynamicText({ text, animation }: DynamicTextProps) {
  switch (animation) {
    case "fuzzy":
      return <FuzzyText>{text}</FuzzyText>;
    // case "typewriter":
    //   return <Typewriter>{text}</Typewriter>;
    // case "fade":
    //   return <FadeText>{text}</FadeText>;
    // case "shake":
    //   return <ShakeText>{text}</ShakeText>;
    default:
      return <span>{text}</span>;
  }
}
