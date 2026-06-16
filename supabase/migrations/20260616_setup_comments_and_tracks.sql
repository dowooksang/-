-- 1️⃣ comments 테이블 생성 (댓글 저장용)
CREATE TABLE IF NOT EXISTS public.comments (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id     uuid        REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id     uuid        REFERENCES public.users(id) ON DELETE SET NULL,
  content     text        NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- 인덱스 추가 (조회 성능 최적화)
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON public.comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);

-- RLS 비활성화 (보안 통제는 애플리케이션 단에서 수행하며, RLS 오작동 방지)
ALTER TABLE public.comments DISABLE ROW LEVEL SECURITY;


-- 2️⃣ posts 테이블에 컬럼 추가 (음원, 이미지, 비디오 연동용)
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS track_url text;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS video_url text;


-- 3️⃣ Supabase Storage 버킷 생성 및 RLS 정책 세팅
-- images 버킷 생성 및 public 설정 (중복 에러 방지 처리 완료)
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- tracks 버킷 생성 및 public 설정 (중복 에러 방지 처리 완료)
INSERT INTO storage.buckets (id, name, public)
VALUES ('tracks', 'tracks', true)
ON CONFLICT (id) DO NOTHING;

-- videos 버킷 생성 및 public 설정 (중복 에러 방지 처리 완료)
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO NOTHING;


-- 4️⃣ 기존 RLS 정책 삭제 (중복 생성 에러 'ERROR: 42710' 원천 차단)
DROP POLICY IF EXISTS "Allow Public Access for Images" ON storage.objects;
DROP POLICY IF EXISTS "Allow Public Access for Tracks" ON storage.objects;
DROP POLICY IF EXISTS "Allow Public Access for Videos" ON storage.objects;


-- 5️⃣ RLS 정책 신규 생성 (버킷이 public이므로 누구나 읽고 업로드할 수 있도록 전체 허용 정책 추가)
-- images 버킷에 대한 정책
CREATE POLICY "Allow Public Access for Images" ON storage.objects
  FOR ALL USING (bucket_id = 'images') WITH CHECK (bucket_id = 'images');

-- tracks 버킷에 대한 정책
CREATE POLICY "Allow Public Access for Tracks" ON storage.objects
  FOR ALL USING (bucket_id = 'tracks') WITH CHECK (bucket_id = 'tracks');

-- videos 버킷에 대한 정책
CREATE POLICY "Allow Public Access for Videos" ON storage.objects
  FOR ALL USING (bucket_id = 'videos') WITH CHECK (bucket_id = 'videos');
