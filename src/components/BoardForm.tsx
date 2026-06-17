'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { UserLevel } from '@/lib/store';
import { supabase } from '@/lib/supabaseClient';
import Editor from '@/components/Editor';

interface BoardFormProps {
  initialData?: {
    id?: string;
    title: string;
    content: string;
    author: string;
    is_notice?: boolean;
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
  const [isNotice, setIsNotice] = useState(initialData?.is_notice || false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded) return;
    
    setIsLoading(true);

    try {
      // 폼 제출 직전, 실제 Supabase 세션이 여전히 유효한지 비동기로 최종 검증합니다.
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      // Supabase Auth 세션이 만료된 경우라도 useAuth Context에 user 정보가 온전히 복구되어 있다면 이를 허용합니다.
      if (!session && !user) {
        alert('로그인 세션이 만료되었거나 올바르지 않습니다. 다시 로그인해 주세요.');
        router.push('/login');
        setIsLoading(false);
        return;
      }
      
      if (!user) {
        alert('로그인이 필요한 서비스입니다.');
        router.push('/login');
        setIsLoading(false);
        return;
      }

      // 게시판 쓰기 권한 등급 동적 조회 및 최종 검증
      let writeLevel = 2; // 기본값
      try {
        const { data: permData } = await supabase
          .from('board_permissions')
          .select('write_level')
          .eq('category', category)
          .single();
        if (permData) {
          writeLevel = permData.write_level;
        } else {
          const fallbacks: Record<string, number> = {
            notice: 5, free: 2, greeting: 1, promotion: 2, market: 2, archive: 2, qa: 1, press: 5, event: 5
          };
          writeLevel = fallbacks[category] ?? 2;
        }
      } catch (e) {
        const fallbacks: Record<string, number> = {
          notice: 5, free: 2, greeting: 1, promotion: 2, market: 2, archive: 2, qa: 1, press: 5, event: 5
        };
        writeLevel = fallbacks[category] ?? 2;
      }

      const userLevel = user.level ?? UserLevel.LV1_GUEST;
      if (userLevel < writeLevel) {
        const levelNames: Record<number, string> = {
          1: '준회원 (LV1)',
          2: '정회원 (LV2)',
          3: '우수회원 (LV3)',
          4: '지부장급 (LV4)',
          5: '관리자 (LV5)',
          6: '최고관리자 (LV6)'
        };
        alert(`이 게시판에 글을 작성할 권한이 없습니다. (${levelNames[writeLevel] || `LV${writeLevel}`} 이상 작성 가능)`);
        setIsLoading(false);
        return;
      }

      if (isEdit) {
        const { error } = await supabase
          .from('posts')
          .update({
            title: formData.title,
            content: formData.content,
            is_notice: isNotice,
            board_type: category === 'council' ? 'council' : 'general'
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
            author: user.nickname || '익명',
            author_id: user.id, // RLS 정책 및 작성자 데이터 매핑을 위해 author_id 추가
            category: category,
            is_notice: isNotice,
            board_type: category === 'council' ? 'council' : 'general'
          }])
          .select()
          .single();
          
        if (error) throw error;
        router.push(`/board/${data.id}`);
      }
      router.refresh();
    } catch (error) {
      console.error('Submit post error:', error);
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

        {user && user.level !== undefined && user.level >= 4 && (
          <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
            <span className="min-w-[100px] font-medium text-[#333333]">공지 여부</span>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isNotice}
                onChange={e => setIsNotice(e.target.checked)}
                className="w-4.5 h-4.5 text-[#5486B2] border-gray-300 rounded focus:ring-[#5486B2]"
              />
              <span className="text-sm font-semibold text-gray-700">이 게시판의 공지로 등록</span>
            </label>
          </div>
        )}

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