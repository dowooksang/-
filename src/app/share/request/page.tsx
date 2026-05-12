import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { supabase } from '@/lib/supabase';
import { PenSquare, HeartHandshake, Music, Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function RequestPage() {
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('category', 'volunteer')
    .order('created_at', { ascending: false });
    
  const postList = posts || [];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#0A103D] via-[#1A2255] to-[#5486B2] text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <HeartHandshake className="w-96 h-96 transform translate-x-1/4 -translate-y-1/4" />
        </div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
          <span className="inline-block py-1.5 px-4 rounded-full bg-accent text-[#0A103D] text-sm font-bold mb-6 tracking-widest shadow-lg">
            음악으로 나누는 따뜻함
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            재능기부 및 봉사 요청하기
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed break-keep">
            요양원, 보육원, 복지관 등 따뜻한 음악과 위로가 필요한 곳이라면 어디든 찾아갑니다.<br />
            사단법인 직장인밴드연합회 소속 아티스트들이 여러분의 뜻깊은 행사에 음악으로 동참하겠습니다.
          </p>
        </div>
      </div>

      {/* Guide & Features */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-50 text-[#5486B2] rounded-full flex items-center justify-center mb-6">
                <Music className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">맞춤형 공연 기획</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                어르신들을 위한 트로트부터 아이들을 위한 애니메이션 OST까지, 대상에 맞는 레퍼토리를 준비합니다.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                <HeartHandshake className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">장비 무상 지원</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                공연에 필요한 기본 앰프와 음향 장비(PA)는 연합회에서 자체적으로 준비하여 방문합니다.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">전국 지부 네트워킹</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                요청하신 지역에서 가장 가깝고 적합한 지부 및 밴드를 매칭하여 신속하게 연락을 드립니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Board Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-[#333333] pb-4 mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[#333333]">봉사 요청 게시판</h2>
            <p className="text-gray-500 mt-2 text-sm">
              행사 일정, 장소, 원하시는 공연 분위기를 간략히 남겨주시면 담당자가 확인 후 연락드립니다.
            </p>
          </div>
          <Link 
            href="/board/write?category=volunteer" 
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-[#0A103D] bg-accent hover:bg-[#82C8FF] rounded-lg shadow-md transition-all hover:-translate-y-0.5"
          >
            <PenSquare className="w-4 h-4" />
            봉사 요청 글쓰기
          </Link>
        </div>

        <div className="bg-white border-t-2 border-t-accent shadow-sm">
          <ul className="divide-y divide-gray-200">
            {postList.length === 0 ? (
              <li className="p-16 text-center text-gray-500 flex flex-col items-center">
                <HeartHandshake className="w-12 h-12 text-gray-300 mb-4" />
                <p>아직 등록된 봉사 요청글이 없습니다.</p>
                <p className="text-sm mt-2 text-gray-400">첫 번째 요청의 주인공이 되어주세요!</p>
              </li>
            ) : (
              postList.map(post => (
                <li key={post.id} className="hover:bg-gray-50 transition-colors">
                  <Link href={`/board/${post.id}`} className="block px-6 py-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-red-50 text-red-600 text-xs font-bold px-2 py-0.5 rounded border border-red-100">요청</span>
                          <h3 className="text-lg font-medium text-[#333333] truncate">
                            {post.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-2">
                          <span className="font-medium text-gray-700">{post.author}</span>
                          <span className="text-gray-300">|</span>
                          <time dateTime={post.created_at}>
                            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ko })}
                          </time>
                        </div>
                      </div>
                      <div className="text-gray-400">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
