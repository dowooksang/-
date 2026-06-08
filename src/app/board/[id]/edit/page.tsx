import BoardForm from '@/components/BoardForm';
import { db } from '@/lib/store';
import { notFound } from 'next/navigation';

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await db.getPost(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-white flex-1 w-full flex justify-center py-12">
      <div className="max-w-6xl w-full px-6">
        <div className="border-b-2 border-[#333333] pb-4 mb-8">
          <h1 className="text-2xl font-bold text-[#333333]">글 수정</h1>
        </div>

        <BoardForm initialData={post} isEdit={true} />
      </div>
    </div>
  );
}
