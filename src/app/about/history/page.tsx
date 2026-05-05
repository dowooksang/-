import Link from 'next/link';

export default function HistoryPage() {
  return (
    <div className="bg-[#0A103D] text-white min-h-screen py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-accent text-sm font-bold tracking-widest uppercase mb-2 block">Mission & History</span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">설립 취지 및 연혁</h1>
          <p className="text-gray-300 text-lg">아마추어 음악인들의 권익을 보호하고, 평범한 일상을 예술로 가꾸어 나갑니다.</p>
        </div>

        {/* Timeline */}
        <div className="relative border-l-2 border-accent/30 pl-8 ml-4 md:ml-0 md:pl-0 md:border-l-0">
          {/* Timeline Center Line for PC */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-accent/30 -translate-x-1/2"></div>
          
          <div className="flex flex-col gap-16 md:gap-24">
            
            {/* 2013 Event */}
            <div className="relative w-full md:flex md:justify-between md:items-center">
              <div className="absolute -left-[41px] md:left-1/2 md:-translate-x-1/2 w-5 h-5 rounded-full bg-accent border-4 border-[#0A103D] z-10"></div>
              
              <div className="md:w-[45%] text-left md:text-right md:pr-12">
                <div className="text-4xl font-black text-white/20 mb-2">2013</div>
                <h3 className="text-2xl font-bold text-accent mb-3">서울톡톡 보도: "넥타이를 맨 록커, 직장인밴드 모여라"</h3>
                <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                  어린이대공원 열린무대에서 개최된 &lt;2013 직장인밴드 Festival&gt; 관련 보도.
                  본 연합회가 서울문화재단에서 예술지원금을 후원받아 진행한 공신력 있는 축제로서, 
                  직장인들에게 끼를 발산할 전용 무대를 제공하고 시민들에게 즐거움을 선사하는 연합회의 역할이 조명되었습니다.
                </p>
                <div className="inline-block px-3 py-1 bg-white/10 rounded text-xs text-blue-200">#서울문화재단 #직장인밴드Festival</div>
              </div>
              <div className="hidden md:block md:w-[45%] pl-12 opacity-80">
                <div className="w-full h-48 bg-gray-800 rounded-xl overflow-hidden border border-white/10 relative">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540039155732-d674d40af4e0?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white text-xs font-bold">서울톡톡 기사 캡처본 대체 이미지</div>
                </div>
              </div>
            </div>

            {/* 2008 Event */}
            <div className="relative w-full md:flex md:justify-between md:items-center flex-row-reverse">
              <div className="absolute -left-[41px] md:left-1/2 md:-translate-x-1/2 w-5 h-5 rounded-full bg-accent border-4 border-[#0A103D] z-10"></div>
              
              <div className="md:w-[45%] text-left md:pl-12">
                <div className="text-4xl font-black text-white/20 mb-2">2008</div>
                <h3 className="text-2xl font-bold text-accent mb-3">조선일보 보도: 사단법인 공식 출범</h3>
                <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                  인터넷 카페로 시작된 모임이 서울시로부터 공식적인 '사단법인' 지위를 인정받고 출범. 
                  당시 400여 명의 회원을 보유하며 <strong>'대한가수협회'와 동등한 법적 지위</strong>를 얻게 된 가요계의 상징적 사건입니다.
                </p>
                <blockquote className="border-l-4 border-white/40 pl-4 text-gray-400 italic text-sm mb-4">
                  "이제 우리도 대중음악계의 당당한 일원이 되었으며, 한국 가요 발전에 한몫하겠다" <br/>- 초대 대표 황지훈
                </blockquote>
                <div className="inline-block px-3 py-1 bg-white/10 rounded text-xs text-blue-200">#사단법인설립 #조선일보보도</div>
              </div>
              <div className="hidden md:block md:w-[45%] pr-12 opacity-80">
                <div className="w-full h-48 bg-gray-800 rounded-xl overflow-hidden border border-white/10 relative">
                   <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504465039710-0f49c0a47eb7?q=80&w=1964&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-60"></div>
                   <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-transparent"></div>
                   <div className="absolute bottom-4 right-4 text-white text-xs font-bold text-right">조선일보 2008.03.13</div>
                </div>
              </div>
            </div>

            {/* 2000s Origin */}
            <div className="relative w-full md:flex md:justify-between md:items-center">
              <div className="absolute -left-[41px] md:left-1/2 md:-translate-x-1/2 w-5 h-5 rounded-full bg-white/30 border-4 border-[#0A103D] z-10"></div>
              
              <div className="md:w-[45%] text-left md:text-right md:pr-12">
                <div className="text-4xl font-black text-white/10 mb-2">2000s</div>
                <h3 className="text-xl font-bold text-white mb-2">인터넷 카페 "직장인밴드 7080" 결성</h3>
                <p className="text-gray-400 text-sm">
                  음악을 사랑하는 소수의 직장인들이 모여 순수한 친목 도모를 목적으로 인터넷 커뮤니티를 결성하고, 소규모 지하 연습실에서 첫 합주를 시작했습니다.
                </p>
              </div>
              <div className="hidden md:block md:w-[45%] pl-12"></div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
