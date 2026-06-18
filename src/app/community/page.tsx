'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const CATEGORY_MAP: Record<string, string> = {
  greeting: '가입인사',
  free: '자유게시판',
  archive: '행정 자료실',
  qa: '가입/협업 문의'
};

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<'greeting' | 'free' | 'archive' | 'qa'>('greeting');
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchType, setSearchType] = useState('title_content');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

  const fetchPosts = async (keyword = '') => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('posts')
        .select('*', { count: 'exact' })
        .eq('category', activeTab)
        .order('created_at', { ascending: false });

      if (keyword) {
        if (searchType === 'title_content') {
          query = query.or(`title.ilike.%${keyword}%,content.ilike.%${keyword}%`);
        } else if (searchType === 'author') {
          query = query.ilike('author', `%${keyword}%`);
        }
      }

      const { data, count, error } = await query;
      if (error) throw error;

      setPosts(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('게시글 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts(searchKeyword);
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-[#0A103D] mb-4">커뮤니티</h1>
          <p className="text-gray-500 text-lg">회원들의 자유로운 소통 공간입니다.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 bg-gray-100/50">
            {(['greeting', 'free', 'archive', 'qa'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSearchKeyword('');
                }}
                className={`flex-1 py-4 px-6 text-center font-bold transition-all ${
                  activeTab === tab
                    ? 'text-[#5486B2] border-b-2 border-[#5486B2] bg-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {CATEGORY_MAP[tab]}
              </button>
            ))}
          </div>

          <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <span className="text-sm text-gray-500">
                총 <strong className="text-[#5486B2] text-base">{totalCount}</strong>건의 게시물이 있습니다.
              </span>
              <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
                <select 
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-white text-gray-700 outline-none focus:border-[#5486B2]"
                >
                  <option value="title_content">제목+내용</option>
                  <option value="author">작성자</option>
                </select>
                <input 
                  type="text" 
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="검색어 입력" 
                  className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-white text-gray-800 outline-none focus:border-[#5486B2] flex-1 md:flex-none" 
                />
                <button type="submit" className="bg-[#5486B2] text-white px-4 py-1.5 rounded text-sm hover:bg-[#436f94] transition-colors whitespace-nowrap">검색</button>
              </form>
            </div>

            {/* Table (Mangboard Basic Skin Replacement) */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-t-2 border-[#5486B2]">
                <thead>
                  <tr className="border-b border-gray-200 text-sm text-gray-600 bg-gray-50">
                    <th className="py-4 px-4 font-semibold text-center w-16">번호</th>
                    <th className="py-4 px-4 font-semibold text-center w-24">분류</th>
                    <th className="py-4 px-4 font-semibold">제목</th>
                    <th className="py-4 px-4 font-semibold text-center w-28">작성자</th>
                    <th className="py-4 px-4 font-semibold text-center w-36">작성일</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="py-20 text-center text-gray-500">
                        게시글을 불러오는 중입니다...
                      </td>
                    </tr>
                  ) : posts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-20 text-center text-gray-500">
                        등록된 게시물이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    posts.map((post, idx) => (
                      <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 text-center text-gray-500 text-sm">{posts.length - idx}</td>
                        <td className="py-4 px-4 text-center text-sm text-gray-500">
                          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded border border-gray-200">
                            {CATEGORY_MAP[post.category] || post.category}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-medium text-gray-800 hover:text-[#5486B2] transition-colors">
                          <Link href={`/board/${post.id}`} className="block">
                            {post.title}
                          </Link>
                        </td>
                        <td className="py-4 px-4 text-center text-sm text-gray-700 truncate max-w-[120px]">{post.author_id ? post.author : '알 수 없음'}</td>
                        <td className="py-4 px-4 text-center text-sm text-gray-500">
                          {new Date(post.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Write Button & Footer */}
            <div className="mt-8 flex justify-end items-center">
              <Link 
                href={`/board/write?category=${activeTab}`} 
                className="bg-[#5486B2] text-white px-6 py-2.5 rounded font-bold shadow hover:bg-[#436f94] transition-colors text-sm"
              >
                글쓰기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
