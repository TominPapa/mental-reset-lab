# PROMPT_TEMPLATES.md — AI 생성 프롬프트 저장소 (Mental Reset Lab)

이 문서는 AI 생성기(Anthropic SDK)에서 사용할 **프롬프트와 출력 스키마**를 저장한다.

> ⚠️ **프롬프트와 스키마는 영어로 그대로(verbatim) 사용된다. 번역/수정하지 않는다.** 주변 설명만 한국어다.

근거: 마스터 기획서 13.1(출력 형식), 13.2(기본 프롬프트), 13.4(톤), 7.3(Shorts 구조).

---

## 1. 기본 생성 프롬프트 (기획서 13.2)

`{topic}`, `{category}`, `{targetAudience}`, `{tone}`, `{mainArgument}` 자리에 입력값을 치환해 사용한다.

```text
You are writing for English-speaking adults who want focus, discipline, and mental clarity in the AI era.

Topic:
{topic}

Category:
{category}

Target audience:
{targetAudience}

Tone:
{tone}

Main argument:
{mainArgument}

Write a concise, practical, non-medical mindset article.

Rules:
- Do not sound like generic motivation.
- Do not make medical or therapeutic claims.
- Avoid clichés like "believe in yourself" or "never give up."
- Include one uncomfortable truth.
- Include one practical mental framework.
- Include three actionable rules.
- End with one reflection question.
- Write in clear, natural English.
- Keep the article between 500 and 900 words.
- Return the result as valid JSON.
```

---

## 2. 기대 JSON 출력 스키마 (기획서 13.1)

모델은 자유 텍스트가 아니라 **유효한 JSON**으로 반환해야 한다. 저장 전 **zod로 검증**한다.

```json
{
  "title": "You Don't Need Motivation. You Need a System.",
  "slug": "you-dont-need-motivation-you-need-a-system",
  "seoTitle": "You Don't Need Motivation. You Need a System",
  "metaDescription": "A short mental framework for building discipline when motivation disappears.",
  "category": "Self-Mastery",
  "tags": ["discipline", "motivation", "systems"],
  "oneLineInsight": "Motivation is unstable. Systems keep moving when your mood changes.",
  "articleBody": "...",
  "practicalRules": [
    "Make the action smaller.",
    "Remove one source of friction.",
    "Repeat before you judge yourself."
  ],
  "reflectionQuestion": "What is one action you can make too small to avoid today?",
  "shortsScript": "...",
  "youtubeTitles": ["..."],
  "thumbnailTexts": ["..."],
  "socialPosts": ["..."]
}
```

### 필드 → DB 매핑 메모

- `title, slug, seoTitle, metaDescription, category, tags, oneLineInsight, articleBody, practicalRules, reflectionQuestion` → `articles` 테이블
  (`seoTitle`→`seo_title`, `metaDescription`→`meta_description`, `oneLineInsight`→`one_line_insight`, `articleBody`→`body`, `practicalRules`→`practical_rules`, `reflectionQuestion`→`reflection_question`)
- `shortsScript, youtubeTitles, thumbnailTexts, socialPosts` → `content_assets` 테이블
  (`shortsScript`→`shorts_script`, `youtubeTitles`→`youtube_titles`, `thumbnailTexts`→`thumbnail_texts`, `socialPosts`→`social_posts`)

---

## 3. 톤 옵션 (기획서 13.4)

`{tone}` 에 넣을 수 있는 값:

```text
Calm but direct
Stoic
Founder-focused
Practical
Harsh truth
Reflective
```

Default:

```text
Calm but direct
```

---

## 4. Shorts 대본 구조 (기획서 7.3)

길이: **30–45초**. `shortsScript` 생성 시 다음 구조를 따른다.

```text
Hook: 1-3s
Problem: 5-8s
Core insight: 8-12s
3 rules: 15-20s
Reflection / CTA: 3-5s
```

예시 출력:

```text
You don't need more motivation.
You need a system that works when motivation disappears.

Motivation is unstable.
It changes with sleep, stress, and mood.

A system is different.
It tells you what to do next even when you don't feel ready.

Make the action smaller.
Remove one source of friction.
Repeat before you judge yourself.

Today, don't ask how you feel.
Ask what the next small action is.
```

---

## 5. 생성 후 처리 규칙

- 출력 JSON은 **zod 스키마로 검증** 후 저장한다 (실패 시 재시도 또는 관리자에게 오류 표시).
- 본문/제목/메타에 **금지 표현**(`CONTENT_GUIDE.md` 5장)이 있으면 관리자 검수 화면에서 하이라이트한다.
- AI 생성물은 **즉시 공개 발행하지 않는다.** 항상 관리자 검수 후 발행/예약한다 (기획서 14.2).
