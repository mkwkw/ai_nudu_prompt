import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            너도 할 수 있어, 프롬프트 작성
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            모든 조직 구성원이 '프롬프트 엔지니어'가 되지 않아도, <br/> 자연어로 쉽게 고품질 프롬프트를 작성·공유·개선할 수 있는 원스톱 플랫폼
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/create">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                프롬프트 만들기
              </Button>
            </Link>
            <Link href="/gallery">
              <Button variant="outline" size="lg">
                템플릿 갤러리
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-center">🎯 역할 기반 추천</CardTitle>
              <CardDescription className="text-center">
                기획자, 개발자, 분석가 등 역할에 맞는 <br/> 최적의 프롬프트 템플릿을 자동으로 추천
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-center">⚡ 실시간 미리보기</CardTitle>
              <CardDescription className="text-center">
                프롬프트 작성과 동시에 결과를 미리보기하고 <br/> 토큰 수와 비용을 실시간으로 확인
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-center">🤝 협업 & 공유</CardTitle>
              <CardDescription className="text-center">
                팀 내 Best Practice를 갤러리에 공유하고 <br/> 동료들과 함께 프롬프트를 개선
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Target Users */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">당신은 어떤 역할인가요?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📝</span>
                  </div>
                  <h3 className="font-semibold mb-2">새내기 기획자</h3>
                  <p className="text-sm text-gray-900">마케팅 카피를 빠르게 뽑고 싶은 분</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💻</span>
                  </div>
                  <h3 className="font-semibold mb-2">개발자</h3>
                  <p className="text-sm text-gray-900">API 자동화를 위한 변수·버전 관리</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="font-semibold mb-2">데이터 분석가</h3>
                  <p className="text-sm text-gray-900">반복 레포트 작성용 템플릿</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📋</span>
                  </div>
                  <h3 className="font-semibold mb-2">PM</h3>
                  <p className="text-sm text-gray-900">일정관리, 비용관리, 회의 요약 자동화</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
} 