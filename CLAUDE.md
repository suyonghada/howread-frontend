# CLAUDE.md

이 파일은 Claude Code(claude.ai/code)가 이 저장소에서 작업할 때 참고하는 가이드입니다.

## 명령어

```bash
npm run dev        # 개발 서버 실행 (http://localhost:3000)
npm run build      # 프로덕션 빌드 + 라우트 타입 생성
npm run lint       # ESLint (Next.js core-web-vitals + TypeScript 규칙)
npx tsc --noEmit  # 타입 검사 (파일 생성 없음)
```

테스트 스위트는 설정되어 있지 않습니다.

## 아키텍처

### 기술 스택

- **Next.js 16** App Router, **React 19**, **TypeScript** (strict mode)
- **Tailwind CSS v4** — `@tailwindcss/postcss` 사용, `tailwind.config.ts` 없음; `globals.css`에서 `@import "tailwindcss"`로 설정
- **ShadCN** 컴포넌트 (`src/components/ui/`) — Radix UI가 아닌 `@base-ui/react` 사용
- **TanStack Query v5** (서버 상태), **react-hook-form + Zod** (폼)

### ShadCN 핵심 주의사항

`Button`은 `@base-ui/react/button` 기반으로 **`asChild` prop이 없습니다**. 버튼 스타일의 링크를 렌더링하려면 `buttonVariants()`를 className으로 사용하세요:

```tsx
import { buttonVariants } from "@/components/ui/button";
<Link href="/path" className={buttonVariants({ variant: "outline" })}>레이블</Link>
```

### API 레이어 (`src/lib/api/`)

모든 HTTP 호출은 `src/lib/api/client.ts`의 `apiFetch`를 거칩니다:

- **액세스 토큰은 메모리에** 보관 (`setAccessToken`/`getAccessToken`) — localStorage나 쿠키에 저장하지 않음
- **리프레시 토큰은 `localStorage`** 의 `"refreshToken"` 키에 보관
- 401 응답 시: `/auth/refresh` 호출 → 두 토큰 갱신 → 원래 요청 재시도. 모듈 레벨의 `refreshPromise` 락으로 동시 갱신 경쟁 방지
- 백엔드 응답 래퍼 `{ success, data, error }` 언래핑, 실패 시 `ApiError` throw

### 인증 흐름

- `AuthContext` (`src/store/auth.ts`) — `{ user, isLoading, isAuthenticated, login, logout, refreshUser }` 노출
- `AuthProvider` (`src/providers/AuthProvider.tsx`) — 마운트 시 `localStorage.refreshToken` 읽어 `/auth/refresh` → `/users/me` 호출로 세션 복원
- 라우트 그룹 `src/app/(auth-required)/layout.tsx` — 비인증 사용자를 `/auth/login`으로 리다이렉트

### 백엔드 API 명세

Base URL: `http://localhost:8080/api/v1` (`.env.local`의 `NEXT_PUBLIC_API_BASE_URL`로 설정).

모든 응답 형식: `{ success: boolean, data: T | null, error: { code, message } | null }`.

일반적인 네이밍과 다른 주요 형태:

- **도서 커서 페이지** (`GET /books`): `{ data: Book[], nextCursor: number | null, hasNext: boolean }` — cursor는 마지막 도서의 숫자형 ID
- **리뷰 페이지** (`GET /books/:id/reviews`, `GET /users/me/reviews`): `{ data: Review[], page, size, totalCount, hasNext }` — `totalPages` 없음; `Math.ceil(totalCount / size)`로 계산
- **리뷰 필드**: `isLikedByMe` (`isLiked` 아님); 응답에 `userNickname`, `userProfileImageUrl` 없음
- **이메일 중복 확인** (`POST /auth/email/check`): 성공 시 void 반환, 중복 시 `ApiError` throw — `{ available }` 필드 없음

### 경로 별칭

`@/*` → `src/*` (tsconfig.json)

## Git Workflow

### 브랜치 전략

- `main` 브랜치에 직접 push하지 않습니다. 항상 브랜치를 분리해 작업합니다.
- 브랜치 네이밍: `feat/기능명`, `fix/버그명`, `chore/작업명`, `ci/작업명`

```bash
git switch -c feat/my-feature   # 새 브랜치 생성
git push -u origin feat/my-feature
```

### 커밋 컨벤션

[Conventional Commits](https://www.conventionalcommits.org/) 규약을 따릅니다.

| 타입 | 사용 시점 |
|------|----------|
| `feat` | 새 기능 추가 |
| `fix` | 버그 수정 |
| `chore` | 빌드, 설정, 패키지 등 기능 외 변경 |
| `ci` | CI/CD 파이프라인 변경 |
| `refactor` | 기능 변경 없는 코드 개선 |
| `style` | 포매팅, 세미콜론 등 코드 의미 변경 없는 수정 |
| `docs` | 문서 변경 |

```bash
git commit -m "feat: 도서 목록 무한 스크롤 구현"
git commit -m "fix: 로그인 후 리다이렉트 경로 수정"
```

### PR 규칙

- 작업 단위로 커밋을 세분화합니다.
- PR 설명에 변경 이유와 설계 의도가 드러나도록 작성합니다.
