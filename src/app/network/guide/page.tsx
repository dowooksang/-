'use client';

export default function GuidePage() {
  const cases = [
    { id: 1, title: '2025 서울시 생활문화예술동아리 지원사업 선정 사례', branch: '서울 강남지부', date: '2025.11.20', views: 342, likes: 45 },
    { id: 2, title: '제1회 해운대 직장인 밴드 페스티벌 공동 기획안', branch: '부산 해운대지부', date: '2025.08.15', views: 512, likes: 89 },
    { id: 3, title: '지역 상권 살리기 버스킹 프로젝트 (상인회 협력)', branch: '경기 수원지부', date: '2025.04.10', views: 289, likes: 31 },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">연합회 공동 기획 가이드</h2>
        <p className="text-gray-400">
          사단법인 명의로 참여할 수 있는 공모 사업 정보와 지자체 제출용 공식 제안서 템플릿을 제공합니다.
        </p>
      </div>

      {/* Templates & Strategies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Support Strategy */}
        <div className="bg-gradient-to-br from-[#1A2255]/50 to-[#0A103D]/80 border border-white/10 rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-24 h-24 text-accent" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="relative z-10">
            <span className="bg-accent text-[#0A103D] text-xs font-bold px-2 py-1 rounded mb-4 inline-block">HOT</span>
            <h3 className="text-xl font-bold text-white mb-2">2026 문화예술 지원사업 공고</h3>
            <p className="text-gray-400 text-sm mb-6 h-10 line-clamp-2">
              한국문화예술위원회 및 각 지역 문화재단의 2026년 상반기 생활문화동호회 지원사업 요약 및 연합회 공동 참여 전략.
            </p>
            <button className="flex items-center gap-2 text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-lg transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              전략 자료집 다운로드 (PDF)
            </button>
          </div>
        </div>

        {/* Official Templates */}
        <div className="bg-gradient-to-br from-[#1A2255]/50 to-[#0A103D]/80 border border-white/10 rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-24 h-24 text-accent" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="relative z-10">
             <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded mb-4 inline-block">상시 비치</span>
            <h3 className="text-xl font-bold text-white mb-2">공식 협력 제안서 양식</h3>
            <p className="text-gray-400 text-sm mb-6 h-10 line-clamp-2">
              지자체 및 유관기관 제출용. 사단법인 직장인밴드연합회 소개 및 지역 문화행사 공동 주관 제안서 표준 템플릿.
            </p>
            <div className="flex gap-2">
              <button className="flex-1 flex justify-center items-center gap-2 text-sm font-bold text-[#0A103D] bg-accent hover:bg-[#82C8FF] px-4 py-2 rounded-lg transition-all">
                HWP 다운로드
              </button>
              <button className="flex-1 flex justify-center items-center gap-2 text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-lg transition-all">
                PPT 다운로드
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Cases Board */}
      <div>
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-accent">💡</span> 우수 기획 사례 공유
          </h3>
          <button className="text-sm text-accent hover:text-white transition-colors underline underline-offset-4">
            사례 등록하기
          </button>
        </div>
        
        <div className="bg-[#1A2255]/30 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-sm bg-white/5">
                <th className="p-4 font-medium w-16 text-center">번호</th>
                <th className="p-4 font-medium">제목</th>
                <th className="p-4 font-medium w-32">등록 지부</th>
                <th className="p-4 font-medium w-24 text-center">등록일</th>
                <th className="p-4 font-medium w-20 text-center">조회</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {cases.map((c) => (
                <tr key={c.id} className="hover:bg-white/5 transition-colors cursor-pointer group">
                  <td className="p-4 text-center text-gray-500">{c.id}</td>
                  <td className="p-4">
                    <span className="font-bold text-gray-200 group-hover:text-accent transition-colors">
                      {c.title}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400">{c.branch}</td>
                  <td className="p-4 text-center text-gray-500">{c.date}</td>
                  <td className="p-4 text-center text-gray-500">{c.views}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
