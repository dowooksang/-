import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { PenSquare, Pin, Eye, MessageSquare, Calendar, User } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  author: string;
  author_id: string | null;
  created_at: string;
  views: number;
  is_notice: boolean;
  comments?: { id: string }[];
}

interface NewsListProps {
  posts: Post[];
  canWrite: boolean;
}

/**
 * '소식/알림' 게시판의 목록 뷰를 렌더링하는 서버 컴포넌트입니다.
 * 중요 공지사항(is_notice)은 최상단에 고정 뱃지 및 배경 스타일과 함께 노출됩니다.
 */
export default function NewsList({ posts, canWrite }: NewsListProps) {
  return (
    <div className="bg-[#FAFBFD] min-h-screen py-12 text-black">
      <div className="max-w-5xl mx-auto px-6">
        {/* 상단 헤더 */}
        <div className="border-b border-gray-200 pb-6 mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#0A103D] tracking-tight">소식/알림</h1>
            <p className="text-gray-500 mt-2 text-sm leading-relaxed">
              사단법인 직장인밴드연합회의 공식 공지사항 및 대외 문화 사업 소식을 전달하는 공간입니다.
            </p>
          </div>
          {canWrite && (
            <Link
              href="/news?action=write"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#0A103D] hover:bg-[#1a225c] rounded-lg shadow-sm hover:shadow transition-all duration-200"
            >
              <PenSquare className="w-4 h-4" />
              <span>소식 등록</span>
            </Link>
          )}
        </div>

        {/* 게시글 리스트 컨테이너 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {posts.length === 0 ? (
              <li className="py-24 text-center text-gray-400 font-medium">
                등록된 소식 또는 공지사항이 없습니다.
              </li>
            ) : (
              posts.map((post) => {
                const isNotice = post.is_notice === true;
                const commentCount = post.comments?.length || 0;

                return (
                  <li
                    key={post.id}
                    className={`transition-all duration-200 ${
                      isNotice
                        ? 'bg-amber-50/50 hover:bg-amber-50/80 border-l-4 border-l-amber-500'
                        : 'hover:bg-slate-50/50'
                    }`}
                  >
                    <Link href={`/news?action=detail&id=${post.id}`} className="block px-6 py-5">
                      <div className="flex flex-col gap-3">
                        {/* 카테고리 태그 및 제목 */}
                        <div className="flex items-start gap-2.5">
                          {isNotice && (
                            <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm shrink-0">
                              <Pin className="w-3 h-3 fill-white" />
                              공지
                            </span>
                          )}
                          <h2
                            className={`text-[17px] text-[#0A103D] leading-snug hover:text-[#5486B2] transition-colors line-clamp-2 ${
                              isNotice ? 'font-bold' : 'font-medium'
                            }`}
                          >
                            {post.title}
                          </h2>
                          {commentCount > 0 && (
                            <span className="inline-flex items-center gap-0.5 bg-blue-50 text-blue-600 text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0">
                              <MessageSquare className="w-3 h-3" />
                              {commentCount}
                            </span>
                          )}
                        </div>

                        {/* 메타 정보 */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-gray-400" />
                            <span className="font-semibold text-gray-700">
                              {post.author_id ? post.author : '알 수 없음'}
                            </span>
                          </div>
                          <span className="text-gray-300">|</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <time dateTime={post.created_at}>
                              {formatDistanceToNow(new Date(post.created_at), {
                                addSuffix: true,
                                locale: ko,
                              })}
                            </time>
                          </div>
                          <span className="text-gray-300">|</span>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5 text-gray-400" />
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
