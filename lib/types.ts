// Data model types — mirror the Supabase schema in supabase/schema.sql.
import type { ArticleStatus } from "./constants";

export type { ArticleStatus };

export interface Article {
  id: string;
  title: string;
  slug: string;
  seo_title: string | null;
  meta_description: string | null;
  category: string;
  tags: string[];
  body: string; // markdown
  summary: string | null;
  one_line_insight: string | null;
  practical_rules: string[]; // jsonb array of strings
  reflection_question: string | null;
  youtube_url: string | null;
  status: ArticleStatus;
  published_at: string | null; // ISO timestamp
  created_at: string;
  updated_at: string;
}

export interface ContentAsset {
  id: string;
  article_id: string;
  shorts_script: string | null;
  youtube_titles: string[];
  thumbnail_texts: string[];
  social_posts: string[];
  video_prompt: string | null;
  description_draft: string | null;
  created_at: string;
}

export interface Framework {
  id: string;
  title: string;
  slug: string;
  statement: string;
  explanation: string | null;
  category: string;
  tags: string[];
  source_article_id: string | null;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
}

export interface PerformanceLog {
  id: string;
  article_id: string;
  youtube_views: number;
  article_views: number;
  search_impressions: number;
  search_clicks: number;
  notes: string | null;
  logged_at: string;
}

export interface TopicIdea {
  id: string;
  topic: string;
  category: string | null;
  source: string | null; // "manual" | "comment" | "search" | "ai" ...
  priority: number;
  status: "new" | "used" | "ignored";
  notes: string | null;
  created_at: string;
}

export interface Subscriber {
  id: string;
  email: string;
  source: string | null;
  confirmed: boolean;
  created_at: string;
}

// Shape returned by the AI generator (master plan §13.1) before it is
// mapped onto Article + ContentAsset rows.
export interface GeneratedContent {
  title: string;
  slug: string;
  seoTitle: string;
  metaDescription: string;
  category: string;
  tags: string[];
  oneLineInsight: string;
  summary: string;
  articleBody: string;
  practicalRules: string[];
  reflectionQuestion: string;
  shortsScript: string;
  youtubeTitles: string[];
  thumbnailTexts: string[];
  socialPosts: string[];
  descriptionDraft: string;
  videoPrompt: string;
}
