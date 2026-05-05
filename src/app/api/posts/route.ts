import { NextResponse } from 'next/server';
import { db } from '@/lib/store';

// 모든 게시글 조회
export async function GET() {
  const posts = db.getPosts();
  return NextResponse.json(posts);
}

// 새 게시글 작성
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, author } = body;

    // 간단한 유효성 검사
    if (!title || !content || !author) {
      return NextResponse.json(
        { error: '제목, 내용, 작성자는 필수 항목입니다.' },
        { status: 400 }
      );
    }

    const newPost = db.addPost({ title, content, author });
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
