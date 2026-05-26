import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db, UserLevel } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    let user = db.getUserByEmail(email);

    // [로컬 개발 편의성 개선] 서버 핫리로드로 인해 메모리 DB가 초기화된 경우, 
    // 가입 완료한 준회원이 튕기지 않도록 테스트용 임시 계정을 자동 생성해 줍니다.
    if (!user && email.endsWith('@jb-band.org')) {
      try {
        const isOwner = email.includes('dowooksang') || email.includes('admin');
        user = db.addUser({
          email,
          password: password || '123456',
          nickname: isOwner ? '최고대표' : '임시준회원',
          name: isOwner ? '도욱상' : '임시회원',
          phone: '010-1234-5678',
          bandName: '소속 없음',
          position: '보컬',
          address: '서울 서초구'
        });
      } catch (e) {
        // 이미 생성된 이메일 충돌 무시
      }
    }

    if (!user) {
  return NextResponse.json({ error: '이메일 또는 비밀번호가 일치하지 않습니다.' }, { status: 401 });
}
const isMatch = await bcrypt.compare(password, user.password ?? '');
if (!isMatch) {
  return NextResponse.json({ error: '이메일 또는 비밀번호가 일치하지 않습니다.' }, { status: 401 });
}
      return NextResponse.json({ error: '이메일 또는 비밀번호가 일치하지 않습니다.' }, { status: 401 });
    }

    // 최고 관리자 강제 보정 로직 (이메일에 dowooksang 또는 admin이 포함되면 대표이사 레벨 & active 강제 적용)
    const isOwner = user.email.includes('dowooksang') || user.email.includes('admin');
    if (isOwner) {
      user.level = UserLevel.LV6_CEO;
      user.status = 'active';
    }

    // 준회원(status: 'pending') 계정 로그인 허용:
    // 인증 API 차단 조건 없이 정상적으로 로그인 응답을 전달하여 메인 및 커뮤니티 페이지로의 진입을 성공시킵니다.
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword, { status: 200 });
    
  } catch (error) {
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
