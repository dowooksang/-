'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data, error: signInError } = await import('@/lib/supabase').then(m => m.supabase).auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (signInError) {
        throw new Error('이메일이나 비밀번호가 일치하지 않습니다.');
      }

      // 로그인 성공 시 메인 페이지로 이동
      router.push('/');
      router.refresh();
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#0A103D] min-h-screen text-white flex items-center justify-center py-12 px-6">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md shadow-2xl animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-48 h-48 mx-auto flex items-center justify-center shadow-xl mb-8 rounded-full bg-white overflow-hidden relative border-4 border-white/20">
            <Image 
              src="/logo.png" 
              alt="로고" 
              fill
              className="object-contain p-3"
            />
          </div>
          <h1 className="text-3xl font-bold mb-2">로그인</h1>
          <p className="text-gray-400 text-sm">연합회 커뮤니티에 오신 것을 환영합니다</p>
        </div>

        {error && (
          <div className="bg-red-500/20 text-red-300 border border-red-500/30 p-4 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* 안내 메시지 - 임시 테스트용 */}
        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg mb-6 text-xs text-blue-200">
          <strong className="text-blue-400">💡 관리자(테스트) 계정</strong><br/>
          이메일: dowooksang@gmail.com<br/>
          비밀번호: admin
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">이메일</label>
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              placeholder="example@jb-band.org"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">비밀번호</label>
            <input 
              type="password" 
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-accent text-[#0A103D] font-bold py-3.5 rounded-lg mt-6 shadow-lg hover:bg-accent-hover transition-colors disabled:opacity-50"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-400 gap-4">
          <Link href="/reset-password" className="hover:text-white transition-colors">비밀번호를 잊으셨나요?</Link>
          <Link href="/signup" className="text-accent hover:underline font-medium">새 계정 만들기</Link>
        </div>
      </div>
    </div>
  );
}
