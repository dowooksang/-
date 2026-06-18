'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import Link from 'next/link';

export default function MyPageEdit() {
  const router = useRouter();
  const { user, isLoaded, login } = useAuth();
  
  // 상태 관리 (회원가입 양식과 동일한 구조)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    region: '서울/수도권',
    instrument: '보컬',
    activityType: '개인(취미)',
    genre: '',
    experience: '신입',
    bandName: '',
    practiceRegion: '',
    bandRole: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    try {
      const res = await fetch('/api/auth/withdraw', {
        method: 'POST',
      });
      if (res.ok) {
        alert('회원 탈퇴가 완료되었습니다. 그동안 이용해 주셔서 감사합니다.');
        window.location.href = '/';
      } else {
        const data = await res.json();
        alert(`회원 탈퇴 실패: ${data.error || '알 수 없는 오류'}`);
      }
    } catch (err: any) {
      console.error(err);
      alert('회원 탈퇴 처리 중 오류가 발생했습니다.');
    } finally {
      setIsWithdrawing(false);
      setIsConfirmModalOpen(false);
    }
  };

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/login');
    } else if (user) {
      // 기존 유저 정보를 폼에 채워넣음
      setFormData({
        ...formData,
        name: user.nickname || '',
        email: user.email || '',
        instrument: user.position || '보컬',
      });
    }
  }, [isLoaded, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: 실제 DB 연동 시 Update API 호출 필요
      // 현재는 로컬 상태 업데이트 (모의 처리)
      alert('회원 정보가 성공적으로 수정되었습니다.');
      router.push('/mypage');
    } catch (err) {
      console.error(err);
      alert('정보 수정 중 에러가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5486B2]"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 flex-1 w-full flex flex-col py-12 items-center">
      <div className="max-w-3xl w-full px-6">
        
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#333333]">내 정보 수정</h1>
            <p className="text-gray-500 mt-2 text-sm">가입 시 입력했던 상세 정보를 수정할 수 있습니다.</p>
          </div>
          <Link href="/mypage" className="text-sm font-medium text-gray-500 hover:text-gray-800">
            돌아가기
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-8">
          
          {/* 섹션 1 */}
          <section>
            <h3 className="text-lg font-bold text-[#0A103D] border-b pb-2 mb-4">기본 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">이메일 (변경불가)</label>
                <input type="email" disabled value={formData.email} className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2.5 text-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">성함 (실명)</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#5486B2] focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">연락처</label>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#5486B2] focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">거주 지역</label>
                <input type="text" value={formData.region} onChange={(e) => setFormData({...formData, region: e.target.value})} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#5486B2] focus:outline-none" />
              </div>
            </div>
          </section>

          {/* 섹션 2 */}
          <section>
            <h3 className="text-lg font-bold text-[#0A103D] border-b pb-2 mb-4">아티스트 성향</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">주요 악기</label>
                <select value={formData.instrument} onChange={(e) => setFormData({...formData, instrument: e.target.value})} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#5486B2] focus:outline-none">
                  <option value="보컬">보컬</option>
                  <option value="일렉기타">일렉기타</option>
                  <option value="베이스">베이스</option>
                  <option value="드럼">드럼</option>
                  <option value="키보드">키보드/신디</option>
                  <option value="관악/현악">관악/현악 등</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">활동 유형</label>
                <select value={formData.activityType} onChange={(e) => setFormData({...formData, activityType: e.target.value})} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#5486B2] focus:outline-none">
                  <option value="개인(취미)">개인(취미)</option>
                  <option value="밴드 소속">밴드 소속</option>
                  <option value="전문 연주자">전문 연주자</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">선호 장르</label>
                <input type="text" value={formData.genre} onChange={(e) => setFormData({...formData, genre: e.target.value})} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#5486B2] focus:outline-none" placeholder="예: 락, 팝, 재즈" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">활동 경력</label>
                <select value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#5486B2] focus:outline-none">
                  <option value="신입">신입 (1년 미만)</option>
                  <option value="1~3년">1~3년</option>
                  <option value="3~5년">3~5년</option>
                  <option value="5년 이상">5년 이상</option>
                </select>
              </div>
            </div>
          </section>

          {/* 섹션 3 */}
          <section>
            <h3 className="text-lg font-bold text-[#0A103D] border-b pb-2 mb-4">밴드 소속 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">밴드명</label>
                <input type="text" value={formData.bandName} onChange={(e) => setFormData({...formData, bandName: e.target.value})} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#5486B2] focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">주요 연습 지역</label>
                <input type="text" value={formData.practiceRegion} onChange={(e) => setFormData({...formData, practiceRegion: e.target.value})} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#5486B2] focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">밴드 내 역할</label>
                <select value={formData.bandRole} onChange={(e) => setFormData({...formData, bandRole: e.target.value})} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#5486B2] focus:outline-none">
                  <option value="">선택안함</option>
                  <option value="팀장(마스터)">팀장(마스터)</option>
                  <option value="총무">총무</option>
                  <option value="일반 멤버">일반 멤버</option>
                </select>
              </div>
            </div>
          </section>

          <div className="pt-6 border-t flex justify-end gap-3">
            <button type="button" onClick={() => router.back()} className="px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
              취소
            </button>
            <button type="submit" disabled={isLoading} className="px-8 py-3 bg-[#0A103D] text-white rounded-lg font-bold shadow-md hover:bg-[#1a2456] transition-colors disabled:opacity-50">
              {isLoading ? '저장 중...' : '변경사항 저장'}
            </button>
          </div>
        </form>

        {/* 회원 탈퇴 (Danger Zone) */}
        <div className="mt-8 bg-red-50 rounded-2xl shadow-sm border border-red-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-red-700">위험 구역 (Danger Zone)</h4>
            <p className="text-gray-500 text-xs mt-1">회원 탈퇴 시 즉시 로그아웃되며 계정 정보가 완전히 삭제됩니다. 단, 작성하신 글과 댓글은 유지됩니다.</p>
          </div>
          <button 
            type="button" 
            onClick={() => setIsConfirmModalOpen(true)}
            className="px-5 py-2.5 bg-red-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-red-700 transition-colors whitespace-nowrap"
          >
            회원 탈퇴
          </button>
        </div>

        {/* 회원 탈퇴 경고 모달 */}
        {isConfirmModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-100 animate-fade-in text-black">
              <h3 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">⚠️ 회원 탈퇴 경고</h3>
              <p className="text-gray-700 text-sm leading-relaxed mb-6">
                <strong>정말로 탈퇴하시겠습니까? 모든 정보가 삭제됩니다.</strong><br/>
                탈퇴 시 기존 계정은 완전히 파기되며 복구할 수 없습니다. 작성하신 게시글과 댓글은 삭제되지 않고 보존됩니다.
              </p>
              <div className="flex justify-end gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setIsConfirmModalOpen(false)}
                  disabled={isWithdrawing}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleWithdraw}
                  disabled={isWithdrawing}
                  className="px-5 py-2.5 bg-red-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-red-700 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isWithdrawing ? '탈퇴 처리 중...' : '탈퇴하기'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
