'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useAuth, getLevelName } from '@/lib/useAuth';
import { UserLevel } from '@/lib/store';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, isLoaded, logout } = useAuth();

  const baseNavLinks = [
    { 
      href: '/about', 
      label: '법인 소개',
      subItems: [
        { href: '/about/greetings', label: '인사말', icon: '🎤' },
        { href: '/about/history', label: '설립 취지 및 연혁', icon: '⏳' },
        { href: '/about/organization', label: '조직도 및 지부', icon: '🏢' },
        { href: '/about/governance', label: '정관 및 공시자료', icon: '📜' },
        { href: '/about/contact', label: '오시는 길', icon: '📍' }
      ]
    },
    { 
      href: '/activity', 
      label: '연합회활동',
      subItems: [
        { href: '/activity/gallery', label: '활동갤러리', icon: '📸' },
        { href: '/activity/video', label: '공연영상', icon: '🎬' }
      ]
    },
    { 
      href: '/solo', 
      label: '방구석 아티스트',
      subItems: [
        { href: '/solo/jam', label: '방구석에선 내가 왕 ㅋㅋ', icon: '🎸' },
        { href: '/solo/group', label: '소모임 및 매칭', icon: '🤝' },
        { href: '/solo/lesson', label: '레슨 및 장비리뷰', icon: '📖' },
        { href: '/solo/debut', label: '무대 데뷔 신청', icon: '🎤' }
      ]
    },
    {  
      href: '/community', 
      label: '커뮤니티',
      subItems: [
        { href: '/board?category=greeting', label: '가입인사', icon: '👋' },
        { href: '/board?category=free', label: '소통 (자유게시판)', icon: '💬' },
        { href: '/board?category=promotion', label: '소속 동호회(클럽) 홍보', icon: '🎸' },
        { href: '/board?category=market', label: '악기/장비 장터', icon: '🛒' },
        { href: '/board?category=archive', label: '활동 자료실', icon: '📁' },
        { href: '/board?category=qa', label: '건의 및 Q&A', icon: '❓' }
      ]
    },
    { 
      href: '/news', 
      label: '소식/알림',
      subItems: [
        { href: '/board?category=notice', label: '공지사항', icon: '📢' },
        { href: '/board?category=press', label: '보도자료 (통합)', icon: '📰' },
        { href: '/board?category=event', label: '이벤트 (통합)', icon: '🎉' }
      ]
    },
    { 
      href: '/share', 
      label: '나눔과 참여',
      subItems: [
        { href: '/share/gallery', label: '재능기부/봉사 기록', icon: '📸' },
        { href: '/share/sponsor', label: '후원 및 협찬 안내', icon: '💝' },
        { href: '/share/request', label: '봉사 요청하기', icon: '🙌' }
      ]
    },
    { 
      href: '/branch', 
      label: '전국 지부',
      subItems: [
        { href: '/branch/recruitment', label: '지부 모집 및 신청', icon: '📝' },
        { href: '/branch/map', label: '전국 지부 현황', icon: '🗺️' },
        { href: '/branch/news', label: '지부별 활동 소식', icon: '📰' },
        { href: '/branch/council', label: '지부장 회의실', icon: '🤝' }
      ]
    },
  ];

  const navLinks = [
    ...baseNavLinks,
    ...(user && user.level !== undefined && user.level >= UserLevel.LV4_MANAGER ? [{
      href: '/network',
      label: '[네트워크 협력·축제 보드]',
      subItems: [
        { href: '/network/festivals', label: '전국 음악 축제 DB', icon: '🎵' },
        { href: '/network/guide', label: '연합회 공동 기획 가이드', icon: '📑' },
        { href: '/network/sponsorship', label: '기업 후원 매칭 현황', icon: '🤝' }
      ]
    }] : []),
    ...(user && user.level !== undefined && user.level >= UserLevel.LV5_ADMIN ? [{
      href: '/admin',
      label: '[시스템 관리자 전용]',
      subItems: [
        { href: '/admin/dashboard', label: '대시보드 바로가기', icon: '⚙️' },
        { href: '/admin/members', label: '회원 목록 및 가입 승인', icon: '👥' },
        { href: '/admin/posts', label: '망보드 게시물 통합 관리', icon: '📝' },
        { href: '/admin/branches', label: '지부 가입 신청 현황 확인', icon: '🏢' },
        { href: '/admin/stats', label: '사이트 통계 (방문자 수)', icon: '📊' }
      ]
    }] : [])
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-primary text-slate-800 shadow-lg border-b-2 border-accent relative">
      {/* PC & Mobile Top Bar */}
      <div className="max-w-7xl mx-auto px-6 h-20 md:h-28 lg:h-32 flex items-center justify-between">
        <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 group">
          <div className="w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform overflow-hidden relative">
            <Image 
              src="/logo.png" 
              alt="사단법인직장인밴드연합회 로고" 
              fill
              className="object-contain"
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[10px] md:text-xs text-accent font-semibold tracking-wider">사단법인</span>
            <span className="text-lg md:text-xl font-bold tracking-tight group-hover:text-accent transition-colors">
              직장인밴드연합회
            </span>
          </div>
        </Link>
        
        {/* GNB (PC) */}
        <nav className="hidden md:flex gap-5 lg:gap-8">
          {navLinks.map((link) => (
            <div key={link.href} className="group relative">
              <Link 
                href={link.href} 
                className={`font-medium transition-all py-6 whitespace-nowrap border-b-2 flex items-center ${
                  pathname === link.href || pathname.startsWith(link.href + '/') ? 'border-accent text-accent' : 'border-transparent text-slate-600 hover:text-accent hover:border-accent/40'
                }`}
              >
                {link.label}
              </Link>
              {link.subItems && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-52 bg-primary-dark shadow-2xl rounded-b-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border-t-2 border-accent border border-white/10 overflow-hidden pointer-events-none group-hover:pointer-events-auto">
                  <div className="p-3 flex flex-col gap-1">
                    {link.subItems.map(subItem => (
                      <Link 
                        key={subItem.label} 
                        href={subItem.href}
                        className="text-gray-300 hover:text-white text-sm py-3 px-4 hover:bg-accent rounded transition-colors flex items-center gap-3 font-medium whitespace-nowrap"
                      >
                        {!!subItem.icon && <span className="text-lg">{subItem.icon}</span>}
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
        
        {/* Right CTA / Shortcuts (PC) */}
        <div className="hidden md:flex items-center gap-4">
          {isLoaded && user ? (
            <div className="flex items-center gap-4">
              {/* 비밀 공간 바로가기 버튼 (조건부 렌더링 - DOM 흔적도 없이 숨김) */}
              {user.level !== undefined && user.level >= UserLevel.LV5_ADMIN && (
                <Link 
                  href="/admin/meeting"
                  className="bg-[#0b1329] border border-cyan-500/30 text-cyan-400 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-cyan-500/10 hover:border-cyan-400 transition-all flex items-center gap-1 shadow-[0_0_10px_rgba(34,211,238,0.15)]"
                >
                  <span>🗣️ 작전실</span>
                </Link>
              )}
              {user.level !== undefined && user.level === UserLevel.LV6_CEO && (
                <Link 
                  href="/admin/vault"
                  className="bg-[#130f05] border border-amber-500/30 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-amber-500/10 hover:border-amber-400 transition-all flex items-center gap-1 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                >
                  <span>🔐 비밀금고</span>
                </Link>
              )}

              <Link href="/mypage" className="text-sm flex items-center hover:opacity-80 transition-opacity">
                <span className="text-slate-700 mr-2 font-medium underline-offset-4 hover:underline">{user.name || user.nickname}님</span>
                <span className="bg-slate-200/50 text-accent px-2 py-1 rounded text-xs border border-slate-300">
                  {getLevelName(user.level)}
                </span>
              </Link>
              <button 
                onClick={logout}
                className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                로그인
              </Link>
              <Link href="/signup" className="text-sm font-bold bg-accent text-white px-4 py-2 rounded-md shadow hover:bg-accent-hover hover:-translate-y-0.5 transition-all">
                회원가입
              </Link>
            </div>
          )}
        </div>
        
        {/* Mobile Menu Toggle Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-slate-700 hover:text-accent transition-colors focus:outline-none z-50 flex items-center justify-center bg-slate-100 rounded-md border border-slate-200"
          aria-label={isMobileMenuOpen ? "닫기" : "메뉴 열기"}
        >
          {isMobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-accent">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay / Sliding Drawer */}
      <div 
        className={`md:hidden absolute top-[80px] md:top-[112px] left-0 w-full h-[calc(100vh-80px)] overflow-y-auto bg-primary-dark/95 backdrop-blur-xl border-t border-white/10 transition-all duration-300 ease-in-out origin-top ${
          isMobileMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col px-6 py-6 pb-24 gap-3 bg-gradient-to-b from-transparent to-primary-dark/80 min-h-full">
          <div className="text-xs font-bold text-accent tracking-widest mb-2 px-1">MENU</div>
          
          {navLinks.map((link) => (
            <div key={link.href} className="flex flex-col">
              <Link 
                href={link.href} 
                onClick={() => !link.subItems && setIsMobileMenuOpen(false)}
                className={`text-lg font-bold px-5 py-4 rounded-xl flex items-center justify-between transition-all ${
                  pathname === link.href || pathname.startsWith(link.href + '/')
                    ? 'bg-accent text-white shadow-lg translate-x-2' 
                    : 'bg-white/5 text-gray-300 border border-white/5 hover:bg-white/10 hover:text-white'
                }`}
              >
                {link.label}
                <div className="flex gap-2 items-center">
                  <svg className={`w-5 h-5 ${pathname === link.href || pathname.startsWith(link.href + '/') ? 'text-white' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
              {link.subItems && (
                 <div className="flex flex-col gap-1 px-3 py-3 bg-white/5 mt-1 rounded-lg">
                    {link.subItems.map(subItem => (
                      <Link
                        key={subItem.label}
                        href={subItem.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-sm text-left text-gray-300 py-3 px-3 hover:bg-white/10 rounded transition-colors flex items-center gap-3 font-medium"
                      >
                        {!!subItem.icon && <span className="text-lg">{subItem.icon}</span>}
                        {subItem.label}
                      </Link>
                    ))}
                 </div>
              )}
            </div>
          ))}
          
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-3">
            {isLoaded && user ? (
              <>
                <Link href="/mypage" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between px-2 mb-2 py-2 hover:bg-white/5 rounded-lg transition-colors">
                  <span className="text-white font-medium underline-offset-4 hover:underline">{user.name || user.nickname}님</span>
                  <span className="bg-accent text-white px-2 py-0.5 rounded text-xs font-bold">
                    {getLevelName(user.level)}
                  </span>
                </Link>

                {/* 모바일 비밀 바로가기 버튼 (조건부 렌더링 - DOM 흔적도 없이 숨김) */}
                {user.level !== undefined && user.level >= UserLevel.LV5_ADMIN && (
                  <Link 
                    href="/admin/meeting"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 text-sm font-bold bg-[#0b1329] border border-cyan-500/30 text-cyan-400 py-3.5 rounded-xl hover:bg-cyan-500/10 transition-colors shadow-inner"
                  >
                    <span>🗣️ 운영진 작전 회의실</span>
                  </Link>
                )}
                {user.level !== undefined && user.level === UserLevel.LV6_CEO && (
                  <Link 
                    href="/admin/vault"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 text-sm font-bold bg-[#130f05] border border-amber-500/30 text-amber-400 py-3.5 rounded-xl hover:bg-amber-500/10 transition-colors shadow-inner"
                  >
                    <span>🔐 최고관리자 비밀 금고</span>
                  </Link>
                )}

                <button 
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 text-base font-bold bg-white/10 text-white py-4 rounded-xl hover:bg-white/20 transition-colors"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center text-base font-bold bg-white/10 text-white py-4 rounded-xl hover:bg-white/20 transition-colors"
                >
                  로그인
                </Link>
                <Link 
                  href="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center text-base font-bold bg-accent text-white py-4 rounded-xl shadow-lg hover:bg-accent-hover transition-colors"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
