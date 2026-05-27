export enum UserLevel {
  LV1_GUEST = 1, // 준회원 (회원가입 직후)
  LV2_MEMBER = 2, // 정회원 (지부 인증 완료)
  LV3_EXCELLENT = 3, // 우수회원 (활동 우수, 공동 행사 참여)
  LV4_MANAGER = 4, // 지부장급 (네트워크, 소속 회원 승인 권한)
  LV5_ADMIN = 5, // 관리자 (연합회 총괄 본부 스태프)
  LV6_CEO = 6 // 대표이사 (최고 권한, 최종 의사결정)
}
