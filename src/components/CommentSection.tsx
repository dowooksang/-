'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/lib/useAuth';
import { UserLevel } from '@/lib/store';
import { MessageSquare, Send, Trash2, Edit2, Check, X, Calendar } from 'lucide-react';

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const { user, isLoaded } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
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
      console.error('댓글을 가져오는 중 오류 발생:', err);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!user) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content: newComment.trim(),
        });

      if (error) throw error;

      setNewComment('');
      fetchComments();
    } catch (err: any) {
      alert(`댓글 등록 실패: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (comment: any) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleSaveEdit = async (commentId: string) => {
    if (!editContent.trim()) return;

    try {
      const { error } = await supabase
        .from('comments')
        .update({ content: editContent.trim() })
        .eq('id', commentId);

      if (error) throw error;

      setEditingId(null);
      setEditContent('');
      fetchComments();
    } catch (err: any) {
      alert(`댓글 수정 실패: ${err.message}`);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('댓글을 삭제하시겠습니까?')) return;

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      fetchComments();
    } catch (err: any) {
      alert(`댓글 삭제 실패: ${err.message}`);
    }
  };

  const hasPermission = (comment: any) => {
    if (!user) return false;
    // 본인이 쓴 댓글이거나 관리자(LV5) 이상 권한이 있는 경우
    return user.id === comment.user_id || (user.level !== undefined && user.level >= UserLevel.LV5_ADMIN);
  };

  return (
    <div className="mt-12 border-t-2 border-gray-300 pt-8 max-w-4xl mx-auto text-black">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-6 h-6 text-[#5486B2]" />
        <h3 className="text-xl font-bold text-gray-800">댓글 ({comments.length})</h3>
      </div>

      {/* 댓글 작성 폼 */}
      {user ? (
        <form onSubmit={handleCommentSubmit} className="mb-8">
          <div className="flex flex-col border border-gray-300 rounded-lg overflow-hidden bg-white focus-within:ring-1 focus-within:ring-[#5486B2] focus-within:border-[#5486B2] transition-colors">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 작성해보세요. 건전한 인터넷 커뮤니티 문화를 함께 만듭시다."
              rows={3}
              required
              className="p-4 w-full bg-white text-gray-800 placeholder-gray-400 focus:outline-none resize-none text-sm"
            />
            <div className="bg-gray-50 px-4 py-2.5 flex justify-between items-center border-t border-gray-200">
              <span className="text-xs text-gray-500 font-semibold">
                작성자: <span className="text-gray-800 font-bold">{user.nickname || user.name}</span>
              </span>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#5486B2] text-white px-4 py-1.5 rounded text-xs font-bold hover:bg-[#436f94] transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>등록</span>
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-gray-500 text-sm font-semibold mb-8">
          댓글을 작성하려면 로그인이 필요합니다.
        </div>
      )}

      {/* 댓글 리스트 */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">등록된 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-slate-50/50 border border-gray-200 rounded-lg p-4 transition-all hover:bg-slate-50">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-sm text-[#0A103D]">
                    {comment.users?.nickname || comment.users?.name || '알 수 없음'}
                  </span>
                  <span className="text-gray-300">|</span>
                  <div className="flex items-center gap-1 text-[11px] text-gray-400 font-semibold">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(comment.created_at).toLocaleString('ko-KR', {
                        year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                {hasPermission(comment) && (
                  <div className="flex items-center gap-1">
                    {editingId !== comment.id ? (
                      <>
                        {user?.id === comment.user_id && (
                          <button
                            onClick={() => handleStartEdit(comment)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded hover:bg-white/70"
                            title="수정"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded hover:bg-white/70"
                          title="삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : null}
                  </div>
                )}
              </div>

              {editingId === comment.id ? (
                <div className="mt-2 space-y-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={2}
                    className="w-full bg-white border border-gray-300 rounded p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#5486B2] focus:border-[#5486B2]"
                  />
                  <div className="flex justify-end gap-1.5">
                    <button
                      onClick={() => handleSaveEdit(comment.id)}
                      className="bg-green-600 text-white p-1.5 rounded hover:bg-green-700 transition-colors text-xs flex items-center gap-1 font-bold"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>저장</span>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-300 text-gray-700 p-1.5 rounded hover:bg-gray-400 transition-colors text-xs flex items-center gap-1 font-bold"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>취소</span>
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mt-1">
                  {comment.content}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
