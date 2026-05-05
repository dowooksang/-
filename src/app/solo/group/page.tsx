import React from 'react';

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 max-w-lg w-full">
        <div className="text-6xl mb-6">🚧</div>
        <h1 className="text-2xl font-bold text-[#0A103D] mb-4">소모임 및 매칭</h1>
        <p className="text-gray-500 mb-8">
          해당 페이지는 현재 <b>준비 중(개발 중)</b>입니다.<br/>
          조금만 기다려 주시면 멋진 모습으로 찾아뵙겠습니다!
        </p>
        <a href="/" className="inline-block px-6 py-3 bg-accent text-[#0A103D] font-bold rounded-lg shadow-sm hover:bg-[#82C8FF] transition-colors">
          홈으로 돌아가기
        </a>
      </div>
    </div>
  );
}
