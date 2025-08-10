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
    <main className="min-h-screen bg-black flex items-center justify-center text-white px-4">
      <div className="text-center space-y-8 max-w-2xl w-full">
        {/* <h1 className="text-5xl font-bold animate-pulse">What would YOU do?</h1> */}
        <FuzzyText
          baseIntensity={0.2}
          hoverIntensity={0.4}
          enableHover={true}
          fontSize="4rem"
        >
            What would YOU do?
        </FuzzyText>
        <p className="text-gray-400">
          Short branching moral stories. Choose wisely.
        </p>
        <div className="space-y-4">
          {stories.map((s) => (
            <FloatingCard key={s.id}>
              <div className="p-4 rounded border border-gray-700 bg-gray-900/80 flex items-center justify-between">
                <div className="text-left">
                  <div className="text-lg font-semibold">{s.title}</div>
                  <div className="text-sm text-gray-500">{s.description}</div>
                </div>
                <Link
                  href={`/${s.id}`}
                  className="ml-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.8)] transition duration-300"
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
