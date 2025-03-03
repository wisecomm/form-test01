# TypeScript로 Vercel 서버를 사용한 로그인 페이지 구현 Todo 리스트

## 1. TypeScript 프로젝트 초기 설정
- [ ] Next.js + TypeScript 프로젝트 확인(이미 form-test01이 존재한다고 가정)
- [ ] TypeScript 설정 파일(tsconfig.json) 검토 및 수정
  ```bash
  npm install --save-dev typescript @types/react @types/node @types/react-dom
  ```
- [ ] 타입스크립트 설정 최적화
  ```json
  // tsconfig.json에 추가할 설정
  {
    "compilerOptions": {
      "strict": true,
      "forceConsistentCasingInFileNames": true,
      "esModuleInterop": true,
      "skipLibCheck": true
    }
  }
  ```
- [ ] 필요한 디렉토리 구조 생성 (타입스크립트 파일용)
  - `/pages` (.tsx 파일용)
  - `/pages/api` (.ts 파일용)
  - `/pages/api/auth` (.ts 파일용)
  - `/components` (.tsx 파일용)
  - `/context` (.tsx 파일용)
  - `/types` (.d.ts 파일용)
  - `/interfaces` (.ts 인터페이스 정의 파일용)

## 2. TypeScript 의존성 패키지 설치
- [ ] NextAuth.js 설치 및 타입 정의
  ```bash
  npm install next-auth
  ```
- [ ] 추가 필요 라이브러리 및 타입 설치
  ```bash
  npm install @headlessui/react
  npm install react-hook-form
  npm install --save-dev @types/next-auth
  ```
- [ ] 스타일링 패키지 설치 (옵션)
  ```bash
  npm install tailwindcss postcss autoprefixer
  npx tailwindcss init -p
  ```

## 3. TypeScript 인증 시스템 구성
- [ ] NextAuth.js 설정 파일 생성 (`/pages/api/auth/[...nextauth].ts`)
- [ ] 인증 타입 선언 및 확장 (`/types/next-auth.d.ts`)
  ```typescript
  declare module 'next-auth' {
    interface Session {
      accessToken?: string;
      error?: string;
      user?: {
        id: string;
        name: string;
        email: string;
      };
    }
  }
  ```
- [ ] JWT 토큰 타입 정의 (`/types/jwt.ts`)
  ```typescript
  import { JWT } from 'next-auth/jwt';
  
  export interface CustomJWT extends JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
  }
  ```
- [ ] 인증 컨텍스트 작성 (`/context/AuthContext.tsx`)
- [ ] 토큰 리프레시 로직 타입 안전하게 구현
- [ ] 세션 인터페이스 타입 정의 및 만료 처리 로직 구현 (5분 후 자동 로그아웃)

## 4. TypeScript UI 컴포넌트 개발
- [ ] 로그인 폼 컴포넌트 작성 (`/components/LoginForm.tsx`)
  - Props 인터페이스 정의
  - 이벤트 핸들러 타입 정의
- [ ] 로그인 페이지 작성 (`/pages/login.tsx`)
  - 페이지 Props 타입 정의
- [ ] 대시보드 페이지 작성 (`/pages/dashboard.tsx`)
  - 세션 데이터 타입 안전하게 처리
- [ ] 응용 프로그램 래퍼 타입 정의 (`/pages/_app.tsx`)
  ```typescript
  import type { AppProps } from 'next/app';
  import { Session } from 'next-auth';
  
  interface MyAppProps extends AppProps {
    pageProps: {
      session?: Session;
    }
  }
  ```
- [ ] 에러 메시지 및 로딩 상태 UI 타입 안전하게 구현

## 5. TypeScript 인증 기능 구현
- [ ] 로그인 양식 유효성 검사 설정 (타입 정의 포함)
  ```typescript
  interface LoginFormData {
    email: string;
    password: string;
  }
  ```
- [ ] 자격 증명 공급자 타입 안전하게 구성(이메일/비밀번호)
- [ ] 로그인 기능 구현 (타입 안전한 API 호출)
- [ ] 로그아웃 기능 구현 (타입 안전한 사용자 세션 처리)
- [ ] 인증된 경로 보호 기능 구현 (타입 가드 활용)

## 6. TypeScript 토큰 관리
- [ ] JWT 토큰 인터페이스 정의 및 설정
- [ ] 접근 토큰 만료 처리 (5분) 타입 안전하게 구현
- [ ] 리프레시 토큰 로직 타입 정의 및 구현
- [ ] 세션 만료 시 자동 로그아웃 타입 안전하게 구현

## 7. TypeScript 테스트 및 검증
- [ ] 로그인 기능 테스트 (타입 안전한 테스트 작성)
- [ ] 인증 경로 보호 테스트
- [ ] 토큰 만료 테스트
- [ ] 리프레시 토큰 동작 확인
- [ ] 에러 처리 테스트 (타입 안전한 에러 처리)
- [ ] 타입 체크 명령 실행 및 검증
  ```bash
  npx tsc --noEmit
  ```

## 8. Vercel 배포 (TypeScript 최적화)
- [ ] .env.local 파일 설정 및 타입 정의
  ```
  NEXTAUTH_URL=http://localhost:3000
  NEXTAUTH_SECRET=your-secret-key
  ```
  ```typescript
  // types/environment.d.ts
  declare namespace NodeJS {
    interface ProcessEnv {
      NEXTAUTH_URL: string;
      NEXTAUTH_SECRET: string;
    }
  }
  ```
- [ ] 깃허브 저장소 설정
- [ ] Vercel 프로젝트 연결 (TypeScript 빌드 설정 확인)
- [ ] 환경 변수 설정
- [ ] 배포 실행 및 테스트

## 9. TypeScript 최적화 및 개선
- [ ] 코드 리팩토링 (더 엄격한 타입 적용)
- [ ] 성능 최적화 (타입 추론 활용)
- [ ] 접근성 개선 (타입 안전한 속성 사용)
- [ ] 보안 검토 (타입을 활용한 취약점 방지)
- [ ] 타입 문서화 개선
