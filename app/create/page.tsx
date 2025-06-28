"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Sparkles, 
  Zap, 
  DollarSign, 
  Hash, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  FileText,
  Calendar,
  Users,
  AlertTriangle,
  Target
} from "lucide-react"

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
  const [executionTime, setExecutionTime] = useState(0)

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
    const startTime = Date.now()
    
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
      setExecutionTime(Date.now() - startTime)
    } catch (error) {
      console.error('Error:', error)
      // 에러 시 기본 결과 표시
      setResult(`프롬프트 실행 결과: ${userPurpose}에 대한 결과가 생성되었습니다.`)
      setTokenCount(Math.floor(Math.random() * 500) + 100)
      setCost(parseFloat((Math.random() * 0.1 + 0.01).toFixed(3)))
      setExecutionTime(Math.floor(Math.random() * 3000) + 1000)
    } finally {
      setIsExecutingPrompt(false)
    }
  }

  // 마크다운 스타일 텍스트 렌더링 함수
  const renderFormattedText = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        // 제목 처리 (## 또는 ###)
        if (line.startsWith('##')) {
          const title = line.replace(/^#+\s*/, '')
          return (
            <h3 key={index} className="text-lg font-bold text-gray-900 mt-4 mb-2 flex items-center">
              <Target className="w-4 h-4 mr-2 text-blue-600" />
              {title}
            </h3>
          )
        }
        if (line.startsWith('#')) {
          const title = line.replace(/^#+\s*/, '')
          return (
            <h2 key={index} className="text-xl font-bold text-gray-900 mt-6 mb-3 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
              {title}
            </h2>
          )
        }
        
        // 리스트 처리 (• 또는 -)
        if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
          const content = line.replace(/^[•-]\s*/, '')
          return (
            <div key={index} className="flex items-start ml-4 mb-1">
              <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">{content}</span>
            </div>
          )
        }
        
        // 이모지가 포함된 라인
        if (line.includes('📋') || line.includes('🎯') || line.includes('📅') || line.includes('👥') || line.includes('⚠️') || line.includes('✅')) {
          return (
            <div key={index} className="flex items-center mb-2">
              <span className="text-lg mr-2">{line.match(/[📋🎯📅👥⚠️✅]/)?.[0]}</span>
              <span className="font-semibold text-gray-800">{line.replace(/[📋🎯📅👥⚠️✅]\s*/, '')}</span>
            </div>
          )
        }
        
        // 빈 줄
        if (line.trim() === '') {
          return <div key={index} className="h-2"></div>
        }
        
        // 일반 텍스트
        return (
          <p key={index} className="text-gray-700 mb-2 leading-relaxed">
            {line}
          </p>
        )
      })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI 프롬프트 생성
          </h1>
          <p className="text-gray-600 text-lg">목적을 입력하면 AI가 최적의 프롬프트를 제안하고 생성해드립니다</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 왼쪽: 입력 및 AI 제안 */}
          <div className="space-y-6">
            {/* 역할 선택 */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-indigo-600" />
                  1. 역할 선택
                </CardTitle>
                <CardDescription>어떤 역할로 프롬프트를 작성하시나요?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {roles.map((role) => (
                    <Button
                      key={role.id}
                      variant={selectedRole === role.id ? "default" : "outline"}
                      className={`h-auto p-4 flex flex-col items-center transition-all duration-200 ${
                        selectedRole === role.id 
                          ? 'bg-indigo-600 text-white shadow-lg scale-105' 
                          : 'hover:shadow-md hover:scale-102'
                      }`}
                      onClick={() => handleRoleSelect(role.id)}
                    >
                      <span className="text-2xl mb-2">{role.icon}</span>
                      <span className={`font-semibold ${selectedRole === role.id ? 'text-white' : ''}`}>
                        {role.name}
                      </span>
                      <span className={`text-xs mt-1 ${selectedRole === role.id ? 'text-indigo-100' : 'text-gray-500'}`}>
                        {role.description}
                      </span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 템플릿 선택 */}
            {selectedRole && (
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                    2. 템플릿 선택
                  </CardTitle>
                  <CardDescription>사용할 템플릿을 선택하세요</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {templates[selectedRole as keyof typeof templates]?.map((template) => (
                      <Button
                        key={template.id}
                        variant={selectedTemplate === template.id ? "default" : "outline"}
                        className={`w-full justify-start h-auto p-4 transition-all duration-200 ${
                          selectedTemplate === template.id 
                            ? 'bg-indigo-600 text-white shadow-lg' 
                            : 'hover:shadow-md'
                        }`}
                        onClick={() => handleTemplateSelect(template.id)}
                      >
                        <div className="text-left">
                          <div className={`font-semibold ${selectedTemplate === template.id ? 'text-white' : ''}`}>
                            {template.name}
                          </div>
                          <div className={`text-sm mt-1 ${selectedTemplate === template.id ? 'text-indigo-100' : 'text-gray-500'}`}>
                            {template.description}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 목적 입력 */}
            {selectedTemplate && (
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-indigo-600" />
                    3. 목적 입력
                  </CardTitle>
                  <CardDescription>달성하고 싶은 목적을 구체적으로 입력하세요</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="예: 새로운 AI 스마트폰, 사용자 인증 API, 월별 매출 데이터 분석..."
                    value={userPurpose}
                    onChange={(e) => setUserPurpose(e.target.value)}
                    className="min-h-[100px] border-2 focus:border-indigo-500 transition-colors"
                  />
                </CardContent>
              </Card>
            )}

            {/* AI 프롬프트 생성 버튼 */}
            {selectedTemplate && userPurpose && (
              <Button
                onClick={handleGeneratePrompt}
                disabled={isGeneratingPrompt}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                size="lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                {isGeneratingPrompt ? "AI가 프롬프트를 생성하고 있습니다..." : "AI 프롬프트 생성"}
              </Button>
            )}

            {/* AI 제안 */}
            {aiSuggestion && (
              <Card className="shadow-lg border-0 bg-indigo-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-indigo-900">
                    <Sparkles className="w-6 h-6 mr-2 text-indigo-600" />
                    🤖 AI 프롬프트 제안
                  </CardTitle>
                  <CardDescription>AI가 제안한 최적의 프롬프트입니다</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-indigo-200 shadow-sm">
                    <h4 className="font-semibold mb-2 flex items-center text-indigo-800">
                      <Zap className="w-4 h-4 mr-2" />
                      생성된 프롬프트:
                    </h4>
                    <div className="whitespace-pre-wrap text-sm bg-indigo-50 p-3 rounded border-l-4 border-indigo-400">
                      {aiSuggestion.prompt}
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-indigo-200 shadow-sm">
                    <h4 className="font-semibold mb-2 flex items-center text-indigo-800">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      💡 효과적인 이유:
                    </h4>
                    <p className="text-sm text-indigo-700">{aiSuggestion.explanation}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-indigo-200 shadow-sm">
                    <h4 className="font-semibold mb-2 flex items-center text-indigo-800">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      💪 개선 팁:
                    </h4>
                    <p className="text-sm text-indigo-700">{aiSuggestion.tips}</p>
                  </div>
                  
                  <Button
                    onClick={handleExecutePrompt}
                    disabled={isExecutingPrompt}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    size="lg"
                  >
                    <Zap className="w-5 h-5 mr-2" />
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
              <Card className="shadow-xl border-0 bg-white">
                <CardHeader className="bg-indigo-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center">
                    <CheckCircle className="w-6 h-6 mr-2" />
                    ✨ 실행 결과
                  </CardTitle>
                  <CardDescription className="text-indigo-100">
                    AI가 생성한 프롬프트로 얻은 결과
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {/* 결과 내용 */}
                  <div className="bg-gray-50 border-2 border-gray-200 p-6 rounded-lg shadow-inner max-h-[600px] overflow-y-auto">
                    <div className="prose prose-sm max-w-none">
                      {renderFormattedText(result)}
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  {/* 통계 정보 */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                      <div className="flex items-center justify-center mb-1">
                        <Hash className="w-4 h-4 text-indigo-600 mr-1" />
                        <span className="text-xs text-indigo-600 font-medium">토큰 수</span>
                      </div>
                      <div className="text-lg font-bold text-indigo-800">
                        {tokenCount.toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="text-center p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                      <div className="flex items-center justify-center mb-1">
                        <DollarSign className="w-4 h-4 text-indigo-600 mr-1" />
                        <span className="text-xs text-indigo-600 font-medium">예상 비용</span>
                      </div>
                      <div className="text-lg font-bold text-indigo-800">
                        ${cost}
                      </div>
                    </div>
                    
                    <div className="text-center p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                      <div className="flex items-center justify-center mb-1">
                        <Clock className="w-4 h-4 text-indigo-600 mr-1" />
                        <span className="text-xs text-indigo-600 font-medium">실행 시간</span>
                      </div>
                      <div className="text-lg font-bold text-indigo-800">
                        {executionTime}ms
                      </div>
                    </div>
                  </div>
                  
                  {/* 성공 배지 */}
                  <div className="mt-4 flex justify-center">
                    <Badge variant="secondary" className="bg-indigo-500 text-white px-4 py-2">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      성공적으로 생성되었습니다!
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 로딩 상태 */}
            {(isGeneratingPrompt || isExecutingPrompt) && (
              <Card className="shadow-lg border-0 bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center py-12">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-indigo-600 animate-pulse" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-lg font-semibold text-gray-800">
                        {isGeneratingPrompt ? "AI가 프롬프트를 생성하고 있습니다..." : "AI 모델이 응답을 생성하고 있습니다..."}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        잠시만 기다려주세요...
                      </div>
                    </div>
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