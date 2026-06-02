-- ─────────────────────────────────────────────────────────────
-- Mental Reset Lab — database schema
-- Run this in the Supabase SQL editor (or `supabase db push`).
-- Master plan §12.
--
-- Visibility rule (used by the public site everywhere):
--   status IN ('published','scheduled') AND published_at <= now()
-- A "scheduled" row with a future published_at stays hidden until its
-- time arrives, even if the revalidation cron never runs.
-- ─────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

-- updated_at auto-touch ------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- articles ------------------------------------------------------------------
create table if not exists public.articles (
  id                  uuid primary key default gen_random_uuid(),
  title               text not null,
  slug                text not null unique,
  seo_title           text,
  meta_description    text,
  category            text not null,
  tags                text[] not null default '{}',
  body                text not null default '',
  summary             text,
  one_line_insight    text,
  practical_rules     jsonb not null default '[]'::jsonb,
  reflection_question text,
  youtube_url         text,
  status              text not null default 'draft'
                        check (status in ('draft','published','scheduled','archived')),
  published_at        timestamptz,
  summary_ko          text,          -- Korean summary for admin oversight
  review              jsonb,         -- AI editor verdict {approved, score, issues, reason}
  auto_generated      boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists articles_status_published_at_idx
  on public.articles (status, published_at desc);
create index if not exists articles_category_idx on public.articles (category);
create index if not exists articles_tags_idx on public.articles using gin (tags);

drop trigger if exists articles_set_updated_at on public.articles;
create trigger articles_set_updated_at
  before update on public.articles
  for each row execute function public.set_updated_at();

-- content_assets ------------------------------------------------------------
create table if not exists public.content_assets (
  id                uuid primary key default gen_random_uuid(),
  article_id        uuid not null references public.articles (id) on delete cascade,
  shorts_script     text,
  youtube_titles    jsonb not null default '[]'::jsonb,
  thumbnail_texts   jsonb not null default '[]'::jsonb,
  social_posts      jsonb not null default '[]'::jsonb,
  video_prompt      text,
  description_draft text,
  created_at        timestamptz not null default now()
);

create index if not exists content_assets_article_id_idx
  on public.content_assets (article_id);

-- frameworks ----------------------------------------------------------------
create table if not exists public.frameworks (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  slug              text not null unique,
  statement         text not null,
  explanation       text,
  category          text not null,
  tags              text[] not null default '{}',
  source_article_id uuid references public.articles (id) on delete set null,
  status            text not null default 'draft'
                      check (status in ('draft','published')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists frameworks_status_idx on public.frameworks (status);
create index if not exists frameworks_category_idx on public.frameworks (category);

drop trigger if exists frameworks_set_updated_at on public.frameworks;
create trigger frameworks_set_updated_at
  before update on public.frameworks
  for each row execute function public.set_updated_at();

-- performance_logs ----------------------------------------------------------
create table if not exists public.performance_logs (
  id                  uuid primary key default gen_random_uuid(),
  article_id          uuid not null references public.articles (id) on delete cascade,
  youtube_views       integer not null default 0,
  article_views       integer not null default 0,
  search_impressions  integer not null default 0,
  search_clicks       integer not null default 0,
  notes               text,
  logged_at           timestamptz not null default now()
);

create index if not exists performance_logs_article_id_idx
  on public.performance_logs (article_id);

-- topic_ideas ---------------------------------------------------------------
create table if not exists public.topic_ideas (
  id          uuid primary key default gen_random_uuid(),
  topic       text not null,
  category    text,
  source      text,
  priority    integer not null default 0,
  status      text not null default 'new' check (status in ('new','used','ignored')),
  notes       text,
  created_at  timestamptz not null default now()
);

create index if not exists topic_ideas_status_idx on public.topic_ideas (status);

-- subscribers (email capture from day one) ---------------------------------
create table if not exists public.subscribers (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  source      text, -- e.g. "home", "article:slug"
  confirmed   boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- Row Level Security
-- Anonymous visitors: read published/scheduled-and-due content only.
-- Authenticated (the single admin): full access.
-- Server-side writes use the service role key, which bypasses RLS.
-- ─────────────────────────────────────────────────────────────
alter table public.articles         enable row level security;
alter table public.content_assets   enable row level security;
alter table public.frameworks       enable row level security;
alter table public.performance_logs enable row level security;
alter table public.topic_ideas      enable row level security;
alter table public.subscribers      enable row level security;

-- articles: public read of live content
drop policy if exists "articles_public_read" on public.articles;
create policy "articles_public_read" on public.articles
  for select to anon
  using (
    status in ('published','scheduled')
    and published_at is not null
    and published_at <= now()
  );

-- articles: admin full access
drop policy if exists "articles_admin_all" on public.articles;
create policy "articles_admin_all" on public.articles
  for all to authenticated using (true) with check (true);

-- frameworks: public read of published
drop policy if exists "frameworks_public_read" on public.frameworks;
create policy "frameworks_public_read" on public.frameworks
  for select to anon using (status = 'published');

drop policy if exists "frameworks_admin_all" on public.frameworks;
create policy "frameworks_admin_all" on public.frameworks
  for all to authenticated using (true) with check (true);

-- content_assets / performance_logs / topic_ideas: admin only
drop policy if exists "content_assets_admin_all" on public.content_assets;
create policy "content_assets_admin_all" on public.content_assets
  for all to authenticated using (true) with check (true);

drop policy if exists "performance_logs_admin_all" on public.performance_logs;
create policy "performance_logs_admin_all" on public.performance_logs
  for all to authenticated using (true) with check (true);

drop policy if exists "topic_ideas_admin_all" on public.topic_ideas;
create policy "topic_ideas_admin_all" on public.topic_ideas
  for all to authenticated using (true) with check (true);

-- subscribers: writes go through the service role (API route); admin can read.
drop policy if exists "subscribers_admin_all" on public.subscribers;
create policy "subscribers_admin_all" on public.subscribers
  for all to authenticated using (true) with check (true);
