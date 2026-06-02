'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

/**
 * 관리자 로그인 페이지 – Next.js App Router (src/app/admin/login/page.tsx)
 * 다크 테마 Tailwind CSS 적용, 이메일·비밀번호 입력 후 최고관리자(dowooksang@gmail.com) 레벨 6 검증.
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (authError) throw authError;

      // 관리자인지 레벨 6 확인
      const { data, error: dbError } = await supabase
        .from('admin_users')
        .select('level')
        .eq('email', form.email)
        .single();
      if (dbError) throw dbError;
      if (data?.level !== 6) {
        throw new Error('관리자 권한이 없습니다.');
      }

      // 성공 시 대시보드로 강제 이동
      router.replace('/admin/dashboard');
    } catch (err: any) {
      const msg = err.message || '로그인 중 오류가 발생했습니다.';
      setError(msg);
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 bg-gray-800 p-6 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold text-center mb-4">관리자 로그인</h2>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <input
          type="email"
          name="email"
          placeholder="관리자 이메일"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded transition-colors disabled:opacity-50"
        >
          {loading ? '처리 중...' : '로그인'}
        </button>
      </form>
    </div>
  );
}
