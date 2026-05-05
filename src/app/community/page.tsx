import React from 'react';
import Link from 'next/link';

export default function CommunityPage() {
  return (
    <div className="bg-gray-50 min-h-screen pt-10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-primary mb-4">커뮤니티</h1>
          <p className="text-gray-500 text-lg">회원들의 자유로운 소통 공간입니다.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 bg-gray-100/50">
            <button className="flex-1 py-4 px-6 text-center font-bold text-primary border-b-2 border-primary bg-white">
              자유게시판
            </button>
            <button className="flex-1 py-4 px-6 text-center font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors">
              행정 자료실
            </button>
            <button className="flex-1 py-4 px-6 text-center font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors">
              가입/협업 문의
            </button>
          </div>

          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-gray-500">총 <strong className="text-primary text-base">142</strong>건의 게시물이 있습니다.</span>
              <div className="flex gap-2">
                <select className="border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-primary">
                  <option>제목+내용</option>
                  <option>작성자</option>
                </select>
                <input type="text" placeholder="검색어 입력" className="border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-primary" />
                <button className="bg-primary text-white px-4 py-1.5 rounded text-sm hover:bg-primary-light transition-colors">검색</button>
              </div>
            </div>

            {/* Table (Mangboard Basic Skin Replacement) */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-t-2 border-primary">
                <thead>
                  <tr className="border-b border-gray-200 text-sm text-gray-600 bg-gray-50">
                    <th className="py-4 px-4 font-semibold text-center w-16">번호</th>
                    <th className="py-4 px-4 font-semibold text-center w-24">분류</th>
                    <th className="py-4 px-4 font-semibold">제목</th>
                    <th className="py-4 px-4 font-semibold text-center w-24">작성자</th>
                    <th className="py-4 px-4 font-semibold text-center w-32">작성일</th>
                    <th className="py-4 px-4 font-semibold text-center w-20">조회</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {/* Notice items */}
                  <tr className="bg-primary/5 hover:bg-primary/10 transition-colors">
                    <td className="py-4 px-4 text-center"><span className="bg-accent text-primary text-xs font-bold px-2 py-1 rounded">공지</span></td>
                    <td className="py-4 px-4 text-center text-sm text-gray-500">필독</td>
                    <td className="py-4 px-4 font-bold text-primary cursor-pointer hover:underline">
                      사단법인 직장인밴드연합회 커뮤니티 이용 규칙 안내
                    </td>
                    <td className="py-4 px-4 text-center text-sm">최고관리자</td>
                    <td className="py-4 px-4 text-center text-sm text-gray-500">2026.04.01</td>
                    <td className="py-4 px-4 text-center text-sm text-gray-500">1,240</td>
                  </tr>
                  
                  {/* Normal items */}
                  {[
                    { id: 142, category: '합주모집', title: '강남/양재 지역에서 함께할 베이시스트 구합니다 (경력자)', author: 'GrooveMaker', date: '2026.04.18', views: 42 },
                    { id: 141, category: '자유수다', title: '어제 본 공연 너무 멋있었습니다!', author: '초보마스터', date: '2026.04.17', views: 156 },
                    { id: 140, category: '악기질문', title: '펜더 스트라토캐스터 픽업 교체 관련해서 조언 부탁드립니다', author: '기타키즈', date: '2026.04.16', views: 89 },
                    { id: 139, category: '공연홍보', title: '이번 주말 직장인 인디밴드 연합 공연 안내 (홍대)', author: '인디홀릭', date: '2026.04.15', views: 231 },
                    { id: 138, category: '자유수다', title: '합주실 방음 공사 꿀팁 있으신 분?', author: 'Drumer99', date: '2026.04.15', views: 104 },
                  ].map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 text-center text-gray-500 text-sm">{post.id}</td>
                      <td className="py-4 px-4 text-center text-sm text-gray-500">{post.category}</td>
                      <td className="py-4 px-4 font-medium text-gray-800 cursor-pointer hover:text-primary transition-colors">
                        {post.title}
                        {post.id % 2 === 0 && <span className="ml-2 text-xs text-red-500 font-bold">[3]</span>}
                      </td>
                      <td className="py-4 px-4 text-center text-sm truncate">{post.author}</td>
                      <td className="py-4 px-4 text-center text-sm text-gray-500">{post.date}</td>
                      <td className="py-4 px-4 text-center text-sm text-gray-500">{post.views}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination & Write Button */}
            <div className="mt-8 flex justify-between items-center">
              <div className="w-24"></div> {/* Spacer to center pagination */}
              <div className="flex gap-1">
                <button className="w-8 h-8 flex items-center justify-center border border-gray-300 text-gray-500 rounded bg-white hover:bg-gray-50">&lt;</button>
                <button className="w-8 h-8 flex items-center justify-center border border-primary text-white bg-primary rounded font-bold">1</button>
                <button className="w-8 h-8 flex items-center justify-center border border-gray-300 text-gray-700 rounded bg-white hover:bg-gray-50">2</button>
                <button className="w-8 h-8 flex items-center justify-center border border-gray-300 text-gray-700 rounded bg-white hover:bg-gray-50">3</button>
                <button className="w-8 h-8 flex items-center justify-center border border-gray-300 text-gray-500 rounded bg-white hover:bg-gray-50">&gt;</button>
              </div>
              <Link href="/board" className="bg-primary text-white px-5 py-2 rounded font-bold shadow hover:bg-primary-light transition-colors text-sm">
                글쓰기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
