'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Eye, Trash2, Edit3, ArrowLeft, User, Tag } from 'lucide-react';
import CommentSection from '@/components/CommentSection';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  author_id: string | null;
  created_at: string;
  views: number;
}

interface ShareDetailProps {
  post: Post;
  currentUser: {
    id: string;
    level: number;
  } | null;
}

/**
 * 말머리 태그와 깨끗한 제목을 분리해주는 헬퍼 함수
 */
function parseTitle(title: string) {
  const match = title.match(/^\[(나눔\/장터|멤버모집|참여\/기부)\]\s*(.*)$/);
  if (match) {
    return {
      tag: match[1] as '나눔/장터' | '멤버모집' | '참여/기부',
      cleanTitle: match[2],
    };
  }
  return {
    tag: null,
    cleanTitle: title,
  };
}

/**
 * 말머리 태그별 스타일 매핑
 */
function getTagStyle(tag: '나눔/장터' | '멤버모집' | '참여/기부' | null) {
  switch (tag) {
    case '나눔/장터':
      return 'bg-orange-50 text-orange-600 border border-orange-200';
    case '멤버모집':
      return 'bg-purple-50 text-purple-600 border border-purple-200';
    case '참여/기부':
      return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
    default:
      return 'bg-gray-50 text-gray-500 border border-gray-200';
  }
}

/**
 * '나눔과 참여' 게시글 상세 페이지를 렌더링하는 클라이언트 컴포넌트입니다.
 */
export default function ShareDetail({ post, currentUser }: ShareDetailProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const { tag, cleanTitle } = parseTitle(post.title);
  const tagStyle = getTagStyle(tag);

  // 본인이 쓴 글이거나 관리자(LV5) 이상인지 체크
  const canManage =
    currentUser &&
    (currentUser.id === post.author_id || (currentUser.level !== undefined && currentUser.level >= 5));

  const handleDelete = async () => {
    if (!confirm('정말 이 게시글을 삭제하시겠습니까?')) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('삭제 실패');

      alert('성공적으로 삭제되었습니다.');
      router.push('/share');
      router.refresh();
    } catch (error) {
      alert('삭제 중 오류가 발생했습니다.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-[#FAFBFD] min-h-screen py-12 text-black">
      <div className="max-w-4xl mx-auto px-6">
        {/* 상단 뒤로가기 */}
        <div className="mb-6">
          <Link
            href="/share"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#5486B2] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>목록으로 돌아가기</span>
          </Link>
        </div>

        {/* 상세 아티클 */}
        <article className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
          <header className="px-8 py-6 border-b border-gray-100 bg-slate-50/50">
            <div className="flex items-center gap-2 mb-3">
              <span className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${tagStyle}`}>
                <Tag className="w-3 h-3" />
                {tag || '일반'}
              </span>
              <span className="text-xs font-semibold text-gray-400">나눔과 참여</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0A103D] leading-tight mb-4">
              {cleanTitle}
            </h1>
            
            {/* 메타데이터 */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-semibold text-gray-700">
                  {post.author_id ? post.author : '알 수 없음'}
                </span>
              </div>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <time dateTime={post.created_at}>
                  {new Date(post.created_at).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </time>
              </div>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-gray-400" />
                <span>조회 {post.views}</span>
              </div>
            </div>
          </header>

          {/* 본문 내용 */}
          <div className="px-8 py-10 min-h-[300px]">
            <div
              className="prose max-w-none text-gray-800 leading-relaxed break-words"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* 하단 제어 */}
          <footer className="px-8 py-5 border-t border-gray-100 bg-slate-50/50 flex items-center justify-between">
            <Link
              href="/share"
              className="px-5 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            >
              목록
            </Link>

            {canManage && (
              <div className="flex items-center gap-2">
                <Link
                  href={`/share?action=edit&id=${post.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                >
                  <Edit3 className="w-4 h-4 text-gray-500" />
                  <span>수정</span>
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{isDeleting ? '삭제 중...' : '삭제'}</span>
                </button>
              </div>
            )}
          </footer>
        </article>

        {/* 댓글 섹션 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <CommentSection postId={post.id} />
        </div>
      </div>
    </div>
  );
}
