import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

import Header from "@/components/Header";
import { AuthProvider } from "@/lib/useAuth";

export const metadata: Metadata = {
  title: "우리동네문화클럽- 직장인밴드연합회",
  description: "초보부터 베테랑까지 함께하는 우리 동네 음악 놀이터",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "우리동네문화클럽- 직장인밴드연합회",
    description: "초보부터 베테랑까지 함께하는 우리 동네 음악 놀이터",
    url: "https://cultureclub24.com",
    siteName: "우리동네문화클럽- 직장인밴드연합회",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "우리동네문화클럽 로고",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`bg-gray-50 text-gray-900 min-h-screen flex flex-col font-sans`}>
        <AuthProvider>
          {/* Navigation Bar Header Client Component */}
          <Header />

          <main className="flex-1 w-full flex flex-col">
            {children}
        </main>

        <footer className="bg-primary text-slate-600 py-12 mt-auto border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="flex flex-col gap-2">
              <div className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-3">
                <div className="w-12 h-12 flex items-center justify-center overflow-hidden relative">
                  <Image 
                    src="/logo.png" 
                    alt="로고" 
                    fill
                    className="object-contain"
                  />
                </div>
                사단법인직장인밴드연합회
              </div>
              <p className="text-sm text-slate-500">법인명: 사단법인직장인밴드연합회 | 대표자: 도욱상 | 등록번호: 110221-0016189</p>
              <p className="text-sm text-slate-500">주소: 효령로4길 56-16</p>
              <p className="text-sm text-slate-500">이메일: dowooksang@gmail.com</p>
              <div className="text-xs text-slate-400 mt-4">
                © {new Date().getFullYear()} 사단법인직장인밴드연합회. All rights reserved.
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <Link href="/terms" className="hover:text-slate-900 transition-colors">이용약관</Link>
                <Link href="/privacy" className="hover:text-slate-900 transition-colors">개인정보처리방침</Link>
                <Link href="/about/contact" className="hover:text-slate-900 transition-colors">오시는길</Link>
              </div>
              <div className="flex gap-3 mt-2 md:mt-0 md:justify-end">
                {/* SNS Icons */}
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-[#1877F2]/20 hover:bg-[#1877F2] text-[#1877F2] hover:text-white flex items-center justify-center cursor-pointer transition-all shadow-sm">
                  <span className="sr-only">Facebook</span>
                  <span className="font-bold">F</span>
                </a>
                <a href="https://pf.kakao.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-[#FEE500]/20 hover:bg-[#FEE500] text-[#FEE500] hover:text-[#371D1E] flex items-center justify-center cursor-pointer transition-all shadow-sm">
                  <span className="sr-only">KakaoTalk</span>
                  <span className="font-bold text-[10px]">TALK</span>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-[#E4405F]/20 hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] text-[#E4405F] hover:text-white flex items-center justify-center cursor-pointer transition-all shadow-sm">
                  <span className="sr-only">Instagram</span>
                  <span className="font-bold">I</span>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-[#FF0000]/20 hover:bg-[#FF0000] text-[#FF0000] hover:text-white flex items-center justify-center cursor-pointer transition-all shadow-sm">
                  <span className="sr-only">YouTube</span>
                  <span className="font-bold">Y</span>
                </a>
              </div>
            </div>
          </div>
        </footer>
        {/* Floating Quick Action */}
        </AuthProvider>
      </body>
    </html>
  );
}
