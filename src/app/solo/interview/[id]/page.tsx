'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function InterviewPage() {
  const params = useParams();
  const id = params.id;

  return (
    <div className="bg-[#0A103D] min-h-screen text-white pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 text-center">
        <span className="text-accent text-sm font-bold tracking-widest uppercase mb-4 block">방구석 아티스트 인터뷰</span>
        <h1 className="text-3xl font-bold mb-4">"밤바다를 닮은 어쿠스틱 선율" - 김기타 님</h1>
        <p className="text-gray-400 mb-8">인터뷰 ID: {id}</p>
        
        <div className="text-left space-y-6 text-gray-300 leading-relaxed text-sm bg-black/20 p-6 rounded-lg">
          <p>
            <strong className="text-accent">Q: 처음 기타를 시작하게 된 계기가 무엇인가요?</strong><br />
            A: 퇴근 후 남는 시간을 의미 있게 보내고 싶었어요. 혼자서도 할 수 있는 취미를 찾다 보니 자연스럽게 기타에 관심을 갖게 되었습니다.
          </p>
          <p>
            <strong className="text-accent">Q: 직장인밴드연합회의 '방구석 릴레이 잼'이 어떤 도움이 되었나요?</strong><br />
            A: 혼자 치다 보면 실력이 늘고 있는지, 제대로 하고 있는지 확신이 안 설 때가 많아요. 연합회 커뮤니티를 통해 다른 분들과 영상을 공유하고 피드백을 주고받으면서 큰 용기를 얻었습니다.
          </p>
          <p>
            <strong className="text-accent">Q: 앞으로의 목표가 있다면?</strong><br />
            A: 다음 달 정모 콘서트 오프닝 무대에 서게 되었어요. 첫 오프라인 무대라 긴장되지만, 열심히 준비해서 멋진 공연을 보여드리고 싶습니다.
          </p>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <Link href="/" className="inline-block px-6 py-3 bg-accent text-[#0A103D] font-bold rounded-lg shadow-sm hover:bg-[#82C8FF] transition-colors">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
