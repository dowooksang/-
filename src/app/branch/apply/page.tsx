'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import Link from 'next/link';

export default function BranchApplyPage() {
  const router = useRouter();
  const { user, isLoaded } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    managerName: '',
    managerPhone: '',
    region: '',
    hasPracticeRoom: false,
    bandCount: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  if (!isLoaded) return <div className="min-h-screen bg-[#0A103D] text-white flex items-center justify-center">로딩 중...</div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A103D] flex items-center justify-center p-6 text-center">
        <div className="bg-white/5 p-12 rounded-2xl border border-white/10 max-w-md w-full backdrop-blur-md">
          <div className="text-5xl mb-4">🔐</div>
          <h1 className="text-2xl font-bold text-white mb-2">로그인이 필요합니다</h1>
          <p className="text-gray-400 mb-6">지부 신청은 연합회 회원만 가능합니다.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/login" className="bg-accent text-[#0A103D] px-6 py-2 rounded-lg font-bold">로그인</Link>
            <Link href="/signup" className="bg-white/10 text-white px-6 py-2 rounded-lg font-bold border border-white/20">회원가입</Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/branch/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          bandCount: Number(formData.bandCount),
          userId: user.id
        })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || '신청 중 오류가 발생했습니다.');
      }

      alert('지부 신청이 완료되었습니다! 관리자 승인을 기다려주세요.');
      router.push('/branch/recruitment');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#0A103D] min-h-screen text-white flex justify-center py-16 px-6">
      <div className="max-w-2xl w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">전국 지부 신청서</h1>
          <p className="text-gray-400">아래 5가지 필수 항목만 입력하시면 신청이 완료됩니다.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">1. 지부 명칭 <span className="text-accent">*</span></label>
            <input 
              type="text" 
              required 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-accent" 
              placeholder="예: 서울 강남지부, 부산 해운대지부 등" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">2-1. 지부장 성함 <span className="text-accent">*</span></label>
              <input 
                type="text" 
                required 
                value={formData.managerName} 
                onChange={(e) => setFormData({...formData, managerName: e.target.value})} 
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-accent" 
                placeholder="본명 입력" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">2-2. 연락처 <span className="text-accent">*</span></label>
              <input 
                type="tel" 
                required 
                value={formData.managerPhone} 
                onChange={(e) => setFormData({...formData, managerPhone: e.target.value})} 
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-accent" 
                placeholder="010-0000-0000" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">3. 활동 지역 <span className="text-accent">*</span></label>
            <input 
              type="text" 
              required 
              value={formData.region} 
              onChange={(e) => setFormData({...formData, region: e.target.value})} 
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-accent" 
              placeholder="시/군/구 단위 (예: 서울시 서초구)" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">4. 현재 소속 동호회(팀) 수 <span className="text-accent">*</span></label>
            <input 
              type="number" 
              required 
              min="1"
              value={formData.bandCount} 
              onChange={(e) => setFormData({...formData, bandCount: e.target.value})} 
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-accent" 
              placeholder="해당 지부에 함께할 팀 수 (숫자만 입력)" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">5. 모임 공간(연습실 등) 유무 <span className="text-accent">*</span></label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer bg-black/20 px-6 py-3 rounded-lg border border-white/10 hover:border-accent transition-colors">
                <input 
                  type="radio" 
                  name="hasPracticeRoom" 
                  checked={formData.hasPracticeRoom === true} 
                  onChange={() => setFormData({...formData, hasPracticeRoom: true})} 
                  className="text-accent focus:ring-accent" 
                />
                <span>예 (보유/확보 가능)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer bg-black/20 px-6 py-3 rounded-lg border border-white/10 hover:border-accent transition-colors">
                <input 
                  type="radio" 
                  name="hasPracticeRoom" 
                  checked={formData.hasPracticeRoom === false} 
                  onChange={() => setFormData({...formData, hasPracticeRoom: false})} 
                  className="text-accent focus:ring-accent" 
                />
                <span>아니오 (미보유)</span>
              </label>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10">
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-accent text-[#0A103D] font-bold py-4 rounded-xl text-lg shadow-[0_0_15px_rgba(130,200,255,0.3)] hover:shadow-[0_0_25px_rgba(130,200,255,0.5)] transition-all disabled:opacity-50"
            >
              {isLoading ? '제출 중...' : '신청서 제출하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
