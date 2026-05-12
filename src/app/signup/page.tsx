'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/useAuth';

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    birthDate: '',
    phone: '',
    region: '서울/수도권',
    instrument: '보컬',
    activityType: '개인(취미)',
    genre: '',
    experience: '신입',
    bandName: '',
    practiceRegion: '',
    bandRole: '',
    agreePrivacy: false,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          nickname: formData.name, // Mock API needs nickname
          name: formData.name,
          phone: formData.phone,
          bandName: formData.bandName || '소속 없음',
          position: formData.instrument,
          address: formData.region
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '회원가입에 실패했습니다.');
      }

      // 회원가입 성공 시 자동 로그인
      login(data);
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
      <div className="w-full max-w-3xl bg-white/5 border border-white/10 rounded-2xl p-8 md:p-10 backdrop-blur-md shadow-2xl animate-fade-in-up">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">회원가입</h1>
          <p className="text-gray-400 text-sm">연합회 커뮤니티에 합류하세요</p>
        </div>

        {error && (
          <div className="bg-red-500/20 text-red-300 border border-red-500/30 p-4 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-5">
            <h3 className="text-accent font-bold border-b border-white/10 pb-2 mb-4">필수 가입 정보</h3>
            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">이메일 (로그인 아이디)</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-accent" placeholder="example@jb-band.org" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">비밀번호</label>
                  <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-accent" placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">비밀번호 확인</label>
                  <input type="password" required value={formData.passwordConfirm} onChange={(e) => setFormData({...formData, passwordConfirm: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-accent" placeholder="••••••••" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">1. 성함 (본명)</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-accent" placeholder="홍길동" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">2. 연락처</label>
                  <input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-accent" placeholder="010-0000-0000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">3. 악기 파트</label>
                  <select value={formData.instrument} onChange={(e) => setFormData({...formData, instrument: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-accent">
                    <option value="보컬">보컬</option>
                    <option value="기타">기타</option>
                    <option value="베이스">베이스</option>
                    <option value="드럼">드럼</option>
                    <option value="키보드">키보드/신디</option>
                    <option value="관악/현악/기타">관악/현악 등</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">4. 활동 지역</label>
                  <input type="text" required value={formData.region} onChange={(e) => setFormData({...formData, region: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-accent" placeholder="예: 서울 서초구" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" required checked={formData.agreePrivacy} onChange={(e) => setFormData({...formData, agreePrivacy: e.target.checked})} className="mt-1 w-4 h-4 rounded bg-black/20 border-gray-500 text-accent focus:ring-accent" />
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">5. [필수] 가입 후 관리자 승인 전까지 일부 이용이 제한됨을 확인합니다.</span>
            </label>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-accent text-[#0A103D] font-bold py-3.5 rounded-lg mt-6 shadow-lg hover:bg-accent-hover transition-colors disabled:opacity-50"
          >
            {isLoading ? '처리 중...' : '회원가입 완료'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          이미 계정이 있으신가요? <Link href="/login" className="text-accent hover:underline font-medium">로그인하기</Link>
        </p>
      </div>
    </div>
  );
}
