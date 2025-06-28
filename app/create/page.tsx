"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const roles = [
  { id: "planner", name: "기획자", description: "마케팅 카피, 기획서 작성", icon: "📝" },
  { id: "developer", name: "개발자", description: "API 자동화, 코드 생성", icon: "💻" },
  { id: "analyst", name: "데이터 분석가", description: "레포트 작성, 데이터 분석", icon: "📊" },
  { id: "pm", name: "PM", description: "회의 요약, 요구사항 도출", icon: "📋" },
]

const templates = {
  planner: [
    { id: "marketing-copy", name: "마케팅 카피 생성", prompt: "다음 제품에 대한 매력적인 마케팅 카피를 작성해주세요: {제품명}" },
    { id: "planning-doc", name: "기획서 작성", prompt: "다음 주제에 대한 기획서를 작성해주세요: {주제}" },
  ],
  developer: [
    { id: "api-doc", name: "API 문서 생성", prompt: "다음 API에 대한 문서를 작성해주세요: {API명}" },
    { id: "code-review", name: "코드 리뷰", prompt: "다음 코드를 리뷰하고 개선점을 제안해주세요: {코드}" },
  ],
  analyst: [
    { id: "data-report", name: "데이터 리포트", prompt: "다음 데이터를 분석하여 리포트를 작성해주세요: {데이터}" },
    { id: "insight", name: "인사이트 도출", prompt: "다음 데이터에서 비즈니스 인사이트를 도출해주세요: {데이터}" },
  ],
  pm: [
    { id: "meeting-summary", name: "회의 요약", prompt: "다음 회의 내용을 요약해주세요: {회의내용}" },
    { id: "requirement", name: "요구사항 도출", prompt: "다음 프로젝트의 요구사항을 도출해주세요: {프로젝트}" },
  ],
}

