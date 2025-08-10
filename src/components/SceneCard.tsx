import React from "react";
import { Node } from "../types/story";
import clsx from "clsx";
import DynamicText from "./DynamicText";

export default function SceneCard({ node }: { node: Node }) {
  if (!node) return null;

  return (
    <div
      className={clsx(
        "max-w-3xl mx-auto p-4 sm:p-8 rounded-xl shadow-lg break-words",
        "bg-gradient-to-b from-gray-800 to-gray-900 text-gray-100"
      )}
    >
      {node.title && (
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">{node.title}</h2>
      )}
      <div className="space-y-4">
        {node.content.map((p, i) => {
          const text = typeof p === "string" ? p : p.text;
          const animation = typeof p === "string" ? undefined : p.animation;

          return <DynamicText key={i} text={text} animation={animation} />;
        })}
      </div>
    </div>
  );
}
