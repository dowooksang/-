import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { PenSquare, Eye, MessageSquare, Calendar, User, Tag, ArrowRight } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  author_id: string | null;
  created_at: string;
  views: number;
  is_notice: boolean;
  comments?: { id: string }[];
}

interface ShareListProps {
  posts: Post[];
  canWrite: boolean;
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
 * 말머리 태그별 알록달록한 그라데이션 스타일 매핑
 */
function getTagStyle(tag: '나눔/장터' | '멤버모집' | '참여/기부' | null) {
  switch (tag) {
    case '나눔/장터':
      return 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm shadow-orange-100';
    case '멤버모집':
      return 'bg-gradient-to-r from-violet-600 to-indigo-500 text-white shadow-sm shadow-indigo-100';
    case '참여/기부':
      return 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm shadow-emerald-100';
    default:
      return 'bg-gradient-to-r from-gray-400 to-slate-500 text-white shadow-sm';
  }
}

/**
 * HTML 태그를 제거하고 순수 텍스트 본문만 일부 추출하는 헬퍼 함수
 */
function getSnippet(htmlContent: string) {
  const pureText = htmlContent.replace(/<[^>]*>/g, '').trim();
  if (pureText.length > 80) {
    return pureText.slice(0, 80) + '...';
  }
  return pureText || '내용 없음';
}

/**
 * '나눔과 참여' 게시판의 카드/피드 뷰를 렌더링하는 컴포넌트입니다.
 */
export default function ShareList({ posts, canWrite }: ShareListProps) {
  return (
    <div className="bg-gradient-to-b from-[#FAFBFD] to-[#F3F5F9] min-h-screen py-16 text-black">
      <div className="max-w-6xl mx-auto px-6">
        {/* 상단 헤더 */}
        <div className="border-b border-gray-200 pb-8 mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-[#5486B2] mb-3">
              🤝 MARKET & COMMUNITY
            </div>
            <h1 className="text-4xl font-extrabold text-[#0A103D] tracking-tight sm:text-5xl">
              나눔과 참여
            </h1>
            <p className="text-gray-500 mt-3 text-sm sm:text-base leading-relaxed max-w-2xl">
              악기/오디오 장비 중고 거래, 재능 나눔, 밴드 멤버 모집을 공유하고 매칭하는 따뜻한 소통 공간입니다.
            </p>
          </div>
          {canWrite && (
            <Link
              href="/share?action=write"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-[#5486B2] to-[#436f94] hover:from-[#436f94] hover:to-[#355977] rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 shrink-0"
            >
              <PenSquare className="w-4 h-4" />
              <span>나눔/등록하기</span>
            </Link>
          )}
        </div>

        {/* 게시글 카드 그리드 */}
        {posts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 py-28 text-center text-gray-400 font-medium">
            등록된 게시물이 없습니다. 첫 번째 나눔/참여 소식을 전해보세요!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              const { tag, cleanTitle } = parseTitle(post.title);
              const tagStyle = getTagStyle(tag);
              const snippet = getSnippet(post.content);
              const commentCount = post.comments?.length || 0;

              return (
                <article
                  key={post.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden relative group"
                >
                  <Link href={`/share?action=detail&id=${post.id}`} className="block p-6 flex-1 flex flex-col">
                    {/* 상단 태그 및 날짜 */}
                    <div className="mb-5 flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-extrabold px-3 py-1 rounded-full ${tagStyle}`}>
                        <Tag className="w-3.5 h-3.5 shrink-0" />
                        {tag || '일반'}
                      </span>
                      
                      <div className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                        <Calendar className="w-3 h-3 text-gray-300" />
                        <span>
                          {formatDistanceToNow(new Date(post.created_at), {
                            addSuffix: true,
                            locale: ko,
                          })}
                        </span>
                      </div>
                    </div>

                    {/* 제목 및 본문 요약 */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-[#0A103D] leading-snug group-hover:text-[#5486B2] transition-colors duration-200 mb-3 line-clamp-2">
                          {cleanTitle}
                        </h2>
                        <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed mb-6">
                          {snippet}
                        </p>
                      </div>
                    </div>

                    {/* 하단 메타 정보 */}
                    <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                          <User className="w-3 h-3 text-[#5486B2]" />
                        </div>
                        <span className="font-semibold text-gray-600 truncate">
                          {post.author_id ? post.author : '알 수 없음'}
                        </span>
                      </div>
                      
                      <div className="inline-flex items-center gap-1 text-[#5486B2] font-semibold text-xs group-hover:translate-x-1 transition-transform duration-300">
                        <span>자세히 보기</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </Link>

                  {/* 카드 밑단 (조회 및 댓글) */}
                  <div className="bg-slate-50/60 px-6 py-4 border-t border-gray-100/80 flex items-center justify-between text-xs text-gray-400 font-bold">
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-gray-300" />
                      <span className="text-gray-500">조회 {post.views || 0}</span>
                    </div>
                    {commentCount > 0 && (
                      <div className="flex items-center gap-1 bg-indigo-50/70 border border-indigo-100/50 text-indigo-600 px-2.5 py-1 rounded-lg">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>댓글 {commentCount}</span>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

