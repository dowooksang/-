'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Editor from '@/components/Editor';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

interface ShareFormProps {
  initialData?: {
    id: string;
    title: string;
    content: string;
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
    tag: '나눔/장터' as const,
    cleanTitle: title,
  };
}

/**
 * '나눔과 참여' 게시글의 등록 및 수정을 위한 폼 컴포넌트입니다.
 * [나눔/장터], [멤버모집], [참여/기부] 등 말머리 선택 기능이 제공됩니다.
 */
export default function ShareForm({ initialData, isEdit = false, currentUser }: ShareFormProps) {
  const router = useRouter();

  // 초기 로드 시 기존 글 정보가 있다면 말머리와 제목 분리
  const initialParsed = initialData ? parseTitle(initialData.title) : { tag: '나눔/장터' as const, cleanTitle: '' };

  const [tag, setTag] = useState<'나눔/장터' | '멤버모집' | '참여/기부'>(initialParsed.tag);
  const [titleInput, setTitleInput] = useState(initialParsed.cleanTitle);
  const [content, setContent] = useState(initialData?.content || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    // 말머리와 텍스트 합치기
    const fullTitle = `[${tag}] ${titleInput.trim()}`;

    setIsLoading(true);
    try {
      if (isEdit && initialData) {
        // 수정 모드
        const { error } = await supabase
          .from('posts')
          .update({
            title: fullTitle,
            content: content,
          })
          .eq('id', initialData.id);

        if (error) throw error;

        alert('수정 완료되었습니다.');
        router.push(`/share?action=detail&id=${initialData.id}`);
      } else {
        // 새 글 등록
        const { data, error } = await supabase
          .from('posts')
          .insert([
            {
              title: fullTitle,
              content: content,
              author: currentUser.nickname || currentUser.name || '정회원',
              author_id: currentUser.id,
              category: 'share',
              is_notice: false, // 나눔과참여에는 is_notice가 없음
              board_type: 'general',
            },
          ])
          .select()
          .single();

        if (error) throw error;

        alert('성공적으로 등록되었습니다.');
        router.push(`/share?action=detail&id=${data.id}`);
      }
      router.refresh();
    } catch (error: any) {
      console.error('글 저장 실패:', error);
      alert(`저장 중 오류가 발생했습니다: ${error.message || error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#FAFBFD] min-h-screen py-12 text-black">
      <div className="max-w-4xl mx-auto px-6">
        {/* 상단 뒤로가기 */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href={isEdit && initialData ? `/share?action=detail&id=${initialData.id}` : '/share'}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#5486B2] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>이전으로</span>
          </Link>
        </div>

        {/* 폼 블록 */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
          <h2 className="text-xl font-bold text-[#0A103D]">
            {isEdit ? '나눔/참여 글 수정하기' : '새로운 나눔/참여 소식 등록'}
          </h2>

          {/* 말머리 및 제목 입력 */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-1/4 space-y-2">
              <label htmlFor="tag-select" className="text-sm font-bold text-gray-700">
                말머리
              </label>
              <select
                id="tag-select"
                value={tag}
                onChange={(e) => setTag(e.target.value as any)}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5486B2]/20 focus:border-[#5486B2] transition-all cursor-pointer font-semibold text-sm"
              >
                <option value="나눔/장터">🟠 [나눔/장터]</option>
                <option value="멤버모집">🟣 [멤버모집]</option>
                <option value="참여/기부">🟢 [참여/기부]</option>
              </select>
            </div>

            <div className="flex-1 space-y-2">
              <label htmlFor="title" className="text-sm font-bold text-gray-700">
                제목
              </label>
              <input
                id="title"
                type="text"
                required
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5486B2]/20 focus:border-[#5486B2] transition-all"
                placeholder="제목을 입력하세요"
              />
            </div>
          </div>

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
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-[#5486B2] hover:bg-[#436f94] rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50"
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
