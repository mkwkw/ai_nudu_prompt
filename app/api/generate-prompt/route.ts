import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { role, template, purpose } = await request.json()

    // 역할별 프롬프트 작성 가이드
    const roleGuides = {
      planner: "기획자로서 마케팅 카피나 기획서를 작성할 때는 명확한 목표, 타겟 고객, 핵심 메시지를 포함해야 합니다.",
      developer: "개발자로서 API 문서나 코드 리뷰를 할 때는 기술적 세부사항, 사용 예시, 에러 처리를 포함해야 합니다.",
      analyst: "데이터 분석가로서 리포트를 작성할 때는 데이터 소스, 분석 방법, 인사이트, 시각화를 포함해야 합니다.",
      pm: "PM으로서 회의 요약이나 요구사항을 도출할 때는 핵심 결정사항, 액션 아이템, 담당자, 일정을 포함해야 합니다."
    }

    // 템플릿별 구체적인 가이드
    const templateGuides = {
      "marketing-copy": "마케팅 카피는 제품의 핵심 가치, 고객의 페인포인트, 행동 유도 문구를 포함해야 합니다.",
      "planning-doc": "기획서는 프로젝트 목표, 범위, 일정, 예산, 리스크 관리 방안을 포함해야 합니다.",
      "api-doc": "API 문서는 엔드포인트, 파라미터, 응답 형식, 에러 코드, 사용 예시를 포함해야 합니다.",
      "code-review": "코드 리뷰는 가독성, 성능, 보안, 테스트 커버리지, 개선 제안을 포함해야 합니다.",
      "data-report": "데이터 리포트는 분석 목적, 방법론, 주요 발견사항, 시각화, 결론을 포함해야 합니다.",
      "insight": "인사이트 도출은 데이터 패턴, 비즈니스 영향, 추천사항, 다음 단계를 포함해야 합니다.",
      "meeting-summary": "회의 요약은 참석자, 논의된 주제, 결정사항, 액션 아이템, 다음 회의 일정을 포함해야 합니다.",
      "requirement": "요구사항 도출은 기능 요구사항, 비기능 요구사항, 우선순위, 제약사항, 승인 기준을 포함해야 합니다.",
      "project-schedule": "프로젝트 일정 관리는 마일스톤, 작업 분해, 의존성, 리소스 할당, 위험 요소를 포함해야 합니다."
    }

    // AI에게 보낼 프롬프트 구성
    const aiPrompt = `당신은 프롬프트 엔지니어링 전문가입니다.

${roleGuides[role as keyof typeof roleGuides]}

${templateGuides[template as keyof typeof templateGuides]}

사용자의 목적: "${purpose}"

이 목적을 달성하기 위해 효과적인 프롬프트를 어떻게 작성해야 하는지 알려주세요. 

다음 JSON 형식으로 응답해주세요:
{
  "prompt": "생성된 프롬프트 (사용자가 AI에게 보낼 최종 프롬프트)",
  "explanation": "이 프롬프트가 효과적인 이유를 설명해주세요",
  "tips": "더 좋은 결과를 얻기 위한 추가 팁을 알려주세요"
}

프롬프트는 다음 요소들을 포함해야 합니다:
1. 명확한 지시사항
2. 구체적인 요구사항
3. 원하는 출력 형식
4. 품질 기준

JSON 형식으로만 응답해주세요.`

    try {
      // OpenAI API 호출
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "당신은 프롬프트 엔지니어링 전문가입니다. 사용자의 목적에 맞는 효과적인 프롬프트를 JSON 형식으로 제공해주세요."
          },
          {
            role: "user",
            content: aiPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      })

      const responseText = completion.choices[0]?.message?.content || ""
      
      // JSON 파싱 시도
      try {
        const parsedResponse = JSON.parse(responseText)
        return NextResponse.json(parsedResponse)
      } catch (parseError) {
        // JSON 파싱 실패 시 기본 응답 반환
        console.error('JSON 파싱 실패:', parseError)
        return NextResponse.json({
          prompt: `다음 목적을 달성하기 위한 효과적인 프롬프트를 작성해주세요: ${purpose}`,
          explanation: "AI가 제안한 프롬프트입니다. 목적에 맞는 구체적인 요구사항을 포함하여 작성되었습니다.",
          tips: "더 구체적인 요구사항이나 제약사항을 추가하면 더 정확한 결과를 얻을 수 있습니다."
        })
      }

    } catch (openaiError) {
      console.error('OpenAI API 호출 실패:', openaiError)
      
      // API 호출 실패 시 더미 데이터 반환 (시연용)
      const dummyResponse = {
        "marketing-copy": {
          prompt: `다음 제품에 대한 매력적이고 설득력 있는 마케팅 카피를 작성해주세요:

제품: ${purpose}

요구사항:
- 제품의 핵심 가치와 혜택을 명확히 전달
- 타겟 고객의 페인포인트를 해결하는 메시지
- 행동을 유도하는 강력한 CTA 포함
- 감정적 연결을 만드는 스토리텔링 요소
- 3-4개의 주요 특징을 불릿 포인트로 정리

출력 형식:
- 제목 (매력적인 헤드라인)
- 본문 (2-3문단)
- 주요 특징 (불릿 포인트)
- 행동 유도 문구

품질 기준:
- 명확하고 이해하기 쉬운 언어
- 고객 중심의 메시지
- 구체적이고 측정 가능한 혜택`,
          explanation: "이 프롬프트는 제품의 핵심 가치를 명확히 전달하면서도 고객의 니즈에 집중하는 구조화된 마케팅 카피를 생성합니다.",
          tips: "더 구체적인 타겟 고객 정보나 제품 특징을 추가하면 더 정확한 결과를 얻을 수 있습니다."
        },
        "project-schedule": {
          prompt: `다음 프로젝트에 대한 체계적이고 실용적인 반영 일정을 작성해주세요:

프로젝트: ${purpose}

요구사항:
- 프로젝트의 전체 범위와 목표 명확히 정의
- 주요 마일스톤과 단계별 일정 계획
- 작업 분해 구조(WBS) 기반 세부 작업 항목
- 작업 간 의존성과 순서 관계 분석
- 필요한 리소스와 담당자 역할 분담
- 잠재적 위험 요소와 대응 방안
- 품질 관리 및 검토 일정

출력 형식:
- 프로젝트 개요
- 목표 및 범위
- 마일스톤 일정
- 세부 작업 계획
- 리소스 할당
- 위험 관리
- 품질 관리 계획

품질 기준:
- 현실적이고 실현 가능한 일정
- 명확한 책임 분담
- 위험 요소 고려
- 품질 보증 방안 포함`,
          explanation: "이 프롬프트는 프로젝트의 모든 단계를 체계적으로 계획하고 실용적인 반영 일정을 생성합니다.",
          tips: "구체적인 팀 구성, 예산, 기술적 제약사항을 추가하면 더 정확한 일정을 수립할 수 있습니다."
        }
      }

      const response = dummyResponse[template as keyof typeof dummyResponse] || {
        prompt: `다음 목적을 달성하기 위한 효과적인 프롬프트를 작성해주세요: ${purpose}`,
        explanation: "사용자의 목적에 맞는 기본적인 프롬프트를 생성했습니다.",
        tips: "더 구체적인 요구사항이나 제약사항을 추가하면 더 정확한 결과를 얻을 수 있습니다."
      }

      return NextResponse.json(response)
    }

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: '프롬프트 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 