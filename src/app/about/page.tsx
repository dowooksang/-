import React from 'react';

export default function AboutPage() {
  return (
    <div className="bg-[#0A103D] min-h-screen pt-10 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-white mb-4">법인 소개</h1>
          <p className="text-gray-400 text-lg">사단법인 직장인밴드연합회를 소개합니다.</p>
        </div>

        <div className="mb-24 space-y-16">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
             <div>
               <h2 className="text-3xl font-bold mb-6 text-white border-l-4 border-accent pl-4 leading-tight">🎵 대한민국 직장인 음악의 중심,<br/><span className="text-2xl text-accent">사단법인 직장인밴드연합회(AOWB)</span></h2>
               <p className="text-gray-300 leading-relaxed mb-4">
                 <strong className="text-accent font-bold">AOWB</strong>는 일상과 음악 사이에서 열정과 정체성을 찾아온 전국의 직장인 뮤지션들을 대표하는 공식 공연 단체입니다.
               </p>
               <p className="text-gray-300 leading-relaxed mb-4">
                 2000년대 초 태동한 직장인밴드 문화의 안정적인 발전과 권익 보호를 위해 2008년, 서울시의 허가를 받아 공식 사단법인으로 출범했습니다.
               </p>
               <p className="text-gray-300 leading-relaxed font-bold">
                 우리는 취미로 그치는 음악 활동을 넘어, 대한민국 대중음악계의 당당한 일원으로서 문화 발전에 기여하고 있습니다.
               </p>
             </div>
             <div className="bg-gray-200 rounded-2xl h-80 flex items-center justify-center text-gray-500 italic relative overflow-hidden shadow-lg">
               <div className="absolute inset-0 bg-cover bg-center hover:scale-105 transition-transform duration-700" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?q=80&w=2076&auto=format&fit=crop')" }}></div>
               <div className="absolute inset-0 bg-black/20"></div>
             </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
              <h3 className="text-2xl font-bold mb-4 text-accent">1. 직장인밴드 전용 무대 제공</h3>
              <div className="space-y-4 text-gray-400">
                <p>
                  <strong className="text-white drop-shadow-sm">직장인밴드 페스티벌 (Band Festival):</strong> 2010년부터 서울문화재단의 후원을 받아 매년 5월부터 10월까지 서울 시민의 여가 공간을 찾아가는 우리 고유의 공연 트렌드를 창조하고 이끌어왔습니다. 매회 5개 팀씩, 연간 30개 팀 이상이 참여하는 이 축제는 직장인 뮤지션만을 위한 최고의 무대입니다.
                </p>
                <p>
                  <strong className="text-white drop-shadow-sm">전국 네트워크:</strong> 연합회 직속 30여 개의 그룹사운드를 비롯하여 전국 직장인밴드와의 유대관계를 통해, 크고 작은 지역 축제 및 행사에서 성공적인 공연을 주도합니다.
                </p>
              </div>
            </div>

            <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
              <h3 className="text-2xl font-bold mb-4 text-accent">2. 문화 교류와 재능 기부</h3>
              <div className="space-y-4 text-gray-400">
                <p>
                  <strong className="text-white drop-shadow-sm">글로벌 교류:</strong> 2011년 일본 직장인밴드 초청 공연 및 2012년 한국 대표팀의 KAGOSHIMA JAZZ STREET 참가 등 국제 무대에서 직장인밴드 문화 교류의 첨병 역할을 수행하며 대한민국의 문화적 역량을 과시하고 있습니다.
                </p>
                <p>
                  <strong className="text-white drop-shadow-sm">재능 기부 및 봉사:</strong> 2008년부터 장애 시설(솔뫼마을) 및 노인 복지 시설(서초성모성심 복지회관 등) 등 문화 소외 지역을 꾸준히 찾아 음악을 통한 봉사활동과 재능 기부를 실천하였습니다.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#1E293B] to-[#0A103D] text-white p-10 rounded-2xl text-center shadow-2xl relative overflow-hidden border border-white/10">
            <div className="absolute top-0 left-0 w-full h-1 bg-accent"></div>
            <h3 className="text-2xl font-bold mb-4 text-accent">💖 연합회가 함께 만드는 가치</h3>
            <p className="text-gray-300 leading-relaxed mb-8 max-w-3xl mx-auto">
              연합회는 넥타이를 맨 록커부터 2030 여성 밴드까지, 모든 세대의 음악적 열정을 지원합니다.<br className="hidden md:block"/>
              단순한 카피밴드를 넘어선 직장인밴드만의 음악적 정체성을 확립하고, 음악을 통해 대중문화 발전에 기여하는 것이 우리의 미션입니다.
            </p>
            <p className="text-xl md:text-2xl font-extrabold italic text-white drop-shadow-lg">
              “일상의 멜로디를 무대 위의 하모니로 만드는 곳,<br className="md:hidden"/> 사단법인 직장인밴드연합회입니다.”
            </p>
          </div>
        </div>


        <div className="bg-[#111827] rounded-2xl p-10 text-center border border-white/10">
           <h2 className="text-3xl font-bold mb-8 text-white">오시는 길</h2>
           <div className="w-full h-96 bg-[#1F2937] rounded-xl mb-6 flex items-center justify-center text-gray-400">
             {/* Map Placeholder */}
             <div className="text-center">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-2 text-accent">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
               </svg>
               <p>카카오/네이버 지도 API 연동 예정 구역</p>
             </div>
           </div>
           <p className="font-medium text-lg text-gray-200">서울시 서초구 효령로4길 56-16 (AOWB 회관)</p>
        </div>
      </div>
    </div>
  );
}
