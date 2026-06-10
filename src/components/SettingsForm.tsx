'use client';

import React, { useState, useEffect } from 'react';

/**
 * SettingsForm Component
 * 관리자 전용 수동 지표(누적 정기공연수, 서울/수도권 거점 수)를 수정/저장할 수 있는 클라이언트 사이드 설정 폼입니다.
 */
export default function SettingsForm() {
  const [cumulativeConcerts, setCumulativeConcerts] = useState('');
  const [metroHubs, setMetroHubs] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setFetching(true);
        const res = await fetch('/api/admin/settings');
        if (res.ok) {
          const data = await res.json();
          setCumulativeConcerts(data.cumulative_concerts || '320');
          setMetroHubs(data.metro_hubs || '5');
        }
      } catch (err) {
        console.error('설정 데이터를 불러오는 도중 오류 발생:', err);
      } finally {
        setFetching(false);
      }
    };
    const finalCatch = () => setFetching(false);
    fetchSettings().catch(finalCatch);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cumulative_concerts: cumulativeConcerts,
          metro_hubs: metroHubs,
        }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: '지표 설정이 성공적으로 업데이트되었습니다!' });
      } else {
        const errData = await res.json();
        setMessage({ type: 'error', text: errData.error || '저장에 실패했습니다.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: '네트워크 오류가 발생했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-10 bg-gray-200 rounded mb-4"></div>
        <div className="h-10 bg-gray-200 rounded mb-4"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 w-full max-w-md">
      <h3 className="text-lg font-bold text-gray-800 mb-2">⚙️ 메인 화면 수동 지표 관리</h3>
      <p className="text-xs text-gray-500 mb-6">메인 화면에 노출될 수동 수치(누적공연수, 거점수)를 데이터베이스에 직접 업데이트합니다.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="cumulativeConcerts" className="block text-sm font-semibold text-gray-700 mb-1">
            누적 정기공연 수
          </label>
          <input
            id="cumulativeConcerts"
            type="number"
            value={cumulativeConcerts}
            onChange={(e) => setCumulativeConcerts(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 bg-gray-50 text-sm font-medium"
            required
            placeholder="예: 320"
          />
        </div>

        <div>
          <label htmlFor="metroHubs" className="block text-sm font-semibold text-gray-700 mb-1">
            서울/수도권 거점 수
          </label>
          <input
            id="metroHubs"
            type="number"
            value={metroHubs}
            onChange={(e) => setMetroHubs(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 bg-gray-50 text-sm font-medium"
            required
            placeholder="예: 5"
          />
        </div>

        {message && (
          <div className={`p-3 rounded-lg text-xs font-semibold ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors text-sm shadow disabled:opacity-50 cursor-pointer"
        >
          {loading ? '저장 중...' : '지표 업데이트 저장'}
        </button>
      </form>
    </div>
  );
}
