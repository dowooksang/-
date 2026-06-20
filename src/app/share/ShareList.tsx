import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { PenSquare, Eye, MessageSquare, Calendar, User, Tag } from 'lucide-react';

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
 * '나눔과 참여' 게시판의 카드/피드 뷰를 렌더링하는 서버 컴포넌트입니다.
 */
export default function ShareList({ posts, canWrite }: ShareListProps) {
  return (
    <div className="bg-[#FAFBFD] min-h-screen py-12 text-black">
      <div className="max-w-6xl mx-auto px-6">
        {/* 상단 헤더 */}
        <div className="border-b border-gray-200 pb-6 mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#0A103D] tracking-tight">나눔과 참여</h1>
            <p className="text-gray-500 mt-2 text-sm leading-relaxed">
              악기/오디오 장비 중고 거래, 재능 나눔, 밴드 멤버 모집을 공유하고 매칭하는 따뜻한 공간입니다.
            </p>
          </div>
          {canWrite && (
            <Link
              href="/share?action=write"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#5486B2] hover:bg-[#436f94] rounded-lg shadow-sm hover:shadow transition-all duration-200"
            >
              <PenSquare className="w-4 h-4" />
              <span>나눔/등록하기</span>
            </Link>
          )}
        </div>

        {/* 게시글 카드 그리드 */}
        {posts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-24 text-center text-gray-400 font-medium">
            등록된 게시물이 없습니다. 첫 번째 나눔/참여 소식을 전해보세요!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => {
              const { tag, cleanTitle } = parseTitle(post.title);
              const tagStyle = getTagStyle(tag);
              const snippet = getSnippet(post.content);
              const commentCount = post.comments?.length || 0;

              return (
                <article
                  key={post.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between overflow-hidden"
                >
                  <Link href={`/share?action=detail&id=${post.id}`} className="block p-6 flex-1 flex flex-col">
                    {/* 상단 태그 */}
                    <div className="mb-4">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${tagStyle}`}>
                        <Tag className="w-3 h-3 shrink-0" />
                        {tag || '일반'}
                      </span>
                    </div>

                    {/* 제목 및 본문 요약 */}
                    <div className="flex-1">
                      <h2 className="text-[18px] font-bold text-[#0A103D] leading-snug hover:text-[#5486B2] transition-colors mb-2 line-clamp-2">
                        {cleanTitle}
                      </h2>
                      <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed mb-4">
                        {snippet}
                      </p>
                    </div>

                    {/* 하단 메타 정보 */}
                    <div className="border-t border-gray-50 pt-4 flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="font-semibold text-gray-700 truncate">
                          {post.author_id ? post.author : '알 수 없음'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-[11px]">
                        <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>
                          {formatDistanceToNow(new Date(post.created_at), {
                            addSuffix: true,
                            locale: ko,
                          })}
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* 카드 밑단 (조회 및 댓글) */}
                  <div className="bg-slate-50/50 px-6 py-3.5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 font-semibold">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>조회 {post.views || 0}</span>
                    </div>
                    {commentCount > 0 && (
                      <div className="flex items-center gap-1 text-blue-600">
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
