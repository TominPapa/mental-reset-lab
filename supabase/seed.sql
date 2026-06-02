-- ─────────────────────────────────────────────────────────────
-- Mental Reset Lab — seed data (optional, for local/demo preview)
-- Run AFTER schema.sql. Safe to re-run: uses ON CONFLICT guards where unique.
-- ─────────────────────────────────────────────────────────────

-- 30-day topic backlog (master plan §24) -----------------------------------
insert into public.topic_ideas (topic, category, source, priority, status) values
  ('You Don''t Need Motivation. You Need a System.', 'Taking Action', 'manual', 10, 'used'),
  ('AI Is Not the Threat. Your Lack of Direction Is.', 'AI-Era Mindset', 'manual', 10, 'used'),
  ('Discipline Is Not Intensity. It Is Consistency.', 'Self-Mastery', 'manual', 9, 'new'),
  ('Stop Negotiating With Your Weaker Self.', 'Self-Mastery', 'manual', 8, 'new'),
  ('Protect Your Attention Like Money.', 'Focus & Attention', 'manual', 9, 'new'),
  ('Confidence Is Evidence, Not a Feeling.', 'Self-Mastery', 'manual', 8, 'new'),
  ('Your Future Is Built by Boring Repetitions.', 'Taking Action', 'manual', 7, 'new'),
  ('Clarity Comes After Action, Not Before.', 'Taking Action', 'manual', 8, 'new'),
  ('Your Phone Is Training Your Brain Against You.', 'Focus & Attention', 'manual', 9, 'new'),
  ('Make the Task Too Small to Avoid.', 'Taking Action', 'manual', 8, 'new'),
  ('The Easiest Life Is Usually the Most Expensive One.', 'Self-Mastery', 'manual', 6, 'new'),
  ('You Are Not Lazy. Your System Is Too Vague.', 'Taking Action', 'manual', 7, 'new'),
  ('Focus Is a Boundary, Not a Mood.', 'Focus & Attention', 'manual', 7, 'new'),
  ('Stop Waiting to Feel Ready.', 'Taking Action', 'manual', 7, 'new'),
  ('Your Environment Is Stronger Than Your Willpower.', 'Focus & Attention', 'manual', 8, 'new'),
  ('Small Promises Build Self-Respect.', 'Self-Mastery', 'manual', 7, 'new'),
  ('The Algorithm Is Training Your Attention.', 'AI-Era Mindset', 'manual', 7, 'new'),
  ('You Don''t Need More Advice. You Need Repetition.', 'Taking Action', 'manual', 6, 'new'),
  ('Direction Beats Speed.', 'Resilience', 'manual', 7, 'new'),
  ('Action Creates Clarity.', 'Taking Action', 'manual', 6, 'new'),
  ('Boredom Is Where Discipline Begins.', 'Self-Mastery', 'manual', 6, 'new'),
  ('Your Weakest Habit Sets the Ceiling.', 'Self-Mastery', 'manual', 6, 'new'),
  ('Don''t Optimize What You Haven''t Repeated.', 'Resilience', 'manual', 6, 'new'),
  ('The Cost of Comfort Compounds.', 'Self-Mastery', 'manual', 6, 'new'),
  ('Your Calendar Shows Your Real Priorities.', 'Focus & Attention', 'manual', 6, 'new'),
  ('The First Win Should Be Too Easy.', 'Taking Action', 'manual', 6, 'new'),
  ('Stop Measuring Your Life by Your Mood.', 'Emotional Clarity', 'manual', 7, 'new'),
  ('A Clear No Protects a Better Yes.', 'Emotional Clarity', 'manual', 6, 'new'),
  ('Consistency Is Built Before Crisis.', 'Self-Mastery', 'manual', 6, 'new'),
  ('Build Systems Your Tired Self Can Follow.', 'Taking Action', 'manual', 8, 'new')
on conflict do nothing;

-- Sample published articles -------------------------------------------------
insert into public.articles
  (title, slug, seo_title, meta_description, category, tags, body, summary,
   one_line_insight, practical_rules, reflection_question, status, published_at)
