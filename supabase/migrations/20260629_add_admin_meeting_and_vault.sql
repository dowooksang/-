-- 1️⃣ 기존 posts RLS 정책 교체 (일반 게시글 RLS에서 meeting 제외)
DROP POLICY IF EXISTS "Allow general posts for everyone" ON public.posts;

CREATE POLICY "Allow general posts for everyone" ON public.posts
  FOR ALL
  USING (board_type NOT IN ('council', 'meeting'))
  WITH CHECK (board_type NOT IN ('council', 'meeting'));

-- 2️⃣ 신규 운영진 작전 회의실(board_type = 'meeting') RLS 정책 생성 (Level 5 이상 전용)
DROP POLICY IF EXISTS "Allow meeting posts for admins only" ON public.posts;

CREATE POLICY "Allow meeting posts for admins only" ON public.posts
  FOR ALL
  USING (board_type = 'meeting' AND public.get_user_level() >= 5)
  WITH CHECK (board_type = 'meeting' AND public.get_user_level() >= 5);


-- 3️⃣ 기존 comments RLS 정책 교체 (일반 댓글 RLS에서 meeting 글의 댓글 제외)
DROP POLICY IF EXISTS "Allow general comments for everyone" ON public.comments;

CREATE POLICY "Allow general comments for everyone" ON public.comments
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE posts.id = comments.post_id AND posts.board_type NOT IN ('council', 'meeting')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE posts.id = comments.post_id AND posts.board_type NOT IN ('council', 'meeting')
    )
  );

-- 4️⃣ 신규 운영진 작전 회의실 댓글 RLS 정책 생성 (Level 5 이상 전용)
DROP POLICY IF EXISTS "Allow meeting comments for admins only" ON public.comments;

CREATE POLICY "Allow meeting comments for admins only" ON public.comments
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE posts.id = comments.post_id AND posts.board_type = 'meeting'
    )
    AND public.get_user_level() >= 5
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE posts.id = comments.post_id AND posts.board_type = 'meeting'
    )
    AND public.get_user_level() >= 5
  );


-- 5️⃣ 최고관리자 전용 비공개(Private) 버킷 생성 및 RLS 적용
-- 5-1) ceo-vault 버킷 추가 (기존에 없을 경우에만 생성, public = false로 비공개 설정)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('ceo-vault', 'ceo-vault', false, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- 5-2) ceo-vault 버킷 내의 objects에 대한 RLS 정책 생성 (Level 6 최고관리자 단독 접근)
DROP POLICY IF EXISTS "Allow CEO full access to ceo-vault" ON storage.objects;

CREATE POLICY "Allow CEO full access to ceo-vault" ON storage.objects
  FOR ALL
  USING (bucket_id = 'ceo-vault' AND public.get_user_level() = 6)
  WITH CHECK (bucket_id = 'ceo-vault' AND public.get_user_level() = 6);
