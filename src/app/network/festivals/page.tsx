'use client';

import { useState } from 'react';

// Mock data for festivals
const mockFestivals = [
  { id: 1, region: '서울', city: '강남구', name: '2026 영동대로 K-POP 콘서트', date: '2026.05.15 - 05.16', place: '코엑스 동측 광장', scale: '메인 스테이지', status: '모집중' },
  { id: 2, region: '서울', city: '마포구', name: '홍대 인디음악 거리축제', date: '2026.06.01 - 06.03', place: '홍대 걷고싶은거리', scale: '버스킹/소극장', status: '모집마감' },
  { id: 3, region: '경기', city: '가평군', name: '자라섬 국제 재즈 페스티벌', date: '2026.10.09 - 10.11', place: '자라섬 일대', scale: '메인/서브 스테이지', status: '예정' },
  { id: 4, region: '부산', city: '해운대구', name: '해운대 모래축제 버스킹 페스티벌', date: '2026.05.20 - 05.24', place: '해운대 해수욕장 특설무대', scale: '버스킹', status: '모집중' },
  { id: 5, region: '제주', city: '제주시', name: '제주 들불축제 기념 락 페스티벌', date: '2026.03.10 - 03.12', place: '새별오름 메인무대', scale: '메인 스테이지', status: '종료' },
];

const regions = ['전체', '서울', '경기', '인천', '강원', '대전', '충남', '충북', '부산', '울산', '경남', '대구', '경북', '광주', '전남', '전북', '제주'];

export default function FestivalsPage() {
  const [selectedRegion, setSelectedRegion] = useState('전체');

  const filteredFestivals = selectedRegion === '전체' 
    ? mockFestivals 
    : mockFestivals.filter(f => f.region === selectedRegion);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">전국 음악 축제 데이터베이스</h2>
        <p className="text-gray-400">
          공공데이터포털 연동 기반 전국 226개 지자체의 음악/공연 행사를 확인하고 무대 기회를 탐색하세요.
        </p>
      </div>

      {/* Filter Section */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="font-bold text-white">지역 필터링</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {regions.map(region => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedRegion === region
                  ? 'bg-accent text-[#0A103D] shadow-md'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* DB Table / List */}
      <div className="bg-[#1A2255]/50 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-gray-300 text-sm">
                <th className="p-4 font-semibold whitespace-nowrap">지역</th>
                <th className="p-4 font-semibold whitespace-nowrap">축제명</th>
                <th className="p-4 font-semibold whitespace-nowrap">행사 기간</th>
                <th className="p-4 font-semibold whitespace-nowrap">개최 장소</th>
                <th className="p-4 font-semibold whitespace-nowrap">무대 규모</th>
                <th className="p-4 font-semibold text-center whitespace-nowrap">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filteredFestivals.length > 0 ? (
                filteredFestivals.map((fest) => (
                  <tr key={fest.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4 text-gray-300">
                      <span className="bg-white/10 px-2 py-1 rounded text-xs">{fest.region} {fest.city}</span>
                    </td>
                    <td className="p-4 font-bold text-white group-hover:text-accent transition-colors">
                      {fest.name}
                    </td>
                    <td className="p-4 text-gray-400">{fest.date}</td>
                    <td className="p-4 text-gray-400">{fest.place}</td>
                    <td className="p-4 text-gray-400">{fest.scale}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                        fest.status === '모집중' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        fest.status === '예정' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}>
                        {fest.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-500">
                    해당 지역에 등록된 축제 정보가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex justify-end mt-4 text-sm text-gray-500">
        <p>※ 공공데이터 API 연동은 현재 개발 중입니다. (Beta)</p>
      </div>
    </div>
  );
}