values
(
  'You Don''t Need Motivation. You Need a System.',
  'you-dont-need-motivation-you-need-a-system',
  'You Don''t Need Motivation. You Need a System',
  'A short mental framework for building discipline when motivation disappears. Learn how to make action easier, smaller, and repeatable.',
  'Taking Action',
  array['discipline','motivation','systems'],
  E'Most people wait to feel motivated. Then they wonder why nothing changes.\n\nMotivation is a feeling, and feelings are unstable. They move with your sleep, your stress, and your mood. If your progress depends on a feeling, your progress will be as inconsistent as the feeling is.\n\n## The uncomfortable truth\n\nYou will not feel like it most days. That is not a character flaw. That is the normal state of being a person with a life. Building anything real means doing it on the days you do not want to.\n\n## A system does the deciding for you\n\nA system is a pre-made decision. It tells you what to do next before your mood gets a vote. You do not negotiate with it. You just follow it, especially when you feel resistance.\n\nThe goal is not to feel more motivated. The goal is to need less motivation to act.\n\n## Three rules\n\n1. **Make the action smaller.** Shrink it until it is too small to refuse. Two pushups. One sentence. Five minutes.\n2. **Remove one source of friction.** Lay out the clothes. Close the tab. Put the phone in another room.\n3. **Repeat before you judge yourself.** Do not evaluate a system you have run three times. Evaluate one you have run thirty.\n\nMotivation is a nice bonus. It is a terrible foundation.',
  'Motivation is unstable. A system tells you what to do next even when your mood does not cooperate.',
  'Motivation is unstable. Systems keep moving when your mood changes.',
  '["Make the action smaller.","Remove one source of friction.","Repeat before you judge yourself."]'::jsonb,
  'What is one action you can make too small to avoid today?',
  'published',
  now() - interval '5 days'
),
(
  'AI Is Not the Threat. Your Lack of Direction Is.',
  'ai-is-not-the-threat-your-lack-of-direction-is',
  'AI Is Not the Threat. Your Lack of Direction Is',
  'AI does not replace direction — it amplifies it. A practical mindset for staying valuable in the AI era without the anxiety.',
  'AI-Era Mindset',
  array['ai','focus','direction'],
  E'The anxiety sounds like this: *AI will make me irrelevant.* It is loud, and it is mostly misdirected.\n\n## The uncomfortable truth\n\nAI multiplies whatever clarity you already have. If your direction is vague, AI helps you produce vague work faster. If your direction is sharp, AI helps you move faster toward something real. The tool is neutral. The direction is not.\n\n## Vagueness is the actual risk\n\nMost people are not threatened by a smarter tool. They are threatened by their own lack of a clear question. They ask the model to "help me with my career" and get noise back, because they handed it noise.\n\nThe skill that compounds in the AI era is not prompting. It is knowing what you are actually trying to do.\n\n## Three rules\n\n1. **Write the goal in one sentence before opening any tool.** If you cannot, that is the work.\n2. **Use AI to remove grunt work, not to outsource thinking.** Keep the judgment; delegate the typing.\n3. **Check the output against your direction, not against how impressive it sounds.** Polished and wrong is still wrong.\n\nThe people who struggle will not be the ones who refused AI. They will be the ones who never decided where they were going.',
  'AI amplifies direction. Sharpen the direction and the tool becomes leverage instead of a threat.',
  'AI is not the threat. A vague direction is. Tools only multiply the clarity you already have.',
  '["Write the goal in one sentence before opening any tool.","Use AI to remove grunt work, not to outsource thinking.","Check the output against your direction, not how impressive it sounds."]'::jsonb,
  'What is the one sentence that describes what you are actually trying to build?',
  'published',
  now() - interval '2 days'
)
on conflict (slug) do nothing;

-- Sample frameworks ---------------------------------------------------------
insert into public.frameworks (title, slug, statement, explanation, category, tags, status)
values
  ('Confidence is evidence', 'confidence-is-evidence',
   'Confidence is not a feeling. It is evidence you build by keeping small promises.',
   'Stop waiting to feel confident. Make a small promise, keep it, repeat. Confidence is the residue of kept promises.',
   'Self-Mastery', array['confidence','habits'], 'published'),
  ('Direction over speed', 'direction-over-speed',
   'Direction beats speed. Fast in the wrong direction is just expensive.',
   'Before optimizing how fast you move, confirm you are pointed at something worth reaching.',
   'Resilience', array['direction','focus'], 'published'),
  ('Make it too small to avoid', 'make-it-too-small-to-avoid',
   'If you keep skipping it, the task is too big. Shrink it until refusing feels absurd.',
   'Two pushups. One sentence. The point is to win the start, not the session.',
   'Taking Action', array['habits','systems'], 'published'),
  ('Protect attention like money', 'protect-attention-like-money',
   'You budget your money. Budget your attention with the same seriousness.',
   'Every notification is a withdrawal. Decide what gets access before the day starts.',
   'Focus & Attention', array['attention','focus'], 'published')
on conflict (slug) do nothing;
