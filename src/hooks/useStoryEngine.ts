import { useEffect, useMemo, useState } from 'react';
import { Story, Node, Choice } from '../types/story';
import { evalCondition } from '../utils/conditionEvaluator';
import { sendAnalyticsEvent } from '../utils/analytics';

const STORAGE_PREFIX = 'dilemmastories_progress_';

export function useStoryEngine(story?: Story) {
  const startNodeId = story?.startNodeId || '';
  const [variables, setVariables] = useState<Record<string, any>>({});
  const [tagCounts, setTagCounts] = useState<Record<string, number>>({});
  const [currentNodeId, setCurrentNodeId] = useState<string>(startNodeId);
  const [history, setHistory] = useState<Array<{ nodeId: string; choiceId?: string }>>([]);

  useEffect(() => {
    if (!story) return;
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_PREFIX + story.id) : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        setVariables(parsed.variables || {});
        setTagCounts(parsed.tagCounts || {});
        setCurrentNodeId(parsed.currentNodeId || startNodeId);
        setHistory(parsed.history || []);
      } else {
        setCurrentNodeId(startNodeId);
      }
    } catch {}
    sendAnalyticsEvent('story_view', { storyId: story.id });
  }, [story, startNodeId]);

  useEffect(() => {
    if (!story || typeof window === 'undefined') return;
    try {
      const payload = { variables, tagCounts, currentNodeId, history };
      localStorage.setItem(STORAGE_PREFIX + story.id, JSON.stringify(payload));
    } catch {}
  }, [variables, tagCounts, currentNodeId, history, story]);

  const node: Node | undefined = useMemo(() => {
    if (!story) return undefined;
    return story.nodes[currentNodeId];
  }, [story, currentNodeId]);

  function computeArchetype(): { id: string; archetypeName: string } {
    if (!story) return { id: '', archetypeName: '' };
    const totals = { ...tagCounts };
    const archeKeys = Object.keys(story.archetypes || {});
    let bestId = archeKeys.length > 0 ? archeKeys[0] : '';
    let bestScore = -Infinity;
    archeKeys.forEach((id) => {
      const arche = story.archetypes[id];
      let score = 0;
      (arche.priorityTags || []).forEach((t) => {
        score += (totals[t] || 0) * 1;
      });
      if (score > bestScore) {
        bestScore = score;
        bestId = id;
      }
    });
    return { id: bestId, archetypeName: story.archetypes[bestId]?.displayName || bestId };
  }

  function makeChoice(choice: Choice) {
    if (!story || !node) return;
    const mergedVars = { ...variables, ...(choice.set || {}) };
    if (choice.set) {
      setVariables((prev) => ({ ...prev, ...choice.set }));
    }
    if (choice.tags && choice.tags.length > 0) {
      setTagCounts((prev) => {
        const clone = { ...prev };
        choice.tags!.forEach((t) => {
          clone[t] = (clone[t] || 0) + 1;
        });
        return clone;
      });
    }
    setHistory((h) => [...h, { nodeId: node.id, choiceId: choice.id }]);
    sendAnalyticsEvent('choice_made', { storyId: story.id, nodeId: node.id, choiceId: choice.id, tags: choice.tags });
    const nextEntry = (choice.next || []).find((n) => evalCondition(n.condition, mergedVars));
    const nextId = nextEntry ? nextEntry.nextId : undefined;
    if (!nextId) return;
    setTimeout(() => {
      setCurrentNodeId(nextId);
      sendAnalyticsEvent('node_view', { storyId: story.id, nodeId: nextId });
    }, 200);
  }

  function reset() {
    if (!story) return;
    setVariables({});
    setTagCounts({});
    setCurrentNodeId(startNodeId);
    setHistory([]);
    if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_PREFIX + story.id);
  }

  function getEndingIfExists() {
    if (!story) return undefined;
    if (story.endings && story.endings[currentNodeId]) return story.endings[currentNodeId];
    const nodeObj = story.nodes[currentNodeId];
    if (nodeObj && nodeObj.isEnding && nodeObj.endingId) return story.endings[nodeObj.endingId];
    return undefined;
  }

  return {
    node,
    currentNodeId,
    variables,
    tagCounts,
    history,
    makeChoice,
    reset,
    computeArchetype,
    getEndingIfExists
  } as const;
}
