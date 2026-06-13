import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import Calendar from '@/components/Calendar';
import BranchMap from '@/components/BranchMap';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Supabase에서 최근 게시물 5개 가져오기
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
    
  const recentPosts = posts || [];

  // 1. 전국 총 회원 수 (level 상관없이 users 전체 행 수)
  const { count: totalUsersCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });
  const totalUsers = totalUsersCount || 0;

  // 2. 활성 지부 수 (branches status가 'approved'인 것)
  const { count: totalBranchesCount } = await supabase
    .from('branches')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved');
  const activeBranches = totalBranchesCount || 0;

  // 3. 소속 동호회 수 (branches 테이블의 band_count 총합)
  const { data: bandCountData } = await supabase
    .from('branches')
    .select('band_count')
    .eq('status', 'approved');
  const totalBands = bandCountData
    ? bandCountData.reduce((sum, row) => sum + (row.band_count || 0), 0)
    : 0;

  // 4. 정회원 수 (users 테이블의 level이 2 이상인 회원 수)
  const { count: regularUsersCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .gte('level', 2);
  const regularUsers = regularUsersCount || 0;

  // 5. 수동 지표 (site_settings) 가져오기
  const { data: settingsData } = await supabase
    .from('site_settings')
    .select('*');

  let cumulativeConcerts = '320'; // default fallback
  let metroHubs = '5';            // default fallback

  if (settingsData && Array.isArray(settingsData)) {
    settingsData.forEach((row: any) => {
      if (row.key === 'cumulative_concerts') cumulativeConcerts = row.value;
      if (row.key === 'metro_hubs') metroHubs = row.value;
    });
  }

  // 지역별 지부 개수 집계
  const { data: branchRegions } = await supabase
    .from('branches')
    .select('region')
    .eq('status', 'approved');

  let seoulCount = 0;
  let chungcheongCount = 0;
  let yeongnamCount = 0;
  let honamCount = 0;

  if (branchRegions && Array.isArray(branchRegions)) {
    branchRegions.forEach((b: any) => {
      const r = b.region || '';
      if (r.includes('서울') || r.includes('수도권') || r.includes('경기') || r.includes('인천')) {
        seoulCount++;
      } else if (r.includes('충청') || r.includes('강원') || r.includes('대전') || r.includes('세종')) {
        chungcheongCount++;
      } else if (r.includes('영남') || r.includes('경상') || r.includes('부산') || r.includes('대구') || r.includes('울산')) {
        yeongnamCount++;
      } else if (r.includes('호남') || r.includes('전라') || r.includes('광주') || r.includes('제주')) {
        honamCount++;
      } else {
        seoulCount++;
      }
    });
  }

  // fallback이 적용된 지역별 지부수
  const finalSeoul = seoulCount || 18;
  const finalChungcheong = chungcheongCount || 6;
  const finalYeongnam = yeongnamCount || 12;
  const finalHonam = honamCount || 4;

  return (
    <div className="bg-[#FAF7F2] text-[#3E332E] min-h-screen font-sans selection:bg-[#E89C5E]/20">
      {/* 1. 전국 회원/동호회 현황 탑 바 */}
      <div className="w-full bg-[#F3EFE9] border-b border-[#E3DAC9] py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-center items-center gap-6 md:gap-20 text-sm font-medium text-[#5A4535]">
          <div className="flex items-center gap-3 group cursor-default">
            <span className="w-9 h-9 rounded-full bg-[#FAF7F2] border border-[#E3DAC9] flex items-center justify-center text-lg shadow-xs transition-transform group-hover:scale-110 duration-300">👥</span>
            <div className="flex flex-col">
              <span className="text-neutral-500 text-[11px] tracking-wider font-semibold">함께하는 음악 이웃들</span>
              <span className="text-[#7A5A44] font-black text-xl">{(totalUsers || 12504).toLocaleString()}<span className="text-xs font-normal text-neutral-500 ml-0.5">명</span></span>
            </div>
          </div>
          <div className="hidden sm:block w-px h-8 bg-[#E3DAC9]"></div>
          <div className="flex items-center gap-3 group cursor-default">
            <span className="w-9 h-9 rounded-full bg-[#FAF7F2] border border-[#E3DAC9] flex items-center justify-center text-lg shadow-xs transition-transform group-hover:scale-110 duration-300">🏡</span>
            <div className="flex flex-col">
              <span className="text-neutral-500 text-[11px] tracking-wider font-semibold">우리 동네 동호회방</span>
              <span className="text-[#7A5A44] font-black text-xl">{activeBranches || 42}<span className="text-xs font-normal text-neutral-500 ml-0.5">개 지부</span></span>
            </div>
          </div>
          <div className="hidden sm:block w-px h-8 bg-[#E3DAC9]"></div>
          <div className="flex items-center gap-3 group cursor-default">
            <span className="w-9 h-9 rounded-full bg-[#FAF7F2] border border-[#E3DAC9] flex items-center justify-center text-lg shadow-xs transition-transform group-hover:scale-110 duration-300">🎸</span>
            <div className="flex flex-col">
              <span className="text-neutral-500 text-[11px] tracking-wider font-semibold">소담한 악기 소모임</span>
              <span className="text-[#7A5A44] font-black text-xl">{totalBands || 320}<span className="text-xs font-normal text-neutral-500 ml-0.5">개 팀</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-[#FAF7F2] to-[#F3EFE9] overflow-hidden border-b border-[#E3DAC9]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: 따뜻하고 친근한 메시지 */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#E89C5E]/10 text-[#E89C5E] font-bold text-xs tracking-wider border border-[#E89C5E]/30 mb-6 shadow-xs">
              우리 동네 악기 놀이터 문화클럽24 🌿
            </span>
            <h2 className="text-lg md:text-xl text-[#7A6354] font-semibold mb-3 tracking-wide text-pretty">
              음악을 사랑하는 누구나, 악기 하나로 하나 되는 공간
            </h2>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#3E332E] tracking-tight mb-6 leading-tight text-balance">
              초보부터 베테랑까지,<br />
              <span className="text-[#E89C5E] underline decoration-4 decoration-[#E89C5E]/40 underline-offset-8">함께 만드는</span> 우리들의 음악 이야기
            </h1>
            <p className="text-base md:text-lg text-[#5A4535] font-normal mb-8 leading-relaxed max-w-xl text-pretty">
              사단법인직장인밴드연합회가 전국의 모든 일상 속 연주자들을 위해 따뜻하고 친근한 쉼터가 되어 드립니다. 
              퇴근 후의 즐거운 소담 합주, 골목길 광장에서 나누는 버스킹의 소박한 기쁨을 지금 만나보세요.
            </p>
            <blockquote className="border-l-4 border-[#E89C5E] pl-6 text-[#5A4535] italic text-base md:text-lg mb-8 font-serif relative">
              "음악은 평범한 이웃들의 고단한 일상을 위로하고 따뜻하게 이어주는 소중한 쉼터입니다."
              <span className="block text-xs mt-2 text-neutral-500 not-italic font-sans">- 연합회 창립 취지문 중에서</span>
            </blockquote>
            <div className="flex flex-wrap gap-4">
              <Link href="/about" className="px-7 py-3.5 bg-[#7A5A44] hover:bg-[#5A4535] text-white font-bold rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
                동호회 연합 소개 🌿
              </Link>
              <Link href="/activity" className="px-7 py-3.5 bg-white border-2 border-[#D2B48C] text-[#7A5A44] hover:bg-[#FAF7F2] font-bold rounded-xl shadow-xs transition-all duration-300 transform hover:-translate-y-0.5">
                활동 갤러리 둘러보기 📸
              </Link>
            </div>
          </div>

          {/* Right: 따뜻한 아마추어 연주자들의 일러스트/사진 */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full aspect-square max-w-[450px] rounded-3xl overflow-hidden shadow-xl border-[12px] border-white transform rotate-1 hover:rotate-0 transition-transform duration-500 bg-white">
              <Image 
                src="/images/club_hero_banner.png"
                alt="아늑한 동호회실에서 통기타, 색소폰, 건반을 함께 즐기는 한국인 아마추어 연주자들"
                fill
                priority
                className="object-cover"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-[#E89C5E]/10 rounded-full blur-xl -z-10"></div>
          </div>
        </div>
      </section>

      {/* 3. Status & Quick Notice Block */}
      <section className="max-w-7xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Block */}
          <div className="lg:col-span-2 bg-white border border-[#EBE4D8] rounded-2xl p-6 shadow-xs flex items-center">
            <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 divide-x divide-[#EBE4D8] text-center">
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-black text-[#E89C5E] mb-1">{metroHubs}</span>
                <span className="text-xs text-neutral-500 font-semibold">거점 연습실</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-black text-[#7A5A44] mb-1">{totalBands || 320}</span>
                <span className="text-xs text-neutral-500 font-semibold">등록 소모임</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-black text-[#7A5A44] mb-1">{(regularUsers || 5800).toLocaleString()}</span>
                <span className="text-xs text-neutral-500 font-semibold">소속 연주자</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-black text-[#E89C5E] mb-1">{cumulativeConcerts}+</span>
                <span className="text-xs text-neutral-500 font-semibold">마을 합주공연</span>
              </div>
            </div>
          </div>
          
          {/* Quick Notice Block */}
          <div className="bg-white border border-[#EBE4D8] rounded-2xl p-6 shadow-xs flex flex-col justify-center">
            <div className="flex justify-between items-center mb-4 border-b border-[#EBE4D8] pb-3">
               <h3 className="text-base font-bold text-[#3E332E] flex items-center gap-2">
                 <span className="bg-[#E89C5E]/10 text-[#E89C5E] text-[10px] px-2 py-0.5 rounded-full font-bold border border-[#E89C5E]/20">소식</span>
                 연합회 소식통
               </h3>
               <Link href="/news" className="text-xs text-neutral-400 hover:text-[#E89C5E] transition-colors">더보기 &gt;</Link>
            </div>
            <ul className="flex flex-col gap-2.5">
              {recentPosts.length === 0 ? (
                <li className="text-xs text-neutral-400 text-center py-4">새로운 소식이 준비 중입니다.</li>
              ) : (
                recentPosts.slice(0, 3).map(post => (
                  <li key={post.id}>
                    <Link href={`/board/${post.id}`} className="group flex items-center text-sm text-neutral-600 hover:text-[#E89C5E] transition-colors">
                      <span className="text-[#E89C5E] mr-2 opacity-60 group-hover:opacity-100 font-bold">·</span> 
                      <span className="truncate group-hover:underline underline-offset-4">{post.title}</span>
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Branch Network Section (전국 네트워크 지부) */}
      <section className="bg-[#F3EFE9] border-y border-[#E3DAC9] py-16 my-12 relative">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="text-[#E89C5E] text-xs font-bold tracking-widest uppercase mb-2 block">Our Warm Community</span>
          <h2 className="text-2xl md:text-3xl font-black text-[#3E332E] mb-3">전국 방방곡곡 지부 네트워크</h2>
          <p className="text-neutral-500 text-sm md:text-base mb-10 max-w-xl mx-auto leading-relaxed text-pretty">
            우리 동네 음악 놀이터가 전국의 끈끈한 네트워크로 이어집니다. 아래 지도 노드를 눌러 지부별 모임방 현황과 실시간 이웃 소식을 만나보세요.
          </p>
          
          <div className="max-w-5xl mx-auto">
            <BranchMap 
              seoulCount={finalSeoul} 
              chungcheongCount={finalChungcheong} 
              yeongnamCount={finalYeongnam} 
              honamCount={finalHonam} 
            />
          </div>
          
          <div className="mt-10">
             <Link href="/branch/map" className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-[#FAF7F2] border border-[#D2B48C] rounded-full font-bold text-[#7A5A44] text-sm shadow-xs transition-all hover:scale-105 duration-300">
               🗺️ 전국 지부 지도로 찾아보기
             </Link>
          </div>
        </div>
      </section>

      {/* 5. Main Content Grid: Recent Posts & Calendar */}
      <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Recent Posts / News Widget */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#3E332E] mb-1">우리 동네 음악 소식통</h2>
              <p className="text-xs text-neutral-400">Neighborhood Stories & News</p>
            </div>
            <Link href="/community" className="text-[#E89C5E] text-xs font-bold hover:underline">이야기 더보기 +</Link>
          </div>
          
          <div className="bg-white border border-[#EBE4D8] rounded-2xl overflow-hidden divide-y divide-neutral-100 shadow-xs">
            {recentPosts.length === 0 ? (
              <div className="p-8 text-center text-neutral-400 text-sm">등록된 새소식이 없습니다.</div>
            ) : (
              recentPosts.map((post) => (
                <Link href={`/board/${post.id}`} key={post.id} className="flex items-center px-5 py-4.5 hover:bg-[#FAF7F2] transition-all duration-200 group">
                  <span className={`w-12 text-center text-[10px] font-bold py-1 rounded mr-4 ${post.title.includes('공지') || post.title.includes('필독') ? 'bg-red-50/70 text-red-500 border border-red-100' : 'bg-[#FAF7F2] text-[#7A6354] border border-[#EBE4D8]'}`}>
                    {post.title.includes('공지') || post.title.includes('필독') ? '필독' : '이웃'}
                  </span>
                  <div className="flex-1 min-w-0 pr-4">
                    <h3 className="text-base font-semibold group-hover:text-[#E89C5E] transition-colors truncate text-neutral-800">
                      {post.title}
                    </h3>
                  </div>
                  <div className="flex flex-col items-end hidden sm:flex text-right">
                    <span className="text-xs font-medium text-neutral-600">{post.author}</span>
                    <span className="text-[10px] text-neutral-400">{formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ko })}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Calendar Widget */}
        <div className="flex flex-col">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#3E332E] mb-1">우리 지부의 이달의 약속</h2>
              <p className="text-xs text-neutral-400">Monthly Calendar</p>
            </div>
          </div>
          
          <Calendar />
        </div>
      </section>

      {/* 6. Rising Star & Solo Artist Banner */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        {/* Banner */}
        <div className="block bg-[#EBE4D8]/40 border border-[#D2B48C]/40 rounded-3xl overflow-hidden shadow-xs mb-16 relative">
          <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col items-start text-left max-w-xl">
              <span className="bg-[#FAF7F2] text-[#7A5A44] border border-[#D2B48C] font-bold text-[10px] px-2.5 py-1 rounded-md tracking-wider mb-4 inline-block">혼자서도 즐거운 음악 여행</span>
              <h2 className="text-2xl md:text-3xl font-black text-[#3E332E] mb-3">퇴근 길, 손때 묻은 악기 하나와 함께</h2>
              <p className="text-sm md:text-base text-[#5A4535] leading-relaxed text-pretty">
                거창한 밴드나 무대가 아니어도 괜찮습니다. 소박한 다락방에서 혼자 튕기는 통기타의 멜로디, 
                나만의 일상적인 음악 이야기를 편안하게 이웃들과 나누어 보세요.
              </p>
              <Link href="/solo" className="mt-6 inline-flex items-center gap-2 px-5 py-3 bg-[#E89C5E] hover:bg-[#D98B4D] text-white font-bold rounded-xl shadow transition-colors text-sm duration-300">
                방구석 릴레이 잼 참여하기 🎸
              </Link>
            </div>
            
            <div className="w-full md:w-[280px] aspect-square rounded-2xl overflow-hidden shadow-md relative bg-white border-4 border-white flex-shrink-0">
              <Image 
                src="/images/cozy_guitar.png"
                alt="아늑한 방구석에 세워진 손때 묻은 어쿠스틱 통기타와 정겨운 악보"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Rising Star */}
        <div className="bg-white border border-[#EBE4D8] rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-xs">
          <div className="md:w-1/3 bg-cover bg-center h-64 md:h-auto min-h-[250px] relative">
            <Image 
              src="/images/rising_star.png" 
              alt="통기타를 든 인자한 미소의 이달의 이웃 연주자" 
              fill 
              className="object-cover"
            />
          </div>
          <div className="md:w-2/3 p-8 md:p-12 flex flex-col justify-center text-left">
            <span className="text-[#E89C5E] font-bold tracking-widest text-xs mb-2 block">★ 이달의 우리 동네 음악 스타 ★</span>
            <h3 className="text-2xl font-black text-[#3E332E] mb-3">"소박한 통기타로 전하는 따뜻한 위로" - 김영희 님</h3>
            <p className="text-neutral-600 text-sm leading-relaxed mb-6 text-pretty">
              "퇴근 후 혼자 방 안에서 튕기던 통기타가 이제는 동네 이웃들과 따뜻한 인사를 나누는 작은 다리가 되었습니다. 
              부족한 솜씨인데도 '방구석 릴레이 잼' 게시판에서 이웃분들이 건네주신 다정한 격려글 덕분에 큰 용기를 얻었고, 
              이번에 우리 지부 주말 음악회 오프닝 무대에도 서게 되었습니다. 음악은 일상의 가장 포근한 위로예요."
            </p>
            <div>
              <Link href="/solo/interview/1" className="text-[#E89C5E] hover:text-[#D98B4D] font-bold text-sm border-b-2 border-[#E89C5E] pb-0.5 inline-block transition-colors duration-300">
                인터뷰 전문 읽기 →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Gallery Preview */}
      <section className="bg-[#F3EFE9] border-t border-[#E3DAC9] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center mb-12 text-center">
            <span className="text-[#E89C5E] text-xs font-bold tracking-widest uppercase mb-2 block">Neighborhood Stages</span>
            <h2 className="text-2xl md:text-3xl font-black text-[#3E332E] mb-3">함께해서 더 소중했던 순간들</h2>
            <p className="text-neutral-500 text-sm md:text-base max-w-md text-pretty">소박하고 따뜻한 우리들의 동네 음악 축제 기록</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { img: "/images/gallery_1.png", title: "꽃피는 동네 벚꽃 버스킹" },
              { img: "/images/gallery_2.png", title: "이웃과의 주말 합동 연습" },
              { img: "/images/gallery_3.png", title: "마을 작은 음악회 축제" },
              { img: "/images/gallery_4.png", title: "햇살 비치는 야외 잼 세션" }
            ].map((item, idx) => (
              <Link href="/activity" key={idx} className="group overflow-hidden rounded-2xl bg-white border border-[#E3DAC9] shadow-xs relative h-64 block">
                <div 
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700" 
                  style={{ backgroundImage: `url('${item.img}')` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#4E3629]/95 via-transparent to-transparent z-10"></div>
                <div className="absolute bottom-0 left-0 w-full p-5 z-20 text-left">
                  <h3 className="text-base font-bold text-white mb-0.5">{item.title}</h3>
                  <p className="text-xs text-[#EBE4D8] group-hover:underline">추억 보러가기 →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
