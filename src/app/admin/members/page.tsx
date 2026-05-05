'use client';

import { useState } from 'react';

export default function AdminMembers() {
  // 임시 회원 데이터 (이후 Supabase 연결)
  const [members, setMembers] = useState([
    { id: '1', name: '도욱상', email: 'dowooksang@gmail.com', region: '서울 서초구', role: 'ADMIN', band: '연합회 운영진', joinDate: '2026-04-20' },
    { id: '2', name: '김기타', email: 'guitar@example.com', region: '서울 마포구', role: 'MEMBER', band: '블루사운드', joinDate: '2026-04-22' },
    { id: '3', name: '이보컬', email: 'vocal@example.com', region: '경기 분당', role: 'GUEST', band: '-', joinDate: '2026-04-28' },
  ]);

  const handleRoleChange = (id: string, newRole: string) => {
    setMembers(members.map(m => m.id === id ? { ...m, role: newRole } : m));
    alert('회원 등급이 변경되었습니다.');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#333333]">회원 목록 & 등급 관리</h2>
          <p className="text-gray-500 mt-1">전체 회원을 조회하고 클릭 한 번으로 등급을 변경합니다.</p>
        </div>
        <div className="flex gap-2">
          <input type="text" placeholder="이름 또는 이메일 검색" className="border border-gray-300 rounded-lg px-4 py-2 text-sm" />
          <button className="px-4 py-2 bg-[#0A103D] text-white rounded-lg text-sm font-bold">검색</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500">
              <th className="p-4 w-16 text-center">No.</th>
              <th className="p-4">성함 / 이메일</th>
              <th className="p-4">거주 지역</th>
              <th className="p-4">소속 밴드</th>
              <th className="p-4 w-32">가입일</th>
              <th className="p-4 w-40 text-center">회원 등급 변경</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {members.map((member, idx) => (
              <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-center text-gray-400">{idx + 1}</td>
                <td className="p-4">
                  <div className="font-bold text-gray-800">{member.name}</div>
                  <div className="text-xs text-gray-500">{member.email}</div>
                </td>
                <td className="p-4 text-sm text-gray-600">{member.region}</td>
                <td className="p-4 text-sm text-gray-600">{member.band}</td>
                <td className="p-4 text-sm text-gray-500">{member.joinDate}</td>
                <td className="p-4 text-center">
                  <select 
                    value={member.role}
                    onChange={(e) => handleRoleChange(member.id, e.target.value)}
                    className={`text-sm font-bold px-3 py-1.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent ${
                      member.role === 'ADMIN' ? 'bg-red-50 text-red-600 border-red-200' :
                      member.role === 'MASTER' ? 'bg-purple-50 text-purple-600 border-purple-200' :
                      member.role === 'MEMBER' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                      'bg-gray-50 text-gray-600 border-gray-200'
                    }`}
                  >
                    <option value="GUEST">준회원</option>
                    <option value="MEMBER">정회원</option>
                    <option value="MASTER">지부장/마스터</option>
                    <option value="ADMIN">관리자</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
