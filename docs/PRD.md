# PRD – “너도 할 수 있어 프롬프트 작성” 서비스

## 1. Vision & Purpose

모든 조직 구성원이 ‘프롬프트 엔지니어’가 되지 않아도, 자연어로 쉽게 고품질 프롬프트를 작성·공유·개선할 수 있는 **원스톱 플랫폼 서비스**을 제공한다. 목표는 AI 활용 진입장벽을 제거하고 팀 전체의 생산성을 높이는 것.

## 2. Goals & Success Metrics

| 목표      | 측정 지표 (30일 기준)               | 목표치    |
| ------- | ---------------------------- | ------ |
| **사용성** | 신규 가입 후 첫 프롬프트 생성까지 평균 소요 시간 | ≤ 5 분  |
| **활용도** | 주간 활성 사용자(WAU) / 가입자         | ≥ 40 % |
| **품질**  | “생성된 프롬프트 만족” 4점 이상(5점 척도)   | ≥ 80 % |
| **협업**  | 갤러리에 공유된 프롬프트당 평균 복제 수       | ≥ 2 회  |

## 3. Target Users & Personas

1. **새내기 기획자 지훈(28)** – 프롬프트 개념이 생소하지만 마케팅 카피를 빠르게 뽑고 싶다.
2. **개발자 민주(32)** – API 자동화를 위해 변수·버전 관리를 원한다.
3. **데이터 분석가 소라(35)** – 반복 레포트 작성용 템플릿과 배치 실행이 필요하다.
4. **PM 재윤(34)** – 기획서, 회의 요약, 요구사항 도출을 빠르게 자동화하고 싶다.

## 4. Problem Statement

- 고급 프롬프트 기법(Chain-of-Thought 등)을 배우려면 학습 부담이 큼.
- 결과 품질이 파라미터(Temperature 등)와 프롬프트 구조에 크게 의존하나, 실험·버전 관리 도구가 부족.
- 조직 내 베스트 프랙티스가 흩어져 재사용성이 떨어짐.

## 5. Solution Overview

웹 기반 SaaS로 **프롬프트 작성 → 실험 → 공유** 전 과정을 지원.
핵심은 “한국어 자연어 입력만으로도 고급 프롬프트를 자동 생성·튜닝”하는 **NL → Prompt 마법사**와 **템플릿 라이브러리**.

## 6. Feature List & Priorities

| #  | 기능                             | 설명                                                                 | MVP |
|----|----------------------------------|----------------------------------------------------------------------|-----|
| 1  | 용도·목적별 템플릿 라이브러리              | 템플릿을 JSON 또는 DB에서 불러와 검색 및 미리보기 제공                             | ✅  |
| 2  | 실시간 미리보기 & 토큰/비용 표시          | 프롬프트 실행 결과를 실시간 표시, 응답과 비용(토큰 수) 출력                         | ✅  |
| 3  | 역할 기반 모델 추천 + 프롬프트 생성        | 드롭다운에서 역할 선택 시 적절한 프롬프트와 모델 구성 요소를 자동 완성                  | ✅  |
| 4  | NL → 프롬프트 템플릿 매핑 마법사 (간이형) | 사용자가 목적/상황을 자연어로 입력하면 적절한 템플릿에 자동 삽입 (룰 기반)           | ✅  |
| 5  | 프롬프트 생성 및 실행 API                | `POST /prompts`, `POST /run`, `GET /models` 등 기본 실행 API 구성 | ✅  |


1. **첫 프롬프트 작성**

   - 홈 → “프롬프트 만들기” → 한국어로 목적 입력
   - 마법사가 템플릿 추천 + 파라미터 기본값 설정
   - **역할 드롭다운 선택(예: 기획자)** → 자동으로 적합한 LLM 모델과 포맷 추천
   - 실시간 미리보기 확인 후 “저장 & 실행”

2. **템플릿 활용 & 공유**

   - 라이브러리 검색 → 샘플 출력 확인 → 복제
   - 변수 `{상품명}` 추가 → CSV 업로드 → 배치 실행
   - 완료 후 “갤러리에 공개” 체크 → 동료가 복제·코멘트

## 8. Functional Requirements (MVP)

- 프롬프트 생성 API: ⚙️ `POST /prompts` (payload: templateId | userInput | params)
- 실행 API: `POST /run` → returns `response`, `cost`, `latency`
- 역할 기반 모델 프리셋 API: `GET /models?role=planner` → returns best-suited LLM & defaults
- 미리보기 WebSocket: 결과 스트리밍
- Auth: OAuth2 (사내 SSO 지원)
- Rate Limiting: per-user token quota

## 9. Non-Functional Requirements

| 항목               | 목표                            |
| ---------------- | ----------------------------- |
| **Latency**      | ⩽ 3 s(95-pctl) for 1K tokens  |
| **Uptime**       | 99.5 % 월간                     |
| **Localization** | UI : KO/EN, 프롬프트 다국어 생성       |
| **Security**     | SOC2-Type II 목표, 엔드-to-엔드 암호화 |
| **Scalability**  | ≥ 500 동시 실행 세션                |

## 10. Tech Stack Recommendation

- **Full-stack**: Next.js 14 (App Router)
- **UI**: Tailwind CSS (+ shadcn/ui)
- **LLM Provider**: GPT-4o, OpenAI Node SDK 로 호출
- **DB**: PostgreSQL (prompts, versions), Redis (sessions, rate limit)
- **CI/CD**: Vercel

## 11. Milestones & Timeline (T-0 = 개발 시작)

| 주차  | 목표 산출물                          |
| --- | ------------------------------- |
| 0-1 | 기획 확정, 와이어프레임, API 명세           |
| 2-4 | 템플릿 라이브러리, Auth 구현              |
| 5-7 | NL-→Prompt 마법사 + 파라미터 패널 + 미리보기 |
| 8-9 | 버전 관리, 비용 계산, QA                |
| 10  | 내부 베타 & 피드백 반영                  |
| 12  | 사내 론칭 (MVP)                     |

## 12. Risks & Mitigations

| 리스크          | 영향    | 대응                         |
| ------------ | ----- | -------------------------- |
| LLM 호출 비용 급증 | 예산 초과 | 토큰 최적화, 캐싱, 밤 시간대 저가 모델 사용 |
| 민감 데이터 유출    | 보안 사고 | PII 마스킹, 클라우드 VPC, 로그 레드액션 |
| 사용자 학습 곡선    | 도입 저조 | 온보딩 튜토리얼, 갤러리 큐레이트         |

## 13. External References

- Kaggle “Prompt Engineering Whitepaper”
- GitHub `f/awesome-chatgpt-prompts`, `dair-ai/Prompt-Engineering-Guide`, etc.

---

*작성: 2025-06-23, PM / Rev 0.2*

