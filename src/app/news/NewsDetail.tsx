'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Eye, Trash2, Edit3, ArrowLeft, User } from 'lucide-react';
import CommentSection from '@/components/CommentSection';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  author_id: string | null;
  created_at: string;
  views: number;
  is_notice: boolean;
}

interface NewsDetailProps {
  post: Post;
  currentUser: {
    id: string;
    level: number;
  } | null;
}

/**
 * '소식/알림' 게시글 상세 페이지를 렌더링하는 클라이언트 컴포넌트입니다.
 * 작성자 본인이거나 관리자(LV5 이상)일 경우 수정 및 삭제 권한을 부여하고 댓글 기능을 통합합니다.
 */
export default function NewsDetail({ post, currentUser }: NewsDetailProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  // 본인이 쓴 글이거나 관리자(LV5) 이상인지 체크
  const canManage =
    currentUser &&
    (currentUser.id === post.author_id || (currentUser.level !== undefined && currentUser.level >= 5));

  const handleDelete = async () => {
    if (!confirm('정말 이 소식글을 삭제하시겠습니까?')) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('삭제 실패');

      alert('성공적으로 삭제되었습니다.');
      router.push('/news');
      router.refresh();
    } catch (error) {
      alert('삭제 중 오류가 발생했습니다.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-[#FAFBFD] min-h-screen py-12 text-black">
      <div className="max-w-4xl mx-auto px-6">
        {/* 상단 뒤로가기 및 타이틀 */}
        <div className="mb-6">
          <Link
            href="/news"
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
              {post.is_notice && (
                <span className="bg-amber-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-sm">
                  [공지]
                </span>
              )}
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">소식/알림</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0A103D] leading-tight mb-4">
              {post.title}
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
          <div className="px-8 py-10 min-h-[350px]">
            <div
              className="prose max-w-none text-gray-800 leading-relaxed break-words"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* 하단 제어 및 목록 이동 */}
          <footer className="px-8 py-5 border-t border-gray-100 bg-slate-50/50 flex items-center justify-between">
            <Link
              href="/news"
              className="px-5 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            >
              목록
            </Link>

            {canManage && (
              <div className="flex items-center gap-2">
                <Link
                  href={`/news?action=edit&id=${post.id}`}
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
