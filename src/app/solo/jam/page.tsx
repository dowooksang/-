'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';
import { UserLevel } from '@/lib/store';
import { supabase } from '@/lib/supabaseClient';
import { Play, Music, X, Calendar, User, Trash2, Upload, Volume2 } from 'lucide-react';

export default function JamPage() {
  const { user, isLoaded } = useAuth();
  const [writeLevel, setWriteLevel] = useState<number | null>(null);
  const [tracks, setTracks] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // 업로드 폼 상태
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);

  // 카테고리별 쓰기 권한 등급 조회
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
          setWriteLevel(2); // fallback
        }
      } catch (err) {
        setWriteLevel(2);
      }
    };
    fetchWriteLevel();
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('category', 'jam')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setTracks(data);
      }
    } catch (err) {
      console.error('트랙을 불러오는 중 오류 발생:', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioFile || !title) {
      alert('제목과 음원 파일을 필수 입력해주세요.');
      return;
    }

    try {
      setIsUploading(true);

      // 1. 파일명 안전하게 가공 및 업로드 경로 설정
      const fileExt = audioFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `tracks/${fileName}`;

      // 2. Storage 'tracks' 버킷에 업로드
      const { data: storageData, error: uploadError } = await supabase.storage
        .from('tracks')
        .upload(filePath, audioFile);

      if (uploadError) {
        throw uploadError;
      }

      // 3. public URL 생성
      const { data: urlData } = supabase.storage
        .from('tracks')
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) {
        throw new Error('Public URL 획득에 실패했습니다.');
      }

      // 4. posts 테이블에 insert
      const { error: dbError } = await supabase
        .from('posts')
        .insert({
          title: title,
          content: description || '등록된 설명이 없습니다.',
          author: user?.nickname || user?.name || '익명',
          author_id: user?.id,
          category: 'jam',
          track_url: urlData.publicUrl,
        });

      if (dbError) {
        throw dbError;
      }

      alert('성공적으로 트랙이 업로드되었습니다!');
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      setAudioFile(null);
      fetchTracks(); // 목록 갱신
    } catch (error: any) {
      console.error('Track upload error:', error);
      alert(`업로드에 실패했습니다.\n사유: ${error.message}\n\n(Supabase SQL Editor에서 '20260616_setup_comments_and_tracks.sql' 스크립트가 실행되었는지 확인해주세요.)`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (trackId: string, trackUrl: string) => {
    if (!confirm('정말로 이 트랙을 삭제하시겠습니까?')) return;

    try {
      // 1. DB에서 삭제
      const { error: dbError } = await supabase
        .from('posts')
        .delete()
        .eq('id', trackId);

      if (dbError) throw dbError;

      // 2. Storage 에서 삭제 (url에서 경로 추출)
      if (trackUrl) {
        const filePath = trackUrl.split('/public/tracks/')[1];
        if (filePath) {
          await supabase.storage.from('tracks').remove([filePath]);
        }
      }

      alert('트랙이 정상적으로 삭제되었습니다.');
      fetchTracks();
    } catch (err: any) {
      alert(`삭제 중 오류 발생: ${err.message}`);
    }
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

  return (
    <div className="min-h-screen bg-[#0A103D] text-white">
      {/* 히어로 헤더 */}
      <div className="bg-gradient-to-r from-[#0D154A] via-[#1E2866] to-[#0D154A] py-20 text-center border-b border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-300 via-blue-900 to-black pointer-events-none"></div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight flex items-center justify-center gap-3">
          <Music className="w-10 h-10 text-accent animate-pulse" />
          방구석 릴레이 잼
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto px-6">
          집에서 연주한 음원 트랙을 올리고 다른 회원들과 온라인으로 자유롭게 음악 소통과 잼(Jam)을 나누어보세요.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Volume2 className="w-6 h-6 text-accent" />
              참여 트랙 리스트
            </h2>
            <p className="text-sm text-gray-400 mt-1">우리 동네 아티스트들의 멋진 오리지널 레코드</p>
          </div>
          
          {user && user.level !== undefined && user.level >= writeLevel ? (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-accent text-[#0A103D] font-black px-6 py-3 rounded-xl hover:bg-[#82C8FF] hover:-translate-y-[1px] transition-all shadow-[0_0_15px_rgba(130,200,255,0.3)] cursor-pointer flex items-center gap-2"
            >
              <Upload className="w-5 h-5" />
              트랙 올리기
            </button>
          ) : (
            <button 
              onClick={() => alert(`트랙 업로드는 ${targetLevelName} 이상부터 가능합니다.\n가입 승인을 기다려주세요.`)}
              className="bg-white/5 text-gray-400 font-bold px-6 py-3 rounded-xl border border-white/10 cursor-not-allowed flex items-center gap-2"
            >
              <Upload className="w-5 h-5" />
              트랙 올리기 ({targetLevelName})
            </button>
          )}
        </div>
        
        {tracks.length === 0 ? (
          <div className="bg-white/5 border-2 border-dashed border-white/10 rounded-2xl p-20 text-center text-gray-400">
            <Music className="w-14 h-14 mx-auto mb-4 text-gray-600" />
            <p className="text-lg font-bold">등록된 잼 트랙이 없습니다.</p>
            <p className="text-sm text-gray-500 mt-1.5">첫 번째 멋진 연주 음원 트랙의 주인공이 되어보세요!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tracks.map((track) => (
              <div 
                key={track.id} 
                className="bg-white/5 border border-white/10 hover:border-accent/40 rounded-2xl p-6 transition-all duration-300 backdrop-blur-md flex flex-col justify-between shadow-lg relative group"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-accent tracking-tight truncate pr-4">{track.title}</h3>
                    {user && (user.id === track.author_id || (user.level ?? 0) >= UserLevel.LV5_ADMIN) && (
                      <button 
                        onClick={() => handleDelete(track.id, track.track_url)}
                        className="text-gray-400 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-white/5"
                        title="트랙 삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <p className="text-sm text-gray-300 font-medium mb-6 line-clamp-3 bg-black/20 p-3.5 rounded-lg min-h-[72px]">
                    {track.content}
                  </p>
                </div>

                <div className="space-y-4">
                  {track.track_url ? (
                    <div className="bg-[#0D154A] p-2 rounded-xl border border-white/5">
                      <audio 
                        src={track.track_url} 
                        controls 
                        className="w-full h-8 custom-audio-player focus:outline-none"
                      />
                    </div>
                  ) : (
                    <div className="text-xs text-red-400 font-bold bg-red-500/10 p-2 rounded-lg text-center">
                      오디오 파일 경로에 오류가 있습니다.
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-400 border-t border-white/5 pt-3">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-accent" />
                      <span className="font-semibold text-gray-200">{track.author}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(track.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 업로드 모달 창 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-[#0D154A] border border-white/10 rounded-2xl w-full max-w-lg p-8 relative shadow-2xl">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-black text-white mb-6 tracking-tight flex items-center gap-2">
              <Upload className="w-6 h-6 text-accent" />
              신규 잼 트랙 업로드
            </h2>

            <form onSubmit={handleUploadSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">트랙 제목 *</label>
                <input 
                  type="text" 
                  required 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예: 강남지부 릴레이 드럼 베이스 잼"
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">설명 / 소개 *</label>
                <textarea 
                  required 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="곡 소개나 잼 참여를 유도하는 코멘트를 남겨주세요."
                  rows={4}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-accent focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">오디오 파일 (mp3, wav 등) *</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 hover:border-accent/50 rounded-xl cursor-pointer bg-black/20 hover:bg-black/30 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-xs text-gray-400 font-semibold">
                        {audioFile ? audioFile.name : '음악 파일 선택 (클릭 또는 드래그)'}
                      </p>
                    </div>
                    <input 
                      type="file" 
                      accept="audio/*"
                      onChange={handleFileChange}
                      required
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>

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
                  {isUploading ? '업로드 진행중...' : '음원 등록 완료'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
