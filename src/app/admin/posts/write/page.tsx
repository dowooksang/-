'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/useAuth';
import Editor from '@/components/Editor';

export default function AdminPostWrite() {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('notice');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Supabase에 데이터 삽입
      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            title,
            content,
            category,
            author: user?.nickname || '관리자',
            // auth 사용 안하므로 임시 문자열 삽입
          }
        ])
        .select();

      if (error) {
        throw error;
      }

      alert('게시글이 성공적으로 등록되었습니다!');
      router.push('/admin/posts');
    } catch (err: any) {
      console.error('글쓰기 에러:', err.message);
      alert('등록 중 에러가 발생했습니다. 테이블이 생성되었는지 확인해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-8 border-b pb-4">
        <h2 className="text-2xl font-bold text-[#333333]">새 게시물 작성</h2>
        <button 
          onClick={() => router.back()}
          className="text-sm font-medium text-gray-500 hover:text-gray-800"
        >
          돌아가기
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex gap-4">
          <div className="w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-2">분류</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value="notice">공지사항</option>
              <option value="branch">지부 모집</option>
              <option value="free">자유게시판</option>
              <option value="gallery">활동 갤러리</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="게시물 제목을 입력하세요"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
          <Editor content={content} onChange={setContent} />
        </div>

        <div className="pt-6 flex justify-end gap-3 border-t">
          <button 
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-accent text-[#0A103D] rounded-lg font-bold shadow-md hover:bg-[#82C8FF] transition-colors disabled:opacity-50"
          >
            {isSubmitting ? '저장 중...' : '등록하기'}
          </button>
        </div>
      </form>
    </div>
  );
}
