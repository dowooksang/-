import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

export default async function Home() {
  // Supabase에서 최근 게시물 5개 가져오기
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
    
  const recentPosts = posts || [];

  return (
    <div className="bg-[#0A103D] text-white min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 scale-105 animate-[pulse_20s_ease-in-out_infinite]" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070&auto=format&fit=crop')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A103D]/90 via-[#0A103D]/60 to-[#0A103D] z-10"></div>
        
        {/* Association Scale Bar */}
        <div className="absolute top-0 w-full bg-gradient-to-r from-[#0A103D] via-[#1A2359] to-[#0A103D] border-b border-accent/30 py-3 backdrop-blur-md z-40 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-center items-center gap-6 md:gap-24 text-sm md:text-base font-medium">
            <div className="flex items-center gap-4 group cursor-default">
              <span className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(59,130,246,0.3)] group-hover:scale-110 transition-transform">👥</span>
              <div className="flex flex-col">
                <span className="text-gray-400 text-xs tracking-wider uppercase">전국 총 회원 수</span>
                <span className="text-white font-black text-2xl tracking-widest text-shadow-sm">12,504<span className="text-sm font-normal text-gray-300 ml-1">명</span></span>
              </div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-white/10"></div>
            <div className="flex items-center gap-4 group cursor-default">
              <span className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(130,200,255,0.3)] group-hover:scale-110 transition-transform">🏢</span>
              <div className="flex flex-col">
                <span className="text-gray-400 text-xs tracking-wider uppercase">활성 지부 수</span>
                <span className="text-white font-black text-2xl tracking-widest text-shadow-sm">42<span className="text-sm font-normal text-gray-300 ml-1">개 지부</span></span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto flex flex-col items-center animate-fade-in-up mt-16">
          <span className="px-5 py-2 rounded-full bg-accent/20 text-accent font-bold text-sm mb-6 border border-accent/40 tracking-[0.2em] shadow-[0_0_15px_rgba(130,200,255,0.3)]">
            A O W B · OFFICIAL WEBSITE
          </span>
          <h2 className="text-2xl md:text-4xl text-gray-200 font-medium mb-4 tracking-wide text-shadow-sm">
            평범한 일상을 예술로 바꾸는 우리의 무대
          </h2>
          <h1 className="text-6xl md:text-[5.5rem] lg:text-9xl font-black tracking-tighter mb-8 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-accent">
            우리동네 <span className="text-accent underline decoration-4 underline-offset-8">문화클럽</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 font-light mb-8">
            사단법인 직장인밴드연합회가 당신의 꿈을 응원합니다.
          </p>
          <blockquote className="border-l-4 border-accent pl-6 text-gray-300 italic text-xl md:text-2xl mb-12 font-serif relative">
            <span className="text-5xl text-accent/30 absolute -left-4 -top-4 font-sans">"</span>
            대한민국 대중음악계의 당당한 일원이 되겠습니다
            <span className="block text-sm mt-3 text-gray-500 not-italic font-sans">- 초대 대표 황지훈, 조선일보 보도 (2008)</span>
          </blockquote>
          <div className="flex gap-4">
            <Link href="/about" className="px-8 py-4 bg-accent text-primary-dark font-bold rounded shadow-lg hover:bg-accent-hover hover:-translate-y-1 transition-all">
              연합회 소개
            </Link>
            <Link href="/activity" className="px-8 py-4 bg-transparent border border-white text-white font-bold rounded shadow-lg hover:bg-white/10 hover:-translate-y-1 transition-all">
              활동 갤러리
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Status & Quick Notice Block */}
      <section className="relative z-30 mt-8 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Block */}
          <div className="lg:col-span-2 bg-primary/90 backdrop-blur-md border border-white/10 rounded-xl p-5 shadow-lg flex items-center">
            <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 divide-x divide-white/10 text-center">
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-black text-accent mb-1">5</span>
                <span className="text-xs text-gray-300 font-medium">서울/수도권 거점</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-black text-white mb-1">320</span>
                <span className="text-xs text-gray-300 font-medium">소속 밴드</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-black text-white mb-1">5,800</span>
                <span className="text-xs text-gray-300 font-medium">정회원</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-black text-accent mb-1">320+</span>
                <span className="text-xs text-gray-300 font-medium">누적 정기공연</span>
              </div>
            </div>
          </div>
          
          {/* Quick Notice Block */}
          <div className="bg-[#111827]/90 backdrop-blur-xl border border-white/10 rounded-xl p-5 shadow-lg flex flex-col justify-center">
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
               <h3 className="text-lg font-bold text-white flex items-center gap-2 tracking-wide">
                 <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded leading-none">NOTICE</span>
                 공지사항
               </h3>
               <Link href="/news" className="text-xs text-gray-400 hover:text-white transition-colors">더보기 &gt;</Link>
            </div>
            <ul className="flex flex-col gap-3.5">
              {recentPosts.slice(0, 3).map(post => (
                <li key={post.id}>
                  <Link href={`/board/${post.id}`} className="group flex items-center text-sm text-gray-300 hover:text-white transition-colors">
                    <span className="text-accent mr-2 opacity-50 group-hover:opacity-100 transition-opacity">·</span> 
                    <span className="truncate group-hover:underline underline-offset-4">{post.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Branch Network Section */}
      <section className="bg-[url('https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-fixed bg-center relative py-20 my-12 border-y border-white/10">
        <div className="absolute inset-0 bg-[#0A103D]/80 backdrop-blur-sm z-0"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <span className="text-accent text-sm font-bold tracking-widest uppercase mb-2 block">National Branch Network</span>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4">현재 가입된 전국 지부 현황</h2>
          <p className="text-gray-300 text-lg mb-12">전국 곳곳에서 음악으로 하나되는 네트워크</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { region: '서울/수도권 지부', count: 18, color: 'border-[#FF9F1C]' },
              { region: '충청/강원 지부', count: 6, color: 'border-[#2EC4B6]' },
              { region: '영남 지부', count: 12, color: 'border-[#E71D36]' },
              { region: '호남/제주 지부', count: 4, color: 'border-[#011627] bg-[#82C8FF]' },
            ].map((item, idx) => (
              <div key={idx} className={`bg-[#0A103D]/70 p-8 rounded-2xl border-t-4 ${item.color} shadow-lg hover:-translate-y-2 transition-transform`}>
                <div className="text-gray-400 font-medium mb-4">{item.region}</div>
                <div className="text-5xl font-black text-white flex justify-center items-end gap-2">
                  <span className={item.color.includes('bg-') ? 'text-[#0A103D]' : 'text-accent'}>{item.count}</span>
                  <span className="text-xl font-normal text-gray-500 mb-1">개</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12">
             <Link href="/branch/map" className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 rounded-full font-bold text-white transition-all hover:scale-105">
               🗺️ 전국 지점 지도 보기
             </Link>
          </div>
        </div>
      </section>

      {/* Main Content Grid: Recent Posts & Calendar */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* 3. Recent Posts / News Widget */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">연합회 소식 & 공지</h2>
              <p className="text-gray-400">Notice & Newsroom</p>
            </div>
            <Link href="/community" className="text-accent text-sm hover:underline">더보기 +</Link>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden divide-y divide-white/10">
            {recentPosts.length === 0 ? (
              <div className="p-8 text-center text-gray-400">등록된 새소식이 없습니다.</div>
            ) : (
              recentPosts.map((post) => (
                <Link href={`/board/${post.id}`} key={post.id} className="flex items-center px-6 py-5 hover:bg-white/10 transition-all duration-300 group">
                  <span className={`w-14 text-center text-xs font-bold py-1.5 rounded mr-5 ${post.title.includes('공지') || post.title.includes('필독') ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white/10 text-accent border border-white/10'}`}>
                    {post.title.includes('공지') || post.title.includes('필독') ? '필독' : '소식'}
                  </span>
                  <div className="flex-1 min-w-0 pr-4">
                    <h3 className="text-lg font-medium group-hover:text-accent transition-colors truncate text-gray-100">
                      {post.title}
                    </h3>
                  </div>
                  <div className="flex flex-col items-end hidden sm:flex">
                    <span className="text-sm text-gray-400">{post.author}</span>
                    <span className="text-xs text-gray-500">{formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ko })}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* 4. Calendar Widget */}
        <div className="flex flex-col">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">주요 일정</h2>
              <p className="text-gray-400">Calendar</p>
            </div>
          </div>
          
          <div className="bg-primary border border-white/10 rounded-xl p-6 shadow-xl flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <button className="text-gray-400 hover:text-white">&lt;</button>
              <span className="text-xl font-bold">2026. 04</span>
              <button className="text-gray-400 hover:text-white">&gt;</button>
            </div>
            
            {/* Minimal Calendar mock */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs mb-4 text-gray-400">
              <span className="text-red-400">일</span><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span className="text-blue-400">토</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium">
              {Array.from({length: 30}).map((_, i) => (
                <div key={i} className={`py-2 rounded-full cursor-pointer hover:bg-white/20 ${i===17 ? 'bg-accent text-primary font-bold' : i===24 ? 'bg-white/20 font-bold border border-white/40' : ''}`}>
                  {i + 1}
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-sm text-accent font-bold mb-1">04.18 (토)</p>
              <p className="text-base text-white">서울 강북/성동권 봄맞이 오픈마이크</p>
              <p className="text-xs text-gray-500 mt-1">@ 홍대 클럽 롤링홀</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4.5. Rising Star & Solo Artist Banner */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        {/* Banner */}
        <Link href="/solo" className="block relative rounded-2xl overflow-hidden shadow-2xl group mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-accent to-blue-600 opacity-90 z-10 mix-blend-multiply transition-opacity group-hover:opacity-80"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center z-0 group-hover:scale-105 transition-transform duration-700"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop')" }}
          ></div>
          <div className="relative z-20 py-16 px-10 md:px-20 flex flex-col md:flex-row items-center justify-between">
            <div>
              <span className="bg-white text-[#0A103D] font-black text-xs px-2 py-1 rounded tracking-widest mb-4 inline-block">FOR SOLO ARTISTS</span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-2 text-shadow-sm">악기 하나쯤은 다루고 싶은 당신을 위하여</h2>
              <p className="text-lg text-blue-100 font-medium">혼자서도 즐거운 음악 생활, 방구석 아티스트를 깨우세요!</p>
            </div>
            <div className="mt-8 md:mt-0 flex-shrink-0">
              <span className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full group-hover:bg-white group-hover:text-[#0A103D] transition-colors flex items-center gap-2">
                방구석 릴레이 잼 참여하기 🎸
              </span>
            </div>
          </div>
        </Link>

        {/* Rising Star */}
        <div className="bg-primary/50 border border-white/10 rounded-2xl overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-1/3 bg-cover bg-center h-64 md:h-auto" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=2070&auto=format&fit=crop')" }}></div>
          <div className="md:w-2/3 p-8 md:p-12 flex flex-col justify-center">
            <span className="text-accent font-bold tracking-widest text-sm mb-2">★ 이달의 방구석 라이징 스타 ★</span>
            <h3 className="text-3xl font-extrabold mb-4">"밤바다를 닮은 어쿠스틱 선율" - 김기타 님</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              "퇴근 후 혼자 치던 기타가 이제는 수많은 온라인 관객 앞에서 연주하는 저만의 무대가 되었습니다. 
              방구석 릴레이 잼 덕분에 용기를 얻어 다음 달 정모 콘서트 오프닝 팀에 합류하게 되었어요!"
            </p>
            <div>
              <Link href="/solo/interview/1" className="text-accent hover:text-white font-medium border-b border-accent pb-1 inline-block transition-colors">
                인터뷰 전문 보기 →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Gallery Preview */}
      <section className="bg-[#0A103D] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center mb-16 text-center">
            <span className="text-accent text-sm font-bold tracking-widest uppercase mb-4">Stage Gallery</span>
            <h2 className="text-4xl font-extrabold mb-4">가장 뜨거웠던 순간들</h2>
            <p className="text-gray-400 text-lg">우리의 땀방울이 만들어낸 하모니</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Gallery items mock */}
            {[
              "https://images.unsplash.com/photo-1501612780327-45045538702b?q=80&w=2070&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2070&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1974&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=2070&auto=format&fit=crop",
            ].map((img, idx) => (
              <Link href="/activity" key={idx} className="group overflow-hidden rounded-xl bg-white/5 border border-white/10 relative h-64 lg:h-80 block">
                <div 
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" 
                  style={{ backgroundImage: `url('${img}')` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-primary-dark/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 group-hover:translate-y-0 transition-transform opacity-80 group-hover:opacity-100">
                  <h3 className="text-lg font-bold text-white mb-1">제 {15 - idx}회 정기공연</h3>
                  <p className="text-sm text-accent">Gallery 보러가기 →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
