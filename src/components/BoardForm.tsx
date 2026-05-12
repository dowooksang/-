'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { UserLevel } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import Editor from '@/components/Editor';

interface BoardFormProps {
  initialData?: {
    id?: string;
    title: string;
    content: string;
    author: string;
  };
  isEdit?: boolean;
  category?: string;
}

export default function BoardForm({ initialData, isEdit = false, category = 'free' }: BoardFormProps) {
  const router = useRouter();
  const { user, isLoaded } = useAuth();
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded) return;
    
    if (!user) {
      alert('로그인이 필요한 서비스입니다.');
      router.push('/login');
      return;
    }


    setIsLoading(true);

    try {
      if (isEdit) {
        const { error } = await supabase
          .from('posts')
          .update({
            title: formData.title,
            content: formData.content,
          })
          .eq('id', initialData?.id);
        
        if (error) throw error;
        router.push(`/board/${initialData?.id}`);
      } else {
        const { data, error } = await supabase
          .from('posts')
          .insert([{
            title: formData.title,
            content: formData.content,
            author: user.nickname,
            category: category
          }])
          .select()
          .single();
          
        if (error) throw error;
        router.push(`/board/${data.id}`);
      }
      router.refresh();
    } catch (error) {
      alert('게시글 저장 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border-t-2 border-t-[#5486B2] shadow-sm p-8 max-w-4xl mx-auto">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <label htmlFor="title" className="min-w-[100px] font-medium text-[#333333]">제목</label>
          <input
            id="title"
            type="text"
            required
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            className="flex-1 bg-white border border-gray-300 rounded px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#5486B2] focus:border-[#5486B2] transition-colors"
            placeholder="제목을 입력하세요"
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-4 border-t border-gray-100 pt-6">
          <label htmlFor="author" className="min-w-[100px] font-medium text-[#333333]">작성자</label>
          <input
            id="author"
            type="text"
            readOnly
            value={user ? user.nickname : '로그인 필요'}
            className="w-full md:w-1/2 lg:w-1/3 bg-gray-100 border border-gray-300 rounded px-4 py-2.5 text-gray-500 cursor-not-allowed"
          />
          {!user && (
             <span className="text-sm text-red-500 font-medium">※ 로그인 후 작성할 수 있습니다.</span>
          )}
        </div>

        <div className="flex flex-col gap-4 border-t border-gray-100 pt-6">
          <label htmlFor="content" className="font-medium text-[#333333]">내용</label>
          <Editor 
            content={formData.content} 
            onChange={(html) => setFormData({ ...formData, content: html })} 
          />
        </div>

        <div className="flex items-center justify-center gap-3 pt-8 border-t border-gray-200 mt-8">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isLoading}
            className="px-8 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-2.5 text-sm font-medium text-white bg-[#5486B2] hover:bg-[#436f94] rounded shadow transition-colors disabled:opacity-50"
          >
            {isLoading ? '전송중...' : (isEdit ? '수정' : '확인')}
          </button>
        </div>
      </div>
    </form>
  );
}