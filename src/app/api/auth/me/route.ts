import { NextResponse } from 'next/server';
import { db, UserLevel } from '@/lib/store';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: '이메일 파라미터가 필요합니다.' }, { status: 400 });
    }

    let user = db.getUserByEmail(email);

    // [로컬 개발 편의성 개선] 서버 핫리로드 시 In-Memory 유저 유실로 인해 
    // 준회원 세션이 갑자기 끊어지는(튕기는) 현상을 막기 위한 세션 자동 복구 로직
    if (!user && email.endsWith('@jb-band.org')) {
      try {
        const isOwner = email.includes('dowooksang') || email.includes('admin');
        user = db.addUser({
          email,
          password: 'mockedpassword_from_session',
          nickname: isOwner ? '최고대표' : '임시준회원',
          name: isOwner ? '도욱상' : '임시회원',
          phone: '010-1234-5678',
          bandName: '소속 없음',
          position: '보컬',
          address: '서울 서초구'
        });
      } catch (e) {
        // 이미 가입 처리된 경우 무시
      }
    }

    if (!user) {
      return NextResponse.json({ error: '존재하지 않는 회원입니다.' }, { status: 404 });
    }

    // 최고 관리자 강제 보정 로직 (이메일에 dowooksang 또는 admin이 포함되면 대표이사 레벨 & active 강제 적용)
    const isOwner = user.email.includes('dowooksang') || user.email.includes('admin');
    if (isOwner) {
      user.level = UserLevel.LV6_CEO;
      user.status = 'active';
    }

    // 준회원(status === 'pending') 상태라도 세션 응답을 정상적으로 전달하여
    // 클라이언트 측에서 튕기지 않고 메인 화면 및 기본 커뮤니티 메뉴를 볼 수 있도록 보장합니다.
    const { password, ...safeUser } = user;
    return NextResponse.json(safeUser, { status: 200 });
    
  } catch (error) {
    return NextResponse.json({ error: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
  }
}
