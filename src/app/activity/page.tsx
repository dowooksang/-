import React from 'react';
import Link from 'next/link';

export default function ActivityPage() {
  const dummyImages = [
    "https://images.unsplash.com/photo-1540039155732-68473638ep?q=80&w=2070&auto=format&fit=crop", // placeholder
    "https://images.unsplash.com/photo-1501612780327-45045538702b?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=2079&auto=format&fit=crop",
  ];

  return (
    <div className="bg-[#0A103D] min-h-screen text-white pt-10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-white mb-4">활동 갤러리</h1>
          <p className="text-gray-400 text-lg">우리가 만들어가는 뜨거운 무대의 기록입니다.</p>
        </div>

        {/* Gallery Grid (Mangboard Gallery Skin Replacement) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dummyImages.map((img, idx) => (
            <Link href="#" key={idx} className="group flex flex-col bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-colors shadow-lg">
              <div className="relative h-60 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url('${idx === 0 ? "https://images.unsplash.com/photo-1493225457124-a1a2a40b7511?q=80&w=2070&auto=format&fit=crop" : img}')` }}
                ></div>
                {/* Play Button Icon for Video entries if needed */}
                {idx % 3 === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                    <div className="w-14 h-14 bg-accent/90 rounded-full flex items-center justify-center text-primary-dark pl-1 shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                        <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-accent px-2 py-1 bg-accent/10 rounded">
                    {idx % 3 === 0 ? '공연영상' : '정모사진'}
                  </span>
                  <span className="text-xs text-gray-400">2026.04.{18 - idx}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-accent transition-colors">
                  제 {15 - idx}회 정기공연 현장 스케치
                </h3>
                <p className="text-gray-400 text-sm line-clamp-2 flex-1">
                  홍대 롤링홀에서 진행된 이번 정기 공연은 총 10개 팀이 참여하여 성황리에 마무리 되었습니다. 무대를 가득 채운 열기를 사진으로 확인하세요.
                </p>
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center text-xs text-gray-500 gap-4">
                  <span className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    {1200 - idx * 34}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Pagination Dummy */}
        <div className="mt-12 flex justify-center gap-2">
          <button className="w-10 h-10 rounded-md bg-white/10 text-white flex items-center justify-center hover:bg-accent hover:text-primary-dark font-bold transition-colors">1</button>
          <button className="w-10 h-10 rounded-md bg-white/5 text-gray-400 flex items-center justify-center hover:bg-white/10 transition-colors">2</button>
          <button className="w-10 h-10 rounded-md bg-white/5 text-gray-400 flex items-center justify-center hover:bg-white/10 transition-colors">3</button>
        </div>
      </div>
    </div>
  );
}
