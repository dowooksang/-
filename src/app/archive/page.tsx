import React from 'react';
import Link from 'next/link';

export default function ArchivePage() {
  return (
    <div className="bg-white min-h-screen pt-10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-primary mb-4">뉴스룸 / 보도자료</h1>
          <p className="text-gray-500 text-lg">직장인밴드연합회의 생생한 소식을 언론 보도를 통해 만나보세요.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Main featured article */}
          <div className="lg:col-span-2 group cursor-pointer group hover:shadow-xl transition-shadow border border-gray-200 rounded-xl overflow-hidden bg-white flex flex-col">
            <div className="h-80 w-full bg-gray-200 relative overflow-hidden">
               <div 
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540039155732-68473638ep?q=80&w=2070&auto=format&fit=crop')" }}
                ></div>
            </div>
            <div className="p-8 flex flex-col justify-center bg-gray-50 flex-1 border-t border-gray-100">
              <div className="flex gap-2 mb-4">
                <span className="text-xs font-bold bg-primary text-white px-2 py-1 rounded">보도자료</span>
                <span className="text-xs font-bold border border-gray-300 text-gray-500 px-2 py-1 rounded">조선일보</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                "퇴근 후엔 넥타이 풀고 기타 멥니다" 직장인 밴드 부는 새 바람
              </h2>
              <p className="text-gray-600 line-clamp-3 mb-6">
                최근 워라밸 문화가 정착되면서 직장인들의 여가 활동도 진화하고 있다. 그 중 가장 눈에 띄는 것은 '직장인 밴드'의 부활이다. 과거 대학가요제나 동아리 활동을 추억하는 4050 세대부터, 새로운 취미를 찾는 MZ 세대까지 다양한 연령대가 어우러져 하모니를 만들어내고 있다. 사단법인 직장인밴드연합회에 따르면 올해 가입한 신규 밴드 수만...
              </p>
              <div className="text-sm border-t border-gray-200 pt-4 text-gray-500">
                2026. 03. 10 발행
              </div>
            </div>
          </div>

          {/* Sub articles */}
          <div className="flex flex-col gap-6">
            {[
              { press: '매일경제', title: '제 15회 수도권 직장인밴드 페스티벌, 무관중 온라인 생중계 성료', date: '2026. 02. 15' },
              { press: 'KBS 뉴스', title: '[문화현장] 악기로 뭉친 직장인들, 세대 갈등도 씻는다', date: '2025. 11. 22' },
              { press: '문화일보', title: '연합회, 연말 자선 콘서트 수익금 전액 기부', date: '2025. 12. 30' },
              { press: '보도자료', title: '홍대/강남을 넘어 경기 지역까지, 문화클럽 거점 확대', date: '2025. 08. 05' },
            ].map((news, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl p-6 hover:border-primary hover:shadow-md transition-all cursor-pointer bg-white group h-full flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold border border-gray-300 text-gray-500 px-2 py-1 rounded mb-3 inline-block">
                    {news.press}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-primary transition-colors mb-2">
                    {news.title}
                  </h3>
                </div>
                <div className="text-xs text-gray-400 mt-4">
                  {news.date}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Load more */}
        <div className="mt-16 text-center">
           <button className="border-2 border-primary text-primary px-10 py-3 font-bold rounded hover:bg-primary hover:text-white transition-colors">
             보도자료 더보기
           </button>
        </div>
      </div>
    </div>
  );
}
