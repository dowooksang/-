'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuth, getLevelName } from '@/lib/useAuth';
import { UserLevel } from '@/lib/store';
import { useEffect } from 'react';
import Link from 'next/link';

export default function NetworkLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      if (!user) {
        alert('로그인이 필요합니다.');
        router.push('/login');
      } else if (user.level < UserLevel.LV4_MANAGER) {
        alert('지부장급 이상의 관리자만 접근할 수 있는 메뉴입니다.');
        router.push('/');
      }
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || !user || user.level < UserLevel.LV4_MANAGER) {
    return <div className="min-h-screen bg-primary flex items-center justify-center text-white">권한 확인 중...</div>;
  }

  const subMenus = [
    { href: '/network/festivals', label: '전국 음악 축제 DB', desc: '공공데이터 기반 행사 현황' },
    { href: '/network/guide', label: '공동 기획 가이드', desc: '제안서 템플릿 및 사례 공유' },
    { href: '/network/sponsorship', label: '기업 후원 매칭', desc: '물품 협찬 및 장비 지원' },
  ];

  return (
    <div className="min-h-screen bg-primary text-gray-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0A103D] via-[#1A2255] to-[#0A103D] border-b-2 border-accent py-16 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] bg-accent rounded-full mix-blend-overlay filter blur-[100px]"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[150%] bg-[#5486B2] rounded-full mix-blend-overlay filter blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-accent/20 text-accent border border-accent/30 text-sm font-bold mb-4 tracking-widest">
            {getLevelName(user.level)} 전용
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
            네트워크 협력·축제 보드
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            전국 단위의 행사 데이터를 활용하고 본부-지부 간 협력을 통해 더 큰 무대를 기획하세요.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Nav */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <div className="bg-[#111827] rounded-2xl border border-white/10 overflow-hidden sticky top-36 shadow-2xl">
            <div className="p-6 border-b border-white/5 bg-white/5">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-accent">⚡</span> 전략 네트워크
              </h2>
            </div>
            <nav className="p-4 flex flex-col gap-2">
              {subMenus.map((menu) => {
                const isActive = pathname.startsWith(menu.href);
                return (
                  <Link
                    key={menu.href}
                    href={menu.href}
                    className={`block p-4 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-accent text-[#0A103D] shadow-lg translate-x-2 font-bold' 
                        : 'text-gray-300 hover:bg-white/10 hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="text-lg">{menu.label}</div>
                    <div className={`text-xs mt-1 ${isActive ? 'text-[#0A103D]/80' : 'text-gray-500'}`}>
                      {menu.desc}
                    </div>
                  </Link>
                );
              })}
            </nav>
            <div className="p-6 border-t border-white/5 bg-gradient-to-br from-transparent to-[#1A2255]/30">
              <div className="text-sm text-gray-400 mb-2">현재 접속자</div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold border border-accent/30">
                  {user.nickname.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-white">{user.nickname}</div>
                  <div className="text-xs text-accent">{getLevelName(user.level)}</div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-[#111827] rounded-2xl border border-white/10 shadow-2xl p-8 min-h-[600px]">
          {children}
        </main>
      </div>
    </div>
  );
}
