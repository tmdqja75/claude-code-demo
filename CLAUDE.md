# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 기본 명령어

```bash
npm run dev       # 개발 서버 시작 (http://localhost:3000)
npm run build     # 프로덕션 빌드
npm run start     # 프로덕션 서버 시작
npm run lint      # ESLint 실행
```

빌드 후 타입 검증은 `npx next build` 안에서 자동으로 실행됨 — 별도의 `tsc` 실행 불필요.

---

## 프로젝트 구조

- **Next.js 16 + App Router** 기반. 페이지는 `src/app/` 디렉토리에 파일 시스템 라우팅으로 구성됨.
- **Tailwind CSS v4** 사용. `globals.css`에서 `@import "tailwindcss"`로 가져오고, `@theme inline` 블록으로 CSS 변수를 정의함. 별도의 `tailwind.config` 파일 없음.
- **경로 별칭**: `@/*` → `./src/*` (tsconfig.json에 정의)
- **폰트**: Geist Sans / Geist Mono (`next/font/google`에서 로드, `layout.tsx`에서 CSS 변수로 공급)

```
src/
└── app/
    ├── layout.tsx      # 루트 레이아웃 (폰트 로드, 메타데이터)
    ├── globals.css     # 글로벌 스타일 및 Tailwind 임포트
    ├── page.tsx        # 홈페이지 (클라이언트 컴포넌트)
    └── favicon.ico
```

---

## 핵심 구현 세부사항

### 슬롯 머신 아니메이션 (`src/app/page.tsx`)

- `"use client"` 디렉티브로 클라이언트 컴포넌트.
- `setInterval`로 60ms마다 스핀 루프를 돌리고, 각 문자가 왼쪽부터 오른쪽 순서로 120ms 간격으로 순차적으로 고정됨.
- `useRef`로 타겟 문자열과 고정 진행 상태를 관리 — `useState`를 사용하면 스핀 루프 클로저 안에서 최신 값을 읽을 수 없기 때문.
- 아니메이션 상수는 파일 상단에 정의됨: `SPIN_INTERVAL_MS`, `SETTLE_DELAY_MS`, `LENGTH`.

### 스타일 패턴

- 입력 및 버튼은 `rounded-full`로 pill 형태.
- 입력에 `font-mono tracking-widest` 적용 — 스핀 중 문자 폭이 바뀌면서 레이아웃이 흔들리지 않도록.
- 다크 모드 CSS 변수는 `globals.css`에 정의되어 있지만, 현재 컴포넌트는 하드코딩된 Tailwind 색상(`bg-white`, `bg-gray-300`, `bg-black`)을 사용.

---

## 환경 및 권한

- **패키지 매니저**: npm
- `.claude/settings.local.json`에서 빌드, git 작업에 대한 권한이 사전 허용됨.
