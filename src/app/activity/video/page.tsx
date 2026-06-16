'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';
import { UserLevel } from '@/lib/store';
import { supabase } from '@/lib/supabaseClient';
import { Play, Plus, X, Calendar, User, Trash2, Upload, Loader2, Video } from 'lucide-react';

// YouTube 썸네일 추출 유틸리티 (ID 추출 후 고화질 썸네일 사용)
function getYouTubeThumbnail(url: string) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  const id = (match && match[2].length === 11) ? match[2] : null;
  return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : null;
}

// YouTube 비디오 ID 추출
function getYouTubeId(url: string) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default function VideoPage() {
  const { user, isLoaded } = useAuth();
  const [writeLevel, setWriteLevel] = useState<number | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // 업로드 폼 상태
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [uploadType, setUploadType] = useState<'youtube' | 'file'>('youtube'); // youtube or file
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // 모달 동영상 재생 상태
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  useEffect(() => {
    const fetchWriteLevel = async () => {
      try {
        const { data, error } = await supabase
          .from('board_permissions')
          .select('write_level')
          .eq('category', 'video')
          .single();
        if (!error && data) {
          setWriteLevel(data.write_level);
        } else {
          setWriteLevel(2); // fallback
        }
      } catch (err) {
        setWriteLevel(2);
      }
    };
    fetchWriteLevel();
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('category', 'video')
        .order('created_at', { ascending: false });
      if (!error && data) {
        setPosts(data);
      }
    } catch (err) {
      console.error('비디오 데이터를 불러오는 중 오류 발생:', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      alert('제목을 입력해주세요.');
      return;
    }

    try {
      setIsUploading(true);
      let finalVideoUrl = '';

      if (uploadType === 'youtube') {
        if (!youtubeUrl) {
          alert('YouTube 링크를 입력해주세요.');
          setIsUploading(false);
          return;
        }
        finalVideoUrl = youtubeUrl;
      } else {
        if (!videoFile) {
          alert('비디오 파일을 선택해주세요.');
          setIsUploading(false);
          return;
        }

        // 1. 파일명 가공 및 경로 설정
        const fileExt = videoFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `videos/${fileName}`;

        // 2. Storage 'videos' 버킷에 업로드
        const { data: storageData, error: uploadError } = await supabase.storage
          .from('videos')
          .upload(filePath, videoFile);

        if (uploadError) {
          throw uploadError;
        }

        // 3. public URL 생성
        const { data: urlData } = supabase.storage
          .from('videos')
          .getPublicUrl(filePath);

        if (!urlData?.publicUrl) {
          throw new Error('Public URL 획득에 실패했습니다.');
        }

        finalVideoUrl = urlData.publicUrl;
      }

      // 4. posts 테이블에 insert
      const { error: dbError } = await supabase
        .from('posts')
        .insert({
          title: title,
          content: content || '등록된 내용이 없습니다.',
          author: user?.nickname || user?.name || '익명',
          author_id: user?.id,
          category: 'video',
          video_url: finalVideoUrl,
        });

      if (dbError) {
        throw dbError;
      }

      alert('성공적으로 영상이 등록되었습니다!');
      setIsModalOpen(false);
      setTitle('');
      setContent('');
      setYoutubeUrl('');
      setVideoFile(null);
      fetchPosts();
    } catch (err: any) {
      console.error('Video upload error:', err);
      alert(`영상 등록 실패: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (postId: string, videoUrl: string) => {
    if (!confirm('정말로 이 영상을 삭제하시겠습니까?')) return;

    try {
      const { error: dbError } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (dbError) throw dbError;

      // Storage 에 저장된 파일인 경우 삭제 처리
      if (videoUrl && videoUrl.includes('/public/videos/')) {
        const filePath = videoUrl.split('/public/videos/')[1];
        if (filePath) {
          await supabase.storage.from('videos').remove([filePath]);
        }
      }

      alert('삭제되었습니다.');
      fetchPosts();
    } catch (err: any) {
      alert(`삭제 중 오류 발생: ${err.message}`);
    }
  };

  const playVideo = (url: string) => {
    setActiveVideoUrl(url);
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    setActiveVideoUrl(null);
  };

  if (!isLoaded || writeLevel === null) return <div className="py-20 text-center text-white">로딩 중...</div>;

  const levelNames: Record<number, string> = {
    1: '준회원 (LV1)',
    2: '정회원 (LV2)',
    3: '우수회원 (LV3)',
    4: '지부장급 (LV4)',
    5: '관리자 (LV5)',
    6: '최고관리자 (LV6)'
  };
  const targetLevelName = levelNames[writeLevel] || '정회원 (LV2)';

  // YouTube 와 직접 업로드 썸네일 분기 판정
  const getThumbnail = (url: string) => {
    if (url.includes('youtu.be') || url.includes('youtube.com')) {
      return getYouTubeThumbnail(url);
    }
    return null; // 직접 비디오 파일은 html video 태그로 직접 렌더하거나 기본 플레이 아이콘 노출
  };

  return (
    <div className="min-h-screen bg-[#0A103D] text-white">
      {/* 히어로 배너 */}
      <div className="bg-gradient-to-r from-[#0D154A] via-[#1E2866] to-[#0D154A] py-20 text-center border-b border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-300 via-blue-900 to-black pointer-events-none"></div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight flex items-center justify-center gap-3">
          <Play className="w-10 h-10 text-accent animate-pulse" />
          공연영상
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto px-6">
          연합회 회원분들의 뜨거운 무대 실황과 직장인밴드 공연 영상을 감상해보세요.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">최신 무대 영상</h2>
            <p className="text-sm text-gray-400 mt-1">현장감 넘치는 우리 동네 뮤지션들의 영상 리스트</p>
          </div>

          {user && user.level !== undefined && user.level >= writeLevel ? (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-accent text-[#0A103D] font-black px-6 py-3 rounded-xl hover:bg-[#82C8FF] hover:-translate-y-[1px] transition-all shadow-[0_0_15px_rgba(130,200,255,0.3)] cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              영상 올리기
            </button>
          ) : (
            <button 
              onClick={() => alert(`영상 업로드는 ${targetLevelName} 이상부터 가능합니다.\n가입 승인을 기다려주세요.`)}
              className="bg-white/5 text-gray-400 font-bold px-6 py-3 rounded-xl border border-white/10 cursor-not-allowed flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              영상 올리기 ({targetLevelName})
            </button>
          )}
        </div>

        {posts.length === 0 ? (
          <div className="bg-white/5 border-2 border-dashed border-white/10 rounded-2xl p-20 text-center text-gray-400">
            <Video className="w-14 h-14 mx-auto mb-4 text-gray-600" />
            <p className="text-lg font-bold">등록된 공연 영상이 없습니다.</p>
            <p className="text-sm text-gray-500 mt-1.5">첫 번째 멋진 무대를 영상으로 공유해 보세요!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              const ytThumbnail = getThumbnail(post.video_url || '');
              const isYt = post.video_url && (post.video_url.includes('youtu.be') || post.video_url.includes('youtube.com'));

              return (
                <div 
                  key={post.id} 
                  className="bg-[#111827] border border-white/10 hover:border-accent/40 rounded-2xl overflow-hidden transition-all duration-300 backdrop-blur-md flex flex-col justify-between shadow-lg group"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-black flex items-center justify-center border-b border-white/5">
                    {isYt && ytThumbnail ? (
                      <img 
                        src={ytThumbnail} 
                        alt={post.title} 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-black/40 text-gray-500 group-hover:text-accent transition-colors">
                        <Video className="w-12 h-12 mb-2" />
                        <span className="text-xs font-semibold">동영상 파일 재생</span>
                      </div>
                    )}
                    
                    <button 
                      onClick={() => playVideo(post.video_url)}
                      className="absolute inset-0 flex items-center justify-center z-10 bg-black/10 hover:bg-black/30 transition-colors"
                    >
                      <div className="w-14 h-14 rounded-full bg-accent/90 text-[#0A103D] flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-300">
                        <Play className="w-6 h-6 ml-1 text-[#0A103D]" fill="currentColor" />
                      </div>
                    </button>

                    {user && (user.id === post.author_id || (user.level ?? 0) >= UserLevel.LV5_ADMIN) && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(post.id, post.video_url);
                        }}
                        className="absolute top-3 right-3 bg-black/60 hover:bg-red-600 text-white hover:text-white p-2 rounded-xl transition-colors z-20 shadow-lg"
                        title="영상 삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-accent transition-colors truncate">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-300 font-medium line-clamp-3 bg-black/20 p-3 rounded-lg min-h-[64px] mb-4">
                        {post.content}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-400 border-t border-white/5 pt-4">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-accent" />
                        <span className="font-semibold text-gray-200">{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 영상 업로드 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#0D154A] border border-white/10 rounded-2xl w-full max-w-lg p-8 relative shadow-2xl">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-black text-white mb-6 tracking-tight flex items-center gap-2">
              <Upload className="w-6 h-6 text-accent" />
              신규 영상 업로드
            </h2>

            {/* 업로드 방식 탭 */}
            <div className="flex bg-black/20 border border-white/10 p-1 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => setUploadType('youtube')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${uploadType === 'youtube' ? 'bg-accent text-[#0A103D]' : 'text-gray-400 hover:text-white'}`}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.387.511a3.002 3.002 0 0 0-2.11 2.107C0 8.053 0 12 0 12s0 3.947.503 5.837a3.002 3.002 0 0 0 2.11 2.107c1.882.511 9.387.511 9.387.511s7.505 0 9.387-.511a3.002 3.002 0 0 0 2.11-2.107c.503-1.89.503-5.837.503-5.837s0-3.947-.503-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                YouTube 연동
              </button>
              <button
                type="button"
                onClick={() => setUploadType('file')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${uploadType === 'file' ? 'bg-accent text-[#0A103D]' : 'text-gray-400 hover:text-white'}`}
              >
                <Video className="w-4 h-4" />
                직접 파일 업로드
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">제목 *</label>
                <input 
                  type="text" 
                  required 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예: 2026 홍대 연합 페스티벌 메인 스테이지 연주"
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">공연 설명 *</label>
                <textarea 
                  required 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="공연 곡 목록, 무대 뒤 코멘트 등을 기재해 주세요."
                  rows={3}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-accent focus:outline-none resize-none"
                />
              </div>

              {uploadType === 'youtube' ? (
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">YouTube 비디오 URL *</label>
                  <input 
                    type="url" 
                    required={uploadType === 'youtube'}
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-accent focus:outline-none"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">동영상 파일 (mp4, mov 등) *</label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 hover:border-accent/50 rounded-xl cursor-pointer bg-black/20 hover:bg-black/30 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {isUploading ? (
                          <Loader2 className="w-8 h-8 text-accent animate-spin mb-2" />
                        ) : (
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        )}
                        <p className="text-xs text-gray-400 font-semibold">
                          {videoFile ? videoFile.name : '동영상 파일 선택 (클릭 또는 드래그)'}
                        </p>
                      </div>
                      <input 
                        type="file" 
                        accept="video/*"
                        onChange={handleFileChange}
                        required={uploadType === 'file'}
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-end gap-3.5 border-t border-white/10">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isUploading}
                  className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-gray-300 hover:bg-white/10 transition-all"
                >
                  취소
                </button>
                <button 
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-2.5 bg-accent text-[#0A103D] rounded-xl text-sm font-black hover:bg-[#82C8FF] transition-all disabled:opacity-50 flex items-center gap-2 shadow-md"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>업로드 진행중...</span>
                    </>
                  ) : (
                    <span>영상 등록 완료</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 동영상 재생 모달 */}
      {isVideoModalOpen && activeVideoUrl && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <button 
              onClick={closeVideoModal}
              className="absolute top-4 right-4 bg-black/60 hover:bg-white/10 text-white p-2.5 rounded-full transition-colors z-20"
              title="닫기"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="aspect-video w-full">
              {activeVideoUrl.includes('youtu.be') || activeVideoUrl.includes('youtube.com') ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${getYouTubeId(activeVideoUrl)}?autoplay=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              ) : (
                <video
                  src={activeVideoUrl}
                  controls
                  autoPlay
                  className="w-full h-full"
                ></video>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
