# AI Nudu Prompt

AI 프롬프트 생성 및 실행 서비스

## 🚀 주요 기능

- **역할 기반 프롬프트 생성**: 기획자, 개발자, 데이터 분석가, PM 역할별 최적화된 프롬프트
- **템플릿 시스템**: 마케팅 카피, 기획서, API 문서, 데이터 리포트 등 다양한 템플릿
- **AI 프롬프트 제안**: 사용자 목적에 맞는 최적의 프롬프트 자동 생성
- **실시간 실행**: 생성된 프롬프트를 즉시 실행하여 결과 확인
- **토큰 및 비용 추적**: API 사용량과 비용 실시간 모니터링

## 🛠 기술 스택

- **Frontend**: Next.js 14, React, TypeScript
- **UI**: Tailwind CSS, ShadCN UI
- **AI**: OpenAI GPT-4o-mini
- **Database**: PostgreSQL
- **Cache**: Redis
- **Container**: Docker

## 📦 설치 및 실행

### 1. 저장소 클론
```bash
git clone <repository-url>
cd ai_nudu_prompt
```

### 2. 환경 변수 설정
프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# OpenAI API 설정
OPENAI_API_KEY=your_openai_api_key_here

# Next.js 설정
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**OpenAI API 키 발급 방법:**
1. [OpenAI Platform](https://platform.openai.com/)에 로그인
2. API Keys 섹션에서 새 키 생성
3. 생성된 키를 `OPENAI_API_KEY`에 설정

### 3. Docker로 실행
```bash
# 컨테이너 빌드 및 실행
docker-compose up --build

# 백그라운드 실행
docker-compose up -d
```

### 4. 로컬 개발 환경
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

## 🎯 사용 방법

### 1. 메인 페이지
- 서비스 소개 및 주요 기능 확인
- 프롬프트 생성 페이지로 이동

### 2. 프롬프트 생성 (`/create`)
1. **역할 선택**: 기획자, 개발자, 데이터 분석가, PM 중 선택
2. **템플릿 선택**: 역할에 맞는 템플릿 선택
3. **목적 입력**: 달성하고 싶은 목적을 구체적으로 입력
4. **AI 프롬프트 생성**: AI가 최적의 프롬프트 제안
5. **프롬프트 실행**: 생성된 프롬프트로 실제 결과 생성

### 3. 템플릿 갤러리 (`/gallery`)
- 다양한 프롬프트 템플릿 탐색
- 템플릿 검색 및 복제 기능

## 💰 비용 계산

### 토큰 기반 비용
- **입력 토큰**: $0.00015 per 1K tokens
- **출력 토큰**: $0.0006 per 1K tokens

### 예시 계산
- 입력: 100 tokens = $0.000015
- 출력: 200 tokens = $0.00012
- 총 비용: $0.000135

## 🔧 개발 가이드

### 프로젝트 구조
```
ai_nudu_prompt/
├── app/                    # Next.js App Router
│   ├── api/               # API 엔드포인트
│   ├── create/            # 프롬프트 생성 페이지
│   ├── gallery/           # 템플릿 갤러리
│   └── page.tsx           # 메인 페이지
├── components/            # React 컴포넌트
│   ├── ui/               # ShadCN UI 컴포넌트
│   └── header.tsx        # 헤더 컴포넌트
├── docker-compose.yml     # Docker 서비스 설정
├── Dockerfile            # Docker 이미지 설정
└── package.json          # 프로젝트 의존성
```

### API 엔드포인트
- `POST /api/generate-prompt`: AI 프롬프트 생성
- `POST /api/execute-prompt`: 생성된 프롬프트 실행

## 📝 라이선스

MIT License

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request