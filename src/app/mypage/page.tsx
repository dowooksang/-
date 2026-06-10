'use client';

import { useAuth, getLevelName } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { User, Mail, Shield, Calendar, LogOut } from 'lucide-react';

export default function MyPage() {
  const { user, isLoaded, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/login');
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5486B2]"></div>
      </div>
    );
  }

  // Format date safely
  const formattedDate = user.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('ko-KR', {
        year: 'numeric', month: 'long', day: 'numeric'
      })
    : '가입일 정보 없음';

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="bg-gray-50 flex-1 w-full flex flex-col py-12 items-center">
      <div className="max-w-3xl w-full px-6">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#333333]">마이페이지</h1>
          <p className="text-gray-500 mt-2 text-sm">회원님의 기본 정보와 활동 내역을 확인하세요.</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8 animate-fade-in-up">
          <div className="h-32 bg-[#0A103D] relative">
            <div className="absolute -bottom-12 left-8">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center shadow-md">
                <User size={48} className="text-gray-400" />
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <span className="bg-accent text-[#0A103D] px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                {getLevelName(user.level)}
              </span>
            </div>
          </div>
          
          <div className="pt-16 pb-8 px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.name || user.nickname}</h2>
            <p className="text-gray-500 text-sm font-medium">{user.position} 파트</p>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-[#5486B2]">
                  <Mail size={18} />
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs text-gray-500 mb-0.5">이메일 계정</div>
                  <div className="text-sm font-medium text-gray-900 truncate">{user.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-[#5486B2]">
                  <Calendar size={18} />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">가입일시</div>
                  <div className="text-sm font-medium text-gray-900">{formattedDate}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-600">
                  <Shield size={18} />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">회원 등급</div>
                  <div className="text-sm font-medium text-gray-900">{getLevelName(user.level)} (Level {user.level})</div>
                </div>
              </div>
            </div>
            
            <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <Link 
                href="/board" 
                className="text-[#5486B2] hover:underline text-sm font-medium"
              >
                내가 쓴 글 보러가기 (준비중)
              </Link>
              
              <div className="flex gap-3">
                <Link 
                  href="/mypage/edit"
                  className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  정보 수정
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-6 py-2.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  <LogOut size={16} />
                  로그아웃
                </button>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
