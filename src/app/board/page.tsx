import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { supabase } from '@/lib/supabase';
import { PenSquare } from 'lucide-react';

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
};

export default async function BoardList({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const currentCategory = category || 'free';
  const categoryInfo = CATEGORY_NAMES[currentCategory] || CATEGORY_NAMES.free;

  let query = supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  // Only filter by category if it exists in the URL, otherwise show all or just 'free'
  // Typically, we want to filter by the specific category.
  query = query.eq('category', currentCategory);

  const { data: posts } = await query;
    
  const postList = posts || [];

  return (
    <div className="bg-white file-auto flex-1 w-full flex justify-center py-12">
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
              postList.map(post => (
                <li key={post.id} className="hover:bg-gray-50 transition-colors">
                  <Link href={`/board/${post.id}`} className="block px-6 py-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-medium text-[#333333] mb-1 truncate">
                          {post.title}
                        </h2>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="font-medium text-gray-700">{post.author}</span>
                          <span className="text-gray-300">|</span>
                          <time dateTime={post.created_at}>
                            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ko })}
                          </time>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
