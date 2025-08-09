export type Variables = Record<string, any>;
export interface ConditionalNext { condition: string; nextId: string }
export interface Choice {
  id: string;
  label: string;
  tags?: string[];
  weight?: Record<string, number>;
  set?: Variables;
  next: ConditionalNext[];
}
export interface Node {
  id: string;
  title?: string;
  content: string[];
  choices: Choice[];
  isEnding?: boolean;
  endingId?: string | null;
}
export interface Ending { id: string; title: string; text: string[]; archetype: string; reflection: string }
export interface Archetype { displayName: string; description: string; priorityTags: string[] }
export interface Story {
  id: string;
  title: string;
  description?: string;
  startNodeId: string;
  meta?: Record<string, any>;
  nodes: Record<string, Node>;
  endings: Record<string, Ending>;
  archetypes: Record<string, Archetype>;
}