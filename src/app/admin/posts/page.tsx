'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function AdminPosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      setPosts(data || []);
    } catch (err: any) {
      console.error('게시물 불러오기 에러:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm('정말로 삭제하시겠습니까?')) return;
    
    try {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) throw error;
      alert('삭제되었습니다.');
      fetchPosts();
    } catch (err: any) {
      alert('삭제 중 에러가 발생했습니다.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#333333]">게시물 통합 관리</h2>
          <p className="text-gray-500 mt-1">작성된 모든 게시물과 갤러리를 관리할 수 있습니다.</p>
        </div>
        <Link 
          href="/admin/posts/write" 
          className="px-6 py-3 bg-accent text-[#0A103D] font-bold rounded-lg shadow-md hover:bg-[#82C8FF] transition-colors"
        >
          + 새 글 작성
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500">
              <th className="p-4 w-24 text-center">분류</th>
              <th className="p-4">제목</th>
              <th className="p-4 w-32">작성자</th>
              <th className="p-4 w-32">작성일</th>
              <th className="p-4 w-32 text-center">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-400">데이터를 불러오는 중입니다...</td></tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center text-gray-400 flex flex-col items-center">
                  <span className="text-4xl mb-4">📭</span>
                  등록된 게시물이 없습니다.<br/>(혹은 DB 테이블이 아직 생성되지 않았습니다)
                </td>
              </tr>
            ) : (
              posts.map(post => (
                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-center">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-bold">
                      {post.category === 'notice' ? '공지' : post.category === 'branch' ? '지부모집' : post.category === 'gallery' ? '갤러리' : '자유'}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-gray-800">
                    {post.title}
                  </td>
                  <td className="p-4 text-sm text-gray-600">{post.author}</td>
                  <td className="p-4 text-sm text-gray-500">
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ko })}
                  </td>
                  <td className="p-4 text-center space-x-2">
                    <button className="text-sm font-medium text-[#5486B2] hover:underline">수정</button>
                    <button onClick={() => deletePost(post.id)} className="text-sm font-medium text-red-500 hover:underline">삭제</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
