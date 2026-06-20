'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Editor from '@/components/Editor';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

interface NewsFormProps {
  initialData?: {
    id: string;
    title: string;
    content: string;
    is_notice: boolean;
  };
  isEdit?: boolean;
  currentUser: {
    id: string;
    nickname: string;
    name: string;
    level: number;
  };
}

/**
 * '소식/알림' 게시글의 등록 및 수정을 위한 폼 컴포넌트입니다.
 * 관리자 권한이 있는 경우 상단 고정 공지글 등록 체크박스가 제공됩니다.
 */
export default function NewsForm({ initialData, isEdit = false, currentUser }: NewsFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [isNotice, setIsNotice] = useState(initialData?.is_notice || false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      if (isEdit && initialData) {
        // 수정 모드
        const { error } = await supabase
          .from('posts')
          .update({
            title: title.trim(),
            content: content,
            is_notice: isNotice,
          })
          .eq('id', initialData.id);

        if (error) throw error;

        alert('수정 완료되었습니다.');
        router.push(`/news?action=detail&id=${initialData.id}`);
      } else {
        // 새 글 등록
        const { data, error } = await supabase
          .from('posts')
          .insert([
            {
              title: title.trim(),
              content: content,
              author: currentUser.nickname || currentUser.name || '관리자',
              author_id: currentUser.id,
              category: 'news',
              is_notice: isNotice,
              board_type: 'general',
            },
          ])
          .select()
          .single();

        if (error) throw error;

        alert('성공적으로 등록되었습니다.');
        router.push(`/news?action=detail&id=${data.id}`);
      }
      router.refresh();
    } catch (error: any) {
      console.error('소식 저장 실패:', error);
      alert(`저장 중 오류가 발생했습니다: ${error.message || error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#FAFBFD] min-h-screen py-12 text-black">
      <div className="max-w-4xl mx-auto px-6">
        {/* 상단 헤더 */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href={isEdit && initialData ? `/news?action=detail&id=${initialData.id}` : '/news'}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#5486B2] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>이전으로</span>
          </Link>
        </div>

        {/* 폼 블록 */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
          <h2 className="text-xl font-bold text-[#0A103D]">
            {isEdit ? '소식글 수정하기' : '새로운 소식/알림 등록'}
          </h2>

          {/* 제목 입력 */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-bold text-gray-700">
              제목
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5486B2]/20 focus:border-[#5486B2] transition-all"
              placeholder="소식 제목을 입력하세요"
            />
          </div>

          {/* 중요 공지 여부 (관리자 LV4 또는 LV5 이상만 체크 가능) */}
          {currentUser.level >= 4 && (
            <div className="flex items-center gap-2 py-2">
              <input
                id="is-notice"
                type="checkbox"
                checked={isNotice}
                onChange={(e) => setIsNotice(e.target.checked)}
                className="w-5 h-5 text-[#5486B2] border-gray-300 rounded focus:ring-[#5486B2]/20 cursor-pointer"
              />
              <label htmlFor="is-notice" className="text-sm font-bold text-gray-700 cursor-pointer select-none">
                이 소식을 중요 공지로 등록하여 최상단에 고정합니다.
              </label>
            </div>
          )}

          {/* 에디터 컴포넌트 */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">내용</label>
            <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
              <Editor content={content} onChange={setContent} />
            </div>
          </div>

          {/* 하단 제어 버튼 */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isLoading}
              className="px-6 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-[#0A103D] hover:bg-[#1a225c] rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? '저장 중...' : '저장'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
