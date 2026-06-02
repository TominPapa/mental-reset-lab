# PROJECT_SPEC.md — 제품/기능 명세 기준 문서 (Mental Reset Lab)

이 문서는 **코딩의 기준이 되는 압축 명세서**다. 전체 맥락은 마스터 기획서(`../mental_reset_lab_master_plan.md`)를 따른다.
관련 규칙: `CLAUDE.md`(개발), `CONTENT_GUIDE.md`(콘텐츠), `SEO_RULES.md`(SEO), `PROMPT_TEMPLATES.md`(프롬프트).

---

## 1. MVP 범위 (기획서 10장)

### 반드시 만들 것 (10.1)

공개 웹사이트 / 글 목록 / 글 상세 / 카테고리 페이지 / Frameworks 페이지 / 관리자 로그인 / 글 CRUD·발행 / AI 글 생성 / AI Shorts 대본 생성 / SEO 제목·메타 자동 생성 / 예약 발행 / sitemap.xml / robots.txt / RSS feed / Google Analytics 연결 / Search Console 등록용 구조 / 성과 수동 기록.

### 제외할 것 (10.2)

YouTube API 자동 업로드, 외부 블로그 자동 발행(Medium/Blogger/WordPress.com), 결제, 회원가입, 커뮤니티, 댓글, 앱 기능, 전체 다국어, 자동 댓글/DM.
관리자는 **단일 계정**.

---

## 2. 기능 목록 + 우선순위 (기획서 11장)

### 공개 사이트 (F-series)

| ID | 기능 | 경로 | 핵심 내용 | 우선순위 |
|---|---|---|---|---|
| **F-001** | 홈 페이지 | `/` | 최신 글, 추천 글, 카테고리 링크, Framework 카드, YouTube CTA | **P0** |
| **F-002** | 글 목록 | `/articles` | 발행 글 목록, 카테고리 필터, (2차)태그 필터, 페이지네이션/무한스크롤 | **P0** |
| **F-003** | 글 상세 | `/articles/[slug]` | 제목·메타·본문, 유튜브 임베드, 3 Practical Rules, Reflection Question, 관련 글, YouTube CTA, Open Graph | **P0** |
| **F-004** | 카테고리 | `/categories/[category]` | 해당 카테고리 글 목록, 카테고리 설명, 관련 Framework 카드 | P1 |
| **F-005** | Frameworks | `/frameworks` | 짧은 마인드셋 카드 목록, 카테고리 필터, (2차)개별 카드 페이지 | P1 |
| **F-006** | Watch | `/watch` | 유튜브 채널 소개, 대표 영상 임베드, 최신 영상 목록(수동 입력), 구독 CTA | P1 |

### 관리자 (A-series)

| ID | 기능 | 경로 | 핵심 내용 | 우선순위 |
|---|---|---|---|---|
| **A-001** | 관리자 로그인 | — | 관리자만 접근, 단일 계정 | **P0** |
| **A-002** | 대시보드 | `/admin` | 전체/발행/초안/예약 글 수, 최근 생성, 성과 좋은 콘텐츠, 오늘의 주제 후보 | P1 |
| **A-003** | 글 목록 관리 | `/admin/articles` | 목록, 상태 필터(draft/published/scheduled/archived), 카테고리 필터, 검색, 수정/삭제/발행 | **P0** |
| **A-004** | 새 콘텐츠 생성 | `/admin/articles/new` | 입력: Topic, Category, Target audience, Tone, Main argument, Avoided claims, (선택)Related YouTube URL, Publish date → AI 생성 결과 산출 | **P0** |
| **A-005** | 생성 결과 검수 | — | 미리보기, 금지 표현 하이라이트, 메타·본문 수정, 발행 상태 선택, 예약 일자 선택 | **P0** |
| **A-006** | 예약 발행 | — | `published_at`이 미래면 예약, 시간 경과 시 자동 공개. 외부 플랫폼 자동 발행 없음 | **P0** |
| **A-007** | 유튜브 패키지 생성 | — | Shorts 대본, 제목 후보 5개, 설명란 초안, 썸네일 문구 5개, 영상 프롬프트, 업로드 체크리스트 | P1 |
| **A-008** | 성과 기록 | — | 웹/유튜브 조회수, 검색 노출·클릭(초기 수동), 메모, 성과 점수 | P2 |

A-004 생성 결과 필드: Article title, SEO title, Meta description, Slug, Article body, Summary, 3 practical rules, Reflection question, Shorts script, YouTube title candidates, Thumbnail text candidates, Social post variants, Tags.

---

## 3. 데이터베이스 설계 (기획서 12장)

Supabase / PostgreSQL. `id`는 uuid PK, 시간 필드는 `timestamptz`.

### 3.1 `articles`

| 필드 | 타입 | 설명 |
|---|---|---|
| id | uuid | PK |
| title | text | 제목 |
| slug | text | URL slug, **unique** |
| seo_title | text | SEO 제목 |
| meta_description | text | 메타 설명 |
| category | text | 카테고리(영어명) |
| tags | text[] | 태그 |
| body | text | 본문 |
| summary | text | 요약 |
| one_line_insight | text | 한 줄 핵심 문장 |
| practical_rules | jsonb | 3개 행동 규칙 |
| reflection_question | text | 성찰 질문 |
| youtube_url | text | 연결 영상 URL |
| status | text | draft / published / scheduled / archived |
| published_at | timestamptz | 발행일 |
| created_at | timestamptz | 생성일 |
| updated_at | timestamptz | 수정일 |

