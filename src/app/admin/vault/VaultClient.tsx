'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { 
  ShieldAlert, Save, FileText, Download, Trash2, 
  UploadCloud, Key, RefreshCw, X, FileUp, CheckCircle, Database
} from 'lucide-react';

interface VaultClientProps {
  currentUser: {
    id: string;
    email: string;
    nickname?: string;
    name?: string;
    level: number;
  } | null;
}

export default function VaultClient({ currentUser }: VaultClientProps) {
  // --- 비밀 메모 관련 State ---
  const [memoText, setMemoText] = useState('');
  const [isMemoLoading, setIsMemoLoading] = useState(true);
  const [isMemoSaving, setIsMemoSaving] = useState(false);

  // --- 보관함 파일 관련 State ---
  const [files, setFiles] = useState<any[]>([]);
  const [isFileLoading, setIsFileLoading] = useState(true);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // --- UI 피드백 State ---
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // --- 비밀 메모 다운로드 (Storage 연동) ---
  const fetchSecureMemo = async () => {
    try {
      setIsMemoLoading(true);
      const { data, error } = await supabase.storage
        .from('ceo-vault')
        .download('secure_note.txt');

      if (error) {
        if (error.message.includes('Object not found') || (error as any).status === 404) {
          // 파일이 아직 없는 경우 초기값 설정
          setMemoText('');
        } else {
          console.error('메모 로드 에러:', error);
        }
      } else if (data) {
        const text = await data.text();
        setMemoText(text);
      }
    } catch (e) {
      console.error('비밀 메모 조회 중 오류:', e);
    } finally {
      setIsMemoLoading(false);
    }
  };

  // --- 보관 파일 목록 조회 (Storage 연동) ---
  const fetchVaultFiles = useCallback(async () => {
    try {
      setIsFileLoading(true);
      const { data, error } = await supabase.storage
        .from('ceo-vault')
        .list('', {
          limit: 100,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (!error && data) {
        // secure_note.txt는 메모장에서 따로 다루므로 파일 목록에서 제외
        setFiles(data.filter(f => f.name !== 'secure_note.txt'));
      } else if (error) {
        console.error('파일 목록 조회 에러:', error);
      }
    } catch (e) {
      console.error('파일 조회 오류:', e);
    } finally {
      setIsFileLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSecureMemo();
    fetchVaultFiles();
  }, [fetchVaultFiles]);

  // --- 비밀 메모 저장 (Storage 연동) ---
  const handleSaveMemo = async () => {
    if (!currentUser) return;
    setIsMemoSaving(true);
    setSaveStatus('saving');

    try {
      const file = new File([memoText], 'secure_note.txt', { type: 'text/plain;charset=utf-8' });
      const { error } = await supabase.storage
        .from('ceo-vault')
        .upload('secure_note.txt', file, { upsert: true });

      if (error) throw error;
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (e: any) {
      alert(`메모 저장 실패: ${e.message}`);
      setSaveStatus('idle');
    } finally {
      setIsMemoSaving(false);
    }
  };

  // --- 파일 업로드 (Storage 연동) ---
  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !currentUser) return;

    setIsUploading(true);
    try {
      // 파일 이름 인코딩 이슈를 예방하기 위해 안전하게 명명하거나 그대로 업로드
      const { error } = await supabase.storage
        .from('ceo-vault')
        .upload(uploadFile.name, uploadFile, { upsert: true });

      if (error) throw error;

      setUploadFile(null);
      fetchVaultFiles();
      alert('중요 문서가 안전하게 업로드 및 암호화 보관되었습니다.');
    } catch (e: any) {
      alert(`업로드 실패: ${e.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // --- 파일 다운로드 (Signed URL 발급 연동) ---
  const handleFileDownload = async (fileName: string) => {
    try {
      // 60초 유효한 다운로드 서명 링크 생성
      const { data, error } = await supabase.storage
        .from('ceo-vault')
        .createSignedUrl(fileName, 60);

      if (error || !data?.signedUrl) {
        throw new Error(error?.message || '다운로드 링크 생성 실패');
      }

      // Signed URL을 통한 안전한 임시 브라우저 다운로드 트레이
      const link = document.createElement('a');
      link.href = data.signedUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e: any) {
      alert(`다운로드 실패: ${e.message}`);
    }
  };

  // --- 파일 파기 (Storage 연동) ---
  const handleFileDelete = async (fileName: string) => {
    if (!confirm('이 중요 백업 파일을 금고에서 영구 파기하시겠습니까? 복구할 수 없습니다.')) return;

    try {
      const { error } = await supabase.storage
        .from('ceo-vault')
        .remove([fileName]);

      if (error) throw error;
      fetchVaultFiles();
      alert('파일이 완전히 영구 삭제되었습니다.');
    } catch (e: any) {
      alert(`삭제 실패: ${e.message}`);
    }
  };

  // --- 바이트 크기 포맷팅 헬퍼 ---
  const formatBytes = (bytes: number, decimals = 2) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-[#050508] min-h-screen text-[#f1f1f7] font-sans pb-20">
      {/* CEO Vault Premium Header (Deep Black & Gold Style) */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#130f05] via-[#08080c] to-[#050508] border-b border-amber-500/20 py-16 px-8 shadow-2xl">
        {/* Glowing backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-amber-500/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-amber-950/40 border-2 border-amber-500/80 rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.25)]">
              <Key className="w-8 h-8 text-amber-400 animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-amber-500 tracking-widest uppercase drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]">
                CEO SECURE STORAGE
              </h1>
              <p className="text-sm text-slate-400 mt-2 font-medium tracking-wide flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                대표이사(LV6) 단독 통제 구역 • 일체 외부 연동 및 비공개(Private) 등급 적용
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-amber-950/20 border border-amber-500/20 px-4 py-2.5 rounded-xl">
            <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping" />
            <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
              AUTHORIZED: CEO SYSTEM
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: 비밀 메모 보관함 (site_settings 대신 더 안전한 storage text 파일 보관) */}
        <div className="lg:col-span-7 bg-[#0b0b0f] border border-amber-500/10 rounded-3xl p-8 shadow-[0_15px_35px_rgba(0,0,0,0.8)] relative">
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-amber-500/2 blur-[80px] rounded-full pointer-events-none" />
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-white flex items-center gap-3 tracking-wide">
              <FileText className="w-6 h-6 text-amber-500" />
              최고관리자 비밀 메모 보관함
            </h2>
            <button
              onClick={handleSaveMemo}
              disabled={isMemoSaving || isMemoLoading}
              className="bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-black text-xs font-black px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(217,119,6,0.2)]"
            >
              <Save className="w-4 h-4" />
              <span>{isMemoSaving ? '저장 중...' : '저장'}</span>
            </button>
          </div>

          {isMemoLoading ? (
            <div className="flex flex-col items-center justify-center py-32 text-slate-500">
              <RefreshCw className="w-8 h-8 animate-spin mb-3 text-amber-500" />
              <span className="text-sm font-semibold">비밀 메모를 해독하는 중...</span>
            </div>
          ) : (
            <div className="relative">
              <textarea
                value={memoText}
                onChange={e => setMemoText(e.target.value)}
                placeholder="CEO만 확인할 수 있는 중요한 문서 번호, 마스터 키, 시스템 보안 내용 등을 자유롭게 메모해 두십시오."
                rows={22}
                className="w-full bg-[#030305] border border-slate-900 rounded-2xl p-6 text-sm text-[#e2e8f0] placeholder-[#475569] focus:outline-none focus:border-amber-500/50 resize-none leading-relaxed font-mono focus:ring-1 focus:ring-amber-500/30 transition-all"
              />
              
              {/* Save Status Indicator */}
              {saveStatus === 'saving' && (
                <div className="absolute bottom-4 right-4 bg-amber-950/90 border border-amber-500/40 text-amber-400 text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>비밀 데이터 저장 중...</span>
                </div>
              )}
              {saveStatus === 'saved' && (
                <div className="absolute bottom-4 right-4 bg-emerald-950/90 border border-emerald-500/40 text-emerald-400 text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>메모 암호화 저장 완료</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: CEO 전용 비공개 백업/중요 파일 보관함 */}
        <div className="lg:col-span-5 bg-[#0b0b0f] border border-amber-500/10 rounded-3xl p-8 shadow-[0_15px_35px_rgba(0,0,0,0.8)] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-white flex items-center gap-3 tracking-wide">
                <Database className="w-6 h-6 text-amber-500" />
                기밀 문서 및 백업 스토리지
              </h2>
              <button 
                onClick={fetchVaultFiles}
                className="p-2.5 bg-slate-900 border border-slate-900 rounded-xl text-slate-500 hover:text-amber-500 transition-all hover:border-amber-500/20"
                title="스토리지 동기화"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* File upload form */}
            <form onSubmit={handleFileUpload} className="mb-8">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-amber-500/10 hover:border-amber-500/30 rounded-2xl p-6 bg-[#030305] text-center cursor-pointer transition-all relative">
                <input 
                  type="file" 
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setUploadFile(e.target.files[0]);
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isUploading}
                />
                <UploadCloud className="w-8 h-8 text-amber-500/70 mb-2" />
                <span className="text-xs font-bold text-slate-400">
                  {uploadFile ? uploadFile.name : '마우스 드래그 혹은 클릭하여 파일 선택'}
                </span>
                <span className="text-[10px] text-slate-600 mt-1 block">
                  (업로드 즉시 CEO 전용 암호화 비공개 버킷에 분리 적재됩니다)
                </span>
              </div>

              {uploadFile && (
                <div className="flex gap-2 mt-3.5">
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="flex-1 bg-amber-600 hover:bg-amber-500 text-black text-xs font-black py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md disabled:opacity-50"
                  >
                    <FileUp className="w-4 h-4" />
                    <span>{isUploading ? '기밀 파일 송신 중...' : '금고에 업로드'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadFile(null)}
                    className="px-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl text-slate-400 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </form>

            {/* File List */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-2">보관 파일 목록</h3>
              
              {isFileLoading ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                  <RefreshCw className="w-6 h-6 animate-spin mb-3 text-amber-500" />
                  <span className="text-xs font-semibold">금고 데이터 파싱 중...</span>
                </div>
              ) : files.length === 0 ? (
                <div className="border border-slate-900 rounded-xl py-12 text-center text-xs text-slate-600 font-semibold bg-[#030305]/50">
                  스토리지에 보관된 외부 파일이 없습니다.
                </div>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {files.map(file => (
                    <div 
                      key={file.id} 
                      className="bg-[#030305] border border-slate-900 hover:border-amber-500/20 rounded-xl p-3.5 flex items-center justify-between gap-4 transition-all"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-white truncate">{file.name}</div>
                        <div className="text-[10px] text-slate-500 font-medium mt-1">
                          크기: {formatBytes(file.metadata?.size || 0)}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleFileDownload(file.name)}
                          className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-all"
                          title="일시적 서명 링크 생성 및 안전 다운로드"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleFileDelete(file.name)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                          title="영구 파기"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 border-t border-slate-900 pt-6">
            <div className="bg-[#120a0a] border border-red-500/10 rounded-xl p-4 text-[11px] text-[#fda4af] leading-relaxed font-semibold">
              <span className="text-red-400 font-black block mb-1">⚠️ 보안 통제 경고</span>
              여기에 보관된 자료는 Supabase CLI 백업 데이터를 포함한 최고 등급 기밀 문서입니다. 외부에 절대 공유되어서는 안 되며, 다운로드 서명 링크(Signed URL)는 60초 후 자동으로 권한 해제되어 만료됩니다.
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
