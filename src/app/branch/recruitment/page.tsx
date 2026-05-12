import Link from 'next/link';

export default function BranchRecruitmentPage() {
  return (
    <div className="bg-[#0A103D] min-h-screen text-white flex justify-center py-16 px-6">
      <div className="max-w-4xl w-full">
        {/* 공지 헤더 */}
        <div className="text-center mb-12">
          <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-bold border border-accent/30 tracking-widest mb-4 inline-block">
            NOTICE
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">전국 지부 모집 공고</h1>
          <p className="text-gray-400 text-lg">사단법인 직장인밴드연합회와 함께할 각 지역의 든든한 거점을 찾습니다.</p>
        </div>

        {/* 공지 내용 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 backdrop-blur-sm shadow-2xl mb-12 space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold text-accent mb-4 border-b border-white/10 pb-2">모집 개요</h2>
            <p className="text-gray-300 leading-relaxed">
              본 연합회는 전국 단위의 순수 아마추어 문화동호회('우리동네문화클럽') 활성화와 체계적인 지원을 위해 각 지역을 대표할 '지부'를 모집하고 있습니다. 
              지부는 해당 지역의 다양한 동호회(클럽)들을 통합 관리하고, 연합회 공식 행사를 지역에서 주관하는 등 중추적인 역할을 수행하게 됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-accent mb-4 border-b border-white/10 pb-2">지부의 역할 및 혜택</h2>
            <ul className="space-y-3 text-gray-300 list-disc pl-5">
              <li>지역 내 아마추어 문화동호회(우리동네문화클럽) 네트워킹 및 통합 관리</li>
              <li>연합회 주관 대규모 행사 및 페스티벌 지역 예선 개최 권한</li>
              <li>지부 전용 모임 공간 및 인프라 지원 우선 고려</li>
              <li>지부장 전용 비밀 게시판(회의실) 참여 및 연합회 운영진 권한 부여</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-accent mb-4 border-b border-white/10 pb-2">신청 조건</h2>
            <ul className="space-y-3 text-gray-300 list-disc pl-5">
              <li>해당 지역에서 활동 중인 문화동호회(클럽) 대표 또는 리더</li>
              <li>현재 1개 이상의 동호회(또는 팀)가 소속되어 활동 중일 것</li>
              <li>동호회원들이 모일 수 있는 연습실이나 모임 공간을 보유하고 있거나 확보 가능한 자 (우대)</li>
            </ul>
          </section>

          <div className="bg-[#1A225C]/50 border border-[#82C8FF]/30 p-6 rounded-xl mt-8">
            <h3 className="font-bold text-[#82C8FF] mb-2 flex items-center gap-2">
              <span>💡</span> 진행 절차
            </h3>
            <p className="text-sm text-gray-300">
              하단의 [지부 신청하기] 버튼을 통해 5가지 필수 항목만 입력하시면 신청이 완료됩니다.<br/>
              이후 연합회 최고관리자의 개별 연락 및 심사를 거쳐 [승인] 처리되며, 승인 즉시 '지부장' 등급이 부여되고 전국 지부 지도에 노출됩니다.
            </p>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex justify-center">
          <Link 
            href="/branch/apply"
            className="bg-accent text-[#0A103D] text-xl font-bold px-12 py-5 rounded-full shadow-[0_0_20px_rgba(130,200,255,0.4)] hover:shadow-[0_0_30px_rgba(130,200,255,0.6)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-3"
          >
            <span>📝 지부 신청하기</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
