import fs from "fs";
import path from "path";
import Link from "next/link";
import React from "react";
import { Story } from "../types/story";
import FuzzyText from "../components/FuzzyText";

export async function getStaticProps() {
  const storiesDir = path.join(process.cwd(), "stories");
  const files = fs.existsSync(storiesDir)
    ? fs.readdirSync(storiesDir).filter((f) => f.endsWith(".json"))
    : [];
  const stories: Story[] = files.map((f) => {
    const raw = fs.readFileSync(path.join(storiesDir, f), "utf-8");
    return JSON.parse(raw) as Story;
  });
  return { props: { stories } };
}

function FloatingCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="transition-transform transform hover:-translate-y-2 hover:scale-105 hover:shadow-xl duration-300 ease-out">
      {children}
    </div>
  );
}

export default function Home({ stories }: { stories: Story[] }) {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center text-white px-3 sm:px-4 py-4 sm:py-12">
  <div className="text-center space-y-6 sm:space-y-8 max-w-2xl w-full">
    <FuzzyText
      baseIntensity={0.2}
      hoverIntensity={0.4}
      enableHover={true}
      fontSize="clamp(1.6rem, 5vw, 4rem)" // Fluid scaling
      className="leading-tight"
    >
      What would YOU do?
    </FuzzyText>

    <p className="text-gray-400 text-sm sm:text-lg px-2">
      Short branching moral stories. Choose wisely.
    </p>

    <div className="space-y-3 sm:space-y-4">
      {stories.map((s) => (
        <FloatingCard key={s.id}>
          <div className="p-3 sm:p-6 rounded-xl border border-gray-700 bg-gradient-to-b from-gray-800 to-gray-900/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="text-left flex-1">
              <div className="text-base sm:text-xl font-semibold">{s.title}</div>
              <div className="text-xs sm:text-base text-gray-400">{s.description}</div>
            </div>
            <Link
              href={`/${s.id}`}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-gray-100 rounded-lg hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] transition duration-300"
            >
              Start
            </Link>
          </div>
        </FloatingCard>
      ))}
    </div>
  </div>
</main>

  );
}
