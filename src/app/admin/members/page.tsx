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

  // 접근 제어 및 데이터 로드
  useEffect(() => {
    if (isLoaded) {
      if (!user || user.level !== UserLevel.ADMIN) {
        alert('관리자만 접근할 수 있습니다.');
        router.push('/');
        return;
      }
      fetchMembers();
    }
  }, [user, isLoaded, router]);

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
    if (!confirm('해당 회원을 최고관리자로 임명하시겠습니까?')) return;
    
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

  if (!isLoaded || isLoading) {
    return <div className="text-center py-20 text-white">로딩 중...</div>;
  }

  const pendingMembers = members.filter(m => m.status === 'pending' && m.level < UserLevel.ADMIN);
  const activeMembers = members.filter(m => m.status === 'active' || m.level === UserLevel.ADMIN);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 text-white">
      <h1 className="text-3xl font-bold mb-8">회원 관리</h1>

      {/* 대기 명단 섹션 */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-3">
          <h2 className="text-xl font-bold text-accent">대기 명단</h2>
          <span className="bg-red-500/20 text-red-300 text-xs px-2 py-1 rounded font-medium">
            {pendingMembers.length}명 대기중
          </span>
        </div>
        
        {pendingMembers.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center text-gray-400">
            현재 대기 중인 회원이 없습니다.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/10 border-y border-white/20 text-sm">
                  <th className="p-4 font-semibold">이름(닉네임)</th>
                  <th className="p-4 font-semibold">연락처</th>
                  <th className="p-4 font-semibold">활동 지역</th>
                  <th className="p-4 font-semibold">악기 파트</th>
                  <th className="p-4 font-semibold">가입일</th>
                  <th className="p-4 font-semibold text-center">관리</th>
                </tr>
              </thead>
              <tbody>
                {pendingMembers.map((m) => (
                  <tr key={m.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="font-bold">{m.name || m.nickname}</div>
                      <div className="text-xs text-gray-400">{m.email}</div>
                    </td>
                    <td className="p-4 text-sm">{m.phone || '-'}</td>
                    <td className="p-4 text-sm">{m.address || '-'}</td>
                    <td className="p-4 text-sm">{m.position}</td>
                    <td className="p-4 text-sm text-gray-400">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleApprove(m.id)}
                        className="bg-accent text-[#0A103D] text-xs font-bold px-4 py-2 rounded shadow hover:bg-[#82C8FF] transition-all"
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
        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-3">
          <h2 className="text-xl font-bold">전체 회원 (정회원)</h2>
          <span className="bg-white/10 text-gray-300 text-xs px-2 py-1 rounded font-medium">
            총 {activeMembers.length}명
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-y border-white/10 text-sm text-gray-300">
                <th className="p-4 font-semibold">상태</th>
                <th className="p-4 font-semibold">이름(닉네임)</th>
                <th className="p-4 font-semibold">연락처</th>
                <th className="p-4 font-semibold">활동 지역</th>
                <th className="p-4 font-semibold">악기 파트</th>
                <th className="p-4 font-semibold text-center">관리 권한</th>
              </tr>
            </thead>
            <tbody>
              {activeMembers.map((m) => (
                <tr key={m.id} className="border-b border-white/5 hover:bg-white/5 transition-colors text-sm">
                  <td className="p-4">
                    {m.level === UserLevel.ADMIN ? (
                      <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded border border-purple-500/30">관리자</span>
                    ) : (
                      <span className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded border border-green-500/30">정회원</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-base">{m.name || m.nickname}</div>
                    <div className="text-xs text-gray-500">{m.email}</div>
                  </td>
                  <td className="p-4 text-gray-300">{m.phone || '-'}</td>
                  <td className="p-4 text-gray-400">{m.address || '-'}</td>
                  <td className="p-4 text-gray-300">{m.position}</td>
                  <td className="p-4 text-center">
                    {user?.id === m.id ? (
                      <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">본인</span>
                    ) : m.level === UserLevel.ADMIN ? (
                      <button 
                        onClick={() => handleDismiss(m.id)}
                        className="bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold px-3 py-1.5 rounded shadow hover:bg-red-500/30 transition-all"
                      >
                        해임
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleAppoint(m.id)}
                        className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold px-3 py-1.5 rounded shadow hover:bg-purple-500/30 transition-all"
                      >
                        관리자 임명
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
