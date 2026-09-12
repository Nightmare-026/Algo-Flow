export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}

export interface VisualizerDeepLink {
  slug: string;
  title: string;
  description: string;
}

export interface LearningChapter {
  id: string;
  title: string;
  slug: string;
  fileName: string;
  folderName: string;
  order: number;
  description: string;
  topicsCovered: string[];
  visualizerLinks?: VisualizerDeepLink[];
}

export interface LearningModule {
  id: string;
  partNumber: number;
  slug: string;
  title: string;
  folderName: string;
  shortDescription: string;
  iconName: string;
  colorTone: "emerald" | "sky" | "purple" | "amber" | "indigo" | "rose" | "teal" | "blue";
  chapters: LearningChapter[];
}

export interface ChapterNavigation {
  previous: {
    moduleSlug: string;
    chapterSlug: string;
    title: string;
  } | null;
  next: {
    moduleSlug: string;
    chapterSlug: string;
    title: string;
  } | null;
}

export interface ParsedChapterContent {
  rawMarkdown: string;
  htmlContent: string;
  tableOfContents: TableOfContentsItem[];
  readingTimeMinutes: number;
  wordCount: number;
}
