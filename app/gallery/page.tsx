"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const templates = [
  {
    id: "marketing-copy",
    title: "마케팅 카피 생성",
    description: "제품이나 서비스에 대한 매력적인 마케팅 카피를 생성합니다",
    category: "마케팅",
    author: "기획팀",
    usage: 1247,
    tags: ["마케팅", "카피", "제품"],
    prompt: "다음 제품에 대한 매력적인 마케팅 카피를 작성해주세요: {제품명}",
    example: "새로운 AI 스마트폰",
  },
  {
    id: "api-doc",
    title: "API 문서 생성",
    description: "API 엔드포인트에 대한 상세한 문서를 자동으로 생성합니다",
    category: "개발",
    author: "개발팀",
    usage: 892,
    tags: ["API", "문서", "개발"],
    prompt: "다음 API에 대한 문서를 작성해주세요: {API명}",
    example: "사용자 인증 API",
  },
  {
    id: "data-report",
    title: "데이터 분석 리포트",
    description: "데이터를 분석하여 비즈니스 인사이트가 담긴 리포트를 작성합니다",
    category: "분석",
    author: "데이터팀",
    usage: 567,
    tags: ["데이터", "분석", "리포트"],
    prompt: "다음 데이터를 분석하여 리포트를 작성해주세요: {데이터}",
    example: "월별 매출 데이터",
  },
  {
    id: "meeting-summary",
    title: "회의 요약",
    description: "회의 내용을 요약하고 액션 아이템을 정리합니다",
    category: "업무",
    author: "PM팀",
    usage: 445,
    tags: ["회의", "요약", "업무"],
    prompt: "다음 회의 내용을 요약해주세요: {회의내용}",
    example: "분기별 전략 회의",
  },
  {
    id: "code-review",
    title: "코드 리뷰",
    description: "코드를 분석하고 개선점을 제안합니다",
    category: "개발",
    author: "개발팀",
    usage: 334,
    tags: ["코드", "리뷰", "개발"],
    prompt: "다음 코드를 리뷰하고 개선점을 제안해주세요: {코드}",
    example: "React 컴포넌트",
  },
  {
    id: "planning-doc",
    title: "기획서 작성",
    description: "프로젝트나 제품에 대한 체계적인 기획서를 작성합니다",
    category: "기획",
    author: "기획팀",
    usage: 289,
    tags: ["기획", "문서", "프로젝트"],
    prompt: "다음 주제에 대한 기획서를 작성해주세요: {주제}",
    example: "모바일 앱 개발",
  },
]

const categories = ["전체", "마케팅", "개발", "분석", "업무", "기획"]

export default function GalleryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "전체" || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleCopy = (templateId: string) => {
    setCopiedId(templateId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">템플릿 갤러리</h1>
          <p className="text-gray-600">팀에서 공유된 베스트 프롬프트 템플릿들을 확인하고 활용해보세요</p>
        </div>

        {/* 검색 및 필터 */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="템플릿 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* 템플릿 그리드 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{template.title}</CardTitle>
                    <CardDescription className="mt-2">{template.description}</CardDescription>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {template.category}
                  </span>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* 프롬프트 미리보기 */}
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-sm font-mono">{template.prompt}</p>
                  </div>
                  
                  {/* 예시 */}
                  <div>
                    <p className="text-xs text-gray-500 mb-1">예시:</p>
                    <p className="text-sm bg-blue-50 p-2 rounded">{template.example}</p>
                  </div>
                  
                  {/* 태그 */}
                  <div className="flex flex-wrap gap-1">
                    {template.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* 메타 정보 */}
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>작성자: {template.author}</span>
                    <span>사용 {template.usage}회</span>
                  </div>
                  
                  {/* 액션 버튼 */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleCopy(template.id)}
                    >
                      {copiedId === template.id ? "복사됨!" : "복제하기"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = `/create?template=${template.id}`}
                    >
                      사용하기
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 결과 없음 */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">검색 결과가 없습니다</h3>
            <p className="text-gray-500">다른 검색어나 카테고리를 시도해보세요</p>
          </div>
        )}
      </div>
    </div>
  )
} 