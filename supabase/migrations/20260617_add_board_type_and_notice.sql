-- 1️⃣ posts 테이블에 board_type 컬럼 추가 (기본값 'general', NOT NULL)
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS board_type text NOT NULL DEFAULT 'general';

-- 2️⃣ posts 테이블에 is_notice 컬럼 추가 (기본값 false, NOT NULL)
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS is_notice boolean NOT NULL DEFAULT false;

-- 3️⃣ 사용자 권한 등급을 안전하게 조회하는 SQL 함수 생성 (RLS 내에서 users 테이블 조회를 위해 SECURITY DEFINER 적용)
CREATE OR REPLACE FUNCTION public.get_user_level()
RETURNS integer SECURITY DEFINER AS $$
  SELECT COALESCE((SELECT level FROM public.users WHERE id = auth.uid()), 1);
$$ LANGUAGE sql;

-- 4️⃣ posts 및 comments 테이블 RLS 활성화
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- 5️⃣ 기존 정책 삭제 (중복 생성 에러 방지)
DROP POLICY IF EXISTS "Allow general posts for everyone" ON public.posts;
DROP POLICY IF EXISTS "Allow council posts for managers and admins" ON public.posts;
DROP POLICY IF EXISTS "Allow general comments for everyone" ON public.comments;
DROP POLICY IF EXISTS "Allow council comments for managers and admins" ON public.comments;

-- 6️⃣ posts 테이블 RLS 정책 생성
-- 6-1) 일반 게시판 포스트는 로그인 여부와 관계없이 누구나 읽고 쓸 수 있도록 전체 권한 허용 (기존 동작 호환)
CREATE POLICY "Allow general posts for everyone" ON public.posts
  FOR ALL
  USING (board_type IS DISTINCT FROM 'council')
  WITH CHECK (board_type IS DISTINCT FROM 'council');

-- 6-2) 지부장 회의실 포스트는 오직 지부장급(Level 4) 이상의 회원만 읽고 쓰기 허용
CREATE POLICY "Allow council posts for managers and admins" ON public.posts
  FOR ALL
  USING (board_type = 'council' AND public.get_user_level() >= 4)
  WITH CHECK (board_type = 'council' AND public.get_user_level() >= 4);

-- 7️⃣ comments 테이블 RLS 정책 생성
-- 7-1) 일반 게시판 포스트에 속한 댓글은 누구나 접근 가능
CREATE POLICY "Allow general comments for everyone" ON public.comments
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE posts.id = comments.post_id AND posts.board_type IS DISTINCT FROM 'council'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE posts.id = comments.post_id AND posts.board_type IS DISTINCT FROM 'council'
    )
  );

-- 7-2) 지부장 회의실 포스트에 속한 댓글은 오직 지부장급(Level 4) 이상의 회원만 접근 가능
CREATE POLICY "Allow council comments for managers and admins" ON public.comments
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE posts.id = comments.post_id AND posts.board_type = 'council'
    )
    AND public.get_user_level() >= 4
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE posts.id = comments.post_id AND posts.board_type = 'council'
    )
    AND public.get_user_level() >= 4
  );
