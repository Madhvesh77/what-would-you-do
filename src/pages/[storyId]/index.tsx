import fs from 'fs';
import path from 'path';
import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';
import { Story } from '../../types/story';
import SceneCard from '../../components/SceneCard';
import Choices from '../../components/Choices';
import EndingView from '../../components/EndingView';
import { useStoryEngine } from '../../hooks/useStoryEngine';

export const getStaticPaths: GetStaticPaths = async () => {
  const storiesDir = path.join(process.cwd(), 'stories');
  const files = fs.existsSync(storiesDir)
    ? fs.readdirSync(storiesDir).filter((f) => f.endsWith('.json'))
    : [];
  const paths = files.map((f) => ({
    params: { storyId: f.replace('.json', '') }
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = String(params?.storyId || '');
  const file = path.join(process.cwd(), 'stories', `${id}.json`);
  if (!fs.existsSync(file)) {
    return { notFound: true };
  }
  const raw = fs.readFileSync(file, 'utf-8');
  const story = JSON.parse(raw) as Story;
  return { props: { story } };
};

export default function StoryPage({ story }: { story: Story }) {
  const engine = useStoryEngine(story);
  const node = engine.node;
  const ending = engine.getEndingIfExists();
  const arche = engine.computeArchetype();

  if (!node) return <div>Loading...</div>;

  if (ending) {
    return (
      <main className="max-w-4xl mx-auto relative">
        <EndingView
          ending={ending}
          archetypeName={arche.archetypeName}
          onReplay={() => engine.reset()}
        />
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto relative">
      {engine.history.length > 0 && (
        <button
          onClick={() => engine.goBack?.()}
          className="fixed bottom-4 right-4 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors shadow-lg"
        >
          Reconsider
        </button>
      )}

      <div className="mb-6 pt-12">
        <div className="text-sm text-gray-500">{story.title}</div>
      </div>
      <SceneCard node={node} />
      <Choices choices={node.choices} onChoose={(c) => engine.makeChoice(c)} />
    </main>
  );
}
