import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-blue-600">AI 프롬프트</span>
          </Link>
          
          <nav className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost">홈</Button>
            </Link>
            <Link href="/create">
              <Button variant="ghost">프롬프트 만들기</Button>
            </Link>
            <Link href="/gallery">
              <Button variant="ghost">갤러리</Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
} 