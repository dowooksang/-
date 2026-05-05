import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { supabase } from '@/lib/supabase';
import { PenSquare } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BoardList() {
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });
    
  const postList = posts || [];

  return (
    <div className="bg-white file-auto flex-1 w-full flex justify-center py-12">
      <div className="max-w-6xl w-full px-6">
        <div className="border-b-2 border-[#333333] pb-4 mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#333333]">공지/소통게시판</h1>
            <p className="text-gray-500 mt-2 text-sm">연합회 공지사항 및 다양한 정보를 나누는 공간입니다.</p>
          </div>
          <Link 
            href="/board/write" 
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
