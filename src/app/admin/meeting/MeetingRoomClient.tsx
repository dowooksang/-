'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { UserLevel } from '@/lib/store';
import { 
  Lock, PenSquare, FileText, Trash2, Calendar, 
  MessageSquare, Send, X, AlertTriangle, ShieldCheck, 
  UserMinus, Plus, RefreshCw, Eye
} from 'lucide-react';

interface MeetingRoomClientProps {
  currentUser: {
    id: string;
    email: string;
    nickname?: string;
    name?: string;
    level: number;
  } | null;
}

export default function MeetingRoomClient({ currentUser }: MeetingRoomClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'board' | 'blacklist'>('board');

  // --- 게시판 State ---
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [writeTitle, setWriteTitle] = useState('');
  const [writeContent, setWriteContent] = useState('');
  const [isNotice, setIsNotice] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isBoardLoading, setIsBoardLoading] = useState(true);

  // --- 블랙리스트 회원 State ---
  const [members, setMembers] = useState<any[]>([]);
  const [isMembersLoading, setIsMembersLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // --- 게시판 로드 ---
  const fetchPosts = useCallback(async () => {
    try {
      setIsBoardLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('board_type', 'meeting')
        .order('is_notice', { ascending: false })
        .order('created_at', { ascending: false });

      if (!error && data) {
        setPosts(data);
      }
    } catch (err) {
      console.error('회의글 로드 중 오류:', err);
    } finally {
      setIsBoardLoading(false);
    }
  }, []);

  // --- 회원 목록 로드 (블랙리스트용) ---
  const fetchMembers = useCallback(async () => {
    try {
      setIsMembersLoading(true);
      const res = await fetch('/api/admin/members');
      if (res.ok) {
        const data = await res.json();
        // 운영진(LV5) 미만 회원들만 제보 및 관리 대상으로 필터링
        setMembers(data.filter((m: any) => m.level < UserLevel.LV5_ADMIN));
      }
    } catch (err) {
      console.error('회원 목록 로드 중 오류:', err);
    } finally {
      setIsMembersLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    fetchMembers();
  }, [fetchPosts, fetchMembers]);

  // --- 게시글 상세 및 댓글 조회 ---
  const handleSelectPost = async (post: any) => {
    setSelectedPost(post);
    // 조회수 증가
    try {
      await supabase
        .from('posts')
        .update({ views: (post.views || 0) + 1 })
        .eq('id', post.id);
      
      // 로컬 리스트도 업데이트
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, views: (p.views || 0) + 1 } : p));
    } catch (e) {
      console.warn('조회수 반영 실패:', e);
    }
    fetchComments(post.id);
  };

  const fetchComments = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*, users(nickname, name, email)')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setComments(data);
      }
    } catch (err) {
      console.error('댓글 로딩 에러:', err);
    }
  };

  // --- 댓글 작성 ---
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !selectedPost || !currentUser) return;

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: selectedPost.id,
          user_id: currentUser.id,
          content: newCommentText.trim(),
        });

      if (error) throw error;
      setNewCommentText('');
      fetchComments(selectedPost.id);
    } catch (err: any) {
      alert(`댓글 등록 실패: ${err.message}`);
    }
  };

  // --- 댓글 삭제 ---
  const handleCommentDelete = async (commentId: string) => {
    if (!confirm('댓글을 삭제하시겠습니까?')) return;
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);
      if (error) throw error;
      if (selectedPost) {
        fetchComments(selectedPost.id);
      }
    } catch (err: any) {
      alert(`댓글 삭제 실패: ${err.message}`);
    }
  };

  // --- 게시글 작성 ---
  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!writeTitle.trim() || !writeContent.trim() || !currentUser) return;

    setIsSubmitLoading(true);
    try {
      const { error } = await supabase
        .from('posts')
        .insert([{
          title: writeTitle.trim(),
          content: writeContent.trim(),
          author: currentUser.nickname || currentUser.name || '운영진',
          author_id: currentUser.id,
          category: 'meeting',
          is_notice: isNotice,
          board_type: 'meeting'
        }]);

      if (error) throw error;

      setIsWriteModalOpen(false);
      setWriteTitle('');
      setWriteContent('');
      setIsNotice(false);
      fetchPosts();
    } catch (err: any) {
      alert(`작전 안건 생성 실패: ${err.message}`);
    } finally {
      setIsSubmitLoading(false);
    }
  };

  // --- 게시글 삭제 ---
  const handlePostDelete = async (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('정말로 이 작전 안건을 파기하시겠습니까? (복구 불가능)')) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      if (selectedPost?.id === postId) {
        setSelectedPost(null);
      }
      fetchPosts();
    } catch (err: any) {
      alert(`안건 삭제 실패: ${err.message}`);
    }
  };

  // --- 불량 회원 관리 (강제 탈퇴/상태 변경) ---
  const handleKickMember = async (userId: string) => {
    if (!confirm('해당 회원을 정말로 연합회에서 강제 탈퇴시키겠습니까?')) return;

    try {
      const res = await fetch('/api/admin/members/kick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      
      if (res.ok) {
        alert('성공적으로 강제 탈퇴 처리되었습니다.');
        fetchMembers();
      } else {
        const err = await res.json();
        alert(`탈퇴 실패: ${err.error}`);
      }
    } catch (e) {
      alert('오류가 발생했습니다.');
    }
  };

  const handleChangeMemberLevel = async (userId: string, newLevel: number) => {
    if (!confirm('회원의 등급을 조정하시겠습니까?')) return;

    try {
      const res = await fetch('/api/admin/members/level', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, level: newLevel })
      });

      if (res.ok) {
        alert('등급이 정상적으로 변경되었습니다.');
        fetchMembers();
      } else {
        alert('등급 변경에 실패했습니다.');
      }
    } catch (e) {
      alert('오류가 발생했습니다.');
    }
  };

  // --- 검색 필터링 ---
  const filteredMembers = members.filter(m => {
    const term = searchQuery.toLowerCase();
    return (
      (m.name || '').toLowerCase().includes(term) ||
      (m.nickname || '').toLowerCase().includes(term) ||
      (m.email || '').toLowerCase().includes(term) ||
      (m.phone || '').includes(term)
    );
  });

  return (
    <div className="bg-[#080d1a] min-h-screen text-[#e2e8f0] font-sans pb-16">
      {/* Top Banner (Midnight & Cyan Cyberpunk Concept) */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0d162d] to-[#070b18] border-b border-cyan-500/20 py-12 px-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-cyan-950/50 border-2 border-cyan-400/80 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <Lock className="w-7 h-7 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-cyan-400 tracking-wider uppercase drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]">
                OPERATIONS ROOM
              </h1>
              <p className="text-sm text-slate-400 mt-1.5 font-medium">
                사단법인 직장인밴드연합회 1급 비밀 회의 공간 • 등급 LV5 이상 통제 구역
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-cyan-950/40 text-cyan-400 border border-cyan-400/30 text-xs px-3.5 py-1.5 rounded-lg font-bold">
              ACCESS: {currentUser?.nickname} (LV{currentUser?.level})
            </span>
            <button 
              onClick={() => { fetchPosts(); fetchMembers(); }}
              className="p-2.5 bg-slate-800/40 hover:bg-slate-800 border border-slate-700/60 rounded-lg text-slate-400 hover:text-white transition-all"
              title="데이터 동기화"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="max-w-7xl mx-auto px-6 mt-10">
        {/* Tab Controls */}
        <div className="flex gap-2 border-b border-slate-800 pb-3 mb-8">
          <button
            onClick={() => setActiveTab('board')}
            className={`px-6 py-3.5 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 border text-sm ${
              activeTab === 'board'
                ? 'bg-cyan-500/10 border-cyan-400/80 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.1)]'
                : 'bg-transparent border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>운영 안건 게시판</span>
          </button>
          <button
            onClick={() => setActiveTab('blacklist')}
            className={`px-6 py-3.5 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 border text-sm ${
              activeTab === 'blacklist'
                ? 'bg-cyan-500/10 border-cyan-400/80 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.1)]'
                : 'bg-transparent border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>불량 회원 관리 및 제보</span>
          </button>
        </div>

        {/* Tab Content: Board */}
        {activeTab === 'board' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left list panel */}
            <div className="lg:col-span-2 bg-[#0b1329]/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-white flex items-center gap-2.5">
                  <FileText className="w-5.5 h-5.5 text-cyan-400" />
                  작전 안건 목록 ({posts.length})
                </h2>
                <button
                  onClick={() => setIsWriteModalOpen(true)}
                  className="bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white text-xs font-black px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(8,145,178,0.2)]"
                >
                  <Plus className="w-4 h-4" />
                  새 안건 작성
                </button>
              </div>

              {isBoardLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                  <RefreshCw className="w-8 h-8 animate-spin mb-3 text-cyan-500" />
                  <span className="text-sm font-semibold">비밀 회의 안건들을 복구하는 중...</span>
                </div>
              ) : posts.length === 0 ? (
                <div className="border border-dashed border-slate-800 rounded-xl py-16 text-center text-slate-500">
                  등록된 대외비 작전 안건이 없습니다.
                </div>
              ) : (
                <div className="space-y-3">
                  {posts.map(post => {
                    const isNotice = post.is_notice === true;
                    return (
                      <div
                        key={post.id}
                        onClick={() => handleSelectPost(post)}
                        className={`group border rounded-xl p-5 cursor-pointer transition-all duration-200 ${
                          selectedPost?.id === post.id
                            ? 'bg-[#152347] border-cyan-400/80 shadow-[0_0_12px_rgba(34,211,238,0.1)]'
                            : 'bg-[#0f1935]/40 border-slate-800/80 hover:bg-[#101c3d]/60 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1.5">
                              {isNotice && (
                                <span className="bg-red-950/60 border border-red-500/40 text-red-400 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                                  [기밀공지]
                                </span>
                              )}
                              <h3 className={`text-base text-white group-hover:text-cyan-400 transition-colors truncate ${isNotice ? 'font-black' : 'font-bold'}`}>
                                {post.title}
                              </h3>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                              <span>작성자: {post.author}</span>
                              <span className="text-slate-600">|</span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(post.created_at).toLocaleDateString()}
                              </span>
                              <span className="text-slate-600">|</span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-3.5 h-3.5" />
                                {post.views || 0}
                              </span>
                            </div>
                          </div>
                          {currentUser?.level === UserLevel.LV6_CEO && (
                            <button
                              onClick={(e) => handlePostDelete(post.id, e)}
                              className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-red-400 transition-all rounded hover:bg-red-500/10"
                              title="안건 파기"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right detail panel */}
            <div className="bg-[#0b1329]/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-2xl min-h-[500px]">
              {selectedPost ? (
                <div className="flex flex-col h-full">
                  <div className="border-b border-slate-800 pb-4 mb-4">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        {selectedPost.is_notice && (
                          <span className="bg-red-950/60 border border-red-500/40 text-red-400 text-[10px] font-black px-2 py-0.5 rounded uppercase block w-max mb-2">
                            🚨기밀공지
                          </span>
                        )}
                        <h2 className="text-xl font-bold text-white leading-normal">{selectedPost.title}</h2>
                      </div>
                      <button
                        onClick={() => setSelectedPost(null)}
                        className="text-slate-500 hover:text-white p-1 rounded hover:bg-slate-800"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-medium mt-3">
                      <span>작성자: {selectedPost.author}</span>
                      <span>•</span>
                      <span>{new Date(selectedPost.created_at).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Content area */}
                  <div className="flex-1 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap border-b border-slate-800 pb-6 mb-6">
                    {selectedPost.content}
                  </div>

                  {/* Comment Section inside detail panel */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-cyan-400 flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4" />
                      비밀 댓글 ({comments.length})
                    </h4>

                    {/* Comment list */}
                    <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                      {comments.length === 0 ? (
                        <p className="text-xs text-slate-500 text-center py-4">등록된 작전 의견이 없습니다.</p>
                      ) : (
                        comments.map(comment => (
                          <div key={comment.id} className="bg-slate-900/40 border border-slate-800/80 rounded-lg p-3">
                            <div className="flex justify-between items-start gap-2 mb-1.5">
                              <span className="font-bold text-xs text-cyan-300">
                                {comment.users?.nickname || comment.users?.name || '운영진'}
                              </span>
                              {(currentUser?.id === comment.user_id || currentUser?.level === UserLevel.LV6_CEO) && (
                                <button
                                  onClick={() => handleCommentDelete(comment.id)}
                                  className="text-slate-500 hover:text-red-400 p-0.5 rounded transition-all"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">{comment.content}</p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Write comment */}
                    <form onSubmit={handleCommentSubmit} className="flex gap-2">
                      <input
                        type="text"
                        value={newCommentText}
                        onChange={e => setNewCommentText(e.target.value)}
                        placeholder="안건에 의견을 달아주세요..."
                        className="flex-1 bg-[#090e1b] border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                        required
                      />
                      <button
                        type="submit"
                        className="bg-cyan-700 hover:bg-cyan-600 text-white font-bold px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-center"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 py-16 text-center">
                  <ShieldCheck className="w-16 h-16 text-slate-800 mb-4 animate-pulse" />
                  <h3 className="font-bold text-slate-400 text-base">안건 상세 정보</h3>
                  <p className="text-xs text-slate-600 mt-2 max-w-xs leading-relaxed">
                    왼쪽의 작전 안건 목록 중 상세 내용을 조회할 기밀 안건을 선택해 주십시오.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab Content: Blacklist Management */}
        {activeTab === 'blacklist' && (
          <div className="bg-[#0b1329]/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 border-b border-slate-800 pb-5">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2.5">
                  <AlertTriangle className="w-5.5 h-5.5 text-yellow-500 animate-bounce" />
                  불량 회원 모니터링 및 제보
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  일반/정/우수회원(지부장 포함) 대상 등급 강등 및 탈퇴 권한 행사 패널
                </p>
              </div>
              <input
                type="text"
                placeholder="대상 회원 이름, 닉네임, 이메일 검색..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full sm:w-80 px-4 py-2 bg-[#090e1b] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {isMembersLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <RefreshCw className="w-8 h-8 animate-spin mb-3 text-cyan-500" />
                <span className="text-sm font-semibold">회원 보안 데이터를 복원하는 중...</span>
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="border border-dashed border-slate-800 rounded-xl py-16 text-center text-slate-500">
                조회 및 관리할 대상 회원이 없습니다.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/80 text-slate-300 border-b border-slate-800 text-xs uppercase tracking-wider font-bold">
                      <th className="p-4">이름(닉네임)</th>
                      <th className="p-4">이메일</th>
                      <th className="p-4">연락처</th>
                      <th className="p-4">현재 등급</th>
                      <th className="p-4 text-center">보안 조치</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map((m, idx) => (
                      <tr 
                        key={m.id} 
                        className={`border-b border-slate-900 hover:bg-slate-900/30 text-sm font-medium ${
                          idx % 2 === 0 ? 'bg-[#0f1935]/10' : 'bg-transparent'
                        }`}
                      >
                        <td className="p-4">
                          <span className="font-bold text-white">{m.name || m.nickname}</span>
                          {m.status === 'pending' && (
                            <span className="ml-2 bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-[10px] font-bold px-1.5 py-0.5 rounded">
                              승인대기
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-slate-400">{m.email}</td>
                        <td className="p-4 text-slate-400">{m.phone || '-'}</td>
                        <td className="p-4">
                          <select
                            value={m.level}
                            onChange={(e) => handleChangeMemberLevel(m.id, parseInt(e.target.value))}
                            className="bg-[#090e1b] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                          >
                            <option value={UserLevel.LV1_GUEST}>준회원 (LV1)</option>
                            <option value={UserLevel.LV2_MEMBER}>정회원 (LV2)</option>
                            <option value={UserLevel.LV3_EXCELLENT}>우수회원 (LV3)</option>
                            <option value={UserLevel.LV4_MANAGER}>지부장급 (LV4)</option>
                          </select>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleKickMember(m.id)}
                            className="inline-flex items-center gap-1 bg-red-950/40 hover:bg-red-900 border border-red-500/40 text-red-400 text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                          >
                            <UserMinus className="w-3.5 h-3.5" />
                            <span>강제탈퇴(Kick)</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Write Post Modal (Glassmorphism design) */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#0b1329] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-[#0e172e]">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <PenSquare className="w-4.5 h-4.5 text-cyan-400" />
                새로운 작전 안건 수립
              </h3>
              <button
                onClick={() => setIsWriteModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostSubmit} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">안건 제목</label>
                <input
                  type="text"
                  required
                  value={writeTitle}
                  onChange={e => setWriteTitle(e.target.value)}
                  className="w-full bg-[#080d1a] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  placeholder="보안 안건의 제목을 작성하십시오..."
                />
              </div>

              <div className="flex items-center gap-2 select-none">
                <input
                  type="checkbox"
                  id="modal-is-notice"
                  checked={isNotice}
                  onChange={e => setIsNotice(e.target.checked)}
                  className="w-4.5 h-4.5 bg-[#080d1a] border-slate-800 rounded text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900"
                />
                <label htmlFor="modal-is-notice" className="text-xs font-bold text-slate-400 cursor-pointer">
                  작전실 상단 기밀공지(🚨)로 게시
                </label>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">안건 세부 사항</label>
                <textarea
                  required
                  rows={8}
                  value={writeContent}
                  onChange={e => setWriteContent(e.target.value)}
                  className="w-full bg-[#080d1a] border border-slate-800 rounded-xl p-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
                  placeholder="대외비 내용을 자유롭게 명시하십시오..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold bg-transparent hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSubmitLoading}
                  className="px-5 py-2.5 text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl shadow-lg transition-colors disabled:opacity-50"
                >
                  {isSubmitLoading ? '전송중...' : '확인'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
