import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 bg-[#0A103D] text-white w-full">
      <span className="text-accent font-bold tracking-widest text-sm mb-4 block">404 ERROR</span>
      <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-white">
        페이지를 <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-400">찾을 수 없습니다</span>
      </h1>
      <p className="text-lg text-gray-400 max-w-2xl mx-auto font-light mb-8">
        현재 페이지가 준비 중이거나 주소가 잘못 입력되었습니다.<br/>
        이용에 불편을 드려 죄송합니다.
      </p>
      <Link 
        href="/" 
        className="px-8 py-4 bg-accent text-primary-dark font-bold rounded shadow-lg hover:bg-accent-hover hover:-translate-y-1 transition-all"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
