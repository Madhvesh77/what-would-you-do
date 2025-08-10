// src/hooks/useStoryEngine.ts
import { useEffect, useMemo, useState } from 'react';
import { Story, Node, Choice } from '../types/story';
import { evalCondition } from '../utils/conditionEvaluator';
import { sendAnalyticsEvent } from '../utils/analytics';

const STORAGE_PREFIX = 'dilemmastories_progress_';

export function useStoryEngine(story?: Story) {
  const [variables, setVariables] = useState<Record<string, any>>({});
  const [tagCounts, setTagCounts] = useState<Record<string, number>>({});
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [history, setHistory] = useState<
    Array<{ nodeId: string; choiceId?: string; variables: Record<string, any>; tagCounts: Record<string, number> }>
  >([]);
  const [restoredDebugInfo, setRestoredDebugInfo] = useState<any>(null); // optional debug

  // Load initial state once story is available
  useEffect(() => {
    if (!story) return;
    const startNodeId = story.startNodeId;

    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_PREFIX + story.id) : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        // determine what node the saved state wants to restore to
        let restoredNodeId: string = parsed.currentNodeId || startNodeId;

        // detect if restoredNodeId refers to an ending
        const nodeObj = story.nodes?.[restoredNodeId];
        const directEndingMatch = Boolean(story.endings && story.endings[restoredNodeId]);
        const nodeMarkedEnding = Boolean(nodeObj?.isEnding && nodeObj?.endingId);

        const isEndingNode = directEndingMatch || nodeMarkedEnding;

        // DEBUG: store info so devs can inspect in console if needed
        setRestoredDebugInfo({
          restoredNodeId,
          isEndingNode,
          parsedHistoryLength: (parsed.history || []).length,
          parsedVariables: parsed.variables,
        });
        // If the restored node is an ending, ignore it (start fresh at startNodeId).
        const safeNodeId = isEndingNode ? startNodeId : restoredNodeId;

        setVariables(parsed.variables || {});
        setTagCounts(parsed.tagCounts || {});
        setCurrentNodeId(safeNodeId);
        setHistory(parsed.history || []);
      } else {
        setCurrentNodeId(startNodeId);
      }
    } catch (err) {
      // fallback to start node on parse errors
      setCurrentNodeId(startNodeId);
    }

    sendAnalyticsEvent('story_view', { storyId: story.id });
  }, [story]);

  // Persist progress
  useEffect(() => {
    if (!story || typeof window === 'undefined' || !currentNodeId) return;
    try {
      const payload = { variables, tagCounts, currentNodeId, history };
      localStorage.setItem(STORAGE_PREFIX + story.id, JSON.stringify(payload));
    } catch {}
  }, [variables, tagCounts, currentNodeId, history, story]);

  const node: Node | undefined = useMemo(() => {
    if (!story || !currentNodeId) return undefined;
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
        score += (totals[t] || 0);
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

    setHistory((h) => [
      ...h,
      { nodeId: node.id, choiceId: choice.id, variables: { ...variables }, tagCounts: { ...tagCounts } }
    ]);

    const mergedVars = { ...variables, ...(choice.set || {}) };
    if (choice.set) setVariables((prev) => ({ ...prev, ...choice.set }));
    if (choice.tags?.length) {
      setTagCounts((prev) => {
        const clone = { ...prev };
        choice.tags!.forEach((t) => { clone[t] = (clone[t] || 0) + 1; });
        return clone;
      });
    }

    sendAnalyticsEvent('choice_made', { storyId: story.id, nodeId: node.id, choiceId: choice.id, tags: choice.tags });

    const nextEntry = (choice.next || []).find((n) => evalCondition(n.condition, mergedVars));
    const nextId = nextEntry?.nextId;
    if (!nextId) return;

    setTimeout(() => {
      setCurrentNodeId(nextId);
      sendAnalyticsEvent('node_view', { storyId: story.id, nodeId: nextId });
    }, 200);
  }

  function goBack() {
    setHistory((prev) => {
      if (!prev.length) return prev;
      const newHist = [...prev];
      const lastState = newHist.pop();
      if (lastState) {
        setCurrentNodeId(lastState.nodeId);
        setVariables(lastState.variables);
        setTagCounts(lastState.tagCounts);
      }
      return newHist;
    });
  }

  function reset() {
    if (!story) return;
    setVariables({});
    setTagCounts({});
    setCurrentNodeId(story.startNodeId);
    setHistory([]);
    if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_PREFIX + story.id);
  }

  function getEndingIfExists() {
    if (!story || !currentNodeId) return undefined;

    // never consider the start node as an ending
    if (currentNodeId === story.startNodeId) return undefined;

    // require that user actually progressed (history length > 0)
    if (history.length === 0) return undefined;

    const nodeObj = story.nodes[currentNodeId];
    if (nodeObj?.isEnding && nodeObj.endingId) {
      return story.endings[nodeObj.endingId];
    }

    // fallback: allow direct mapping from nodeId -> ending entry,
    // but only if we're past the start node and we have history.
    if (story.endings && story.endings[currentNodeId]) {
      return story.endings[currentNodeId];
    }

    return undefined;
  }

  return {
    node,
    currentNodeId,
    variables,
    tagCounts,
    history,
    makeChoice,
    goBack,
    reset,
    computeArchetype,
    getEndingIfExists,
    isLoading: !node && !!story,
    // optional debug to inspect restored data quickly in the console
    restoredDebugInfo
  } as const;
}
