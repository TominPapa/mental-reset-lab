# Mental Reset Lab

영어권 마인드셋 콘텐츠 허브 MVP. **AI 생성 → 관리자 검수 → 자체 사이트 예약 발행** 구조.

- Next.js 16 (App Router) · TypeScript · Tailwind CSS v4
- Supabase (DB + 단일 관리자 인증) · Anthropic SDK (글/대본 생성)
- Vercel 배포 + Vercel Cron(예약 발행)

설계 기준 문서: `PROJECT_SPEC.md`, `CONTENT_GUIDE.md`, `SEO_RULES.md`, `PROMPT_TEMPLATES.md`, `CLAUDE.md`, `AGENTS.md`.
전체 기획: `../mental_reset_lab_master_plan.md`.

---

## 빠른 시작 (로컬)

```bash
npm install
cp .env.example .env.local   # 값 채우기 (아래 SETUP 참고)
npm run dev                  # http://localhost:3000
```

키 없이도 사이트는 뜬다(빈 상태). DB/AI 기능은 `.env.local`을 채워야 동작한다.

---

## SETUP — 본인이 직접 해야 하는 단계

코드는 준비됨. 아래는 **계정/키가 필요해 사람이 해야 하는 작업**이다. 순서대로.

### 1. Supabase 프로젝트
1. https://app.supabase.com 에서 새 프로젝트 생성.
2. **Project Settings → API** 에서 값 복사 → `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (서버 전용, 절대 노출 금지)
3. **SQL Editor** 에서 `supabase/schema.sql` 전체 실행.
4. (선택) `supabase/seed.sql` 실행 → 샘플 글/프레임워크/주제 30개.

### 2. 관리자 계정 (단일)
- Supabase **Authentication → Users → Add user** 로 본인 이메일/비밀번호 생성
  (이메일 확인 off 또는 confirm 처리).
- 이 계정으로 `/admin/login` 로그인 → 관리자 권한(RLS `authenticated`)을 가진다.

### 3. Anthropic API
- https://console.anthropic.com → API Keys → `.env.local`의 `ANTHROPIC_API_KEY`.
- 모델은 `ANTHROPIC_MODEL` (기본 `claude-sonnet-4-6`).

### 4. 사이트/유튜브 값
- `NEXT_PUBLIC_SITE_URL` (배포 도메인), `NEXT_PUBLIC_YOUTUBE_CHANNEL_URL` (채널 주소).

### 5. Vercel 배포
1. GitHub에 푸시 후 Vercel에서 import (또는 `vercel`).
2. `.env.local`의 모든 값을 Vercel **Environment Variables**에 등록.
3. `CRON_SECRET`에 긴 랜덤 문자열 등록 → `vercel.json`의 Cron이 매시 `/api/revalidate`를
   호출해 예약 글을 발행한다 (Vercel Cron은 `Authorization: Bearer <CRON_SECRET>` 자동 전송).

### 6. Google (검색/분석)
- **Search Console**: 도메인 등록 후 `https://<도메인>/sitemap.xml` 제출.
- **Analytics**: GA4 측정 ID를 `NEXT_PUBLIC_GA_ID`에 넣으면 자동 로드.

### 7. 도메인
- `mentalresetlab.com` (또는 확정 도메인) 구매 → Vercel 연결 → `NEXT_PUBLIC_SITE_URL` 갱신.

---

## 운영 흐름

1. `/admin/articles/new` 에서 주제 입력 → **Generate draft** (AI가 글 + 유튜브 패키지 생성).
2. 검수 화면에서 금지 표현 경고 확인, 본문/메타 수정.
3. **Save draft** / **Schedule**(날짜 지정) / **Publish**.
4. 예약 글은 시간이 지나면 공개 쿼리에 자동 노출되고, 매시 Cron이 상태를 `published`로 정리.

자세한 발행 전 체크리스트는 `PROJECT_SPEC.md` / 기획서 §14.3 참고.

---

## 스크립트

| 명령 | 설명 |
|---|---|
| `npm run dev` | 개발 서버 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 빌드 결과 실행 |
| `npm run lint` | ESLint |

## 라우트 요약

- 공개: `/`, `/articles`, `/articles/[slug]`, `/categories/[category]`, `/frameworks`, `/watch`, `/about`
- SEO: `/sitemap.xml`, `/robots.txt`, `/feed.xml`, OG 이미지 자동 생성
- 관리자: `/admin`, `/admin/articles`, `/admin/articles/new`, `/admin/articles/[id]/edit`
- API: `/api/generate`(관리자), `/api/subscribe`, `/api/revalidate`(Cron)
