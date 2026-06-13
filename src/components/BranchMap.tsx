'use client';

import { useState } from 'react';

/**
 * 지부 맵 컴포넌트의 Props 타입 정의
 * 각 지역별 실시간 데이터(지부 수)를 넘겨받아 렌더링하기 위함입니다.
 */
interface BranchMapProps {
  seoulCount: number;
  chungcheongCount: number;
  yeongnamCount: number;
  honamCount: number;
}

/**
 * 지역 상세 정보의 데이터 구조 인터페이스
 */
interface RegionDetail {
  id: string;
  name: string;
  count: number;
  desc: string;
  accentColor: string;
  badgeBg: string;
  feed: string[];
}

export default function BranchMap({
  seoulCount,
  chungcheongCount,
  yeongnamCount,
  honamCount,
}: BranchMapProps) {
  // 사용자가 선택한 지역을 추적하는 상태 관리 (기본값: 서울/수도권)
  const [selectedRegion, setSelectedRegion] = useState<string>('seoul');

  // 전국 지부별 스토리와 실시간 피드를 엮은 상세 데이터셋
  // 아마추어 동호회의 친근함과 지역적 유대를 생생하게 느끼게 하는 문구로 구성했습니다.
  const regions: Record<string, RegionDetail> = {
    seoul: {
      id: 'seoul',
      name: '서울/수도권 지부',
      count: seoulCount,
      desc: '골목길 버스킹과 정겨운 주말 합주가 있는 도심 속 음악 놀이터',
      accentColor: 'text-[#E89C5E]',
      badgeBg: 'bg-[#E89C5E]/10 border-[#E89C5E]/30 text-[#E89C5E]',
      feed: [
        "🌸 '들꽃 통기타 클럽'이 망원 한강공원에서 소담한 봄바람 버스킹을 마쳤습니다.",
        "🏡 '마포 골목길 합주단'에서 이번 주말 신입 회원 환영 잼 세션을 준비 중입니다.",
        "☕ '분당 통기타 라떼' 모임이 아늑한 북카페에서 정기 모임을 가졌습니다."
      ]
    },
    chungcheong: {
      id: 'chungcheong',
      name: '충청/강원 지부',
      count: chungcheongCount,
      desc: '푸른 자연 속 힐링 연주와 아늑한 산속 통기타 캠핑의 낭만',
      accentColor: 'text-[#4A5D4E]',
      badgeBg: 'bg-[#4A5D4E]/10 border-[#4A5D4E]/30 text-[#4A5D4E]',
      feed: [
        "🏕️ '대관령 소나무 합주단'이 숲속 오두막에서 통기타 힐링 캠프를 진행했습니다.",
        "🎹 '소백산 건반회'가 마을 어르신들을 위한 재능기부 런치 콘서트를 열었습니다.",
        "🎷 '춘천 호수 색소폰 동호회'가 석양 아래 소박한 버스킹 연습에 돌입했습니다."
      ]
    },
    yeongnam: {
      id: 'yeongnam',
      name: '영남 지부',
      count: yeongnamCount,
      desc: '철썩이는 파도 소리와 어우러지는 해변 광장의 정겨운 버스킹 축제',
      accentColor: 'text-[#7A5A44]',
      badgeBg: 'bg-[#7A5A44]/10 border-[#7A5A44]/30 text-[#7A5A44]',
      feed: [
        "🌊 '오륙도 색소폰 동호회'가 광안리 해변 버스킹용 앰프 정비를 마쳤습니다.",
        "🎸 '포항 영일만 통기타클럽'이 3시간 전 주말 정기 합주를 훈훈하게 마쳤습니다.",
        "🥁 '대구 팔공산 재즈동호회'에서 드럼 이웃 멤버를 기쁘게 맞이했습니다."
      ]
    },
    honam: {
      id: 'honam',
      name: '호남/제주 지부',
      count: honamCount,
      desc: '돌담길 너머 들려오는 따뜻하고 서정적인 선율의 평화로운 쉼터',
      accentColor: 'text-[#D2B48C]',
      badgeBg: 'bg-[#D2B48C]/10 border-[#D2B48C]/30 text-[#D2B48C]',
      feed: [
        "🍊 '제주 푸른 잼 동호회'가 귤밭 돌담 너머로 통기타 릴레이 곡을 송출했습니다.",
        "🎺 '광주 무등산 관악클럽'이 청소년 쉼터 재능기부 공연 일정을 확정했습니다.",
        "🌿 '여수 밤바다 어쿠스틱' 회원들이 모여 통기타 튜닝 워크숍을 개최했습니다."
      ]
    }
  };

  const activeData = regions[selectedRegion] || regions.seoul;

  return (
    <div className="w-full bg-[#FAF7F2] border border-[#EBE4D8] rounded-3xl p-6 md:p-8 shadow-xs hover:shadow-md transition-all duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: 친근한 네트워크 지도 시각화 (SVG) */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <span className="text-xs font-bold text-neutral-400 mb-4 block">※ 지도 노드를 클릭하여 지부별 소식을 살펴보세요</span>
          
          <div className="relative w-full max-w-[320px] aspect-[4/5] bg-white border border-[#EBE4D8]/50 rounded-2xl p-4 shadow-2xs">
            <svg 
              viewBox="0 0 200 250" 
              className="w-full h-full text-[#7A6354]"
              aria-label="대한민국 아마추어 동호회 네트워크 지도"
            >
              {/* 유기적으로 연결된 끈끈한 네트워크를 상징하는 정감 있는 점선 */}
              <line x1="80" y1="50" x2="110" y2="100" stroke="#D2B48C" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="80" y1="50" x2="60" y2="180" stroke="#D2B48C" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="110" y1="100" x2="140" y2="160" stroke="#D2B48C" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="60" y1="180" x2="140" y2="160" stroke="#D2B48C" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="60" y1="180" x2="50" y2="230" stroke="#D2B48C" strokeWidth="2" strokeDasharray="3 3" />

              {/* 1. 서울/수도권 노드 */}
              <g 
                onClick={() => setSelectedRegion('seoul')}
                className="cursor-pointer group"
              >
                <circle 
                  cx="80" cy="50" r="18" 
                  fill={selectedRegion === 'seoul' ? '#E89C5E' : '#FAF7F2'} 
                  stroke="#E89C5E" 
                  strokeWidth="3.5"
                  className="transition-all duration-300 group-hover:scale-105"
                />
                <text 
                  x="80" y="54" 
                  textAnchor="middle" 
                  fontSize="9" 
                  fontWeight="900"
                  fill={selectedRegion === 'seoul' ? '#FFFFFF' : '#3E332E'}
                  className="pointer-events-none select-none font-sans"
                >
                  수도권
                </text>
                {/* 활성 지표 펄스 이펙트 */}
                {selectedRegion === 'seoul' && (
                  <circle cx="80" cy="50" r="24" fill="none" stroke="#E89C5E" strokeWidth="1" className="animate-ping" opacity="0.3" />
                )}
              </g>

              {/* 2. 충청/강원 노드 */}
              <g 
                onClick={() => setSelectedRegion('chungcheong')}
                className="cursor-pointer group"
              >
                <circle 
                  cx="110" cy="100" r="18" 
                  fill={selectedRegion === 'chungcheong' ? '#4A5D4E' : '#FAF7F2'} 
                  stroke="#4A5D4E" 
                  strokeWidth="3.5"
                  className="transition-all duration-300 group-hover:scale-105"
                />
                <text 
                  x="110" y="104" 
                  textAnchor="middle" 
                  fontSize="8" 
                  fontWeight="900"
                  fill={selectedRegion === 'chungcheong' ? '#FFFFFF' : '#3E332E'}
                  className="pointer-events-none select-none font-sans"
                >
                  충청강원
                </text>
                {selectedRegion === 'chungcheong' && (
                  <circle cx="110" cy="100" r="24" fill="none" stroke="#4A5D4E" strokeWidth="1" className="animate-ping" opacity="0.3" />
                )}
              </g>

              {/* 3. 영남 노드 */}
              <g 
                onClick={() => setSelectedRegion('yeongnam')}
                className="cursor-pointer group"
              >
                <circle 
                  cx="140" cy="160" r="18" 
                  fill={selectedRegion === 'yeongnam' ? '#7A5A44' : '#FAF7F2'} 
                  stroke="#7A5A44" 
                  strokeWidth="3.5"
                  className="transition-all duration-300 group-hover:scale-105"
                />
                <text 
                  x="140" y="164" 
                  textAnchor="middle" 
                  fontSize="9" 
                  fontWeight="900"
                  fill={selectedRegion === 'yeongnam' ? '#FFFFFF' : '#3E332E'}
                  className="pointer-events-none select-none font-sans"
                >
                  영남
                </text>
                {selectedRegion === 'yeongnam' && (
                  <circle cx="140" cy="160" r="24" fill="none" stroke="#7A5A44" strokeWidth="1" className="animate-ping" opacity="0.3" />
                )}
              </g>

              {/* 4. 호남 노드 */}
              <g 
                onClick={() => setSelectedRegion('honam')}
                className="cursor-pointer group"
              >
                <circle 
                  cx="60" cy="180" r="18" 
                  fill={selectedRegion === 'honam' ? '#D2B48C' : '#FAF7F2'} 
                  stroke="#D2B48C" 
                  strokeWidth="3.5"
                  className="transition-all duration-300 group-hover:scale-105"
                />
                <text 
                  x="60" y="184" 
                  textAnchor="middle" 
                  fontSize="9" 
                  fontWeight="900"
                  fill={selectedRegion === 'honam' ? '#FFFFFF' : '#3E332E'}
                  className="pointer-events-none select-none font-sans"
                >
                  호남
                </text>
                {selectedRegion === 'honam' && (
                  <circle cx="60" cy="180" r="24" fill="none" stroke="#D2B48C" strokeWidth="1" className="animate-ping" opacity="0.3" />
                )}
              </g>

              {/* 5. 제주 노드 */}
              <g 
                onClick={() => setSelectedRegion('honam')} // 제주는 호남과 연계하여 정보 노출
                className="cursor-pointer group"
              >
                <circle 
                  cx="50" cy="230" r="10" 
                  fill={selectedRegion === 'honam' ? '#E89C5E' : '#FAF7F2'} 
                  stroke="#E89C5E" 
                  strokeWidth="2"
                  className="transition-all duration-300 group-hover:scale-105"
                />
                <text 
                  x="50" y="233" 
                  textAnchor="middle" 
                  fontSize="7" 
                  fontWeight="900"
                  fill={selectedRegion === 'honam' ? '#FFFFFF' : '#3E332E'}
                  className="pointer-events-none select-none font-sans"
                >
                  제주
                </text>
              </g>
            </svg>
          </div>
        </div>

        {/* Right: 선택된 지부의 상세 현황 및 실시간 피드 */}
        <div className="lg:col-span-6 flex flex-col text-left">
          <span className={`inline-flex items-center self-start px-3 py-1 rounded-full border text-xs font-bold ${activeData.badgeBg} mb-4`}>
            🏡 {activeData.name} 현황
          </span>
          <h3 className="text-2xl font-black text-[#3E332E] mb-3">
            활성 동호회방 <span className={`text-3xl font-black ${activeData.accentColor} ml-1`}>{activeData.count}</span>개
          </h3>
          <p className="text-[#5A4535] text-sm md:text-base leading-relaxed mb-6">
            {activeData.desc}
          </p>

          <div className="border-t border-[#EBE4D8] pt-5">
            <h4 className="text-xs font-bold text-neutral-400 tracking-wider mb-4 uppercase">
              🌿 실시간 이웃 활동 피드
            </h4>
            <ul className="flex flex-col gap-3.5">
              {activeData.feed.map((item, index) => (
                <li 
                  key={index}
                  className="text-xs md:text-sm text-[#5A4535] bg-white border border-[#EBE4D8]/60 p-3 rounded-xl shadow-3xs flex items-start gap-2 hover:-translate-x-1 transition-transform duration-200"
                >
                  <span className="flex-shrink-0 mt-0.5 text-neutral-300">●</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
