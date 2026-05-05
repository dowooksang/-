import Link from 'next/link';

export const metadata = {
  title: '공연 영상 - 사단법인 직장인밴드연합회',
  description: '직장인밴드연합회의 뜨거운 무대 영상을 확인하세요.',
};

export default function VideoPage() {
  const categories = ['전체보기', '정기공연', '오픈마이크', '페스티벌', '합주일상'];
  
  const videos = [
    {
      id: 1,
      title: '제 15차 서울지역 연합 정기공연 - "한 여름 밤의 록(Rock)"',
      category: '정기공연',
      thumbnail: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2070&auto=format&fit=crop',
      date: '2026. 03. 15',
      duration: '04:23',
    },
    {
      id: 2,
      title: '홍대 길거리 버스킹 하이라이트 영상',
      category: '오픈마이크',
      thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070&auto=format&fit=crop',
      date: '2026. 04. 02',
      duration: '12:45',
    },
    {
      id: 3,
      title: '2025 연말 직장인밴드 그랜드 페스티벌 - 결선 무대',
      category: '페스티벌',
      thumbnail: 'https://images.unsplash.com/photo-1540039155733-d7f6c92982d6?q=80&w=1974&auto=format&fit=crop',
      date: '2025. 12. 24',
      duration: '45:10',
    },
    {
      id: 4,
      title: '블루사운드 밴드 합주실 스케치 & 인터뷰',
      category: '합주일상',
      thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1974&auto=format&fit=crop',
      date: '2026. 02. 10',
      duration: '08:30',
    },
    {
      id: 5,
      title: '제 14차 정기공연 오프닝 무대 현장 스케치',
      category: '정기공연',
      thumbnail: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=2070&auto=format&fit=crop',
      date: '2025. 10. 15',
      duration: '03:15',
    },
    {
      id: 6,
      title: '봄맞이 어쿠스틱 오픈마이크 교류전 (홍대 롤링홀)',
      category: '오픈마이크',
      thumbnail: 'https://images.unsplash.com/photo-1470229722913-7c090be434f0?q=80&w=2056&auto=format&fit=crop',
      date: '2026. 04. 10',
      duration: '15:20',
    }
  ];

  return (
    <div className="bg-[#0A103D] min-h-screen text-white w-full">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1470229722913-7c090be434f0?q=80&w=2056&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A103D]/80 via-[#0A103D]/95 to-[#0A103D] z-0"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center animate-fade-in-up">
          <span className="text-accent font-bold tracking-widest text-sm mb-4 block">MEDIA GALLERY</span>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            우리의 <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-400">뜨거운 무대</span>를 만나다
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light">
            땀방울과 열정이 가득했던 직장인밴드연합회의 모든 무대와 라이브 공연 기록을 감상해 보세요.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 pb-24 relative z-10">
        
        {/* Filter Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {categories.map((category, idx) => (
            <button 
              key={idx}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                idx === 0 
                  ? 'bg-accent text-primary-dark font-bold' 
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <div key={video.id} className="group flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:-translate-y-2 hover:shadow-2xl hover:border-white/20 transition-all duration-500">
              
              {/* Thumbnail Container */}
              <div className="relative aspect-video overflow-hidden cursor-pointer">
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                  style={{ backgroundImage: `url('${video.thumbnail}')` }}
                ></div>
                
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-500"></div>
                
                {/* Duration Badge */}
                <span className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded backdrop-blur-sm shadow-sm opacity-90">
                  {video.duration}
                </span>

                {/* Category Badge */}
                <span className="absolute top-3 left-3 bg-accent text-primary-dark text-xs font-bold px-3 py-1 rounded-sm shadow-lg">
                  {video.category}
                </span>

                {/* Play Button Overlay (Visible on Hover) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 bg-accent/90 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md transform scale-50 group-hover:scale-100 transition-transform duration-300 delay-75">
                    <svg className="w-8 h-8 text-primary-dark ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Info Container */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-white mb-4 line-clamp-2 leading-snug group-hover:text-accent transition-colors cursor-pointer">
                  {video.title}
                </h3>
                <div className="mt-auto flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-md">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {video.date}
                  </span>
                  <button className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="mt-16 text-center">
          <button className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 rounded-full text-white font-medium hover:bg-white/10 hover:border-white/40 active:scale-95 transition-all duration-300 group">
            영상 더 보러가기
            <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

      </section>
    </div>
  );
}
