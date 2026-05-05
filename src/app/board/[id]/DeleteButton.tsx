'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('정말 이 게시글을 삭제하시겠습니까?')) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('삭제 실패');
      
      router.push('/board');
      router.refresh();
    } catch (error) {
      alert('삭제 중 오류가 발생했습니다.');
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="px-6 py-2 text-sm font-medium text-white bg-[#5486B2] rounded hover:bg-[#436f94] transition-colors disabled:opacity-50"
    >
      {isDeleting ? '삭제 중...' : '삭제'}
    </button>
  );
}
