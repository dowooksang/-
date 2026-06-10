'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

/**
 * 회원가입 페이지 – Next.js App Router (src/app/signup/page.tsx)
 * 다크 테마 Tailwind CSS 적용, 5개 입력 필드 (이름, 이메일, 비밀번호, 연락처, 소속 지부).
 */
export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (form.password.length < 6) {
      setError('비밀번호는 최소 6자리 이상이어야 합니다.');
      return;
    }
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });
      if (authError) throw authError;
      if (!authData?.user) throw new Error('회원가입 처리 중 사용자 정보를 생성하지 못했습니다.');

      const { error: dbError } = await supabase.from('users').insert({
        id: authData.user.id,
        name: form.name,
        email: form.email,
        nickname: form.name, // 닉네임 필수값에 이름을 기본값으로 매핑
        phone: form.phone,
        status: 'pending',   // 승인 대기(pending) 상태로 가입
        level: 1,            // 준회원(LV1_GUEST = 1) 등급 부여
        created_at: new Date().toISOString(),
      });
      if (dbError) throw dbError;

      setSuccess('회원가입이 완료되었습니다! 로그인해 주세요.');
      router.push('/login');
    } catch (err: any) {
      setError(err.message || '회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 bg-gray-800 p-6 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold text-center mb-4">회원가입</h2>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {success && <p className="text-green-400 text-sm">{success}</p>}
        <input
          type="text"
          name="name"
          placeholder="이름"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="email"
          name="email"
          placeholder="이메일"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호 (최소 6자리)"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          name="phone"
          placeholder="연락처"
          value={form.phone}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray=700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        // 소속 지부 입력 필드 제거됨
        <button
          type="submit"
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded transition-colors"
        >
          가입하기
        </button>
      </form>
    </div>
  );
}
