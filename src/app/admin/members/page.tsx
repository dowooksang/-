'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';
import { UserLevel } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function AdminMembersPage() {
  const { user, isLoaded } = useAuth();
  const router = useRouter();
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');

  // 접근 제어 및 데이터 로드
  useEffect(() => {
    if (isLoaded) {
      if (!user || user.level < UserLevel.LV5_ADMIN) {
        alert('관리자만 접근할 수 있습니다.');
        router.push('/');
        return;
      }
      fetchMembers();
    }
  }, [user, isLoaded, router]);

  // 5초 간격 실시간 자동 리프레시 (회원가입 즉시 반영 실현)
  useEffect(() => {
    if (isLoaded && user && user.level >= UserLevel.LV5_ADMIN) {
      const interval = setInterval(() => {
        fetchMembers();
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isLoaded, user]);

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/admin/members');
      const data = await res.json();
      setMembers(data);
    } catch (error) {
      console.error('회원 목록을 불러오는 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    if (!confirm('해당 회원을 승인하시겠습니까?')) return;
    
    try {
      const res = await fetch('/api/admin/members/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      
      if (res.ok) {
        alert('승인되었습니다.');
        fetchMembers(); // 목록 새로고침
      } else {
        alert('승인 처리에 실패했습니다.');
      }
    } catch (error) {
      alert('오류가 발생했습니다.');
    }
  };

  const handleAppoint = async (userId: string) => {
    if (!confirm('해당 회원을 관리자(LV5)로 임명하시겠습니까?')) return;
    
    try {
      const res = await fetch('/api/admin/members/appoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      
      if (res.ok) {
        alert('관리자로 임명되었습니다.');
        fetchMembers();
      } else {
        alert('임명 처리에 실패했습니다.');
      }
    } catch (error) {
      alert('오류가 발생했습니다.');
    }
  };

  const handleDismiss = async (userId: string) => {
    if (!confirm('해당 회원의 관리자 권한을 해임하시겠습니까? (정회원으로 강등됩니다)')) return;
    
    try {
      const res = await fetch('/api/admin/members/dismiss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      
      if (res.ok) {
        alert('관리자 권한이 해임되었습니다.');
        fetchMembers();
      } else {
        alert('해임 처리에 실패했습니다.');
      }
    } catch (error) {
      alert('오류가 발생했습니다.');
    }
  };

  const handleChangeLevel = async (userId: string, newLevel: number) => {
    if (!confirm('해당 회원의 등급을 변경하시겠습니까?')) return;
    
    try {
      const res = await fetch('/api/admin/members/level', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, level: newLevel })
      });
      
      if (res.ok) {
        alert('등급이 변경되었습니다.');
        fetchMembers();
      } else {
        alert('등급 변경 처리에 실패했습니다.');
      }
    } catch (error) {
      alert('오류가 발생했습니다.');
    }
  };

  if (!isLoaded || isLoading) {
    return <div className="text-center py-20 text-gray-500 font-semibold text-lg">로딩 중...</div>;
  }

  const pendingMembers = members.filter(m => m.status === 'pending' && m.level < UserLevel.LV5_ADMIN);
  const activeMembers = members.filter(m => m.status === 'active' || m.level >= UserLevel.LV5_ADMIN);

  // 실시간 다차원 검색 및 등급 필터 연산 적용 ("원칙대로" 완벽 집계)
  const filteredPendingMembers = pendingMembers.filter(m => {
    const matchesSearch = 
      (m.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.nickname || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.phone || '').includes(searchQuery);
    return matchesSearch;
  });

  const filteredActiveMembers = activeMembers.filter(m => {
    const matchesSearch = 
      (m.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.nickname || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.phone || '').includes(searchQuery);

    const matchesLevel = selectedLevel === 'all' || m.level === parseInt(selectedLevel, 10);
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 text-black">
      <h1 className="text-4xl font-black mb-8 text-black tracking-tight">회원 관리</h1>

      {/* 실시간 회원 검색 및 필터링 컨트롤 타워 */}
      <div className="flex flex-col sm:flex-row gap-5 mb-10 bg-white p-5 rounded-2xl border-2 border-gray-400 shadow-md">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="회원 이름, 닉네임, 이메일, 연락처로 실시간 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-5 pr-5 py-3 bg-white border-2 border-gray-400 rounded-xl text-base text-black font-black placeholder-gray-500 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all shadow-inner"
          />
        </div>
        <div className="w-full sm:w-56">
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full px-4 py-3 bg-white border-2 border-gray-400 rounded-xl text-base text-black font-black focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm cursor-pointer"
          >
            <option value="all">전체 등급 필터</option>
            <option value="6">최고관리자 (LV6)</option>
            <option value="5">관리자 (LV5)</option>
            <option value="4">지부장급 (LV4)</option>
            <option value="3">우수회원 (LV3)</option>
            <option value="2">정회원 (LV2)</option>
            <option value="1">준회원 (LV1)</option>
          </select>
        </div>
      </div>

      {/* 대기 명단 섹션 */}
      <div className="mb-14">
        <div className="flex items-center gap-3.5 mb-6 border-b-2 border-gray-400 pb-4">
          <h2 className="text-3xl font-black text-black">대기 명단</h2>
          <span className="bg-gray-200 text-black border-2 border-gray-400 text-base px-4 py-2 rounded-lg font-black shadow-sm">
            {pendingMembers.length}명 대기중
          </span>
          {searchQuery && (
            <span className="bg-gray-200 text-black border-2 border-gray-400 text-base px-4 py-2 rounded-lg font-black shadow-sm">
              검색 매칭: {filteredPendingMembers.length}명
            </span>
          )}
        </div>
        
        {filteredPendingMembers.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-400 rounded-2xl p-14 text-center shadow-sm">
            <span className="text-black font-black text-xl block leading-relaxed">
              {searchQuery ? '검색어와 매칭되는 대기 회원이 없습니다.' : '현재 대기 중인 회원이 없습니다.'}
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-2xl border-2 border-gray-400 shadow-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0A103D] text-white border-b-2 border-gray-400 text-lg">
                  <th className="p-5 font-black text-white tracking-wide">이름(닉네임)</th>
                  <th className="p-5 font-black text-white tracking-wide">연락처</th>
                  <th className="p-5 font-black text-white tracking-wide">활동 지역</th>
                  <th className="p-5 font-black text-white tracking-wide">악기 파트</th>
                  <th className="p-5 font-black text-white tracking-wide">가입일</th>
                  <th className="p-5 font-black text-white tracking-wide text-center">관리</th>
                </tr>
              </thead>
              <tbody>
                {filteredPendingMembers.map((m, idx) => (
                  <tr key={m.id} className={`border-b-2 border-gray-300 hover:bg-blue-50/70 transition-colors text-lg font-black ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/80'}`}>
                    <td className="p-5">
                      {/* 이름과 이메일의 크기 및 굵기, 색상 극대화 */}
                      <div className="font-black text-[#0A103D] text-xl">{m.name || m.nickname}</div>
                      <div className="text-base text-blue-900 font-extrabold mt-1.5 select-all">{m.email}</div>
                    </td>
                    <td className="p-5 text-black font-black">{m.phone || '-'}</td>
                    <td className="p-5 text-black font-black">{m.address || '-'}</td>
                    <td className="p-5 text-black font-black">{m.position}</td>
                    <td className="p-5 text-black font-extrabold">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-5 text-center">
                      <button 
                        onClick={() => handleApprove(m.id)}
                        className="bg-blue-700 text-white text-base font-black px-6 py-3 rounded-lg shadow-md hover:bg-blue-800 hover:-translate-y-[1px] transition-all"
                      >
                        승인
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 전체 회원 섹션 */}
      <div>
        <div className="flex items-center gap-3.5 mb-6 border-b-2 border-gray-400 pb-4">
          <h2 className="text-3xl font-black text-black">전체 회원 (정회원)</h2>
          <span className="bg-gray-200 text-black border-2 border-gray-400 text-base px-4 py-2 rounded-lg font-black shadow-sm">
            총 {activeMembers.length}명
          </span>
          {(searchQuery || selectedLevel !== 'all') && (
            <span className="bg-blue-150 text-blue-950 border-2 border-blue-400 text-base px-4 py-2 rounded-lg font-black shadow-sm">
              필터 결과: {filteredActiveMembers.length}명
            </span>
          )}
        </div>

        {filteredActiveMembers.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-400 rounded-2xl p-16 text-center shadow-sm">
            <span className="text-black font-black text-xl block leading-relaxed">
              검색 필터 결과에 매칭되는 정회원이 존재하지 않습니다.
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-2xl border-2 border-gray-400 shadow-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0A103D] text-white border-b-2 border-gray-400 text-lg">
                  <th className="p-5 font-black text-white tracking-wide">상태</th>
                  <th className="p-5 font-black text-white tracking-wide">이름(닉네임)</th>
                  <th className="p-5 font-black text-white tracking-wide">연락처</th>
                  <th className="p-5 font-black text-white tracking-wide">활동 지역</th>
                  <th className="p-5 font-black text-white tracking-wide">악기 파트</th>
                  <th className="p-5 font-black text-white tracking-wide text-center">관리 권한</th>
                </tr>
              </thead>
              <tbody>
                {filteredActiveMembers.map((m, idx) => (
                  <tr key={m.id} className={`border-b-2 border-gray-300 hover:bg-blue-50/70 transition-colors text-lg font-black ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/80'}`}>
                    <td className="p-5">
                      {m.level === UserLevel.LV6_CEO ? (
                        <span className="bg-amber-100 text-amber-950 text-xs px-3 py-1.5 rounded-lg font-black border-2 border-amber-400 shadow-sm">최고관리자</span>
                      ) : m.level === UserLevel.LV5_ADMIN ? (
                        <span className="bg-purple-150 text-purple-950 text-xs px-3 py-1.5 rounded-lg font-black border-2 border-purple-400 shadow-sm">관리자</span>
                      ) : m.level === UserLevel.LV4_MANAGER ? (
                        <span className="bg-blue-150 text-blue-950 text-xs px-3 py-1.5 rounded-lg font-black border-2 border-blue-400 shadow-sm">지부장급</span>
                      ) : m.level === UserLevel.LV3_EXCELLENT ? (
                        <span className="bg-teal-150 text-teal-950 text-xs px-3 py-1.5 rounded-lg font-black border-2 border-teal-400 shadow-sm">우수회원</span>
                      ) : m.level === UserLevel.LV2_MEMBER ? (
                        <span className="bg-emerald-100 text-emerald-950 text-xs px-3 py-1.5 rounded-lg font-black border-2 border-emerald-400 shadow-sm">정회원</span>
                      ) : (
                        <span className="bg-gray-200 text-gray-900 text-xs px-3 py-1.5 rounded-lg font-black border-2 border-gray-400 shadow-sm">준회원</span>
                      )}
                    </td>
                    <td className="p-5">
                      {/* 이름과 이메일의 크기 및 굵기, 색상 극대화 */}
                      <div className="font-black text-[#0A103D] text-xl">{m.name || m.nickname}</div>
                      <div className="text-base text-blue-900 font-extrabold mt-1.5 select-all">{m.email}</div>
                    </td>
                    <td className="p-5 text-black font-black">{m.phone || '-'}</td>
                    <td className="p-5 text-black font-black">{m.address || '-'}</td>
                    <td className="p-5 text-black font-black">{m.position}</td>
                    <td className="p-5 text-center">
                      {user?.id === m.id ? (
                        <span className="text-base text-gray-600 bg-gray-200 px-4 py-2 rounded-lg border-2 border-gray-400 font-black">본인</span>
                      ) : m.level === UserLevel.LV6_CEO ? (
                        <span className="text-base text-gray-500 font-black">불가</span>
                      ) : (
                        <div className="flex items-center gap-3.5 justify-center">
                          {/* CEO(LV6)이거나 대상자가 LV5_ADMIN 미만인 경우에만 조정 select 노출 */}
                          {(user?.level === UserLevel.LV6_CEO || m.level < UserLevel.LV5_ADMIN) ? (
                            <select 
                              className="bg-white border-2 border-gray-400 rounded-lg px-3 py-2 text-base text-black font-black focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm cursor-pointer"
                              value={m.level}
                              onChange={(e) => handleChangeLevel(m.id, parseInt(e.target.value))}
                            >
                              <option value={UserLevel.LV1_GUEST}>준회원 (LV1)</option>
                              <option value={UserLevel.LV2_MEMBER}>정회원 (LV2)</option>
                              <option value={UserLevel.LV3_EXCELLENT}>우수회원 (LV3)</option>
                              <option value={UserLevel.LV4_MANAGER}>지부장급 (LV4)</option>
                              {user?.level === UserLevel.LV6_CEO && (
                                <option value={UserLevel.LV5_ADMIN}>관리자 (LV5)</option>
                              )}
                            </select>
                          ) : (
                            <span className="text-base text-gray-500 font-black">-</span>
                          )}

                          {/* CEO(LV6)이고 대상 회원이 LV5_ADMIN이 아닌 경우 "관리자 임명" 버튼 제공 */}
                          {user?.level === UserLevel.LV6_CEO && m.level !== UserLevel.LV5_ADMIN && (
                            <button 
                              onClick={() => handleAppoint(m.id)}
                              className="bg-purple-600 text-white text-sm font-black px-4 py-2.5 rounded-lg shadow-md hover:bg-purple-700 hover:-translate-y-[1px] transition-all"
                            >
                              관리자 임명
                            </button>
                          )}

                          {/* CEO(LV6)이고 대상 회원이 이미 LV5_ADMIN인 경우 "해임" 버튼 제공 */}
                          {user?.level === UserLevel.LV6_CEO && m.level === UserLevel.LV5_ADMIN && (
                            <button 
                              onClick={() => handleDismiss(m.id)}
                              className="bg-red-600 text-white text-sm font-black px-4 py-2.5 rounded-lg shadow-md hover:bg-red-700 hover:-translate-y-[1px] transition-all"
                            >
                              해임
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
