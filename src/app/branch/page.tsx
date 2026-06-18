import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

export const dynamic = 'force-dynamic';

export default async function BranchRecruitPage() {
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('category', 'branch')
    .order('created_at', { ascending: false });
    
  const branchPosts = posts || [];

  return (
    <div className="bg-gray-50 flex-1 w-full flex justify-center py-12 min-h-screen">
      <div className="max-w-6xl w-full px-6">
        <div className="border-b-2 border-[#0A103D] pb-4 mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#0A103D]">지부 모집 안내</h1>
            <p className="text-gray-500 mt-2 text-sm">전국 각지의 동호회 및 지부원 모집 공고입니다.</p>
          </div>
        </div>

        <div className="bg-white border-t-2 border-t-accent shadow-sm rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500">
                <th className="p-4 w-24 text-center">분류</th>
                <th className="p-4">모집 공고 제목</th>
                <th className="p-4 w-32 text-center">작성자</th>
                <th className="p-4 w-32 text-center">등록일</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {branchPosts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-gray-400">
                    <span className="text-4xl mb-4 block">🏢</span>
                    현재 진행 중인 지부 모집 공고가 없습니다.
                  </td>
                </tr>
              ) : (
                branchPosts.map(post => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-center">
                      <span className="px-2 py-1 bg-accent/20 text-[#0A103D] rounded text-xs font-bold">
                        지부모집
                      </span>
                    </td>
                    <td className="p-4 font-medium text-gray-800">
                      <Link href={`/board/${post.id}`} className="hover:text-accent hover:underline">
                        {post.title}
                      </Link>
                    </td>
                    <td className="p-4 text-sm text-gray-600 text-center">{post.author_id ? post.author : '알 수 없음'}</td>
                    <td className="p-4 text-sm text-gray-500 text-center">
                      {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ko })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
