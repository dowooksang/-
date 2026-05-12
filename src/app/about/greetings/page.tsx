import React from 'react';
import Image from 'next/image';

export default function GreetingsPage() {
  return (
    <div className="bg-[#0A103D] min-h-screen text-white">
      {/* 1. Hero Section (배경 이미지 + 타이틀) */}
      <section className="relative w-full h-[50vh] min-h-[400px] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1920&q=80"
            alt="생동감 넘치는 공연 현장"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A103D]/30 via-[#0A103D]/60 to-[#0A103D]"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 mt-12">
          <span className="inline-block py-1 px-3 bg-accent/20 border border-accent/30 text-accent rounded-full text-sm font-bold tracking-widest mb-6">
            CEO MESSAGE
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            대표이사 인사말
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-light">
            당신의 열정이 빛나는 무대를 위하여
          </p>
        </div>
      </section>

      {/* 2. 본문 섹션 */}
      <section className="py-16 px-6 relative">
        <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 p-8 md:p-16 rounded-3xl backdrop-blur-md shadow-2xl relative">
          
          {/* 장식용 따옴표 */}
          <div className="absolute -top-8 -left-4 md:-left-8 text-6xl md:text-8xl text-accent opacity-30 select-none">
            "
          </div>
          
          <p className="text-lg text-gray-300 mb-12">
            안녕하십니까. <b>사단법인 직장인밴드연합회 대표이사</b> 입니다.
          </p>

          <div className="space-y-12 text-lg md:text-xl leading-relaxed font-light text-gray-300">
            {/* 첫 번째 문단 */}
            <p>
              캄캄한 밤, 도심의 빌딩 숲 사이로 새어 나오는 작은 불빛들이 있습니다. 
              고된 하루를 마친 직장인들이 정장 대신 악기를 메고 모여드는 곳, 바로 우리의 연습실입니다. 
              튜닝을 맞추는 손길과 합을 맞추는 눈빛 속에서 <b>우리는 비로소 살아있음을 느낍니다.</b> 
              하지만 안타깝게도 그 뜨거운 땀방울이 온전한 박수갈채로 이어질 '무대'는 여전히 좁기만 합니다.
            </p>

            {/* 두 번째 문단 */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-3xl">🌐</span> 우리는 전국의 모든 연습실을 하나의 무대로 잇고자 합니다.
              </h3>
              <p>
                본 연합회는 단순히 모임을 주선하는 곳이 아닙니다. 전국 곳곳에 흩어진 아마추어 예술인들을 하나의 거대한 네트워크로 연결하여, 
                <b>지역의 경계를 허물고 누구나 주인공이 될 수 있는 무대를 설계하는 ‘문화의 장인’</b>이 되고자 합니다. 
                서울에서 부산까지, 우리의 소리가 끊이지 않고 이어질 때 대한민국 생활문화예술의 새로운 지도가 완성될 것입니다.
              </p>
            </div>

            {/* 세 번째 문단 */}
            <div className="bg-black/20 p-8 rounded-2xl border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-accent"></div>
              <h3 className="text-2xl font-bold text-accent mb-4 flex items-center gap-3">
                <span className="text-3xl">🤝</span> 후원 기업 여러분, 여러분의 지지는 누군가의 인생을 바꿉니다.
              </h3>
              <p>
                아마추어 연주자들에게 무대는 단순한 공연 공간 그 이상입니다. 그것은 <b>잊고 지냈던 꿈을 되찾는 순간이자, 삶의 활력을 회복하는 치유의 현장</b>입니다. 
                기업 여러분의 소중한 후원과 협찬은 이들에게 가장 화려한 조명이 되어줄 것이며, 우리 사회를 더욱 건강하고 풍요롭게 만드는 <b>가장 가치 있는 투자</b>가 될 것입니다.
              </p>
            </div>

            {/* 네 번째 문단 */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-3xl">🎤</span> 이제, 당신의 무대가 시작됩니다.
              </h3>
              <p>
                우리는 약속합니다. <b>악기를 든 모든 이들이 외롭지 않게, 그들의 연주가 세상에 닿을 수 있도록 든든한 버팀목</b>이 되겠습니다. 
                전국 지부장님들의 헌신과 후원 파트너들의 신뢰를 바탕으로, 대한민국 모든 아마추어 예술인이 환호성 속에서 자신의 노래를 부르는 그날까지 멈추지 않고 전진하겠습니다.
              </p>
            </div>

            {/* 결론 */}
            <p className="text-xl text-center font-medium text-white pt-8 border-t border-white/10">
              여러분의 뜨거운 열정과 함께 이 무대를 채워주십시오.<br/>
              감사합니다.
            </p>
            
            {/* 서명 */}
            <div className="text-right pt-8">
              <p className="text-gray-400 mb-2">2026년 5월 8일</p>
              <p className="text-2xl font-bold text-white">사단법인 직장인밴드연합회 대표이사 배상</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