### 3.2 `content_assets`

| 필드 | 타입 | 설명 |
|---|---|---|
| id | uuid | PK |
| article_id | uuid | → articles.id |
| shorts_script | text | 쇼츠 대본 |
| youtube_titles | jsonb | 제목 후보 |
| thumbnail_texts | jsonb | 썸네일 문구 |
| social_posts | jsonb | X/Threads용 문구 |
| video_prompt | text | 영상 생성 프롬프트 |
| description_draft | text | 유튜브 설명란 초안 |
| created_at | timestamptz | 생성일 |

### 3.3 `frameworks`

| 필드 | 타입 | 설명 |
|---|---|---|
| id | uuid | PK |
| title | text | 프레임워크 제목 |
| slug | text | URL slug |
| statement | text | 핵심 문장 |
| explanation | text | 짧은 설명 |
| category | text | 카테고리 |
| tags | text[] | 태그 |
| source_article_id | uuid | 연결 글 |
| status | text | draft / published |
| created_at | timestamptz | 생성일 |
| updated_at | timestamptz | 수정일 |

### 3.4 `performance_logs`

| 필드 | 타입 | 설명 |
|---|---|---|
| id | uuid | PK |
| article_id | uuid | → articles.id |
| youtube_views | integer | 유튜브 조회수 |
| article_views | integer | 웹 조회수 |
| search_impressions | integer | 검색 노출 |
| search_clicks | integer | 검색 클릭 |
| notes | text | 운영 메모 |
| logged_at | timestamptz | 기록일 |

### 3.5 `topic_ideas`

| 필드 | 타입 | 설명 |
|---|---|---|
| id | uuid | PK |
| topic | text | 주제 |
| category | text | 카테고리 |
| source | text | 직접 입력 / 댓글 / 검색 / AI 추천 |
| priority | integer | 우선순위 |
| status | text | new / used / ignored |
| notes | text | 메모 |
| created_at | timestamptz | 생성일 |

---

## 4. 자동 발행 정책 (기획서 14장)

### 허용 자동화 (14.1)

AI 초안 생성, SEO 제목·메타 자동 생성, Shorts 대본 자동 생성, 썸네일 문구 후보 생성, **자체 사이트 내 예약 발행**, sitemap 자동 갱신, RSS 자동 갱신, 관련 글 자동 추천.

### 금지/비추천 자동화 (14.2)

AI 생성 즉시 공개 발행, 하루 5개 이상 대량 자동 공개, 외부 블로그 자동 배포(Medium/Blogger/WordPress.com), 댓글/DM 자동화, YouTube API 자동 업로드.

### 발행 전 체크리스트 (14.3)

| 항목 | 기준 |
|---|---|
| 글 길이 | 500–900 words |
| 제목 | 명확, 과장 없음 |
| 메타 설명 | 140–160자 |
| 카테고리 | 필수 |
| 금지 표현 | 없어야 함 (`CONTENT_GUIDE.md`) |
| 중복도 | 기존 글과 과도하게 유사하지 않음 |
| Practical rules | 3개 포함 |
| Reflection question | 1개 포함 |
| YouTube CTA | 포함 |
| 관련 글 | 2개 이상 |
| 관리자 승인 | 필수 |

### 발행 빈도 (14.4)

초기 30일: 하루 1개(총 30개). 운영: 주 1회 7개 생성 → 검수 → 예약 발행. 초기 대량 발행 비추천.

---

## 5. 개발 로드맵 (기획서 17장)

| Phase | 목표 | 핵심 기능 | 우선순위 |
|---|---|---|---|
| **1. 콘텐츠 허브 MVP** | 글 만들고 발행 가능한 기본 사이트 | Next.js 생성, 홈/목록/상세/카테고리, 관리자 로그인, 글 CRUD, SEO 메타, sitemap/robots, Vercel 배포, Supabase 연결 | 최상 |
| **2. AI 생성 관리자** | 주제 입력 → 글/대본/SEO 자동 생성 | AI 생성 폼, JSON 구조화 출력, 결과 미리보기, 금지 표현 검사, 초안 저장, 관리자 승인 | 최상 |
| **3. 예약 발행/운영 자동화** | 주 1회 배치 생성 후 예약 발행 | 예약 발행, 발행 캘린더, 관련 글 자동 추천, RSS 자동 생성 | 높음 |
| **4. 유튜브 패키지 생성** | 업로드용 자료 자동 정리 | 제목 후보, 설명란 초안, 썸네일 문구, 영상 프롬프트, 업로드 체크리스트 | 중간 |
| **5. 성과 관리** | 반응 좋은 주제 발견 | 성과 로그, 조회수 수동 입력, Search Console 수동 기록, 성과 점수, 다음 주제 추천 | 중간 |
| **6. 수익화 확장** | 반응 기반 디지털 상품/앱 | (검증 후) Workbook, Notion Template, Focus System, Journal, Cards, AI 코칭 웹앱 | 검증 후 |

현재 작업은 기본적으로 **Phase 1 → 2 → 3** 순서로 진행한다.
