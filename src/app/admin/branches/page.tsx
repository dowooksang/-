'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';
import { UserLevel } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function AdminBranchesPage() {
  const { user, isLoaded } = useAuth();
  const router = useRouter();
  const [branches, setBranches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      if (!user || user.level === undefined || user.level < UserLevel.LV5_ADMIN) {
        alert('관리자만 접근할 수 있습니다.');
        router.push('/');
        return;
      }
      fetchBranches();
    }
  }, [user, isLoaded, router]);

  const fetchBranches = async () => {
    try {
      const res = await fetch('/api/admin/branches');
      const data = await res.json();
      setBranches(data);
    } catch (error) {
      console.error('지부 목록 불러오기 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (branchId: string) => {
    if (!confirm('해당 지부를 공식 지부로 승인하시겠습니까?\n신청자는 즉시 [지부장] 권한을 갖게 됩니다.')) return;
    
    try {
      const res = await fetch('/api/admin/branches/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branchId })
      });
      
      if (res.ok) {
        alert('지부가 승인되었습니다.');
        fetchBranches();
      } else {
        alert('승인 처리에 실패했습니다.');
      }
    } catch (error) {
      alert('오류가 발생했습니다.');
    }
  };

  const handleCancelApproval = async (branchId: string) => {
    if (!confirm('해당 지부의 승인을 취소하시겠습니까?\n지부장 권한도 정회원으로 강등됩니다.')) return;
    
    try {
      const res = await fetch('/api/admin/branches/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branchId })
      });
      
      if (res.ok) {
        alert('지부 승인이 취소되었습니다.');
        fetchBranches();
      } else {
        alert('승인 취소 처리에 실패했습니다.');
      }
    } catch (error) {
      alert('오류가 발생했습니다.');
    }
  };

  if (!isLoaded || isLoading) return <div className="text-center py-20 text-white">로딩 중...</div>;

  const pendingBranches = branches.filter(b => b.status === 'pending');
  const approvedBranches = branches.filter(b => b.status === 'approved');

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 text-white">
      <h1 className="text-3xl font-bold mb-8">지부 신청 현황 및 관리</h1>

      {/* 신규 신청 대기 목록 */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-3">
          <h2 className="text-xl font-bold text-accent">신규 지부 신청 대기</h2>
          <span className="bg-red-500/20 text-red-300 text-xs px-2 py-1 rounded font-medium">
            {pendingBranches.length}건 대기중
          </span>
        </div>
        
        {pendingBranches.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center text-gray-200">
            새로 들어온 지부 신청이 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingBranches.map((b) => (
              <div key={b.id} className="bg-white/5 border border-white/10 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  승인 대기
                </div>
                <h3 className="text-xl font-bold mb-1 text-accent">{b.name}</h3>
                <p className="text-sm text-gray-200 font-medium mb-4">{new Date(b.createdAt).toLocaleDateString()} 신청</p>
                
                <div className="grid grid-cols-2 gap-y-3 text-sm mb-6 bg-black/35 p-4 rounded-lg">
                  <div className="text-gray-200 font-medium">지부장 성함</div>
                  <div className="font-bold text-right text-white">{b.managerName}</div>
                  
                  <div className="text-gray-200 font-medium">연락처</div>
                  <div className="font-bold text-right text-white">{b.managerPhone}</div>
                  
                  <div className="text-gray-200 font-medium">활동 지역</div>
                  <div className="font-bold text-right text-white">{b.region}</div>
                  
                  <div className="text-gray-200 font-medium">소속 동호회 수</div>
                  <div className="font-bold text-right text-white">{b.bandCount}팀</div>
                  
                  <div className="text-gray-200 font-medium">모임 공간 유무</div>
                  <div className="font-bold text-right">
                    {b.hasPracticeRoom ? <span className="text-green-300 font-bold">보유함</span> : <span className="text-gray-300 font-medium">미보유</span>}
                  </div>
                </div>

                <button 
                  onClick={() => handleApprove(b.id)}
                  className="w-full bg-accent text-[#0A103D] font-bold py-3 rounded-lg shadow hover:bg-[#82C8FF] transition-all"
                >
                  지부 공식 승인하기
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 승인된 지부 목록 */}
      <div>
        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-3">
          <h2 className="text-xl font-bold">공식 활동 지부 현황</h2>
          <span className="bg-white/10 text-gray-300 text-xs px-2 py-1 rounded font-medium">
            총 {approvedBranches.length}개 지부
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-y border-white/10 text-sm text-gray-100">
                <th className="p-4 font-bold text-accent">지부 명칭</th>
                <th className="p-4 font-bold text-accent">지부장</th>
                <th className="p-4 font-bold text-accent">연락처</th>
                <th className="p-4 font-bold text-accent">활동 지역</th>
                <th className="p-4 font-bold text-accent text-center">동호회 수</th>
                <th className="p-4 font-bold text-accent text-center">모임 공간</th>
                <th className="p-4 font-bold text-accent text-center">관리</th>
              </tr>
            </thead>
            <tbody>
              {approvedBranches.map((b) => (
                <tr key={b.id} className="border-b border-white/5 hover:bg-white/5 transition-colors text-sm">
                  <td className="p-4 font-extrabold text-accent text-base">{b.name}</td>
                  <td className="p-4 font-bold text-white text-base">{b.managerName}</td>
                  <td className="p-4 font-semibold text-gray-100">{b.managerPhone}</td>
                  <td className="p-4 font-semibold text-gray-100">{b.region}</td>
                  <td className="p-4 text-center font-semibold text-gray-100">{b.bandCount}팀</td>
                  <td className="p-4 text-center font-bold text-white">
                    {b.hasPracticeRoom ? <span className="text-green-300">O (보유)</span> : <span className="text-gray-400">X (미보유)</span>}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleCancelApproval(b.id)}
                      className="bg-red-600/80 border border-red-500/30 text-white font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-red-700 transition-colors shadow"
                    >
                      승인 취소
                    </button>
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
