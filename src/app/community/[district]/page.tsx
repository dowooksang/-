import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DistrictCommunityPage({ params }: { params: Promise<{ district: string }> }) {
  // Decode the URL parameter (e.g., %EA%B0%95%EB%82%A8%EA%B5%AC -> 강남구)
  const { district } = await params;
  const districtName = decodeURIComponent(district);

  return (
    <div className="bg-gray-50 flex-1 w-full flex justify-center py-12">
      <div className="max-w-6xl w-full px-6">
        {/* Header Section */}
        <div className="border-b-2 border-[#333333] pb-4 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/community" className="text-sm text-[#5486B2] hover:underline font-bold">
                커뮤니티 (지역별)
              </Link>
              <span className="text-gray-400 text-sm">{'>'}</span>
              <span className="text-sm font-medium text-gray-700">{districtName}</span>
            </div>
            <h1 className="text-3xl font-bold text-[#333333]">{districtName} 게시판</h1>
            <p className="text-gray-500 mt-2 text-sm">
              {districtName} 지역 밴드 모집, 합주실 정보 공유 및 친목을 위한 소통 공간입니다.
            </p>
          </div>
          <button className="px-5 py-2 text-sm font-semibold text-white bg-[#5486B2] hover:bg-[#436f94] rounded shadow-sm transition-colors whitespace-nowrap self-start md:self-auto">
            이 지역 글쓰기
          </button>
        </div>

        {/* Empty State Table */}
        <div className="bg-white border-t-2 border-t-[#5486B2] shadow-sm rounded-b-lg overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 text-sm text-gray-600 bg-gray-50">
                <th className="py-4 px-4 font-semibold text-center w-16 hidden md:table-cell">번호</th>
                <th className="py-4 px-4 font-semibold text-center w-24 hidden sm:table-cell">분류</th>
                <th className="py-4 px-4 font-semibold">제목</th>
                <th className="py-4 px-4 font-semibold text-center w-24">작성자</th>
                <th className="py-4 px-4 font-semibold text-center w-24 hidden md:table-cell">조회수</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="bg-white">
                <td colSpan={5} className="py-24 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    <p className="text-lg font-medium text-gray-700 mb-1">아직 등록된 게시물이 없습니다.</p>
                    <p className="text-sm text-gray-400">첫 번째 글의 주인공이 되어보세요!</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
