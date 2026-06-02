# CONTENT_GUIDE.md — 콘텐츠 가이드 (Mental Reset Lab)

이 문서는 Mental Reset Lab의 **콘텐츠 톤, 구조, 원칙, 금지 표현, 문장 예시**를 정의한다.

> ⚠️ **언어 규칙**: 아래의 실제 규칙·금지 표현 목록·문장 예시는 **영어로 작성된 그대로(verbatim)** 콘텐츠 생성에 사용된다. 따라서 영어 부분은 절대 번역하거나 수정하지 않는다. 주변 설명만 한국어다.

근거: 마스터 기획서 5장(포지셔닝), 6장(콘텐츠 전략), 7장(콘텐츠 포맷), 13.3장(금지 표현).

---

## 1. 포지셔닝 (기획서 5장)

**가야 할 포지션:** AI 시대에 집중력·자기통제·실행력을 유지하기 위한 짧고 실용적인 사고 프레임워크.

**되면 안 되는 것:** 명언 모음 사이트, 심리치료/상담, 종교/영성, 흔한 자기계발 블로그, AI가 찍어낸 동기부여 글 저장소.

핵심 톤(영어로 사용):

- Calm but direct
- Realistic
- Includes a slightly uncomfortable truth
- Action-oriented
- No exaggeration
- No therapeutic / medical claims

> 영어 표현 주의: 한국어 "마인드컨트롤"은 자기통제 의미지만 영어 `mind control`은 세뇌/조작의 부정적 뉘앙스다. 메인 키워드는 **Mental Reset, Self-Mastery, Mindset Training, Emotional Self-Control, Inner Discipline, Mental Clarity, AI-Era Mindset, Daily Mental Frameworks**를 쓴다.

---

## 2. 6개 카테고리 (기획서 6.1)

| 한국어 | 영어명 (사용값) | 설명 |
|---|---|---|
| AI 시대 생존 마인드 | `AI-Era Mindset` | AI 시대의 불안, 방향성, 실행력 |
| 자기통제 | `Self-Mastery` | 습관, 절제, 일관성 |
| 감정 정리 | `Emotional Clarity` | 감정에 휘둘리지 않는 사고법 |
| 집중력 | `Focus Systems` | 산만함, 스마트폰, 몰입 |
| 창업자 멘탈 | `Founder Mindset` | 1인 창업, 실패, 불확실성 |
| 실행 시스템 | `Action Systems` | 동기부여보다 시스템 |

DB의 `category` 필드에는 위 **영어명**을 그대로 저장한다.

---

## 3. 웹 아티클 구조 (기획서 7.1)

권장 길이: **500–900 words**

```text
1. Title
2. One-line insight
3. Short intro
4. Core argument
5. Uncomfortable truth
6. Mental framework
7. 3 practical rules
8. Reflection question
9. Related YouTube video
10. Related articles
11. YouTube channel CTA
```

---

## 4. 콘텐츠 원칙 — "최소 4개 이상 포함" (기획서 6.2)

Every piece of content must include **at least 4** of the following elements:

- One clear argument
- One uncomfortable truth
- One practical framework
- 3 concrete action rules
- Who should NOT do this / a wrong approach to avoid
- 1 reflection question
- A link to a related YouTube video
- 2 or more related articles

### 피해야 할 콘텐츠 (기획서 6.3)

- Generic quotes like "Believe in yourself"
- Generic motivation like "Never give up"
- Unfounded scientific claims
- Sentences implying therapeutic effects
- Mental-health diagnosis / treatment language
- Overly smooth, obviously AI-written prose
- Rehashed articles that only swap the topic

---

## 5. 금지 / 주의 표현 (기획서 13.3) — BANNED & CAUTION PHRASES

> 아래 영어 문자열은 **금지 표현 검사(banned-phrase check)** 에 그대로 사용된다. 수정 금지.

```text
cure anxiety
treat depression
heal trauma
guaranteed success
scientifically proven
secret formula
never fail
always works
change your life forever
therapy
clinical
trauma healing
mental illness treatment
```

생성/검수 시 본문·제목·메타에 위 표현이 있으면 발행 전에 제거하거나 다시 쓴다.

선택적 면책 문구(필요 시 사용, 기획서 22.5):

```text
This content is for self-management and personal reflection only. It is not medical, psychological, or therapeutic advice.
```

---

## 6. 톤 옵션 (기획서 13.4) — TONE OPTIONS

```text
Calm but direct
Stoic
Founder-focused
Practical
Harsh truth
Reflective
```

Default tone:

```text
Calm but direct
```

---

## 7. 좋은 / 나쁜 문장 예시 (기획서 6.4) — GOOD / BAD EXAMPLES

❌ Bad:

```text
Believe in yourself and never give up.
```

✅ Good:

```text
Confidence is not a feeling. It is evidence you build by keeping small promises.
```

❌ Bad:

```text
AI will change everything. You must adapt.
```

✅ Good:

```text
AI is not the threat. A vague direction is. Tools only multiply the clarity you already have.
```

---

## 8. 예시 제목 (기획서 7.2) — EXAMPLE TITLES

```text
You Don't Need Motivation. You Need a System.
AI Is Not the Threat. Your Lack of Direction Is.
Discipline Is Not Intensity. It Is Consistency.
Stop Negotiating With Your Weaker Self.
Protect Your Attention Like Money.
Confidence Is Evidence, Not a Feeling.
Your Future Is Built by Boring Repetitions.
Clarity Comes After Action, Not Before.
Your Phone Is Training Your Brain Against You.
Make the Task Too Small to Avoid.
```
