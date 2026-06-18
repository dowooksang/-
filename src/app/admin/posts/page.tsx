'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

const CATEGORY_MAP: Record<string, string> = {
  notice: '📢 공지사항',
  free: '💬 소통 (자유게시판)',
  greeting: '👋 가입인사',
  promotion: '🎸 동호회(클럽) 홍보',
  market: '🛒 악기/장비 장터',
  archive: '📁 활동 자료실',
  qa: '❓ 건의 및 Q&A',
  press: '📰 보도자료',
  event: '🎉 이벤트',
  gallery: '📸 활동갤러리',
  video: '🎬 공연영상',
  jam: '🎸 방구석 릴레이 잼',
  group: '🤝 소모임 및 매칭',
  lesson: '📖 레슨 및 장비리뷰',
  debut: '🎤 무대 데뷔 신청',
  branch: '🏢 지부 모집 및 신청',
  branch_news: '📰 지부별 활동 소식',
  council: '🤝 지부장 회의실',
  share_gallery: '📸 재능기부/봉사 기록',
  volunteer: '🙌 봉사 요청하기'
};

const LEVEL_OPTIONS = [
  { value: 1, label: '준회원 (LV1)' },
  { value: 2, label: '정회원 (LV2)' },
  { value: 3, label: '우수회원 (LV3)' },
  { value: 4, label: '지부장급 (LV4)' },
  { value: 5, label: '관리자 (LV5)' },
  { value: 6, label: '최고관리자 (LV6)' }
];

