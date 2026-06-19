'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { UserLevel } from '@/lib/store';
import { supabase } from '@/lib/supabaseClient';
import { ArrowLeft, Play, Calendar, User, Trash2, Video, Film, MessageSquare, Send, AlertCircle } from 'lucide-react';

/** 유튜브 URL에서 11자리 비디오 ID 추출하는 정규식 헬퍼 */
function getYoutubeId(url: string): string | null {
  if (!url) return null;
  // embed 주소 형식(https://www.youtube.com/embed/ID)도 파싱되도록 대응
  if (url.includes('/embed/')) {
    const parts = url.split('/embed/');
    if (parts[1]) {
      const cleanId = parts[1].split('?')[0];
      if (cleanId.length === 11) return cleanId;
    }
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function VideoDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { user, isLoaded } = useAuth();
  const { id: videoId } = React.use(params);

  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (videoId) {
      fetchVideoDetail();
      fetchComments();
    }
  }, [videoId]);

  const fetchVideoDetail = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', videoId)
        .single();

      if (error) throw error;
      setVideo(data);
    } catch (err: any) {
      console.error('영상을 불러오는 중 오류 발생:', err);
      alert('영상을 불러올 수 없거나 존재하지 않는 게시글입니다.');
      router.push('/solo/jam');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          users (
            nickname,
            name
          )
        `)
        .eq('post_id', videoId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (err: any) {
      console.error('댓글을 불러오는 중 오류 발생:', err);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }
    if (!newComment.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      setSubmittingComment(true);
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: videoId,
          user_id: user.id,
          content: newComment.trim(),
        });

      if (error) throw error;

      setNewComment('');
      fetchComments(); // 댓글 목록 갱신
    } catch (err: any) {
      console.error('댓글 등록 실패:', err);
      alert(`댓글 등록 중 오류가 발생했습니다: ${err.message}`);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleCommentDelete = async (commentId: string) => {
    if (!confirm('정말로 이 댓글을 삭제하시겠습니까?')) return;

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      alert('댓글이 삭제되었습니다.');
      fetchComments(); // 댓글 목록 갱신
    } catch (err: any) {
      console.error('댓글 삭제 실패:', err);
      alert(`댓글 삭제 중 오류가 발생했습니다: ${err.message}`);
    }
  };

  const handleVideoDelete = async () => {
    if (!confirm('정말로 이 영상을 삭제하시겠습니까?')) return;

    try {
      // 1. DB에서 게시글 삭제
      const { error: dbError } = await supabase
        .from('posts')
        .delete()
        .eq('id', videoId);

      if (dbError) throw dbError;

      // 2. Storage 에서 직접 파일인 경우 파일 삭제
      if (video?.video_url && video.video_url.includes('/storage/v1/object/public/videos/')) {
        const filePath = video.video_url.split('/public/videos/')[1];
        if (filePath) {
          await supabase.storage.from('videos').remove([filePath]);
        }
      }

      alert('영상이 정상적으로 삭제되었습니다.');
      router.push('/solo/jam');
    } catch (err: any) {
      alert(`삭제 중 오류 발생: ${err.message}`);
    }
  };

  if (loading || !isLoaded) {
    return (
      <div className="min-h-screen bg-[#0A103D] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm font-semibold">데이터를 불러오고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-[#0A103D] text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500 animate-bounce" />
          <p className="text-xl font-bold">영상을 찾을 수 없습니다.</p>
          <button 
            onClick={() => router.push('/solo/jam')}
            className="mt-6 px-6 py-2.5 bg-accent text-[#0A103D] font-bold rounded-xl"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const youtubeId = getYoutubeId(video.video_url);
  const isYoutube = !!youtubeId;

  return (
    <div className="min-h-screen bg-[#0A103D] text-white font-sans pb-24">
      {/* 상단 네비게이션 헤더 */}
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <button
          onClick={() => router.push('/solo/jam')}
          className="flex items-center gap-2 text-gray-400 hover:text-white font-semibold transition-colors duration-200 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>아티스트 영상 갤러리로 돌아가기</span>
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-4">
        {/* 대형 비디오 플레이어 영역 (넷플릭스 스타일) */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10 mb-8">
          {isYoutube ? (
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          ) : video.video_url ? (
            <video
              src={video.video_url}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <AlertCircle className="w-12 h-12 mb-2" />
              <span>비디오 경로를 확인할 수 없습니다.</span>
            </div>
          )}
        </div>

        {/* 비디오 상세 정보 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-white/5">
            <div>
              <span className={`inline-block text-[10px] font-black px-2.5 py-1 rounded shadow-md border mb-3 ${
                isYoutube 
                  ? 'bg-red-500 text-white border-red-400' 
                  : 'bg-accent text-[#0A103D] border-[#82C8FF]'
              }`}>
                {isYoutube ? 'YOUTUBE' : 'FILE'}
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">{video.title}</h1>
              <div className="flex items-center gap-4 text-xs text-gray-400 mt-3 font-semibold">
                <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-accent" /> {video.author}</span>
                <span>|</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(video.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {user && (user.id === video.author_id || (user.level ?? 0) >= UserLevel.LV5_ADMIN) && (
              <button
                onClick={handleVideoDelete}
                className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Trash2 className="w-4 h-4" />
                영상 삭제하기
              </button>
            )}
          </div>

          <div className="pt-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">연주 소개 및 코멘트</h3>
            <div className="bg-black/30 p-5 rounded-xl border border-white/5">
              <p className="text-base text-gray-200 leading-relaxed font-medium whitespace-pre-line">
                {video.content}
              </p>
            </div>
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
          <h2 className="text-xl font-black text-white mb-6 tracking-tight flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-accent" />
            이웃 댓글 ({comments.length}개)
          </h2>

          {/* 댓글 작성 폼 */}
          <form onSubmit={handleCommentSubmit} className="mb-8">
            {user ? (
              <div className="flex gap-3">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={`${user.nickname || user.name || '정회원'}님, 응원이나 감상평 댓글을 남겨보세요!`}
                  rows={2}
                  className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-accent focus:outline-none resize-none placeholder-gray-500 font-medium text-sm"
                />
                <button
                  type="submit"
                  disabled={submittingComment}
                  className="bg-accent text-[#0A103D] font-black px-5 rounded-xl hover:bg-[#82C8FF] transition-all flex items-center justify-center flex-shrink-0 cursor-pointer shadow-md"
                  aria-label="댓글 전송"
                >
                  {submittingComment ? (
                    <div className="w-5 h-5 border-2 border-[#0A103D] border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            ) : (
              <div className="bg-black/30 border border-white/10 rounded-xl p-5 text-center text-gray-400 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-sm font-semibold">로그인한 회원만 댓글을 달 수 있습니다.</span>
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="px-5 py-2 bg-accent text-[#0A103D] font-black text-xs rounded-lg hover:bg-[#82C8FF] transition-colors"
                >
                  로그인하러 가기
                </button>
              </div>
            )}
          </form>

          {/* 댓글 목록 */}
          {comments.length === 0 ? (
            <div className="text-center py-10 text-gray-500 border-t border-white/5">
              <p className="text-sm font-medium">아직 등록된 댓글이 없습니다.</p>
              <p className="text-xs mt-1">첫 번째 따뜻한 응원의 한 마디를 건네보세요!</p>
            </div>
          ) : (
            <div className="space-y-4 border-t border-white/5 pt-6">
              {comments.map((comment) => {
                const commentAuthor = comment.users?.nickname || comment.users?.name || '탈퇴한 회원';
                const isCommentOwner = user && user.id === comment.user_id;
                const isAdmin = user && (user.level ?? 0) >= UserLevel.LV5_ADMIN;

                return (
                  <div key={comment.id} className="bg-black/20 p-4 rounded-xl border border-white/5 flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-sm font-bold text-gray-200">{commentAuthor}</span>
                        <span className="text-[10px] text-gray-500">{new Date(comment.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed font-medium whitespace-pre-line">
                        {comment.content}
                      </p>
                    </div>

                    {(isCommentOwner || isAdmin) && (
                      <button
                        onClick={() => handleCommentDelete(comment.id)}
                        className="text-gray-500 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-white/5 flex-shrink-0"
                        title="댓글 삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
