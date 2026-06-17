import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import DeleteButton from './DeleteButton';
import { cookies } from 'next/headers';
import { Lock } from 'lucide-react';
import CommentSection from '@/components/CommentSection';

export const dynamic = 'force-dynamic';

const DEFAULT_READ_LEVELS: Record<string, number> = {
  notice: 1,
  free: 2,
  greeting: 1,
  promotion: 2,
  market: 2,
  archive: 2,
  qa: 1,
  press: 1,
  event: 1
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
    const { data: user, error } = await supabase
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

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', resolvedParams.id)
    .single();

  if (!post) {
    notFound();
  }

  // 1. 로그인 상태 및 현재 사용자 등급 파악
  const userLevel = await getCurrentUserLevel();

  // 2. 해당 카테고리의 필요 읽기/쓰기 등급 조회
  const category = post.category || 'free';
  let readLevel = DEFAULT_READ_LEVELS[category] ?? 1;
  let writeLevel = 2; // 기본 fallback
  try {
    const { data: permData } = await supabase
      .from('board_permissions')
      .select('read_level, write_level')
      .eq('category', category)
      .single();
    
    if (permData) {
      readLevel = permData.read_level;
      writeLevel = permData.write_level;
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
            해당 게시글을 읽으려면 <strong>{targetLevelName}</strong> 이상의 등급이 필요합니다.
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

  // 조회수 1 증가 처리
  const currentViews = (post.views || 0) + 1;
  await supabase
    .from('posts')
    .update({ views: currentViews })
    .eq('id', resolvedParams.id);

  return (
    <div className="bg-white flex-1 w-full flex justify-center py-12 text-black">
      <div className="max-w-6xl w-full px-6">
        <div className="border-b-2 border-[#333333] pb-4 mb-6">
          <h1 className="text-2xl font-bold text-[#333333]">공지/소통게시판</h1>
        </div>

        <article className="border-t-2 border-t-[#5486B2] bg-white">
          <header className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-[#333333]">
              {post.title}
            </h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="font-medium text-gray-800">{post.author}</span>
              <span className="text-gray-300">|</span>
              <time dateTime={post.created_at}>
                {new Date(post.created_at).toLocaleDateString('ko-KR', {
                  year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
                })}
              </time>
              <span className="text-gray-300">|</span>
              <span>조회 {currentViews}</span>
            </div>
          </header>

          <div className="px-6 py-12 min-h-[300px]">
            <div 
              className="prose max-w-none text-gray-800"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* 쓰기 등급이 현재 로그인 사용자 등급 이하인 경우에 댓글 작성 기능 제공 */}
          {userLevel >= writeLevel && (
            <div className="px-6 pb-8 border-t border-gray-100">
              <CommentSection postId={post.id} />
            </div>
          )}

          <footer className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <Link
              href={`/board?category=${post.category || 'free'}`}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              목록
            </Link>
            
            <div className="flex items-center gap-2">
              <Link
                href={`/board/${post.id}/edit`}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-55 transition-colors"
              >
                수정
              </Link>
              <DeleteButton id={post.id} />
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}
