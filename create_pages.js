const fs = require('fs');
const path = require('path');

const routes = [
  { href: '/about/greetings', title: '인사말' },
  { href: '/about/history', title: '설립 취지 및 연혁' },
  { href: '/about/organization', title: '조직도 및 지부' },
  { href: '/about/governance', title: '정관 및 공시자료' },
  { href: '/about/contact', title: '오시는 길' },

  { href: '/activity/gallery', title: '활동갤러리' },
  { href: '/activity/video', title: '공연영상' },

  { href: '/solo/jam', title: '방구석 릴레이 잼' },
  { href: '/solo/group', title: '소모임 및 매칭' },
  { href: '/solo/lesson', title: '레슨 및 장비리뷰' },
  { href: '/solo/debut', title: '무대 데뷔 신청' },

  { href: '/branch/recruitment', title: '지부 모집 및 신청' },
  { href: '/branch/map', title: '전국 지부 현황' },
  { href: '/branch/news', title: '지부별 활동 소식' },
  { href: '/branch/council', title: '지부장 회의실' },

  // community and news are using /board which already exists.
  // We just need to check if /news, /share, /solo exist.
  { href: '/news', title: '소식/알림' },
  
  { href: '/share', title: '나눔과 참여' },
  { href: '/share/gallery', title: '재능기부/봉사 기록' },
  { href: '/share/sponsor', title: '후원 및 협찬 안내' },
  { href: '/share/request', title: '봉사 요청하기' },
];

const basePath = path.join(__dirname, 'src', 'app');

routes.forEach(route => {
  const dirPath = path.join(basePath, route.href);
  const filePath = path.join(dirPath, 'page.tsx');

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    const content = `import React from 'react';

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 max-w-lg w-full">
        <div className="text-6xl mb-6">🚧</div>
        <h1 className="text-2xl font-bold text-[#0A103D] mb-4">${route.title}</h1>
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
`;
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Created: ${route.href}/page.tsx`);
  } else {
    console.log(`Exists: ${route.href}/page.tsx`);
  }
});
