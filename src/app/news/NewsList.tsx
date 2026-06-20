import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { PenSquare, Pin, Eye, MessageSquare, Calendar, User, ChevronRight } from 'lucide-react';

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
 * '소식/알림' 게시판의 목록 뷰를 렌더링하는 컴포넌트입니다.
 * 중요 공지사항(is_notice)은 최상단에 고정 뱃지 및 배경 그라데이션 스타일과 함께 노출됩니다.
 */
export default function NewsList({ posts, canWrite }: NewsListProps) {
  return (
    <div className="bg-gradient-to-b from-[#FAFBFD] to-[#F3F5F9] min-h-screen py-16 text-black">
      <div className="max-w-5xl mx-auto px-6">
        {/* 상단 헤더 */}
        <div className="border-b border-gray-200/80 pb-8 mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-[#5486B2] mb-3">
              📢 BOARD
            </div>
            <h1 className="text-4xl font-extrabold text-[#0A103D] tracking-tight sm:text-5xl">
              소식/알림
            </h1>
            <p className="text-gray-500 mt-3 text-sm sm:text-base leading-relaxed max-w-2xl">
              사단법인 직장인밴드연합회의 공식 공지사항 및 대외 문화 사업 소식을 가장 신속하게 전달하는 공간입니다.
            </p>
          </div>
          {canWrite && (
            <Link
              href="/news?action=write"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-[#0A103D] to-[#1d276b] hover:from-[#1a225c] hover:to-[#2e3b8a] rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 shrink-0"
            >
              <PenSquare className="w-4 h-4" />
              <span>소식 등록</span>
            </Link>
          )}
        </div>

        {/* 게시글 리스트 컨테이너 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
          <ul className="divide-y divide-gray-100/80">
            {posts.length === 0 ? (
              <li className="py-28 text-center text-gray-400 font-medium">
                등록된 소식 또는 공지사항이 없습니다.
              </li>
            ) : (
              posts.map((post) => {
                const isNotice = post.is_notice === true;
                const commentCount = post.comments?.length || 0;

                return (
                  <li
                    key={post.id}
                    className={`transition-all duration-300 relative group ${
                      isNotice
                        ? 'bg-gradient-to-r from-amber-50/60 via-amber-50/20 to-transparent border-l-4 border-l-amber-500'
                        : 'hover:bg-slate-50/40 border-l-4 border-l-transparent hover:border-l-[#5486B2]'
                    }`}
                  >
                    <Link href={`/news?action=detail&id=${post.id}`} className="block px-6 sm:px-8 py-6">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0 flex flex-col gap-3">
                          {/* 카테고리 태그 및 제목 */}
                          <div className="flex flex-wrap items-center gap-2.5">
                            {isNotice && (
                              <span className="inline-flex items-center gap-1 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-sm shrink-0">
                                <Pin className="w-3.5 h-3.5 fill-white rotate-45 transform" />
                                중요공지
                              </span>
                            )}
                            <h2
                              className={`text-lg text-[#0A103D] leading-snug group-hover:text-[#5486B2] transition-colors duration-200 line-clamp-1 ${
                                isNotice ? 'font-extrabold text-[19px]' : 'font-semibold'
                              }`}
                            >
                              {post.title}
                            </h2>
                            {commentCount > 0 && (
                              <span className="inline-flex items-center gap-0.5 bg-indigo-50 text-indigo-600 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-indigo-100 shrink-0">
                                <MessageSquare className="w-3 h-3" />
                                {commentCount}
                              </span>
                            )}
                          </div>

                          {/* 메타 정보 */}
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-400">
                            <div className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-gray-300" />
                              <span className="font-semibold text-gray-600">
                                {post.author_id ? post.author : '알 수 없음'}
                              </span>
                            </div>
                            <span className="text-gray-200">|</span>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-gray-300" />
                              <time dateTime={post.created_at} className="text-gray-500 font-medium">
                                {formatDistanceToNow(new Date(post.created_at), {
                                  addSuffix: true,
                                  locale: ko,
                                })}
                              </time>
                            </div>
                            <span className="text-gray-200">|</span>
                            <div className="flex items-center gap-1.5">
                              <Eye className="w-3.5 h-3.5 text-gray-300" />
                              <span className="text-gray-500">조회 {post.views || 0}</span>
                            </div>
                          </div>
                        </div>

                        {/* 화살표 아이콘 마이크로 모션 */}
                        <div className="text-gray-300 group-hover:text-[#5486B2] group-hover:translate-x-1.5 transition-all duration-300 shrink-0">
                          <ChevronRight className="w-5 h-5" />
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

