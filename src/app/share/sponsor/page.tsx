import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function SponsorPage() {
  return (
    <div className="bg-[#0A103D] min-h-screen text-white">
      {/* 1. Hero Section (감성/열정 중심) */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1920&q=80"
            alt="음악을 즐기는 사람들"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A103D]/60 via-transparent to-[#0A103D]"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-12">
          <span className="text-accent font-bold tracking-widest text-sm mb-4 block">SPONSORSHIP & PARTNERSHIP</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            당신의 후원이 누군가에게는<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-white">평생의 무대</span>가 됩니다
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed mb-8">
            퇴근 후 악기를 꺼내 드는 설렘, 처음으로 무대에 서는 그 떨림을 응원해 주세요.<br />
            밴드를 넘어 모든 악기와 예술을 사랑하는 이들의 꿈을 협찬해 주십시오.
          </p>
          <div className="inline-flex items-center gap-2 bg-white/10 px-6 py-3 rounded-full border border-white/20 backdrop-blur-md">
            <span className="text-xl">🎸</span>
            <span className="text-sm font-medium">공연 장소 제공 • 악기 및 장비 지원 • 문화 활동비 후원</span>
          </div>
        </div>
      </section>

      {/* 2. 신뢰와 품격 중심 (사단법인 공신력) */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-white/10 to-transparent border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
              <div>
                <span className="inline-block px-3 py-1 bg-[#1A225C] text-accent rounded-full text-xs font-bold mb-4">공식 파트너십</span>
                <h2 className="text-3xl font-bold mb-4 leading-tight">
                  대한민국 생활문화예술의 미래,<br />
                  <span className="text-accent">직장인밴드연합회</span>와 함께 만들어 주십시오.
                </h2>
                <p className="text-gray-400 leading-relaxed mb-6">
                  저희 연합회는 단순한 동호회를 넘어, 전국의 아마추어 예술인들이 마음껏 재능을 펼칠 수 있는 토양을 만들고 있습니다. 
                  귀사(귀하)의 소중한 후원은 전국 지부 활성화와 아마추어 예술 축제 개최의 밑거름이 됩니다.
                </p>
                <div className="bg-black/20 p-5 rounded-xl border border-white/5">
                  <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                    <span>🤝</span> 파트너십 혜택
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start gap-2"><span className="text-accent">✓</span> 공식 홈페이지 및 행사 홍보물 로고 노출</li>
                    <li className="flex items-start gap-2"><span className="text-accent">✓</span> 연합회 공식 감사패 증정 및 초청</li>
                    <li className="flex items-start gap-2"><span className="text-accent">✓</span> 사단법인 기부금 영수증 발행 (세제 혜택)</li>
                  </ul>
                </div>
              </div>
              <div className="relative h-64 md:h-full min-h-[300px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <Image 
                  src="https://images.unsplash.com/photo-1540039155732-68090547b748?auto=format&fit=crop&w=800&q=80"
                  alt="파트너십"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 투명성 강조 (후원금 사용처) */}
      <section className="py-12 bg-[#060a26]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-10">보내주신 후원금은 이렇게 쓰입니다</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors">
              <div className="text-4xl mb-4">🎭</div>
              <h3 className="text-lg font-bold text-white mb-2">공연 및 대관 지원</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                아마추어 예술인들이 무대에 설 수 있도록 지역 공연장 대관료 및 무대 설비 확충에 사용됩니다.
              </p>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors">
              <div className="text-4xl mb-4">🎸</div>
              <h3 className="text-lg font-bold text-white mb-2">악기 및 인프라 대여</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                고가의 장비나 악기를 구하기 힘든 동호회원들을 위한 공용 장비 구비 및 연습실 지원에 사용됩니다.
              </p>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-lg font-bold text-white mb-2">전국 지부 운영 활성화</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                전국 방방곡곡의 지역 문화 발전을 이끄는 '우리동네문화클럽' 지부의 자립과 네트워킹 행사를 지원합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 지역 상생 중심 및 CTA */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <Image 
            src="https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?auto=format&fit=crop&w=1920&q=80"
            alt="지도 및 연결"
            fill
            className="object-cover"
          />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">우리 동네 예술가들의 든든한 버팀목이 되어주세요!</h2>
          <p className="text-gray-300 text-lg mb-10 leading-relaxed">
            전국 구석구석, 음악과 풍류가 흐르는 대한민국을 꿈꿉니다.<br />
            지역 사회와 함께 호흡하는 아마추어 문화 예술 네트워크의 일원이 되어 주십시오.
          </p>
          
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl mx-auto text-[#0A103D]">
            <h3 className="text-xl font-bold mb-6 text-center border-b border-gray-200 pb-4">후원 및 제휴 문의</h3>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#0A103D] rounded-full flex items-center justify-center text-white text-xl">
                  📞
                </div>
                <div className="text-left">
                  <div className="text-sm text-gray-500 font-medium">전화 문의</div>
                  <div className="font-bold text-lg">010-5340-9881</div>
                </div>
              </div>
              
              <div className="hidden md:block w-px h-12 bg-gray-200"></div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-[#0A103D] text-xl">
                  ✉️
                </div>
                <div className="text-left">
                  <div className="text-sm text-gray-500 font-medium">이메일 문의</div>
                  <div className="font-bold text-lg">dowooksang@gmail.com</div>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mt-6 pt-4 border-t border-gray-100">
              * 문의를 남겨주시면 담당자가 상세한 후원 프로그램 안내서를 발송해 드립니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
