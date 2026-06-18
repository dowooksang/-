import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { supabase } from '@/lib/supabase';
import { createServerSupabase } from '@/lib/supabaseServer';
import { PenSquare, Lock } from 'lucide-react';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

const CATEGORY_NAMES: Record<string, { title: string, desc: string }> = {
  notice: { title: '공지사항', desc: '사단법인 직장인밴드연합회의 공식 공지사항 및 안내입니다.' },
  free: { title: '소통 (자유게시판)', desc: '자유롭게 소통하고 이야기를 나누는 공간입니다.' },
  greeting: { title: '가입인사', desc: '새로 오신 회원님들의 가입인사 공간입니다.' },
  promotion: { title: '동호회(클럽) 홍보', desc: '소속 동호회나 클럽을 홍보해보세요.' },
  market: { title: '악기/장비 장터', desc: '중고 악기나 장비를 거래하는 공간입니다.' },
  archive: { title: '활동 자료실', desc: '다양한 활동 자료와 악보 등을 공유합니다.' },
  qa: { title: '건의 및 Q&A', desc: '연합회에 궁금한 점이나 건의사항을 남겨주세요.' },
  press: { title: '보도자료', desc: '사단법인의 공식 보도자료입니다.' },
  event: { title: '이벤트', desc: '진행 중인 이벤트 소식입니다.' },
  council: { title: '지부장 회의실', desc: '지부장 및 관리자 전용 회의 공간입니다.' }
};

const DEFAULT_READ_LEVELS: Record<string, number> = {
  notice: 1,
  free: 2,
  greeting: 1,
  promotion: 2,
  market: 2,
  archive: 2,
  qa: 1,
  press: 1,
  event: 1,
  council: 4
};

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
      .select('level')
      .eq('email', decodeURIComponent(emailCookie))
      .single();
    
    if (error || !user) return 1; // 쿠키는 있으나 DB에 없으면 준회원 LV1 취급
    return user.level ?? 1;
  } catch (err) {
    return 1;
  }
}

export default async function BoardList({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const currentCategory = category || 'free';
  const categoryInfo = CATEGORY_NAMES[currentCategory] || CATEGORY_NAMES.free;

  // 1. 로그인 상태 및 현재 사용자 등급 파악
  const userLevel = await getCurrentUserLevel();

  // 2. 해당 카테고리의 필요 읽기 등급 조회
  let readLevel = DEFAULT_READ_LEVELS[currentCategory] ?? 1;
  const supabaseServer = await createServerSupabase();
  try {
    const { data: permData } = await supabaseServer
      .from('board_permissions')
      .select('read_level')
      .eq('category', currentCategory)
      .single();
    
    if (permData) {
      readLevel = permData.read_level;
    }
  } catch (e) {
    console.warn('board_permissions 조회 에러 (기본값 적용):', e);
  }

  // 3. 권한 대조 및 차단 뷰 반환
  if (userLevel < readLevel) {
    const targetLevelName = LEVEL_NAMES[readLevel] || `LV${readLevel}`;
    const myLevelName = userLevel === 0 ? '비회원 (로그인 필요)' : LEVEL_NAMES[userLevel] || `LV${userLevel}`;

    return (
      <div className="bg-white flex-1 w-full flex items-center justify-center py-32 text-black">
        <div className="text-center max-w-md px-6">
          <div className="text-6xl mb-6 text-red-500 flex justify-center"><Lock className="w-16 h-16" /></div>
          <h1 className="text-2xl font-extrabold text-[#333333] mb-4">접근 권한이 없습니다</h1>
          <p className="text-gray-500 mb-2 leading-relaxed text-sm">
            해당 게시판을 읽으려면 <strong>{targetLevelName}</strong> 이상의 등급이 필요합니다.
          </p>
          <p className="text-gray-400 mb-8 text-xs font-semibold">
            (현재 등급: {myLevelName})
          </p>
          <div className="flex gap-4 justify-center">
            {userLevel === 0 ? (
              <Link href="/login" className="bg-[#0A103D] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#1a225c] transition-colors">
                로그인하러 가기
              </Link>
            ) : (
              <Link href="/board/write?category=greeting" className="bg-[#5486B2] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#436f94] transition-colors">
                가입인사 작성하기 (정회원 등급업 신청)
              </Link>
            )}
            <Link href="/" className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-300 transition-colors">
              메인으로
            </Link>
          </div>
        </div>
      </div>
    );
  }

  let query = supabaseServer
    .from('posts')
    .select('*')
    .order('is_notice', { ascending: false })
    .order('created_at', { ascending: false });

  // 카테고리가 'council'인 경우 board_type = 'council'인 것만 필터링
  if (currentCategory === 'council') {
    query = query.eq('board_type', 'council');
  } else {
    // 일반 게시판은 board_type = 'general' 이고 category = currentCategory 인 것을 조회
    query = query.eq('category', currentCategory).eq('board_type', 'general');
  }

  const { data: posts } = await query;
  const postList = posts || [];

  return (
    <div className="bg-white file-auto flex-1 w-full flex justify-center py-12 text-black">
      <div className="max-w-6xl w-full px-6">
        <div className="border-b-2 border-[#333333] pb-4 mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#333333]">{categoryInfo.title}</h1>
            <p className="text-gray-500 mt-2 text-sm">{categoryInfo.desc}</p>
          </div>
          <Link 
            href={`/board/write?category=${currentCategory}`} 
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-[#5486B2] hover:bg-[#436f94] rounded shadow-sm transition-colors"
          >
            <PenSquare className="w-4 h-4" />
            글쓰기
          </Link>
        </div>

        <div className="bg-white border-t-2 border-t-[#5486B2] shadow-sm">
          <ul className="divide-y divide-gray-200">
            {postList.length === 0 ? (
              <li className="p-12 text-center text-gray-500">
                등록된 게시물이 없습니다.
              </li>
            ) : (
              postList.map(post => {
                const isNotice = post.is_notice === true;
                return (
                  <li 
                    key={post.id} 
                    className={`transition-colors duration-150 ${
                      isNotice 
                        ? 'bg-amber-50/70 hover:bg-amber-100/50 border-l-4 border-l-amber-500 font-semibold' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <Link href={`/board/${post.id}`} className="block px-6 py-5">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            {isNotice && (
                              <span className="bg-amber-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-sm">
                                [공지]
                              </span>
                            )}
                            <h2 className={`text-lg text-[#333333] truncate ${isNotice ? 'font-bold' : 'font-medium'}`}>
                              {post.title}
                            </h2>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="font-medium text-gray-700">{post.author}</span>
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
