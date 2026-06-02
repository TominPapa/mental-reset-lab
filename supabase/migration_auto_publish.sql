-- ─────────────────────────────────────────────────────────────
-- Migration: auto-publish pipeline support
-- Run this ONCE in the Supabase SQL editor (existing projects).
-- New projects get these columns from schema.sql automatically.
-- ─────────────────────────────────────────────────────────────

alter table public.articles
  add column if not exists summary_ko     text,
  add column if not exists review         jsonb,
  add column if not exists auto_generated boolean not null default false;
