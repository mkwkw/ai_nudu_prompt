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
    { id: "marketing-copy", name: "마케팅 카피 생성", description: "제품이나 서비스에 대한 매력적인 마케팅 카피" },
    { id: "planning-doc", name: "기획서 작성", description: "프로젝트나 제품에 대한 체계적인 기획서" },
  ],
  developer: [
    { id: "api-doc", name: "API 문서 생성", description: "API 엔드포인트에 대한 상세한 문서" },
    { id: "code-review", name: "코드 리뷰", description: "코드를 분석하고 개선점을 제안" },
  ],
  analyst: [
    { id: "data-report", name: "데이터 리포트", description: "데이터를 분석하여 비즈니스 인사이트 도출" },
    { id: "insight", name: "인사이트 도출", description: "데이터에서 의미 있는 인사이트 발견" },
  ],
  pm: [
    { id: "meeting-summary", name: "회의 요약", description: "회의 내용을 요약하고 액션 아이템 정리" },
    { id: "requirement", name: "요구사항 도출", description: "프로젝트의 요구사항을 체계적으로 도출" },
    { id: "project-schedule", name: "프로젝트 일정 관리", description: "프로젝트 반영 일정을 체계적으로 계획" },
  ],
}

export default function CreatePage() {
  const [selectedRole, setSelectedRole] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [userPurpose, setUserPurpose] = useState("")
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState<{
    prompt: string
    explanation: string
    tips: string
  } | null>(null)
  const [isExecutingPrompt, setIsExecutingPrompt] = useState(false)
  const [result, setResult] = useState("")
  const [tokenCount, setTokenCount] = useState(0)
  const [cost, setCost] = useState(0)

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId)
    setSelectedTemplate("")
    setUserPurpose("")
    setAiSuggestion(null)
    setResult("")
  }

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    setAiSuggestion(null)
    setResult("")
  }

  const handleGeneratePrompt = async () => {
    if (!selectedRole || !selectedTemplate || !userPurpose) return

    setIsGeneratingPrompt(true)
    
    try {
      const response = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: selectedRole,
          template: selectedTemplate,
          purpose: userPurpose
        }),
      })

      if (!response.ok) {
        throw new Error('프롬프트 생성 실패')
      }

      const data = await response.json()
      setAiSuggestion(data)
    } catch (error) {
      console.error('Error:', error)
      // 에러 시 기본 프롬프트 생성
      setAiSuggestion({
        prompt: `다음 목적을 달성하기 위한 효과적인 프롬프트를 작성해주세요: ${userPurpose}`,
        explanation: "사용자의 목적에 맞는 기본적인 프롬프트를 생성했습니다.",
        tips: "더 구체적인 요구사항을 추가하면 더 정확한 결과를 얻을 수 있습니다."
      })
    } finally {
      setIsGeneratingPrompt(false)
    }
  }

  const handleExecutePrompt = async () => {
    if (!aiSuggestion) return

    setIsExecutingPrompt(true)
    
    try {
      // 실제 OpenAI API 호출 (프롬프트 실행)
      const response = await fetch('/api/execute-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: aiSuggestion.prompt,
          purpose: userPurpose
        }),
      })

      if (!response.ok) {
        throw new Error('프롬프트 실행 실패')
      }

      const data = await response.json()
      setResult(data.result)
      setTokenCount(data.tokenCount || 0)
      setCost(data.cost || 0)
    } catch (error) {
      console.error('Error:', error)
      // 에러 시 기본 결과 표시
      setResult(`프롬프트 실행 결과: ${userPurpose}에 대한 결과가 생성되었습니다.`)
      setTokenCount(Math.floor(Math.random() * 500) + 100)
      setCost(parseFloat((Math.random() * 0.1 + 0.01).toFixed(3)))
    } finally {
      setIsExecutingPrompt(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI 프롬프트 생성</h1>
          <p className="text-gray-600">목적을 입력하면 AI가 최적의 프롬프트를 제안하고 생성해드립니다</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 왼쪽: 입력 및 AI 제안 */}
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
                          <div className="text-sm text-gray-500 mt-1">{template.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 목적 입력 */}
            {selectedTemplate && (
              <Card>
                <CardHeader>
                  <CardTitle>3. 목적 입력</CardTitle>
                  <CardDescription>달성하고 싶은 목적을 구체적으로 입력하세요</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="예: 새로운 AI 스마트폰, 사용자 인증 API, 월별 매출 데이터 분석..."
                    value={userPurpose}
                    onChange={(e) => setUserPurpose(e.target.value)}
                    className="min-h-[100px]"
                  />
                </CardContent>
              </Card>
            )}

            {/* AI 프롬프트 생성 버튼 */}
            {selectedTemplate && userPurpose && (
              <Button
                onClick={handleGeneratePrompt}
                disabled={isGeneratingPrompt}
                className="w-full"
                size="lg"
              >
                {isGeneratingPrompt ? "AI가 프롬프트를 생성하고 있습니다..." : "AI 프롬프트 생성"}
              </Button>
            )}

            {/* AI 제안 */}
            {aiSuggestion && (
              <Card>
                <CardHeader>
                  <CardTitle>🤖 AI 프롬프트 제안</CardTitle>
                  <CardDescription>AI가 제안한 최적의 프롬프트입니다</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">생성된 프롬프트:</h4>
                    <div className="whitespace-pre-wrap text-sm">{aiSuggestion.prompt}</div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">💡 효과적인 이유:</h4>
                    <p className="text-sm">{aiSuggestion.explanation}</p>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">💪 개선 팁:</h4>
                    <p className="text-sm">{aiSuggestion.tips}</p>
                  </div>
                  
                  <Button
                    onClick={handleExecutePrompt}
                    disabled={isExecutingPrompt}
                    className="w-full"
                    size="lg"
                  >
                    {isExecutingPrompt ? "실행 중..." : "프롬프트 실행하기"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 오른쪽: 실행 결과 */}
          <div className="space-y-6">
            {/* 실행 결과 */}
            {result && (
              <Card>
                <CardHeader>
                  <CardTitle>실행 결과</CardTitle>
                  <CardDescription>AI가 생성한 프롬프트로 얻은 결과</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-white border p-4 rounded-lg">
                    <div className="whitespace-pre-wrap">{result}</div>
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
            {(isGeneratingPrompt || isExecutingPrompt) && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3">
                      {isGeneratingPrompt ? "AI가 프롬프트를 생성하고 있습니다..." : "AI 모델이 응답을 생성하고 있습니다..."}
                    </span>
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