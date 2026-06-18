'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';
import { UserLevel } from '@/lib/store';
import { supabase } from '@/lib/supabaseClient';
import { Play, X, Calendar, User, Trash2, Upload, Video, Link2, Film, Sparkles, AlertCircle } from 'lucide-react';
import Image from 'next/image';

/** 유튜브 URL에서 11자리 비디오 ID 추출하는 정규식 헬퍼 */
function getYoutubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export default function JamPage() {
  const { user, isLoaded } = useAuth();
  const [writeLevel, setWriteLevel] = useState<number | null>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  
  // 업로드 관련 상태
  const [uploadType, setUploadType] = useState<'youtube' | 'direct'>('youtube');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // 카테고리별 쓰기 권한 등급 조회 및 영상 목록 패치
  useEffect(() => {
    const fetchWriteLevel = async () => {
      try {
        const { data, error } = await supabase
          .from('board_permissions')
          .select('write_level')
          .eq('category', 'jam')
          .single();
        if (!error && data) {
          setWriteLevel(data.write_level);
        } else {
          setWriteLevel(2); // 기본값: 정회원(LV2)
        }
      } catch (err) {
        setWriteLevel(2);
      }
    };
    fetchWriteLevel();
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('category', 'jam')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setVideos(data);
      }
    } catch (err) {
      console.error('영상을 불러오는 중 오류 발생:', err);
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

    if (uploadType === 'youtube' && !youtubeUrl) {
      alert('유튜브 영상 URL을 입력해주세요.');
      return;
    }

    if (uploadType === 'direct' && !videoFile) {
      alert('자체 업로드할 동영상 파일을 선택해주세요.');
      return;
    }

    try {
      setIsUploading(true);
      let finalVideoUrl = '';

      if (uploadType === 'youtube') {
        const videoId = getYoutubeId(youtubeUrl);
        if (!videoId) {
          alert('올바른 유튜브 주소가 아닙니다. 주소를 다시 확인해 주세요.');
          setIsUploading(false);
          return;
        }
        finalVideoUrl = `https://www.youtube.com/embed/${videoId}`;
      } else if (uploadType === 'direct' && videoFile) {
        // 1. 파일명 안전 가공 및 업로드 경로 설정
        const fileExt = videoFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `videos/${fileName}`;

        // 2. Storage 'videos' 버킷에 업로드
        const { error: uploadError } = await supabase.storage
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

      // posts 테이블에 insert
      const { error: dbError } = await supabase
        .from('posts')
        .insert({
          title: title,
          content: description || '등록된 한줄평이 없습니다.',
          author: user?.nickname || user?.name || '익명',
          author_id: user?.id,
          category: 'jam',
          video_url: finalVideoUrl,
          board_type: 'general', // 일반 글판
        });

      if (dbError) {
        throw dbError;
      }

      alert('성공적으로 영상이 등록되었습니다!');
      setIsUploadModalOpen(false);
      resetForm();
      fetchVideos();
    } catch (error: any) {
      console.error('Video upload error:', error);
      alert(`업로드 실패: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setYoutubeUrl('');
    setVideoFile(null);
    setUploadType('youtube');
  };

  const handleDelete = async (e: React.MouseEvent, videoId: string, videoUrl: string) => {
    e.stopPropagation(); // 카드 클릭 이벤트 차단
    if (!confirm('정말로 이 영상을 삭제하시겠습니까?')) return;

    try {
      // 1. DB에서 삭제
      const { error: dbError } = await supabase
        .from('posts')
        .delete()
        .eq('id', videoId);

      if (dbError) throw dbError;

      // 2. Storage 에서 직접 파일인 경우 삭제 진행
      if (videoUrl && videoUrl.includes('/storage/v1/object/public/videos/')) {
        const filePath = videoUrl.split('/public/videos/')[1];
        if (filePath) {
          await supabase.storage.from('videos').remove([filePath]);
        }
      }

      alert('영상이 정상적으로 삭제되었습니다.');
      fetchVideos();
      if (selectedVideo?.id === videoId) {
        setIsPlayerModalOpen(false);
      }
    } catch (err: any) {
      alert(`삭제 중 오류 발생: ${err.message}`);
    }
  };

  const openPlayer = (video: any) => {
    setSelectedVideo(video);
    setIsPlayerModalOpen(true);
  };

  if (!isLoaded || writeLevel === null) {
    return (
      <div className="min-h-screen bg-[#0A103D] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm font-semibold">동영상 데이터를 불러오고 있습니다...</p>
        </div>
      </div>
    );
  }

  const levelNames: Record<number, string> = {
    1: '준회원 (LV1)',
    2: '정회원 (LV2)',
    3: '우수회원 (LV3)',
    4: '지부장급 (LV4)',
    5: '관리자 (LV5)',
    6: '최고관리자 (LV6)'
  };
  const targetLevelName = levelNames[writeLevel] || '정회원 (LV2)';

  return (
    <div className="min-h-screen bg-[#0A103D] text-white font-sans">
      {/* 히어로 헤더 Section */}
      <div className="bg-gradient-to-b from-[#0D154A] via-[#111A5C] to-[#0A103D] py-24 text-center border-b border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-400 via-blue-900 to-black pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-accent/15 text-accent font-black text-xs tracking-widest uppercase border border-accent/20 mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            SHOW YOUR MUSIC
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 text-balance leading-none">
            방구석에선 내가 왕 ㅋㅋ 🎸
          </h1>
          <p className="text-base md:text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed text-pretty">
            초보 아티스트도 부담 제로! 방구석에서 튕겨보는 감성 일렉, 화려한 드럼, 소박한 어쿠스틱까지 여러분의 모든 연주 영상을 뽐내는 영상 특화 보드입니다.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* 상단 컨트롤 바 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12 border-b border-white/5 pb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Film className="w-7 h-7 text-accent" />
              아티스트 영상 갤러리
            </h2>
            <p className="text-sm text-gray-400 mt-1.5 font-medium">이웃 연주자들의 열정 가득한 연주를 감상해 보세요.</p>
          </div>
          
          {user && user.level !== undefined && user.level >= writeLevel ? (
            <button 
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-accent text-[#0A103D] font-black px-7 py-3.5 rounded-xl hover:bg-[#82C8FF] hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-[0_4px_20px_rgba(130,200,255,0.4)] cursor-pointer flex items-center gap-2"
            >
              <Upload className="w-5 h-5 stroke-[2.5]" />
              영상 업로드하기
            </button>
          ) : (
            <button 
              onClick={() => alert(`영상 업로드는 ${targetLevelName} 이상부터 가능합니다.\n가입 승인 또는 등급업을 기다려주세요.`)}
              className="bg-white/5 text-gray-400 font-bold px-6 py-3.5 rounded-xl border border-white/10 cursor-not-allowed flex items-center gap-2"
            >
              <Upload className="w-5 h-5" />
              영상 업로드 ({targetLevelName})
            </button>
          )}
        </div>
        
        {/* 영상 카드 그리드 목록 */}
        {videos.length === 0 ? (
          <div className="bg-white/5 border-2 border-dashed border-white/10 rounded-3xl py-24 text-center text-gray-400 max-w-4xl mx-auto">
            <Video className="w-16 h-16 mx-auto mb-4 text-gray-600 animate-bounce" />
            <p className="text-xl font-bold text-gray-300">등록된 영상이 없습니다.</p>
            <p className="text-sm text-gray-500 mt-2">첫 번째로 방구석 음악 대장의 위엄을 보여주세요!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {videos.map((video) => {
              const youtubeId = getYoutubeId(video.video_url);
              const isYoutube = !!youtubeId;
              const thumbUrl = isYoutube 
                ? `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`
                : null;

              return (
                <div 
                  key={video.id} 
                  onClick={() => openPlayer(video)}
                  className="bg-white/5 border border-white/10 hover:border-accent/40 rounded-2xl overflow-hidden transition-all duration-300 backdrop-blur-md flex flex-col shadow-xl cursor-pointer group hover:shadow-[0_8px_30px_rgba(130,200,255,0.15)] relative"
                >
                  {/* 카드 썸네일 영역 */}
                  <div className="relative aspect-video w-full overflow-hidden bg-black/40 border-b border-white/5">
                    {isYoutube && thumbUrl ? (
                      <img 
                        src={thumbUrl} 
                        alt={video.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : video.video_url ? (
                      <div className="w-full h-full relative flex items-center justify-center">
                        <video 
                          src={video.video_url} 
                          preload="metadata" 
                          muted 
                          className="w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <Film className="w-10 h-10 text-white/50 group-hover:scale-110 transition-transform" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-900">
                        <Video className="w-10 h-10 text-gray-600" />
                      </div>
                    )}

                    {/* 재생 배지 아이콘 및 글래스모피즘 오버레이 */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                      <div className="w-14 h-14 rounded-full bg-accent text-[#0A103D] flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                        <Play className="w-6 h-6 fill-current ml-1" />
                      </div>
                    </div>

                    {/* 영상 제공 방식 배지 (유튜브 / 파일 직접) */}
                    <span className={`absolute top-3 left-3 z-20 text-[10px] font-black px-2.5 py-1 rounded shadow-md border ${
                      isYoutube 
                        ? 'bg-red-500 text-white border-red-400' 
                        : 'bg-accent text-[#0A103D] border-[#82C8FF]'
                    }`}>
                      {isYoutube ? 'YOUTUBE' : 'FILE'}
                    </span>
                  </div>

                  {/* 카드 텍스트 정보 영역 */}
                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-accent transition-colors truncate">
                          {video.title}
                        </h3>
                        {user && (user.id === video.author_id || (user.level ?? 0) >= UserLevel.LV5_ADMIN) && (
                          <button 
                            onClick={(e) => handleDelete(e, video.id, video.video_url)}
                            className="text-gray-400 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-white/5 flex-shrink-0"
                            title="영상 삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <p className="text-sm text-gray-300 font-medium line-clamp-2 bg-black/20 p-3.5 rounded-lg min-h-[56px] mb-4">
                        {video.content}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-400 border-t border-white/5 pt-4 mt-auto">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-accent" />
                        <span className="font-semibold text-gray-200">{video.author}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(video.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 업로드 등록 모달 창 */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-[#0D154A] border border-white/10 rounded-2xl w-full max-w-lg p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => { setIsUploadModalOpen(false); resetForm(); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-black text-white mb-6 tracking-tight flex items-center gap-2">
              <Upload className="w-6 h-6 text-accent" />
              나의 자랑 영상 올리기
            </h2>

            {/* 업로드 유형 탭 */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => setUploadType('youtube')}
                className={`py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  uploadType === 'youtube' 
                    ? 'bg-accent text-[#0A103D] shadow-sm' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Link2 className="w-4 h-4" />
                유튜브 링크 연동
              </button>
              <button
                type="button"
                onClick={() => setUploadType('direct')}
                className={`py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  uploadType === 'direct' 
                    ? 'bg-accent text-[#0A103D] shadow-sm' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Video className="w-4 h-4" />
                동영상 직접 업로드
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">연주 영상 제목 *</label>
                <input 
                  type="text" 
                  required 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예: 방구석 메탈기타 솔로 연주! (초보입니다)"
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-accent focus:outline-none placeholder-gray-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">연주 한줄평 / 설명</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="연주한 장비나 소감 한줄을 동네 이웃들에게 들려주세요."
                  rows={3}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-accent focus:outline-none resize-none placeholder-gray-500 font-medium"
                />
              </div>

              {uploadType === 'youtube' ? (
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">유튜브 URL 입력 *</label>
                  <input 
                    type="url" 
                    required 
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-accent focus:outline-none placeholder-gray-500 font-medium"
                  />
                  <span className="text-[11px] text-gray-400 mt-2 block leading-relaxed flex items-start gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-accent flex-shrink-0 mt-0.5" />
                    유튜브 영상 상세화면 상단 주소창이나 공유하기 버튼의 주소를 통째로 붙여넣으시면 됩니다.
                  </span>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">자체 영상 파일 업로드 (MP4, MOV 등) *</label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-white/10 hover:border-accent/40 rounded-xl cursor-pointer bg-black/20 hover:bg-black/30 transition-all">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-xs text-gray-300 font-semibold mb-1">
                          {videoFile ? videoFile.name : '동영상 파일 선택 (클릭 또는 드래그)'}
                        </p>
                        <p className="text-[10px] text-gray-500">MP4, MOV, WEBM 등의 포맷을 지원합니다.</p>
                      </div>
                      <input 
                        type="file" 
                        accept="video/*"
                        onChange={handleFileChange}
                        required
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>
              )}

              <div className="pt-6 flex justify-end gap-3 border-t border-white/10 mt-6">
                <button 
                  type="button"
                  onClick={() => { setIsUploadModalOpen(false); resetForm(); }}
                  disabled={isUploading}
                  className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-gray-300 hover:bg-white/10 transition-all cursor-pointer"
                >
                  취소
                </button>
                <button 
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-2.5 bg-accent text-[#0A103D] rounded-xl text-sm font-black hover:bg-[#82C8FF] transition-all disabled:opacity-50 flex items-center gap-2 shadow-md cursor-pointer"
                >
                  {isUploading ? '영상 업로드 중...' : '영상 등록 완료'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 비디오 재생 모달 창 */}
      {isPlayerModalOpen && selectedVideo && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-[#0D154A] border border-white/10 rounded-2xl w-full max-w-4xl overflow-hidden relative shadow-2xl">
            <button 
              onClick={() => setIsPlayerModalOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-accent transition-colors p-2 rounded-full bg-black/60 backdrop-blur-md hover:scale-105 z-50 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* 비디오 플레이어 영역 */}
            <div className="relative aspect-video w-full bg-black">
              {selectedVideo.video_url && selectedVideo.video_url.includes('youtube.com/embed') ? (
                <iframe
                  src={`${selectedVideo.video_url}?autoplay=1`}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              ) : selectedVideo.video_url ? (
                <video 
                  src={selectedVideo.video_url} 
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

            {/* 비디오 하단 텍스트 정보 */}
            <div className="p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-4 border-b border-white/5">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">{selectedVideo.title}</h2>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-2">
                    <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-accent" /> {selectedVideo.author}</span>
                    <span>|</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(selectedVideo.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {user && (user.id === selectedVideo.author_id || (user.level ?? 0) >= UserLevel.LV5_ADMIN) && (
                  <button 
                    onClick={(e) => handleDelete(e, selectedVideo.id, selectedVideo.video_url)}
                    className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    삭제하기
                  </button>
                )}
              </div>

              <div className="bg-black/30 p-4.5 rounded-xl border border-white/5">
                <p className="text-sm text-gray-200 leading-relaxed font-medium whitespace-pre-line">
                  {selectedVideo.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
