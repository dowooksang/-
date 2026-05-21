export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">총 게시물</p>
            <p className="text-3xl font-black text-[#333333]">128<span className="text-sm font-medium text-gray-400 ml-1">개</span></p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 text-2xl">📝</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">신규 지부 신청</p>
            <p className="text-3xl font-black text-accent">3<span className="text-sm font-medium text-gray-400 ml-1">건</span></p>
          </div>
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 text-2xl">🏢</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">오늘 방문자</p>
            <p className="text-3xl font-black text-green-600">1,024<span className="text-sm font-medium text-gray-400 ml-1">명</span></p>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-500 text-2xl">📈</div>
        </div>
      </div>

      {/* Database Connection Status */}
      <div className="bg-white border border-green-100 rounded-2xl p-8 shadow-sm bg-green-50/30">
        <div className="flex items-center gap-4">
          <div className="text-3xl">✅</div>
          <div>
            <h3 className="text-lg font-bold text-green-800 mb-1">시스템이 완벽하게 연동되었습니다!</h3>
            <p className="text-green-600/80 text-sm">Vercel 배포와 Supabase 데이터베이스 연결이 모두 성공적으로 완료되어 정상 작동 중입니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
