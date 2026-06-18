'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';
import { UserLevel } from '@/lib/store';
import { supabase } from '@/lib/supabaseClient';
import { Image as ImageIcon, Plus, X, Calendar, User, Trash2, Upload, Loader2 } from 'lucide-react';

export default function GalleryPage() {
  const { user, isLoaded } = useAuth();
  const [writeLevel, setWriteLevel] = useState<number | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // 업로드 폼 상태
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchWriteLevel = async () => {
      try {
        const { data, error } = await supabase
          .from('board_permissions')
          .select('write_level')
          .eq('category', 'gallery')
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
        .eq('category', 'gallery')
        .order('created_at', { ascending: false });
      if (!error && data) {
        setPosts(data);
      }
    } catch (err) {
      console.error('갤러리 데이터를 불러오는 중 오류 발생:', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile || !title) {
      alert('제목과 사진 파일을 입력해주세요.');
      return;
    }

    try {
      setIsUploading(true);

      // 1. 파일명 가공 및 경로 설정
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      // 2. Storage 'images' 버킷에 업로드
      const { data: storageData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, imageFile);

      if (uploadError) {
        throw uploadError;
      }

      // 3. public URL 생성
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) {
        throw new Error('Public URL 획득에 실패했습니다.');
      }

      // 4. posts 테이블에 insert
      const { error: dbError } = await supabase
        .from('posts')
        .insert({
          title: title,
          content: content || '등록된 내용이 없습니다.',
          author: user?.nickname || user?.name || '익명',
          author_id: user?.id,
          category: 'gallery',
          image_url: urlData.publicUrl,
        });

      if (dbError) {
        throw dbError;
      }

      alert('성공적으로 사진이 업로드되었습니다!');
      setIsModalOpen(false);
      setTitle('');
      setContent('');
      setImageFile(null);
      fetchPosts();
    } catch (err: any) {
      console.error('Gallery upload error:', err);
      alert(`업로드 실패: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (postId: string, imageUrl: string) => {
    if (!confirm('정말로 이 게시물을 삭제하시겠습니까?')) return;

    try {
      const { error: dbError } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (dbError) throw dbError;

      if (imageUrl) {
        const filePath = imageUrl.split('/public/images/')[1];
        if (filePath) {
          await supabase.storage.from('images').remove([filePath]);
        }
      }

      alert('삭제되었습니다.');
      fetchPosts();
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
      {/* 히어로 배너 */}
      <div className="bg-gradient-to-r from-[#0D154A] via-[#1E2866] to-[#0D154A] py-20 text-center border-b border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-300 via-blue-900 to-black pointer-events-none"></div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight flex items-center justify-center gap-3">
          <ImageIcon className="w-10 h-10 text-accent animate-pulse" />
          활동갤러리
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto px-6">
          연합회와 각 지부의 생생한 행사 현장 및 축제 사진들을 감상해보세요.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">현장 기록 사진</h2>
            <p className="text-sm text-gray-400 mt-1">회원들이 공유한 아름다운 추억의 갤러리</p>
          </div>

          {user && user.level !== undefined && user.level >= writeLevel ? (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-accent text-[#0A103D] font-black px-6 py-3 rounded-xl hover:bg-[#82C8FF] hover:-translate-y-[1px] transition-all shadow-[0_0_15px_rgba(130,200,255,0.3)] cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              사진 올리기
            </button>
          ) : (
            <button 
              onClick={() => alert(`사진 업로드는 ${targetLevelName} 이상부터 가능합니다.\n가입 승인을 기다려주세요.`)}
              className="bg-white/5 text-gray-400 font-bold px-6 py-3 rounded-xl border border-white/10 cursor-not-allowed flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              사진 올리기 ({targetLevelName})
            </button>
          )}
        </div>

        {posts.length === 0 ? (
          <div className="bg-white/5 border-2 border-dashed border-white/10 rounded-2xl p-20 text-center text-gray-400">
            <ImageIcon className="w-14 h-14 mx-auto mb-4 text-gray-600" />
            <p className="text-lg font-bold">등록된 활동 사진이 없습니다.</p>
            <p className="text-sm text-gray-500 mt-1.5">첫 번째 멋진 추억을 갤러리에 기록해 보세요!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div 
                key={post.id} 
                className="bg-white/5 border border-white/10 hover:border-accent/40 rounded-2xl overflow-hidden transition-all duration-300 backdrop-blur-md flex flex-col justify-between shadow-lg group"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-black flex items-center justify-center border-b border-white/5">
                  <img 
                    src={post.image_url} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {user && (user.id === post.author_id || (user.level ?? 0) >= UserLevel.LV5_ADMIN) && (
                    <button 
                      onClick={() => handleDelete(post.id, post.image_url)}
                      className="absolute top-3 right-3 bg-black/60 hover:bg-red-600 text-white hover:text-white p-2 rounded-xl transition-colors z-10 shadow-lg"
                      title="사진 삭제"
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
                      <span className="font-semibold text-gray-200">{post.author_id ? post.author : '알 수 없음'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 사진 업로드 모달 */}
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
              신규 사진 업로드
            </h2>

            <form onSubmit={handleUploadSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">제목 *</label>
                <input 
                  type="text" 
                  required 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예: 2026 연합 정기 연주회 단체 촬영"
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">행사 설명 *</label>
                <textarea 
                  required 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="사진 촬영 현장 정보나 참여 팀 소개를 남겨주세요."
                  rows={4}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-accent focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">사진 파일 (png, jpg 등) *</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 hover:border-accent/50 rounded-xl cursor-pointer bg-black/20 hover:bg-black/30 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {isUploading ? (
                        <Loader2 className="w-8 h-8 text-accent animate-spin mb-2" />
                      ) : (
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      )}
                      <p className="text-xs text-gray-400 font-semibold">
                        {imageFile ? imageFile.name : '사진 파일 선택 (클릭 또는 드래그)'}
                      </p>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*"
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
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>업로드 진행중...</span>
                    </>
                  ) : (
                    <span>사진 등록 완료</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
