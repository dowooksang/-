// 회원 등급 (6단계) 정의
export enum UserLevel {
  LV1_GUEST = 1,     // 준회원 (회원가입 직후)
  LV2_MEMBER = 2,    // 정회원 (지부 인증 완료)
  LV3_EXCELLENT = 3, // 우수회원 (활동 우수, 공동 행사 참여)
  LV4_MANAGER = 4,   // 지부장급 (네트워크, 소속 회원 승인 권한)
  LV5_ADMIN = 5,     // 관리자 (연합회 총괄 본부 스태프)
  LV6_CEO = 6        // 대표이사 (최고 권한, 최종 의사결정)
}

export interface User {
  id: string;
  email: string;
  password?: string; // bcrypt 해시 (Supabase Auth 사용 시 null 가능)
  nickname: string;
  name: string; // 이름
  phone: string; // 연락처
  bandName: string; // 소속 동호회(클럽)명
  position: string; // 악기 파트
  address: string; // 주소
  status: 'pending' | 'active'; // 승인 상태
  level: UserLevel;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId?: string; // 작성자 고유 ID
  createdAt: string;
}

export interface Branch {
  id: string;
  name: string; // 지부 명칭
  managerName: string; // 지부장 성함
  managerPhone: string; // 지부장 연락처
  region: string; // 활동 지역
  hasPracticeRoom: boolean; // 연습실 유무
  bandCount: number; // 소속 밴드 수
  status: 'pending' | 'approved';
  userId: string; // 신청자 고유 ID
  createdAt: string;
}

// Note: In‑memory DB functions have been removed. Use Supabase client instead.
export const db = {}; // dummy export to satisfy imports

