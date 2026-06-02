# SEO_RULES.md — SEO 설계 규칙 (Mental Reset Lab)

근거: 마스터 기획서 20장(SEO 설계).
구현은 Next.js Metadata API + route handler 기반으로 한다.

---

## 1. 기본 원칙 (기획서 20.1)

- 영어 콘텐츠 중심.
- **하나의 도메인에 집중** (`mentalresetlab.com`). 여러 사이트를 만들지 않는다.
- 제목은 짧고 명확하게.
- slug는 사람이 읽을 수 있게.
- 각 글에 **관련 글 2개 이상** 연결.
- sitemap 자동 생성.
- RSS 제공.
- Article schema 적용. 영상 연결 시 VideoObject schema 추가.

---

## 2. 언어 설정 (기획서 20.2)

- 초기에는 **영어 단일 사이트**로 간다.
- 루트 레이아웃에 반드시:

```html
<html lang="en">
```

- 다국어는 2단계 이후 검토 (`/en/...`, `/ko/...`). MVP에서는 구현하지 않는다.
- Google은 HTML lang/hreflang만으로 언어를 판단하지 않고 콘텐츠 자체로 판단한다. 따라서 **제목·본문·URL·사이트 전체 맥락이 영어권 기준**이어야 한다.

---

## 3. SEO 제목 규칙

- 짧고 명확하게. 과장 금지 (`CONTENT_GUIDE.md` 금지 표현 준수).
- `articles.seo_title` 필드에 저장. 표시 제목(`title`)과 다를 수 있다 (예: 끝의 마침표 제거).
- 가능하면 핵심 키워드를 앞쪽에 둔다.

예시 (기획서 20.4):

```text
표시 Title:    You Don't Need Motivation. You Need a System.
SEO Title:     You Don't Need Motivation. You Need a System
```

---

## 4. Slug 규칙

- **사람이 읽을 수 있게**, **kebab-case**, **전부 소문자**.
- 영문/숫자/하이픈만 사용. 공백·특수문자·아포스트로피 제거. 연속 하이픈 금지.
- 표시 제목에서 자동 생성하되 관리자가 수정 가능.
- `articles.slug` 는 **unique**.

예시 (기획서 20.3):

```text
/articles/you-dont-need-motivation-you-need-a-system
/articles/ai-is-not-the-threat-your-lack-of-direction-is
/articles/protect-your-attention-like-money
/articles/confidence-is-evidence-not-a-feeling
```

---

## 5. Meta description 규칙

- 길이 **140–160자** 권장 (기획서 14.3 발행 전 체크리스트).
- 글의 핵심 가치를 한 문장으로. 클릭베이트/과장 금지.
- `articles.meta_description` 에 저장.

예시 (기획서 20.4):

```text
A short mental framework for building discipline when motivation disappears. Learn how to make action easier, smaller, and repeatable.
```

---

## 6. 내부 링크 규칙

- 각 글은 **관련 글 2개 이상**과 연결한다 (기획서 6.2 / 14.3 / 20.1).
- 같은 카테고리 또는 같은 태그 기준으로 자동 추천하되, 관리자가 조정 가능.
- 글 상세 페이지 하단의 "Related Articles" 섹션으로 노출.
- 본문 내에서도 자연스러운 문맥 링크를 권장.

---

## 7. Sitemap / RSS

- `sitemap.xml`: `app/sitemap.ts` (Next.js MetadataRoute.Sitemap)로 자동 생성. **status = published** 이고 `published_at <= now()` 인 글/프레임워크만 포함.
- `robots.txt`: `app/robots.ts`. `/admin` 은 disallow.
- RSS feed: route handler(예: `app/feed.xml/route.ts`)로 최신 발행 글 제공.
- 예약 글(미래 `published_at`)과 draft는 sitemap/RSS/공개 목록에 노출하지 않는다.

---

## 8. 구조화 데이터 (JSON-LD)

### Article schema (모든 글)

`headline`, `description`, `datePublished`, `dateModified`, `author`, `mainEntityOfPage` 등을 포함한 `Article` JSON-LD를 글 상세 페이지에 삽입한다.

### VideoObject schema (영상이 연결된 글)

`articles.youtube_url` 이 있을 때만 `VideoObject` JSON-LD를 추가한다. `name`, `description`, `thumbnailUrl`, `uploadDate`, `embedUrl` 포함.

---

## 9. 분석 연동

- Google Analytics 연결 (기획서 9.1 / 10.1).
- Google Search Console 등록 가능한 구조 (sitemap 제출, 검증 메타/파일).
