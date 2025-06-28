# 🤖 AI 프롬프트 작성 서비스

> **"너도 할 수 있어 프롬프트 작성"** - AI 활용 진입장벽을 제거하고 팀 전체의 생산성을 높이는 원스톱 플랫폼

## 📋 목차

- [프로젝트 소개](#프로젝트-소개)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [빠른 시작](#빠른-시작)
- [사용법](#사용법)
- [발표용 시연 가이드](#발표용-시연-가이드)
- [개발 환경](#개발-환경)
- [API 문서](#api-문서)
- [기여하기](#기여하기)

## 🎯 프로젝트 소개

모든 조직 구성원이 '프롬프트 엔지니어'가 되지 않아도, 자연어로 쉽게 고품질 프롬프트를 작성·공유·개선할 수 있는 **원스톱 플랫폼 서비스**입니다.

### 🎯 목표
- AI 활용 진입장벽 제거
- 팀 전체의 생산성 향상
- 조직 내 베스트 프랙티스 공유

### 👥 타겟 사용자
- **새내기 기획자** - 마케팅 카피를 빠르게 뽑고 싶은 분
- **개발자** - API 자동화를 위한 변수·버전 관리
- **데이터 분석가** - 반복 레포트 작성용 템플릿
- **PM** - 기획서, 회의 요약, 요구사항 도출 자동화

## ✨ 주요 기능

### 🎯 역할 기반 모델 추천
- 기획자, 개발자, 분석가, PM 등 역할별 최적 템플릿 자동 추천
- 각 역할에 맞는 LLM 모델과 파라미터 자동 설정

### ⚡ 실시간 미리보기 & 비용 표시
- 프롬프트 작성과 동시에 결과 미리보기
- 토큰 수와 예상 비용 실시간 표시
- 응답 품질 즉시 확인

### 🤝 협업 & 공유
- 팀 내 베스트 프랙티스를 갤러리에 공유
- 템플릿 검색, 필터링, 복제 기능
- 동료들과 함께 프롬프트 개선

### 📚 템플릿 라이브러리
- 용도·목적별 템플릿 라이브러리
- 카테고리별 분류 및 태그 시스템
- 사용량 통계 및 인기도 표시

## 🛠 기술 스택

### Frontend
- **Next.js 14** (App Router)
- **React 18** + **TypeScript**
- **Tailwind CSS** - 스타일링
- **ShadCN/UI** - UI 컴포넌트

### Backend
- **Next.js API Routes** - 서버 API
- **OpenAI API** - LLM 서비스
- **PostgreSQL** - 데이터베이스
- **Redis** - 세션 및 캐싱

### DevOps
- **Docker** - 컨테이너화
- **Docker Compose** - 멀티 서비스 관리
- **Vercel** - 배포 플랫폼

## 🚀 빠른 시작

### 1. 저장소 클론
```bash
git clone https://github.com/your-username/ai_nudu_prompt.git
cd ai_nudu_prompt
```

### 2. Docker로 실행 (권장)
```bash
# Docker 컨테이너 빌드 및 실행
docker-compose up --build

# 브라우저에서 확인
open http://localhost:3000
```

### 3. 로컬 개발 환경
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 브라우저에서 확인
open http://localhost:3000
```

## 📖 사용법

### 1. 프롬프트 생성하기
1. **홈페이지**에서 "프롬프트 만들기" 클릭
2. **역할 선택** (기획자, 개발자, 분석가, PM)
3. **템플릿 선택** (역할별 맞춤 템플릿)
4. **세부 내용 입력** (구체적인 정보 입력)
5. **생성 및 실행** (실시간 결과 확인)

### 2. 템플릿 갤러리 활용
1. **갤러리 페이지**에서 원하는 템플릿 검색
2. **카테고리 필터**로 분야별 템플릿 찾기
3. **복제하기**로 템플릿 가져오기
4. **사용하기**로 바로 프롬프트 생성 페이지로 이동

### 3. 협업 및 공유
1. 생성한 프롬프트를 **갤러리에 공유**
2. 동료들이 **복제하고 개선**
3. **댓글과 피드백**으로 함께 발전

### 기타 포인트
- ✅ **직관적인 UI/UX** - 누구나 쉽게 사용 가능
- ✅ **실시간 피드백** - 즉시 결과 확인
- ✅ **비용 투명성** - 토큰 수와 비용 표시
- ✅ **협업 기능** - 팀 내 지식 공유


## 🛠 개발 환경

### 환경 변수 설정
```bash
# .env.local 파일 생성
cp .env.example .env.local

# 필요한 환경 변수 설정
DATABASE_URL=postgresql://user:password@localhost:5432/mydatabase
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=your_openai_api_key
```

### 개발 명령어
```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# 린트 검사
npm run lint
```

### Docker 명령어
```bash
# 컨테이너 실행
docker-compose up

# 백그라운드 실행
docker-compose up -d

# 컨테이너 중지
docker-compose down

# 로그 확인
docker-compose logs -f
```

## 📚 API 문서

### 주요 엔드포인트

#### 프롬프트 생성
```http
POST /api/prompts
Content-Type: application/json

{
  "templateId": "marketing-copy",
  "userInput": "새로운 AI 스마트폰",
  "params": {
    "temperature": 0.7,
    "maxTokens": 500
  }
}
```

#### 프롬프트 실행
```http
POST /api/run
Content-Type: application/json

{
  "prompt": "다음 제품에 대한 매력적인 마케팅 카피를 작성해주세요: 새로운 AI 스마트폰",
  "model": "gpt-4o"
}
```

#### 템플릿 목록
```http
GET /api/templates?category=marketing&search=카피
```

## 🤝 기여하기

### 기여 방법
1. **Fork** 저장소
2. **Feature branch** 생성 (`git checkout -b feature/amazing-feature`)
3. **Commit** 변경사항 (`git commit -m 'Add amazing feature'`)
4. **Push** 브랜치 (`git push origin feature/amazing-feature`)
5. **Pull Request** 생성

### 개발 가이드라인
- **컴포넌트**: ShadCN/UI 컴포넌트 사용
- **아이콘**: Lucide React 아이콘 사용
- **스타일링**: Tailwind CSS 클래스 사용
- **타입**: TypeScript 타입 정의 필수

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 문의

- **이슈 리포트**: [GitHub Issues](https://github.com/your-username/ai_nudu_prompt/issues)
- **기능 제안**: [GitHub Discussions](https://github.com/your-username/ai_nudu_prompt/discussions)
- **이메일**: your-email@example.com

---

**⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요!** 