'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제로는 Supabase의 resetPasswordForEmail 같은 API를 호출합니다.
    setIsSubmitted(true);
  };

  return (
    <div className="bg-[#0A103D] min-h-screen text-white pt-32 pb-24 px-6 flex items-center justify-center">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">비밀번호 찾기</h1>
          <p className="text-gray-400 text-sm">가입하신 이메일 주소를 입력해주세요.</p>
        </div>

        {isSubmitted ? (
          <div className="text-center space-y-6">
            <div className="bg-green-500/20 text-green-300 border border-green-500/30 p-4 rounded-lg text-sm">
              비밀번호 재설정 링크가 이메일로 발송되었습니다.
            </div>
            <Link href="/login" className="inline-block px-6 py-3 bg-accent text-[#0A103D] font-bold rounded-lg shadow-sm hover:bg-[#82C8FF] transition-colors">
              로그인으로 돌아가기
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">이메일</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                placeholder="example@jb-band.org"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-accent text-[#0A103D] font-bold py-3.5 rounded-lg mt-6 shadow-lg hover:bg-accent-hover transition-colors"
            >
              재설정 링크 받기
            </button>
            <div className="mt-6 text-center text-sm">
              <Link href="/login" className="text-gray-400 hover:text-white transition-colors">
                로그인 화면으로 돌아가기
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
