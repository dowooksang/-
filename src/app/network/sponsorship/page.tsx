'use client';

export default function SponsorshipPage() {
  const sponsors = [
    { id: 1, name: '(주)뮤직브로스', item: '기타 앰프 2대, 드럼 세트 1식 대여', target: '전국 단위 중/대형 축제', status: '협의가능' },
    { id: 2, name: '사운드메이커스', item: 'PA 음향 시스템 (버스킹용) 무상 렌탈', target: '수도권 내 100인 이하 규모 행사', status: '지원중' },
    { id: 3, name: '에너지드링크(주)', item: '행사 당일 음료수 500캔 지원', target: '참여 밴드 10팀 이상 연합 공연', status: '지원중' },
    { id: 4, name: '악기스토어', item: '경품용 통기타 1대, 피크 100개', target: '지역 연말 결산 콘서트', status: '마감임박' },
  ];

  const requests = [
    { id: 1, branch: '경기 안양지부', event: '안양시민과 함께하는 락 페스타', request: '메인 스피커 및 모니터 스피커 지원 요청', status: '검토중', date: '2026.05.10' },
    { id: 2, branch: '서울 홍대지부', event: '직장인 인디밴드 연합 버스킹', request: '참여 밴드 및 관객용 음료 협찬 요청', status: '승인완료', date: '2026.05.08' },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">기업 후원 매칭 현황</h2>
        <p className="text-gray-400">
          연합회 본부에서 유치한 전국구 후원 기업 리스트입니다. 지부 행사에 필요한 물품과 자산을 매칭 신청하세요.
        </p>
      </div>

      {/* Sponsors List */}
      <div>
        <div className="flex items-center gap-2 mb-4">
           <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="text-xl font-bold text-white">본부 유치 후원사 / 지원 가능 물품</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sponsors.map((sponsor) => (
            <div key={sponsor.id} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors flex flex-col h-full">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-lg text-white">{sponsor.name}</h4>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  sponsor.status === '지원중' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                  sponsor.status === '협의가능' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                  'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {sponsor.status}
                </span>
              </div>
              <div className="text-sm text-gray-300 mb-2 flex-1">
                <span className="text-gray-500 block mb-1">지원 내역</span>
                <div className="font-medium bg-black/20 p-2 rounded text-gray-200">
                  {sponsor.item}
                </div>
              </div>
              <div className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                <span className="bg-white/10 px-1.5 py-0.5 rounded text-gray-300">조건</span>
                {sponsor.target}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-8"></div>

      {/* Matching Request Board */}
      <div>
        <div className="flex justify-between items-end mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="text-xl font-bold text-white">협찬/지원 매칭 신청 현황</h3>
          </div>
          <button className="bg-accent text-[#0A103D] text-sm font-bold px-4 py-2 rounded-lg hover:bg-[#82C8FF] transition-colors shadow-md">
            매칭 신청서 작성
          </button>
        </div>

        <div className="bg-[#1A2255]/30 border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-gray-400 text-sm">
                  <th className="p-4 font-semibold whitespace-nowrap">지부명</th>
                  <th className="p-4 font-semibold whitespace-nowrap">대상 행사명</th>
                  <th className="p-4 font-semibold w-1/2">요청 내용</th>
                  <th className="p-4 font-semibold whitespace-nowrap text-center">신청일</th>
                  <th className="p-4 font-semibold whitespace-nowrap text-center">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-medium text-gray-300 whitespace-nowrap">{req.branch}</td>
                    <td className="p-4 text-gray-200">{req.event}</td>
                    <td className="p-4 text-gray-400">{req.request}</td>
                    <td className="p-4 text-gray-500 text-center whitespace-nowrap">{req.date}</td>
                    <td className="p-4 text-center whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                        req.status === '승인완료' ? 'bg-accent/20 text-accent border border-accent/30' :
                        'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
