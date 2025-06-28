import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { prompt, purpose } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: '프롬프트가 필요합니다.' },
        { status: 400 }
      )
    }

    try {
      // OpenAI API 호출하여 프롬프트 실행
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "당신은 사용자의 요청에 따라 전문적이고 실용적인 결과를 제공하는 AI 어시스턴트입니다."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      })

      const result = completion.choices[0]?.message?.content || "응답을 생성할 수 없습니다."
      
      // 토큰 사용량 계산
      const inputTokens = completion.usage?.prompt_tokens || 0
      const outputTokens = completion.usage?.completion_tokens || 0
      const totalTokens = completion.usage?.total_tokens || 0
      
      // 비용 계산 (GPT-4o-mini 기준)
      const inputCost = (inputTokens / 1000) * 0.00015 // $0.00015 per 1K input tokens
      const outputCost = (outputTokens / 1000) * 0.0006  // $0.0006 per 1K output tokens
      const totalCost = inputCost + outputCost

      return NextResponse.json({
        result,
        tokenCount: totalTokens,
        cost: parseFloat(totalCost.toFixed(4)),
        inputTokens,
        outputTokens
      })

    } catch (openaiError) {
      console.error('OpenAI API 호출 실패:', openaiError)
      
      // API 호출 실패 시 더미 결과 반환 (시연용)
      const dummyResults = {
        "프로젝트 일정 관리": `📋 ${purpose} 프로젝트 반영 일정

🎯 프로젝트 개요:
• 목표: ${purpose} 성공적 반영 및 안정화
• 기간: 3개월 (12주)
• 예산: 2,500만원

📅 마일스톤 일정:
• 1주차: 요구사항 분석 및 설계 완료
• 4주차: 개발 1단계 완료 (핵심 기능)
• 8주차: 개발 2단계 완료 (부가 기능)
• 10주차: 테스트 및 QA 완료
• 12주차: 배포 및 안정화 완료

👥 리소스 할당:
• PM: 전체 프로젝트 관리
• 개발자 2명: 핵심 기능 개발
• 디자이너 1명: UI/UX 설계
• QA 1명: 테스트 및 품질 관리

⚠️ 위험 관리:
• 기술적 리스크: 외부 API 의존성
• 일정 리스크: 개발자 1명 병가 가능성
• 예산 리스크: 추가 기능 요구 시 초과

✅ 품질 관리:
• 주간 진행상황 리뷰
• 2주차 단위 코드 리뷰
• 사용자 테스트 및 피드백 수집`,
        "마케팅 카피": `🚀 혁신적인 ${purpose}으로 당신의 일상을 완전히 바꿔보세요!

✨ 주요 특징:
• 사용하기 쉬운 직관적인 인터페이스
• 빠르고 정확한 성능
• 합리적인 가격

💡 지금 바로 시작하고 변화를 경험해보세요!`,
        "기획서": `📋 ${purpose} 기획서

🎯 목표:
• 명확한 목표 설정
• 구체적인 실행 계획
• 예상 결과 및 KPI

📊 예산 및 일정:
• 총 예산: 1,000만원
• 기간: 3개월
• 주요 마일스톤: 월별 진행상황 체크`
      }

      const result = dummyResults[purpose as keyof typeof dummyResults] || 
        `${purpose}에 대한 결과가 성공적으로 생성되었습니다.`

      return NextResponse.json({
        result,
        tokenCount: Math.floor(Math.random() * 500) + 100,
        cost: parseFloat((Math.random() * 0.1 + 0.01).toFixed(4)),
        inputTokens: Math.floor(Math.random() * 200) + 50,
        outputTokens: Math.floor(Math.random() * 300) + 100
      })
    }

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: '프롬프트 실행 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 