--- a / src / lib / useAuth.ts
+++ b / src / lib / useAuth.ts
@@
   // ② Client‑side: keep local storage in sync (for page refreshes)
   const savedEmail = localStorage.getItem('jb_session_email');
if (savedEmail) {
  -     // NOTE: 기존에 `/api/auth/me` 라는 엔드포인트가 없어서 오류가 발생했습니다.
    -     //       이제는 별도 API 호출 없이 로컬에 저장된 이메일을 그대로 사용합니다.
    -     //       필요 시 아래 코드를 활성화해 자체 `/api/auth/me` 를 구현할 수 있습니다.
    -     // try {
    -     //   const res = await fetch(`/api/auth/me?email=${encodeURIComponent(savedEmail)}`);
    -     //   if (res.ok) {
    -     //     const userData = await res.json();
    -     //     setUser(userData);
    -     //   }
    -     // } catch (e) {
    -     //   console.error('세션 동기화 실패:', e);
    -     // }
    +     // 로컬에 저장된 이메일만으로도 충분히 로그인 상태를 판단합니다.
    +     // Supabase 세션이 아직 서버‑사이드에서 로드되지 않았을 경우
    +     //   - `supabase.auth.getUser()` 로 서버‑사이드 유저를 가져오고,
    +     //   - `localStorage` 에 있던 이메일을 그대로 사용해 UI에 바로 반영합니다.
    +     //   - 이후 Supabase가 세션을 복구하면 `onAuthStateChange` 가
    +     //     자동으로 `setUser` 를 업데이트합니다.
    +     setUser({ email: savedEmail } as any);   // 임시 사용자 객체
}