export default function CreatePage() {
  const [selectedRole, setSelectedRole] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [userInput, setUserInput] = useState("")
  const [generatedPrompt, setGeneratedPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState("")
  const [tokenCount, setTokenCount] = useState(0)
  const [cost, setCost] = useState(0)

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId)
    setSelectedTemplate("")
    setGeneratedPrompt("")
    setResult("")
  }

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = templates[selectedRole as keyof typeof templates]?.find(t => t.id === templateId)
    if (template) {
      setGeneratedPrompt(template.prompt)
    }
  }

  const handleGenerate = async () => {
    setIsLoading(true)
    
    // 시연용 더미 데이터
    setTimeout(() => {
      const dummyResults = {
        "marketing-copy": "🚀 혁신적인 {제품명}으로 당신의 일상을 완전히 바꿔보세요! <br/><br/>✨ 주요 특징:<br/>• 사용하기 쉬운 직관적인 인터페이스<br/>• 빠르고 정확한 성능<br/>• 합리적인 가격<br/><br/>💡 지금 바로 시작하고 변화를 경험해보세요!",
        "planning-doc": "📋 {주제} 기획서<br/><br/>🎯 목표:<br/>• 명확한 목표 설정<br/>• 구체적인 실행 계획<br/>• 예상 결과 및 KPI<br/><br/>📊 예산 및 일정:<br/>• 총 예산: 1,000만원<br/>• 기간: 3개월<br/>• 주요 마일스톤: 월별 진행상황 체크",
        "api-doc": "# {API명} API 문서<br/><br/>## 개요<br/>이 API는 {API명} 기능을 제공합니다.<br/><br/>## 엔드포인트<br/>`GET /api/{API명}`<br/><br/>## 파라미터<br/>- `id`: 고유 식별자<br/>- `format`: 응답 형식 (json/xml)<br/><br/>## 응답 예시<br/>```json<br/>{<br/>  \"status\": \"success\",<br/>  \"data\": {...}<br/>}<br/>```",
        "data-report": "📊 {데이터} 분석 리포트<br/><br/>📈 주요 지표:<br/>• 총 매출: 1억 2천만원<br/>• 성장률: 15%<br/>• 고객 만족도: 4.5/5.0<br/><br/>🔍 인사이트:<br/>• Q4 매출이 가장 높음<br/>• 신규 고객 유입 증가<br/>• 재구매율 70% 달성",
      }
      
      const result = dummyResults[selectedTemplate as keyof typeof dummyResults] || "결과가 생성되었습니다."
      setResult(result)
      setTokenCount(Math.floor(Math.random() * 500) + 100)
      setCost(parseFloat((Math.random() * 0.1 + 0.01).toFixed(3)))
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">프롬프트 만들기</h1>
          <p className="text-gray-600">역할을 선택하고 템플릿을 활용하여 프롬프트를 생성해보세요</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 왼쪽: 프롬프트 생성 */}
          <div className="space-y-6">
            {/* 역할 선택 */}
            <Card>
              <CardHeader>
                <CardTitle>1. 역할 선택</CardTitle>
                <CardDescription>어떤 역할로 프롬프트를 작성하시나요?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {roles.map((role) => (
                    <Button
                      key={role.id}
                      variant={selectedRole === role.id ? "default" : "outline"}
                      className="h-auto p-4 flex flex-col items-center"
                      onClick={() => handleRoleSelect(role.id)}
                    >
                      <span className="text-2xl mb-2">{role.icon}</span>
                      <span className="font-semibold">{role.name}</span>
                      <span className="text-xs text-gray-500 mt-1">{role.description}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 템플릿 선택 */}
            {selectedRole && (
              <Card>
                <CardHeader>
                  <CardTitle>2. 템플릿 선택</CardTitle>
                  <CardDescription>사용할 템플릿을 선택하세요</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {templates[selectedRole as keyof typeof templates]?.map((template) => (
                      <Button
                        key={template.id}
                        variant={selectedTemplate === template.id ? "default" : "outline"}
                        className="w-full justify-start h-auto p-4"
                        onClick={() => handleTemplateSelect(template.id)}
                      >
                        <div className="text-left">
                          <div className="font-semibold">{template.name}</div>
                          <div className="text-sm text-gray-500 mt-1">{template.prompt}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 사용자 입력 */}
            {selectedTemplate && (
              <Card>
                <CardHeader>
                  <CardTitle>3. 세부 내용 입력</CardTitle>
                  <CardDescription>템플릿에 들어갈 구체적인 내용을 입력하세요</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="예: 새로운 스마트폰, AI 챗봇, 데이터 분석 프로젝트..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="min-h-[100px]"
                  />
                </CardContent>
              </Card>
            )}

            {/* 생성 버튼 */}
            {selectedTemplate && userInput && (
              <Button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? "생성 중..." : "프롬프트 생성 및 실행"}
              </Button>
            )}
          </div>

          {/* 오른쪽: 결과 미리보기 */}
          <div className="space-y-6">
            {/* 생성된 프롬프트 */}
            {generatedPrompt && (
              <Card>
                <CardHeader>
                  <CardTitle>생성된 프롬프트</CardTitle>
                  <CardDescription>템플릿과 입력값이 결합된 최종 프롬프트</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="whitespace-pre-wrap">{generatedPrompt.replace(/\{.*?\}/g, userInput)}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 실행 결과 */}
            {result && (
              <Card>
                <CardHeader>
                  <CardTitle>실행 결과</CardTitle>
                  <CardDescription>AI 모델의 응답 결과</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-white border p-4 rounded-lg">
                    <div className="whitespace-pre-wrap">{result.replace(/\{.*?\}/g, userInput)}</div>
                  </div>
                  
                  {/* 토큰 및 비용 정보 */}
                  <div className="mt-4 flex justify-between text-sm text-gray-500">
                    <span>토큰 수: {tokenCount.toLocaleString()}</span>
                    <span>예상 비용: ${cost}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 로딩 상태 */}
            {isLoading && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3">AI 모델이 응답을 생성하고 있습니다...</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 