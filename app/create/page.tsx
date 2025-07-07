"use client"

import { useState } from "react"
import { useRef } from "react"
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
  type ProjectResult = { title: string; tableRows: string[][] } | string
  const [result, setResult] = useState<ProjectResult>("")
  const [tokenCount, setTokenCount] = useState(0)
  const [cost, setCost] = useState(0)
  const [executionTime, setExecutionTime] = useState(0)
  const [missingFields, setMissingFields] = useState<string[]>([])
  const [pendingPurpose, setPendingPurpose] = useState<string>("")
  const [missingFieldsText, setMissingFieldsText] = useState("")
  const [purposeGuide, setPurposeGuide] = useState<string>("달성하고 싶은 목적을 구체적으로 입력하세요")
  const [copySuccess, setCopySuccess] = useState("")
  const promptRef = useRef<HTMLDivElement>(null)

  // 항목 추출/검사 함수
  function checkProjectFields(text: string) {
    // 날짜 패턴: 숫자/숫자
    const datePattern = /\d{1,2}\/\d{1,2}/
    // 오픈 관련
    const openPattern = /((오픈|런칭|open|launch)[^\n\d]{0,10}\d{1,2}\/\d{1,2})|((\d{1,2}\/\d{1,2})[^\n\d]{0,10}(오픈|런칭|open|launch))/i
    // 시작 관련
    const startPattern = /((시작|start)[^\n\d]{0,10}\d{1,2}\/\d{1,2})|((\d{1,2}\/\d{1,2})[^\n\d]{0,10}(시작|start))/i
    // 종료 관련
    const endPattern = /((종료|end)[^\n\d]{0,10}\d{1,2}\/\d{1,2})|((\d{1,2}\/\d{1,2})[^\n\d]{0,10}(종료|end))/i

    const fields = [
      {
        key: "startDate",
        label: "프로젝트 시작 날짜",
        regex: /(시작[일|날짜|일자]|kickoff|start|이번 ?달부터 ?시작|다음 ?달부터 ?시작)/i,
        dateRegex: startPattern
      },
      {
        key: "openDate",
        label: "프로젝트 오픈 날짜",
        regex: /(오픈[일|날짜|일자]|런칭|open|launch)/i,
        dateRegex: openPattern
      },
      {
        key: "members",
        label: "프로젝트에 할당된 인력 정보",
        regex: /(인력|리소스|멤버|투입|담당자|팀원|engineer|developer|member|resource)/i
      },
      {
        key: "endDate",
        label: "프로젝트 종료 날짜",
        regex: /(종료[일|날짜|일자]|end)/i,
        dateRegex: endPattern
      },
    ]
    const missing = fields.filter(f => {
      if (f.key === "members") {
        return !f.regex.test(text)
      } else if (f.dateRegex) {
        // 날짜 키워드는 키워드+숫자/숫자 조합 또는 기존 키워드만으로도 인정
        return !(f.regex.test(text) && (datePattern.test(text) || f.dateRegex.test(text))) && !f.dateRegex.test(text)
      } else {
        return !f.regex.test(text)
      }
    })
    // endDate는 필수 아님, 기존 필수 3개만 반환
    return missing.filter(f => ["startDate", "openDate", "members"].includes(f.key)).map(f => f.key)
  }

  // 프로젝트 정보 추출 함수
  function extractProjectInfo(text: string) {
    // 시작 날짜: 2025/01/10 또는 1/10 등
    const startDateMatch = text.match(/(20\d{2}[./-]\d{1,2}[./-]\d{1,2}|\d{1,2}[./-]\d{1,2})[\s\S]{0,10}(시작|kickoff)/i)
    let startDate = startDateMatch ? startDateMatch[1] : ''
    if (!startDate && /시작[일|날짜|일자]/.test(text)) {
      // "시작" 키워드만 있을 때 월/일 추출
      const dateMatch = text.match(/(20\d{2}[./-]\d{1,2}[./-]\d{1,2}|\d{1,2}[./-]\d{1,2})/)
      startDate = dateMatch ? dateMatch[1] : ''
    }
    // 오픈 날짜: 2025/02/16 또는 2/16 등
    const openDateMatch = text.match(/(20\d{2}[./-]\d{1,2}[./-]\d{1,2}|\d{1,2}[./-]\d{1,2})[\s\S]{0,10}(오픈|런칭|open|launch)/i)
    let openDate = openDateMatch ? openDateMatch[1] : ''
    if (!openDate && /(오픈|런칭|open|launch)/i.test(text)) {
      const dateMatch = text.match(/(20\d{2}[./-]\d{1,2}[./-]\d{1,2}|\d{1,2}[./-]\d{1,2})/)
      openDate = dateMatch ? dateMatch[1] : ''
    }
    // 투입 인력: "3명", "홍길동 외 2명", "5명", "3인", "개발자 2명" 등
    const memberMatch = text.match(/([가-힣a-zA-Z0-9,\s]+)?(\d+) ?(명|인|engineer|member|개발자|팀원)/i)
    let members = memberMatch ? memberMatch[0] : ''
    return { startDate, openDate, members }
  }

  // 연도 없는 월/일을 2025년으로 자동 변환하는 함수
  function addYearToDates(text: string) {
    // 2025년 기준
    const year = 2025
    // 각 줄마다 검사
    return text.split(/\n/).map(line => {
      // 이미 연도가 있으면 그대로
      if (/(\d{4}|\d{2})[./년]/.test(line)) return line
      // 월/일 패턴 찾기
      // 예: 12/10, 7/1, 07/01 등
      return line.replace(/(\d{1,2})\/(\d{1,2})/g, `${year}/$1/$2`)
    }).join('\n')
  }

  // 항목별 label 매핑
  const fieldLabels: { [key: string]: string } = {
    startDate: "프로젝트 시작 날짜",
    openDate: "프로젝트 오픈 날짜",
    members: "프로젝트에 투입될 인력 정보",
  }

  // 목적 입력란이 변경될 때는 값만 변경, 안내문구는 항상 기본값으로 리셋
  const handlePurposeChange = (value: string) => {
    setUserPurpose(value)
    setPurposeGuide("달성하고 싶은 목적을 구체적으로 입력하세요")
    // missingFields는 여기서 업데이트하지 않음
  }

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

  // 프롬프트 생성 버튼 클릭 시에만 누락 항목 검사 및 안내문구 업데이트
  const handleGeneratePrompt = async () => {
    if (!selectedRole || !selectedTemplate || !userPurpose) return
    let processedPurpose = userPurpose
    if (selectedTemplate === "project-schedule") {
      // 연도 없는 월/일을 2025년으로 변환
      processedPurpose = addYearToDates(userPurpose)
      const missing = checkProjectFields(processedPurpose)
      setMissingFields(missing)
      if (missing.length > 0) {
        setPurposeGuide(`프로젝트 일정 생성을 위하여 ${missing.map(f => fieldLabels[f]).join('과 ')}을(를) 입력해주세요.`)
        return
      } else {
        setPurposeGuide("달성하고 싶은 목적을 구체적으로 입력하세요")
      }
    } else {
      setMissingFields([])
      setPurposeGuide("달성하고 싶은 목적을 구체적으로 입력하세요")
    }
    setIsGeneratingPrompt(true)
    setMissingFields([])
    setPurposeGuide("달성하고 싶은 목적을 구체적으로 입력하세요")
    setPendingPurpose("")
    setMissingFieldsText("")
    try {
      const response = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: selectedRole,
          template: selectedTemplate,
          purpose: processedPurpose
        }),
      })
      if (!response.ok) {
        throw new Error('프롬프트 생성 실패')
      }
      const data = await response.json()
      setAiSuggestion(data)
    } catch (error) {
      setAiSuggestion({
        prompt: `다음 목적을 달성하기 위한 효과적인 프롬프트를 작성해주세요: ${processedPurpose}`,
        explanation: "사용자의 목적에 맞는 기본적인 프롬프트를 생성했습니다.",
        tips: "더 구체적인 요구사항을 추가하면 더 정확한 결과를 얻을 수 있습니다."
      })
    } finally {
      setIsGeneratingPrompt(false)
    }
  }

  // 누락 항목 추가 입력 후 최종 프롬프트 생성 (줄글로 입력)
  const handleMissingFieldsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // 기존 목적 + 추가 입력값 합치기
    let newPurpose = pendingPurpose + '\n' + missingFieldsText
    // 다시 누락 항목 검사
    const stillMissing = checkProjectFields(newPurpose)
    if (stillMissing.length > 0) {
      setMissingFields(stillMissing)
      setPendingPurpose(newPurpose)
      setMissingFieldsText("")
      return
    }
    setUserPurpose(newPurpose)
    setMissingFields([])
    setPendingPurpose("")
    setMissingFieldsText("")
    // 프롬프트 생성 재시도
    setTimeout(() => handleGeneratePrompt(), 0)
  }

  const handleExecutePrompt = async () => {
    if (!aiSuggestion) return

    setIsExecutingPrompt(true)
    const startTime = Date.now()

    try {
      // 입력값에서 프로젝트 정보 추출
      const { startDate, openDate, members } = extractProjectInfo(userPurpose)

      // 날짜 파싱 함수
      function parseDate(str: string): Date | null {
        if (!str) return null
        let s = str.replace(/\./g, '/').replace(/-/g, '/').trim()
        if (/^\d{1,2}\/\d{1,2}$/.test(s)) s = `2025/${s}`
        if (/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(s)) return new Date(s)
        return null
      }
      const start = parseDate(startDate)
      const open = parseDate(openDate)
      // 기본값: 시작일 2025/01/10, 오픈일 2025/02/16
      const defaultStart = new Date('2025/01/10')
      const defaultOpen = new Date('2025/02/16')
      const s = start || defaultStart
      const o = open || defaultOpen
      // 전체 기간(일)
      const totalDays = Math.max(1, Math.round((o.getTime() - s.getTime()) / (1000*60*60*24)))
      // 단계별 기간(일) 비율
      const steps = [
        { name: '1차 보고', work: '착수, 요구사항 1차 확인' },
        { name: '2차 보고', work: '중간 점검, 이슈 공유' },
        { name: '분석/설계', work: '요구사항 분석, 설계 산출물 작성' },
        { name: '개발', work: '프론트/백엔드, API 개발' },
        { name: '단위 테스트', work: '기능별 단위 테스트' },
        { name: '통합 테스트', work: '전체 시스템 통합 테스트' },
        { name: '오픈', work: '배포, 오픈 체크리스트 점검' },
        { name: '모니터링', work: '시스템 모니터링, 장애 대응' },
      ]
      function fmt(date: Date): string {
        return `${date.getFullYear()}/${(date.getMonth()+1).toString().padStart(2,'0')}/${date.getDate().toString().padStart(2,'0')}`
      }
      // 오픈 전 단계(1차~통합테스트) 기간 계산
      const openIdx = 6 // 오픈 단계 인덱스
      const monitorIdx = 7 // 모니터링 단계 인덱스
      const n = openIdx // 오픈 전 단계 개수(0~5: 6개, 0~6: 7개)
      const openDateObj = new Date(o)
      const startDateObj = new Date(s)
      // 오픈 전 마지막 단계(통합테스트) 종료일 = 오픈일 하루 전
      const openDay = new Date(openDateObj)
      openDay.setDate(openDay.getDate() - 1)
      // 오픈 전 전체 기간(일)
      const preOpenDays = Math.max(1, Math.round((openDay.getTime() - startDateObj.getTime()) / (1000*60*60*24)) + 1)
      // 오픈 전 단계별 기간(균등 분배)
      const base = Math.floor(preOpenDays / n)
      const remain = preOpenDays % n
      const stepDays = Array(n).fill(base).map((v, i) => v + (i < remain ? 1 : 0))
      // 오픈 단계: 오픈일 하루(고정)
      stepDays.push(1)
      // 모니터링: 28일(4주)
      stepDays.push(28)
      // 각 단계별 시작/종료일 계산
      let cur = new Date(startDateObj)
      const rows = steps.map((step, i) => {
        const days = stepDays[i]
        const from = new Date(cur)
        cur.setDate(cur.getDate() + days - 1)
        const to = new Date(cur)
        cur.setDate(cur.getDate() + 1)
        // 오픈 단계는 오픈일과 맞춤, 모니터링은 오픈일+1~오픈일+28
        if (i === openIdx) {
          return `| ${step.name} | ${step.work} | ${fmt(openDateObj)} | |`
        }
        if (i === monitorIdx) {
          const monitorStart = new Date(openDateObj)
          monitorStart.setDate(monitorStart.getDate() + 1)
          const monitorEnd = new Date(openDateObj)
          monitorEnd.setDate(monitorEnd.getDate() + 28)
          return `| ${step.name} | ${step.work} | ${fmt(monitorStart)}~${fmt(monitorEnd)} | 운영팀 담당 |`
        }
        return `| ${step.name} | ${step.work} | ${fmt(from)}~${fmt(to)} | ${i===3 && members ? members : ''} |`
      })
      // 표 헤더
      const tableHeader = '| 단계 | 주요 작업 | 예상 기간 | 비고 |\n|------|--------------------------|---------------------|------|'
      // 최종 보고서
      setResult({
        title: '프로젝트 일정 제안',
        tableRows: [
          ['단계', '주요 작업', '예상 기간', '비고'],
          ...rows.map(row => row.split('|').slice(1, 5).map(cell => cell.trim())),
        ]
      })
      setTokenCount(0)
      setCost(0)
      setExecutionTime(Date.now() - startTime)
    } catch (error) {
      console.error('Error:', error)
      setResult(`프로젝트 일정 제안 생성 중 오류가 발생했습니다.`)
      setTokenCount(0)
      setCost(0)
      setExecutionTime(Date.now() - startTime)
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

  // 복사 버튼 핸들러
  const handleCopyPrompt = async () => {
    if (aiSuggestion?.prompt) {
      try {
        await navigator.clipboard.writeText(aiSuggestion.prompt)
        setCopySuccess("복사됨!")
        setTimeout(() => setCopySuccess(""), 1500)
      } catch {
        setCopySuccess("복사 실패")
        setTimeout(() => setCopySuccess(""), 1500)
      }
    }
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
                  <CardDescription>{purposeGuide}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="예: 새로운 AI 스마트폰, 사용자 인증 API, 월별 매출 데이터 분석..."
                    value={userPurpose}
                    onChange={(e) => handlePurposeChange(e.target.value)}
                    className="min-h-[100px] border-2 focus:border-indigo-500 transition-colors"
                  />
                  {/* 누락 항목 안내 */}
                  {missingFields.length > 0 && (
                    <div className="mt-3 text-yellow-800 bg-yellow-50 border border-yellow-200 rounded p-3 text-sm font-semibold">
                      프로젝트 일정 생성을 위하여 {missingFields.map(f => fieldLabels[f]).join('과 ')}을(를) 입력해주세요.
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* AI 프롬프트 생성 버튼 */}
            {selectedTemplate && (
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
                  <div className="bg-white p-4 rounded-lg border border-indigo-200 shadow-sm relative">
                    <h4 className="font-semibold mb-2 flex items-center text-indigo-800">
                      <Zap className="w-4 h-4 mr-2" />
                      생성된 프롬프트:
                      <button
                        type="button"
                        onClick={handleCopyPrompt}
                        className="ml-auto px-3 py-1 text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded border border-indigo-300 transition-all ml-4"
                      >
                        복사
                      </button>
                      {copySuccess && (
                        <span className="ml-2 text-green-600 text-xs font-semibold">{copySuccess}</span>
                      )}
                    </h4>
                    <div
                      ref={promptRef}
                      className="whitespace-pre-wrap text-sm bg-indigo-50 p-3 rounded border-l-4 border-indigo-400"
                    >
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
                    {typeof result === 'object' && (result as any)?.tableRows ? (
                      <div>
                        <h2 className="text-2xl font-bold mb-4 text-center">{(result as any).title}</h2>
                        <div className="overflow-x-auto">
                          <table className="min-w-full border border-gray-300 rounded-lg bg-white">
                            <thead>
                              <tr>
                                {(result as any).tableRows[0].map((cell: string, idx: number) => (
                                  <th key={idx} className="px-4 py-2 bg-indigo-100 text-indigo-800 font-semibold border-b border-gray-300 text-center">{cell}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {(result as any).tableRows.slice(1).map((row: string[], i: number) => (
                                <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                  {row.map((cell: string, j: number) => (
                                    <td key={j} className="px-4 py-2 border-b border-gray-200 text-center whitespace-nowrap">{cell}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="prose prose-sm max-w-none">
                        {renderFormattedText(result as string)}
                      </div>
                    )}
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