export default function AdminPosts() {
  const [activeTab, setActiveTab] = useState<'posts' | 'permissions'>('posts');
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 게시판 권한 상태
  const [permissions, setPermissions] = useState<any[]>([]);
  const [isPermLoading, setIsPermLoading] = useState(false);
  const [isSavingPerm, setIsSavingPerm] = useState(false);

  useEffect(() => {
    fetchPosts();
    fetchPermissions();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err: any) {
      console.error('게시물 불러오기 에러:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      setIsPermLoading(true);
      const res = await fetch('/api/admin/boards');
      if (res.ok) {
        const data = await res.json();
        setPermissions(data);
      }
    } catch (err) {
      console.error('게시판 권한 불러오기 에러:', err);
    } finally {
      setIsPermLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm('정말로 삭제하시겠습니까?')) return;
    
    try {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) throw error;
      alert('삭제되었습니다.');
      fetchPosts();
    } catch (err: any) {
      alert('삭제 중 에러가 발생했습니다.');
    }
  };

  const handlePermissionChange = (category: string, field: 'read_level' | 'write_level', value: number) => {
    setPermissions(prev =>
      prev.map(p => (p.category === category ? { ...p, [field]: value } : p))
    );
  };

  const savePermissions = async () => {
    try {
      setIsSavingPerm(true);
      const res = await fetch('/api/admin/boards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ permissions })
      });

      if (res.ok) {
        alert('게시판 권한 설정이 성공적으로 저장되었습니다!');
      } else {
        const errData = await res.json();
        alert(`저장 실패: ${errData.error || '알 수 없는 오류'}`);
      }
    } catch (err) {
      console.error('권한 저장 오류:', err);
      alert('네트워크 오류가 발생했습니다.');
    } finally {
      setIsSavingPerm(false);
    }
  };

  return (
    <div className="space-y-6 text-black">
      {/* 타이틀 영역 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#333333]">전체게시판 및 게시물 관리</h2>
          <p className="text-gray-500 mt-1">게시판별 읽기/쓰기 접근 권한과 등록된 게시물들을 통합 관리합니다.</p>
        </div>
        {activeTab === 'posts' && (
          <Link 
            href="/admin/posts/write" 
            className="px-6 py-3 bg-accent text-[#0A103D] font-bold rounded-lg shadow-md hover:bg-[#82C8FF] transition-colors"
          >
            + 새 글 작성
          </Link>
        )}
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('posts')}
          className={`px-6 py-3 font-semibold text-sm transition-colors cursor-pointer ${
            activeTab === 'posts'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          📝 게시물 목록 관리
        </button>
        <button
          onClick={() => setActiveTab('permissions')}
          className={`px-6 py-3 font-semibold text-sm transition-colors cursor-pointer ${
            activeTab === 'permissions'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          ⚙️ 게시판 권한 설정
        </button>
      </div>

      {/* 탭 콘텐츠 */}
      {activeTab === 'posts' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500">
                <th className="p-4 w-28 text-center">분류</th>
                <th className="p-4">제목</th>
                <th className="p-4 w-32">작성자</th>
                <th className="p-4 w-32">작성일</th>
                <th className="p-4 w-32 text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-400">데이터를 불러오는 중입니다...</td></tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-400 flex flex-col items-center">
                    <span className="text-4xl mb-4">📭</span>
                    등록된 게시물이 없습니다.<br/>(혹은 DB 테이블이 아직 생성되지 않았습니다)
                  </td>
                </tr>
              ) : (
                posts.map(post => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-center">
                      <span className="px-2 py-1 bg-gray-100 text-gray-650 rounded text-xs font-bold">
                        {CATEGORY_MAP[post.category] ? CATEGORY_MAP[post.category].split(' ').slice(1).join(' ') : post.category}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-gray-800">
                      {post.title}
                    </td>
                    <td className="p-4 text-sm text-gray-600">{post.author_id ? post.author : '알 수 없음'}</td>
                    <td className="p-4 text-sm text-gray-500">
                      {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ko })}
                    </td>
                    <td className="p-4 text-center space-x-2">
                      <Link href={`/board/${post.id}`} className="text-sm font-medium text-[#5486B2] hover:underline">보기</Link>
                      <button onClick={() => deletePost(post.id)} className="text-sm font-medium text-red-500 hover:underline cursor-pointer">삭제</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <p className="text-sm text-gray-500">
            각 게시판 카테고리별로 접근할 수 있는 최소 회원 등급을 설정합니다. (설정한 등급 이상의 회원만 해당 동작이 가능합니다.)
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600">
                  <th className="p-4">게시판 이름 (카테고리)</th>
                  <th className="p-4 w-60">읽기 권한 등급 지정</th>
                  <th className="p-4 w-60">쓰기 권한 등급 지정</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150">
                {isPermLoading ? (
                  <tr><td colSpan={3} className="p-8 text-center text-gray-400">설정을 불러오는 중입니다...</td></tr>
                ) : permissions.length === 0 ? (
                  <tr><td colSpan={3} className="p-8 text-center text-gray-400">저장된 권한 설정 데이터가 없습니다.</td></tr>
                ) : (
                  permissions.map((perm) => (
                    <tr key={perm.category} className="hover:bg-gray-55/30 transition-colors">
                      <td className="p-4 font-bold text-gray-800">
                        {CATEGORY_MAP[perm.category] || perm.category}
                        <span className="text-xs text-gray-400 font-mono ml-2">({perm.category})</span>
                      </td>
                      <td className="p-4">
                        <select
                          value={perm.read_level}
                          onChange={(e) => handlePermissionChange(perm.category, 'read_level', parseInt(e.target.value))}
                          className="w-full max-w-[200px] border rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer text-gray-800"
                        >
                          {LEVEL_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4">
                        <select
                          value={perm.write_level}
                          onChange={(e) => handlePermissionChange(perm.category, 'write_level', parseInt(e.target.value))}
                          className="w-full max-w-[200px] border rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer text-gray-800"
                        >
                          {LEVEL_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              onClick={savePermissions}
              disabled={isSavingPerm || isPermLoading}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm transition-colors text-sm disabled:opacity-50 cursor-pointer"
            >
              {isSavingPerm ? '저장 중...' : '⚙️ 권한 설정 일괄 저장'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
