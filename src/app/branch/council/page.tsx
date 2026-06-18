import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { supabase } from '@/lib/supabase';
import { createServerSupabase } from '@/lib/supabaseServer';
import { PenSquare, Lock, MessageSquare, ShieldAlert } from 'lucide-react';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

const LEVEL_NAMES: Record<number, string> = {
  1: '준회원 (LV1)',
  2: '정회원 (LV2)',
  3: '우수회원 (LV3)',
  4: '지부장급 (LV4)',
  5: '관리자 (LV5)',
  6: '최고관리자 (LV6)'
};

// 현재 유저의 등급(level)을 조회하는 헬퍼 함수
async function getCurrentUserLevel() {
  const cookieStore = await cookies();
  const emailCookie = cookieStore.get('email')?.value;
  if (!emailCookie) return 0; // 로그인하지 않은 경우 (손님 레벨 0)

  try {
    const supabaseServer = await createServerSupabase();
    const { data: user, error } = await supabaseServer
      .from('users')
      .select('level, nickname, name')
      .eq('email', decodeURIComponent(emailCookie))
      .single();
    
    if (error || !user) return 1; // 쿠키는 있으나 DB에 없으면 준회원 LV1 취급
    return user.level ?? 1;
  } catch (err) {
    return 1;
  }
}

// 현재 유저의 정보를 조회하는 헬퍼 함수
async function getCurrentUser() {
  const cookieStore = await cookies();
  const emailCookie = cookieStore.get('email')?.value;
  if (!emailCookie) return null;

  try {
    const supabaseServer = await createServerSupabase();
    const { data: user } = await supabaseServer
      .from('users')
      .select('id, email, nickname, name, level')
      .eq('email', decodeURIComponent(emailCookie))
      .single();
    return user;
  } catch (err) {
    return null;
  }
}

export default async function BranchCouncilPage() {
  const userLevel = await getCurrentUserLevel();
  const user = await getCurrentUser();

  // 지부장(LV4) 이상만 접근 가능
  if (userLevel < 4) {
    const targetLevelName = LEVEL_NAMES[4];
    const myLevelName = userLevel === 0 ? '비회원 (로그인 필요)' : LEVEL_NAMES[userLevel] || `LV${userLevel}`;

    return (
      <div className="min-h-screen bg-[#0A103D] flex items-center justify-center p-6 text-center text-white">
        <div className="bg-white/5 p-12 rounded-2xl border border-white/10 max-w-lg w-full backdrop-blur-md shadow-2xl animate-fade-in-up">
          <div className="text-6xl mb-6 text-red-500 flex justify-center"><Lock className="w-16 h-16" /></div>
          <h1 className="text-2xl font-bold mb-4">접근 권한이 없습니다</h1>
          <p className="text-gray-400 mb-2 leading-relaxed text-sm">
            해당 게시판은 연합회 공식 <strong>승인을 받은 {targetLevelName} 전용</strong> 비밀 게시판입니다.
          </p>
          <p className="text-gray-500 mb-8 text-xs font-semibold">
            (현재 등급: {myLevelName})
          </p>
          <div className="flex gap-4 justify-center">
            {userLevel === 0 ? (
              <Link href="/login" className="bg-accent text-[#0A103D] px-8 py-3 rounded-lg font-bold hover:bg-[#82C8FF] transition-all">
                로그인하러 가기
              </Link>
            ) : (
              <Link href="/" className="bg-white/10 text-white px-8 py-3 rounded-lg font-bold hover:bg-white/20 transition-all border border-white/10">
                메인으로
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 지부장 회의실 게시물 조회 (공지사항 고정 -> 최신순 정렬)
  const supabaseServer = await createServerSupabase();
  const { data: posts, error } = await supabaseServer
    .from('posts')
    .select('*')
    .eq('board_type', 'council')
    .order('is_notice', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('지부장 회의실 게시글 로드 에러:', error);
  }

  const postList = posts || [];

  return (
    <div className="bg-gray-50 min-h-screen text-black pb-24">
      {/* 프리미엄 다크 네이비 헤더 */}
      <div className="bg-[#0A103D] text-white py-16 px-6 relative overflow-hidden shadow-md">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded shadow-sm">기밀 유지</span>
              <span className="bg-white/20 text-accent text-xs font-bold px-2.5 py-1 rounded border border-white/10">지부장 전용</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">지부장 회의실</h1>
            <p className="text-gray-300 text-sm md:text-base">전국 지부장님들과 연합회 운영진이 직접 소통하고 주요 안건을 논의하는 비밀 소통 공간입니다.</p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2">
            <span className="text-xs text-gray-400 font-semibold">인증된 사용자</span>
            <span className="text-sm text-accent bg-accent/10 border border-accent/20 py-1.5 px-4 rounded-lg font-bold">
              👤 {user?.nickname || user?.name || '지부장'}님
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-12">
        <div className="pb-4 mb-8 flex items-end justify-between border-b-2 border-slate-800">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              📂 안건 목록
            </h2>
          </div>
          <Link 
            href={`/board/write?category=council`} 
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#5486B2] hover:bg-[#436f94] rounded-lg shadow transition-colors"
          >
            <PenSquare className="w-4.5 h-4.5" />
            새 안건 등록
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {postList.length === 0 ? (
              <li className="p-20 text-center text-gray-400">
                <ShieldAlert className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                등록된 안건 게시물이 없습니다.
              </li>
            ) : (
              postList.map(post => {
                const isNotice = post.is_notice === true;
                return (
                  <li 
                    key={post.id} 
                    className={`transition-colors duration-150 ${
                      isNotice 
                        ? 'bg-[#F4F7FB] hover:bg-[#ECF1F7] font-semibold border-l-4 border-l-[#5486B2]' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <Link href={`/board/${post.id}`} className="block px-6 py-5">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            {isNotice && (
                              <span className="bg-[#5486B2] text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-sm">
                                [공지]
                              </span>
                            )}
                            <h3 className={`text-lg text-slate-800 truncate ${isNotice ? 'font-bold' : 'font-medium'}`}>
                              {post.title}
                            </h3>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                            <span className="text-slate-700 font-bold">{post.author}</span>
                            <span className="text-gray-300">|</span>
                            <time dateTime={post.created_at}>
                              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ko })}
                            </time>
                            <span className="text-gray-300">|</span>
                            <span>조회 {post.views || 0}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
