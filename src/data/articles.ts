export interface Article {
  id: string;
  slug: string;
  category: "games" | "science" | "story" | "coding" | "study";
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

export const ARTICLES: Article[] = [
  {
    id: "ART-001",
    slug: "why-indie-games-feel-more-alive",
    category: "games",
    title: "Why Indie Games Feel More Alive Than AAA Titles",
    date: "18 MAY 2026",
    excerpt:
      "Exploring how smaller studios create stronger emotional experiences through focused design and creative risks.",
    content: `
Indie games often succeed because they focus on one strong idea.

Unlike massive AAA productions that try to satisfy everyone, indie developers usually build experiences around emotion, atmosphere, or unique mechanics.

Games like these feel personal. Imperfect, sometimes, but memorable.

Players are starting to value identity more than graphical realism.
    `,
  },

  {
    id: "ART-002",
    slug: "the-future-of-small-space-telescopes",
    category: "science",
    title: "The Future of Small Space Telescopes",
    date: "15 MAY 2026",
    excerpt:
      "Compact orbital telescopes are changing how researchers collect astronomical data.",
    content: `
Miniaturized telescopes are becoming increasingly capable.

With cheaper launch systems and better onboard sensors, universities and smaller research teams can now participate in space observation projects.

This democratization of science may accelerate discoveries dramatically over the next decade.
    `,
  },

  {
    id: "ART-003",
    slug: "letters-from-the-underground-city",
    category: "story",
    title: "Letters from the Underground City",
    date: "12 MAY 2026",
    excerpt:
      "A fragmented story about a city beneath the ocean and the people trying to survive inside it.",
    content: `
The lights flickered every night at exactly 02:13.

Nobody knew why anymore.

The city had existed underwater for so long that most citizens forgot the surface even existed. Yet old maintenance tunnels still carried whispers from above.
    `,
  },

  {
    id: "ART-004",
    slug: "why-developers-love-terminal-workflows",
    category: "coding",
    title: "Why Developers Still Love Terminal Workflows",
    date: "08 MAY 2026",
    excerpt:
      "Modern interfaces are powerful, but terminal-based workflows remain unmatched in speed and flexibility.",
    content: `
Terminal workflows reduce friction.

Developers can chain commands, automate repetitive tasks, and control entire systems without leaving the keyboard.

The terminal is not nostalgia. It is efficiency.
    `,
  },

  {
    id: "ART-005",
    slug: "how-to-study-without-burning-out",
    category: "study",
    title: "How to Study Without Burning Out",
    date: "03 MAY 2026",
    excerpt:
      "Consistency matters more than intensity when building long-term learning habits.",
    content: `
Most students fail because they depend on motivation.

A better strategy is building systems:
small study sessions,
repeatable schedules,
and realistic goals.

Sustainable learning always beats temporary obsession.
    `,
  },

  {
    id: "ART-006",
    slug: "retro-games-and-modern-game-design",
    category: "games",
    title: "Retro Games and Modern Game Design",
    date: "28 APR 2026",
    excerpt:
      "Many modern mechanics were already perfected decades ago in older console generations.",
    content: `
Older games had strict hardware limitations.

Because of that, developers focused heavily on gameplay clarity and strong feedback loops.

Modern games still borrow these principles today.
    `,
  },

  {
    id: "ART-007",
    slug: "why-black-holes-distort-time",
    category: "science",
    title: "Why Black Holes Distort Time",
    date: "21 APR 2026",
    excerpt:
      "Understanding gravitational time dilation through black holes and extreme gravity.",
    content: `
Einstein's theory of relativity predicts that gravity affects time itself.

Near extremely massive objects like black holes, time slows down relative to distant observers.

What feels like minutes near a black hole could become years elsewhere.
    `,
  },

  {
    id: "ART-008",
    slug: "the-last-message-before-winter",
    category: "story",
    title: "The Last Message Before Winter",
    date: "14 APR 2026",
    excerpt:
      "A short fiction piece about isolation, radio silence, and survival.",
    content: `
The final transmission arrived during the storm.

No voice.
No coordinates.

Only one sentence repeated endlessly:

“Do not wait for spring.”
    `,
  },

  {
    id: "ART-009",
    slug: "why-typescript-feels-safer",
    category: "coding",
    title: "Why TypeScript Feels Safer for Large Projects",
    date: "07 APR 2026",
    excerpt:
      "Static typing helps developers maintain confidence as applications grow.",
    content: `
Large JavaScript projects become difficult to maintain without structure.

TypeScript introduces predictable contracts between parts of the application.

This reduces bugs and improves developer experience significantly.
    `,
  },
];
