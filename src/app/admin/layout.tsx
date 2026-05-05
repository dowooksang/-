'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { UserLevel } from '@/lib/store';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      if (!user) {
        alert('로그인이 필요합니다.');
        router.push('/login');
      } else if (user.level !== UserLevel.ADMIN) {
        alert('관리자 전용 페이지입니다.');
        router.push('/');
      }
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || !user || user.level !== UserLevel.ADMIN) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">권한 확인 중...</div>;
  }

  const menuItems = [
    { href: '/admin', label: '대시보드 홈', icon: '📊' },
    { href: '/admin/members', label: '회원 목록 및 관리', icon: '👥' },
    { href: '/admin/posts', label: '게시물 통합 관리', icon: '📝' },
    { href: '/admin/branches', label: '동호회/지부 관리 (준비중)', icon: '🏢' },
    { href: '/admin/finance', label: '회비/협찬 내역 (준비중)', icon: '💰' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0A103D] text-white flex flex-col shadow-xl flex-shrink-0 relative z-10">
        <div className="p-6 border-b border-white/10 text-center">
          <h2 className="text-xl font-black text-accent tracking-wide">CMS ADMIN</h2>
          <p className="text-xs text-gray-400 mt-2">사단법인 직장인밴드연합회</p>
        </div>
        <nav className="flex-1 py-6 px-4 flex flex-col gap-2">
          {menuItems.map(item => (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                pathname === item.href 
                  ? 'bg-accent text-[#0A103D] shadow-md translate-x-1' 
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-6 border-t border-white/10">
          <Link href="/" className="flex items-center justify-center gap-2 w-full py-3 bg-white/10 rounded-xl text-sm font-medium hover:bg-white/20 transition-colors">
            🏠 사이트 홈으로 이동
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-0 h-screen overflow-hidden">
        <header className="bg-white shadow-sm h-16 flex items-center px-8 flex-shrink-0 justify-between">
          <h1 className="text-lg font-bold text-gray-800">
            {menuItems.find(m => m.href === pathname)?.label || '관리자 페이지'}
          </h1>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#5486B2] text-white flex items-center justify-center font-bold shadow-sm">
              {user.nickname.charAt(0)}
            </div>
            <span className="text-sm font-medium text-gray-700">{user.nickname} (최고관리자)</span>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
