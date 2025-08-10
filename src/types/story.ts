export type Variables = Record<string, any>;

export interface ConditionalNext {
  condition: string;
  nextId: string;
}

export interface Choice {
  id: string;
  label: string;
  animation?: string; // animation type for this choice’s text
  tags?: string[];
  weight?: Record<string, number>;
  set?: Variables;
  next: ConditionalNext[];
}

export type ContentBlock = {
  text: string;
  animation?: string;
};

export interface Node {
  id: string;
  title?: string;
  titleAnimation?: string;
  content: (string | ContentBlock)[]; // supports both plain text and animated blocks
  choices: Choice[];
  isEnding?: boolean;
  endingId?: string | null;
}

export interface Ending {
  id: string;
  title: string;
  titleAnimation?: string; // optional animation for ending title
  text: ContentBlock[]; // ending text can also be animated
  archetype: string;
  reflection: string;
}

export interface Archetype {
  displayName: string;
  description: string;
  priorityTags: string[];
}

export interface Story {
  id: string;
  title: string;
  titleAnimation?: string; // animation for the main story title
  description?: string;
  startNodeId: string;
  meta?: Record<string, any>;
  nodes: Record<string, Node>;
  endings: Record<string, Ending>;
  archetypes: Record<string, Archetype>;
}
