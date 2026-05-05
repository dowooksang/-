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

      {/* Database Connection Status & Guide */}
      <div className="bg-white border-2 border-dashed border-accent/50 rounded-2xl p-8 bg-blue-50/50">
        <div className="flex items-start gap-4">
          <div className="text-4xl">🚀</div>
          <div>
            <h3 className="text-xl font-bold text-[#0A103D] mb-2">Supabase 데이터베이스 연동 안내</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              현재 관리자 화면의 껍데기(UI)와 필수 프로그램 설치가 완료되었습니다. <br/>
              사진 업로드와 실제 게시글 저장을 위해 <b>무료 클라우드 DB인 Supabase 설정</b>이 필요합니다.
            </p>
            <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm">
              <h4 className="font-bold text-gray-800 mb-4">✅ 대표님 진행해 주실 순서</h4>
              <ol className="list-decimal pl-5 space-y-3 text-sm text-gray-700">
                <li><a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-accent hover:underline font-bold">Supabase 홈페이지</a>에 접속하여 회원가입 후 로그인합니다. (GitHub 계정 또는 이메일)</li>
                <li><b>[New Project]</b> 버튼을 누르고 프로젝트 이름(예: soundbridge-cms)과 비밀번호를 설정합니다.</li>
                <li>프로젝트가 생성되면(몇 분 소요), 설정(Settings) &gt; <b>API 메뉴</b>로 이동합니다.</li>
                <li>화면에 보이는 <b>Project URL</b>과 <b>anon (public) Key</b> 두 가지 값을 복사해서 채팅창에 남겨주세요!</li>
              </ol>
            </div>
            <div className="mt-6">
              <span className="text-sm text-gray-500">※ 키를 전달해 주시면 즉시 DB 테이블을 세팅하고, 글쓰기 에디터 기능을 활성화해 드립니다.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
