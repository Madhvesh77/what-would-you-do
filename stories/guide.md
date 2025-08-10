# STORY CONTRIBUTION GUIDE

Welcome — thanks for contributing a story! This file lives in the `stories/` folder. Add your new story JSON here following the rules below and the site will pick it up automatically.

---

## 1. Filename & placement

* Put your file under `stories/`.
* Use **kebab-case** and `.json` extension, e.g. `the-night-train.json`.
* The file's top-level `id` must match the filename (without `.json`).

---

## 2. Overall `Story` shape

Use the following keys at the top level (fields marked `?` are optional):

```ts
export interface Story {
  id: string;              // unique id, matches filename
  title: string;           // story title shown in UI
  titleAnimation?: string; // optional: animation for the main title (e.g. "fuzzy")
  description?: string;    // short description shown on the home page
  startNodeId: string;     // id of the first node
  meta?: Record<string, any>; // optional metadata
  nodes: Record<string, Node>;
  endings: Record<string, Ending>;
  archetypes: Record<string, Archetype>;
}
```

---

## 3. Node structure (scenes)

A **node** is a scene. `content` accepts either plain strings (backwards-compat) or objects that allow per-paragraph animation.

```ts
type ContentBlock = { text: string; animation?: string };

export interface Node {
  id: string;
  title?: string;
  titleAnimation?: string;
  content: (string | ContentBlock)[]; // array of paragraphs or animated blocks
  choices: Choice[];
  isEnding?: boolean;
  endingId?: string | null;
}
```

**Example node (short):**

```json
{
  "id": "intro",
  "title": "The Night Train",
  "titleAnimation": "fuzzy",
  "content": [
    "The train sways gently as rain lashes the window.",
    { "text": "You settle in, but something about tonight feels off.", "animation": "typewriter" }
  ],
  "choices": [
    { "id": "to_d1", "label": "Continue", "next": [{ "condition": "true", "nextId": "d1" }] }
  ]
}
```

---

## 4. Choices

```ts
export interface Choice {
  id: string;         // unique id inside the node
  label: string;      // text shown on the button
  animation?: string; // optional animation name for this choice label
  tags?: string[];    // optional tags used to compute archetypes
  set?: Variables;    // optional variables to set when chosen
  next: ConditionalNext[]; // list ordered by priority; first true condition wins
}

export interface ConditionalNext { condition: string; nextId: string }
```

**Notes:**

* `next` is evaluated in order. Use simple conditions like `true`, `false`, or expressions referencing variables (e.g. `helpedTicketless == true`).

---

## 5. Endings

```ts
export interface Ending {
  id: string;
  title: string;
  text: (string | ContentBlock)[]; // paragraphs or animated blocks
  archetype: string; // archetype id
  reflection: string; // explanatory/reflection text
}
```

---

## 6. Archetypes

```ts
export interface Archetype {
  displayName: string;
  description: string;
  priorityTags: string[]; // tags that increase score for this archetype
}
```

Archetypes are used to show a final "player type" based on the tags accumulated through choices.

---

## 7. Minimal full example

Here's a minimal, valid story file you can copy and modify. Save as `stories/example-dilemma.json`.

```json
{
  "id": "example-dilemma",
  "title": "Example Dilemma",
  "titleAnimation": "fuzzy",
  "description": "A tiny demo story",
  "startNodeId": "intro",
  "meta": { "estimatedMinutes": 3 },
  "nodes": {
    "intro": {
      "id": "intro",
      "title": "A Short Night",
      "content": [
        "You enter a quiet room.",
        { "text": "Something feels strange.", "animation": "typewriter" }
      ],
      "choices": [
        { "id": "c1", "label": "Investigate", "next": [{ "condition": "true", "nextId": "investigate" }] },
        { "id": "c2", "label": "Leave", "next": [{ "condition": "true", "nextId": "leave" }] }
      ]
    },

    "investigate": {
      "id": "investigate",
      "content": ["You found a clue."],
      "choices": [ { "id": "end1", "label": "Finish", "next": [{ "condition": "true", "nextId": "ending_good" }] } ]
    },

    "leave": {
      "id": "leave",
      "content": ["You walk away, unsure."],
      "choices": [ { "id": "end2", "label": "Finish", "next": [{ "condition": "true", "nextId": "ending_neutral" }] } ]
    }
  },

  "endings": {
    "ending_good": {
      "id": "ending_good",
      "title": "Curious",
      "text": ["You followed your curiosity and found an answer."],
      "archetype": "Questioner",
      "reflection": "You are curious and brave."
    },
    "ending_neutral": {
      "id": "ending_neutral",
      "title": "Cautious",
      "text": ["You chose safety over risk."],
      "archetype": "Pragmatist",
      "reflection": "You prefer security."
    }
  },

  "archetypes": {
    "Questioner": { "displayName": "The Questioner", "description": "Curious and cautious.", "priorityTags": ["Curiosity"] },
    "Pragmatist": { "displayName": "The Pragmatist", "description": "Values safety.", "priorityTags": ["SelfPreservation"] }
  }
}
```

---

## 8. Testing & tips

* Run `npm run dev` and visit the home page. Your new story should appear automatically.
* Play through every branch and check endings.
* Keep paragraphs short for mobile readability.
* Add `animation` values only if an effect exists in the code (`fuzzy`, `typewriter`, `fade`, etc.).

---