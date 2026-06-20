import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { createServerSupabase } from '@/lib/supabaseServer';
import ShareList from './ShareList';
import ShareDetail from './ShareDetail';
import ShareForm from './ShareForm';

export const dynamic = 'force-dynamic';

const LEVEL_NAMES: Record<number, string> = {
  1: '준회원 (LV1)',
  2: '정회원 (LV2)',
  3: '우수회원 (LV3)',
  4: '지부장급 (LV4)',
  5: '관리자 (LV5)',
  6: '최고관리자 (LV6)',
};

/**
 * 브라우저 쿠키로부터 현재 로그인한 사용자의 정보를 조회합니다.
 */
async function getCurrentUser() {
  const cookieStore = await cookies();
  const emailCookie = cookieStore.get('email')?.value;
  if (!emailCookie) return null;

  try {
    const supabaseServer = await createServerSupabase();
    const { data: user, error } = await supabaseServer
      .from('users')
      .select('id, email, nickname, name, level')
      .eq('email', decodeURIComponent(emailCookie))
      .single();

    if (error || !user) {
      return {
        id: '',
        email: decodeURIComponent(emailCookie),
        nickname: '임시유저',
        name: '임시유저',
        level: 1,
      };
    }
    return user;
  } catch (err) {
    return null;
  }
}

/**
 * 카테고리별 읽기/쓰기 권한 등급을 조회합니다.
 */
async function getBoardPermissions(category: string) {
  const supabaseServer = await createServerSupabase();
  try {
    const { data } = await supabaseServer
      .from('board_permissions')
      .select('read_level, write_level')
      .eq('category', category)
      .single();

    if (data) {
      return {
        readLevel: data.read_level,
        writeLevel: data.write_level,
      };
    }
  } catch (e) {
    console.warn(`${category} 권한 조회 에러 (기본값 적용):`, e);
  }

  // 기본값 fallback (나눔과 참여는 일반 뷰어는 LV1, 작성은 LV2 정회원 이상)
  return {
    readLevel: 1,
    writeLevel: 2,
  };
}

export default async function SharePage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string; id?: string }>;
}) {
  const { action, id } = await searchParams;
  const currentUser = await getCurrentUser();
  const userLevel = currentUser?.level ?? 0;

  const { readLevel, writeLevel } = await getBoardPermissions('share');

  // 1. 읽기 권한 대조
  if (userLevel < readLevel) {
    const targetLevelName = LEVEL_NAMES[readLevel] || `LV${readLevel}`;
    const myLevelName = userLevel === 0 ? '비회원 (로그인 필요)' : LEVEL_NAMES[userLevel] || `LV${userLevel}`;

    return (
      <div className="bg-white min-h-screen w-full flex items-center justify-center py-32 text-black">
        <div className="text-center max-w-md px-6">
          <div className="text-6xl mb-6 text-red-500 flex justify-center">
            <Lock className="w-16 h-16" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#333333] mb-4">접근 권한이 없습니다</h1>
          <p className="text-gray-500 mb-2 leading-relaxed text-sm">
            해당 게시판을 읽으려면 <strong>{targetLevelName}</strong> 이상의 등급이 필요합니다.
          </p>
          <p className="text-gray-400 mb-8 text-xs font-semibold">(현재 등급: {myLevelName})</p>
          <div className="flex gap-4 justify-center">
            {userLevel === 0 ? (
              <Link
                href="/login"
                className="bg-[#0A103D] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#1a225c] transition-colors"
              >
                로그인하러 가기
              </Link>
            ) : (
              <Link
                href="/board/write?category=greeting"
                className="bg-[#5486B2] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#436f94] transition-colors"
              >
                가입인사 작성하기 (정회원 등급업 신청)
              </Link>
            )}
            <Link
              href="/"
              className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-300 transition-colors"
            >
              메인으로
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const supabaseServer = await createServerSupabase();

  // 2. 글 쓰기 분기
  if (action === 'write') {
    if (!currentUser) {
      redirect('/login');
    }
    if (userLevel < writeLevel) {
      return (
        <div className="bg-white min-h-screen w-full flex items-center justify-center py-32 text-black">
          <div className="text-center max-w-md px-6">
            <div className="text-5xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-[#333333] mb-2">글쓰기 권한이 없습니다</h1>
            <p className="text-gray-500 mb-6 leading-relaxed text-sm">
              나눔/참여 게시판에 글을 쓰려면 <strong>{LEVEL_NAMES[writeLevel]}</strong> 이상의 권한이 필요합니다.
            </p>
            <Link
              href="/share"
              className="bg-[#5486B2] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#436f94] transition-colors"
            >
              나눔 목록으로 돌아가기
            </Link>
          </div>
        </div>
      );
    }

    return <ShareForm currentUser={currentUser as any} />;
  }

  // 3. 글 수정 분기
  if (action === 'edit' && id) {
    if (!currentUser) {
      redirect('/login');
    }

    // 게시글 상세 조회
    const { data: post } = await supabaseServer.from('posts').select('*').eq('id', id).single();
    if (!post) {
      notFound();
    }

    // 작성자 본인이거나 관리자(LV5) 이상 권한 확인
    const isAuthor = currentUser.id === post.author_id;
    const isAdmin = userLevel >= 5;
    if (!isAuthor && !isAdmin) {
      return (
        <div className="bg-white min-h-screen w-full flex items-center justify-center py-32 text-black">
          <div className="text-center max-w-md px-6">
            <div className="text-5xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-[#333333] mb-2">수정 권한이 없습니다</h1>
            <p className="text-gray-500 mb-6 leading-relaxed text-sm">
              본인이 작성한 글이거나 관리자 등급만 수정할 수 있습니다.
            </p>
            <Link
              href={`/share?action=detail&id=${id}`}
              className="bg-[#5486B2] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#436f94] transition-colors"
            >
              글로 돌아가기
            </Link>
          </div>
        </div>
      );
    }

    return <ShareForm initialData={post} isEdit={true} currentUser={currentUser as any} />;
  }

  // 4. 글 상세 분기
  if (action === 'detail' && id) {
    const { data: post } = await supabaseServer.from('posts').select('*').eq('id', id).single();
    if (!post) {
      notFound();
    }

    // 조회수 1 증가 처리
    const nextViews = (post.views || 0) + 1;
    await supabaseServer.from('posts').update({ views: nextViews }).eq('id', id);

    return <ShareDetail post={{ ...post, views: nextViews }} currentUser={currentUser} />;
  }

  // 5. 기본값: 글 목록 카드 뷰
  const { data: posts } = await supabaseServer
    .from('posts')
    .select('id, title, content, author, author_id, created_at, views, is_notice, comments(id)')
    .eq('category', 'share')
    .order('created_at', { ascending: false });

  const canWrite = userLevel >= writeLevel;

  return <ShareList posts={(posts as any) || []} canWrite={canWrite} />;
}
