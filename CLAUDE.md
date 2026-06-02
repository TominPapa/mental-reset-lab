# CLAUDE.md — Mental Reset Lab 개발 규칙

이 문서는 **Claude Code가 이 저장소에서 작업할 때 지켜야 할 규칙**이다.
모든 결정의 최종 기준은 마스터 기획서(`../mental_reset_lab_master_plan.md`)다. 충돌이 있으면 기획서가 우선한다.

---

## 1. 프로젝트 한 줄 정의

> Short mental frameworks for focus, discipline, and clear decisions in the AI age.

AI 시대를 살아가는 영어권 사용자를 위한 **집중력 · 자기통제 · 실행력 중심의 짧고 실용적인 영어 마인드셋 콘텐츠 허브**다.

핵심 목표(기획서 0/1장):

- 영어권 마인드셋 콘텐츠를 **자체 허브에 누적**한다.
- 유튜브 채널로 유입시킨다.
- 반응 데이터를 모아 향후 디지털 상품/앱으로 확장한다.
- 초기에는 수익이 아니라 **반복 가능한 생산 시스템 + 영어권 반응 검증**이 목표다.

이 프로젝트는 "대량 자동 발행 시스템"이 아니라 **AI 생성 + 관리자 검수 + 자체 사이트 예약 발행** 구조다.

---

## 2. 기술 스택

| 영역 | 사용 기술 |
|---|---|
| 프레임워크 | **Next.js 16 (App Router)** |
| 언어 | **TypeScript** |
| 스타일링 | **Tailwind CSS v4 (CSS 기반 설정)** |
| DB / 인증 | **Supabase** (`@supabase/ssr`, `@supabase/supabase-js`) |
| AI 생성 | **Anthropic SDK** (`@anthropic-ai/sdk`) |
| 검증 | **zod** (JSON 스키마 파싱/검증) |
| 본문 렌더링 | `react-markdown` + `remark-gfm` |
| 배포 | **Vercel** |

### Tailwind CSS v4 주의

- **`tailwind.config.js` 파일을 만들지 않는다.** Tailwind v4는 CSS 기반 설정을 쓴다.
- 설정은 `app/globals.css`에서 한다:
  - `@import "tailwindcss";`
  - `@theme { ... }` 블록 안에서 토큰(색상, 폰트, 간격 등)을 정의한다.
- PostCSS는 `@tailwindcss/postcss` 플러그인을 쓴다 (`postcss.config.mjs`).
- 새 디자인 토큰이 필요하면 `@theme`에 추가한다. JS config로 되돌리지 않는다.

> 주의: 이 버전의 Next.js는 학습 데이터와 동작이 다를 수 있다. 확신이 없으면 코드를 쓰기 전에 `node_modules/next/dist/docs/`의 관련 문서를 확인한다.

---

## 3. 핵심 코딩 컨벤션

- **App Router** 기준으로만 작성한다 (`app/` 디렉터리). `pages/`를 만들지 않는다.
- **동적 라우트 params는 비동기다.** Next.js 16에서 `params`/`searchParams`는 Promise다.
  ```ts
  export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    // ...
  }
  ```
- **기본은 서버 컴포넌트다.** `"use client"`는 상태/이벤트/브라우저 API가 꼭 필요할 때만 붙인다.
- 데이터 패칭은 서버 컴포넌트 / 서버 액션 / route handler에서 한다.
- **Supabase 키 분리:**
  - 공개 읽기 / 인증은 `anon` 키 + `@supabase/ssr` 쿠키 기반 클라이언트.
  - **`service_role` 키는 서버 전용 코드에서만 사용한다.** 절대 클라이언트 번들에 들어가면 안 된다.
- 환경변수는 `.env.local`에 둔다. 비밀키는 커밋하지 않는다. 브라우저 노출이 필요한 값만 `NEXT_PUBLIC_` 접두사를 쓴다.
- AI 생성 출력은 **항상 zod로 검증**한 뒤 DB에 저장한다 (스키마는 `PROMPT_TEMPLATES.md` 참조).
- 메타데이터는 Next.js Metadata API로 구현한다 (`SEO_RULES.md` 참조).

---

## 4. MVP 범위 가드레일 (반드시 준수)

다음은 **MVP에서 절대 구현하지 않는다** (기획서 10.2 / 14.2):

- ❌ YouTube 업로드 API (videos.insert 등 자동 업로드)
- ❌ 외부 블로그 자동 발행 (Medium / Blogger / WordPress.com 등)
- ❌ 결제 / 구독 결제
- ❌ 일반 사용자 회원가입 — **관리자는 단일 계정**이다
- ❌ 댓글 / 커뮤니티 / DM 자동화
- ❌ 전체 다국어 지원 (초기에는 영어 단일 사이트)

자동화는 **자체 사이트 내부 예약 발행에만** 한정한다. AI 생성물은 항상 관리자 검수를 거쳐 발행한다.

범위를 벗어나는 기능 요청을 받으면, 구현 전에 MVP 범위 밖임을 알리고 확인을 받는다.

---

## 5. 폴더 구조 개요

```text
mental-reset-lab/
├── app/                 # App Router (페이지/레이아웃/route handler/server actions)
│   ├── globals.css      # Tailwind v4 @import + @theme 설정
│   ├── layout.tsx       # 루트 레이아웃 (html lang="en")
│   ├── page.tsx         # 홈 (/)
│   ├── articles/        # /articles, /articles/[slug]
│   ├── categories/      # /categories/[category]
│   ├── frameworks/      # /frameworks, /frameworks/[slug]
│   ├── watch/           # /watch
│   ├── about/           # /about
│   └── admin/           # 관리자 (단일 계정 로그인, 글 CRUD, AI 생성)
├── lib/                 # Supabase 클라이언트, AI 생성 로직, 검증 스키마, 유틸
├── components/          # 재사용 UI 컴포넌트
├── supabase/            # DB 마이그레이션 / SQL 스키마
└── public/              # 정적 파일
```

라우트 전체 맵은 기획서 8.2 / 11장 참조.

---

## 6. 다른 가이드 문서

| 파일 | 역할 |
|---|---|
| `AGENTS.md` | Codex 등 다른 AI 에이전트 공통 규칙 |
| `CONTENT_GUIDE.md` | 콘텐츠 톤 / 글 구조 / 금지 표현 / 좋고 나쁜 문장 예시 |
| `SEO_RULES.md` | SEO 제목 / slug / 메타 / 내부링크 / 스키마 규칙 |
| `PROMPT_TEMPLATES.md` | AI 생성 프롬프트 및 JSON 출력 스키마 |
| `PROJECT_SPEC.md` | 제품/기능 명세, DB 설계, 로드맵 (코딩 기준 문서) |

새 기능을 코딩하기 전에 `PROJECT_SPEC.md`에서 해당 기능 ID(F-00x / A-00x)와 우선순위를 확인한다.
