import BoardForm from '@/components/BoardForm';

export default function WritePage() {
  return (
    <div className="bg-white flex-1 w-full flex justify-center py-12">
      <div className="max-w-6xl w-full px-6">
        <div className="border-b-2 border-[#333333] pb-4 mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#333333]">새 글 작성</h1>
            <p className="text-gray-500 mt-2 text-sm">내용을 정확하게 기입해주세요.</p>
          </div>
        </div>

        <BoardForm />
      </div>
    </div>
  );
}
