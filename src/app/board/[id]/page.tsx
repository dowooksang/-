import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import DeleteButton from './DeleteButton';

export const dynamic = 'force-dynamic';

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', resolvedParams.id)
    .single();

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-white flex-1 w-full flex justify-center py-12">
      <div className="max-w-6xl w-full px-6">
        <div className="border-b-2 border-[#333333] pb-4 mb-6">
          <h1 className="text-2xl font-bold text-[#333333]">공지/소통게시판</h1>
        </div>

        <article className="border-t-2 border-t-[#5486B2] bg-white">
          <header className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-[#333333]">
              {post.title}
            </h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="font-medium text-gray-800">{post.author}</span>
              <span className="text-gray-300">|</span>
              <time dateTime={post.created_at}>
                {new Date(post.created_at).toLocaleDateString('ko-KR', {
                  year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
                })}
              </time>
            </div>
          </header>

          <div className="px-6 py-12 min-h-[300px]">
            <div 
              className="prose max-w-none text-gray-800"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          <footer className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <Link
              href={`/board?category=${post.category || 'free'}`}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              목록
            </Link>
            
            <div className="flex items-center gap-2">
              <Link
                href={`/board/${post.id}/edit`}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                수정
              </Link>
              <DeleteButton id={post.id} />
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}
