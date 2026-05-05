import { NextResponse } from 'next/server';
import { db } from '@/lib/store';

// 특정 게시글 상세 조회
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = db.getPost(id);
  if (!post) {
    return NextResponse.json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
  }
  return NextResponse.json(post);
}

// 특정 게시글 수정
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, content, author } = body;

    const updatedPost = db.updatePost(id, { title, content, author });
    
    if (!updatedPost) {
      return NextResponse.json({ error: '게시글을 찾을 수 없거나 수정 권한이 없습니다.' }, { status: 404 });
    }
    
    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 특정 게시글 삭제
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const isDeleted = db.deletePost(id);
  
  if (!isDeleted) {
    return NextResponse.json({ error: '게시글을 찾을 수 없거나 삭제 권한이 없습니다.' }, { status: 404 });
  }
  
  return NextResponse.json({ message: '성공적으로 삭제되었습니다.' });
}
