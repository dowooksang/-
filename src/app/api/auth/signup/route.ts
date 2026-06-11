import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const {
      email,
      password,
      nickname,
      name,
      phone,
      bandName,
      position,
      address,
    } = await request.json();

    // 필수 항목 검증
    if (!email || !password || !name || !phone || !position || !address) {
      return NextResponse.json({ error: '필수 항목을 모두 입력해주세요.' }, { status: 400 });
    }

    // Supabase Auth 로 회원가입 (auth.users) – password는 자동 해시됩니다.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nickname: nickname || name,
          name,
          phone,
          band_name: bandName || '소속 없음',
          position,
          address,
          status: 'pending',
          level: 1, // LV1_GUEST
        },
      },
    });

    if (error) {
      // 예: 중복 이메일 등
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    // data.user 는 auth.users 레코드이며, user_metadata에 위 data가 포함됩니다.
    const { user } = data;
    if (!user) {
      return NextResponse.json({ error: '회원 생성에 실패했습니다.' }, { status: 500 });
    }

    // public.users 테이블에 가입 시 기입한 상세 정보(전화번호, 밴드명, 파트, 활동지역 등) 저장 (트리거 충돌 방지를 위해 upsert 적용)
    const { error: dbError } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        email: email,
        nickname: nickname || name,
        name: name,
        phone: phone || null,
        band_name: bandName || '소속 없음',
        position: position || null,
        address: address || null,
        status: 'pending',
        level: 1, // LV1_GUEST
      }, { onConflict: 'id' });

    if (dbError) {
      console.error('public.users 상세 정보 저장 실패:', dbError.message);
      // 시스템 중단을 유발하지 않고 기록만 남기거나, 에러를 반환
    }

    // 비밀번호는 auth.users에 해시 저장되므로, 클라이언트에 반환 시 제외
    const { email: userEmail, id, user_metadata } = user;
    const response = NextResponse.json(
      {
        id,
        email: userEmail,
        ...(user_metadata || {}),
      },
      { status: 201 }
    );

    // optional: 쿠키에 email 저장 (로그인 후 자동 로그인은 별도 구현 필요)
    response.cookies.set('email', userEmail || '', {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (e) {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 500 });
  }
}
