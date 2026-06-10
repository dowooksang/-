/*
  Supabase 초기 스키마 파일
  프로젝트 루트의 supabase/migrations/20240526_init.sql 에 위치합니다.
  아래 SQL 문을 Supabase 프로젝트의 'SQL editor' 혹은 CLI `supabase db push` 로 적용하면
  users, posts, branches 테이블이 생성됩니다.
*/

-- 1️⃣ users 테이블 (회원 정보)
CREATE TABLE IF NOT EXISTS public.users (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  email       text        NOT NULL UNIQUE,
  password    text,                       -- bcrypt 해시 값 (null 허용: 소셜 로그인 시)
  nickname    text        NOT NULL,
  name        text        NOT NULL,
  phone       text,
  band_name   text,
  position    text,
  address     text,
  status      text        NOT NULL CHECK (status IN ('pending', 'active')),
  level       integer     NOT NULL CHECK (level BETWEEN 1 AND 6),
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- 2️⃣ posts 테이블 (커뮤니티 게시글)
CREATE TABLE IF NOT EXISTS public.posts (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text        NOT NULL,
  content     text        NOT NULL,
  author      text        NOT NULL,
  author_id   uuid        REFERENCES public.users(id) ON DELETE SET NULL,
  category    text        NOT NULL DEFAULT 'free',
  views       integer     NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- 3️⃣ branches 테이블 (지부 관리)
CREATE TABLE IF NOT EXISTS public.branches (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text        NOT NULL,
  manager_name  text        NOT NULL,
  manager_phone text,
  region        text,
  has_practice  boolean     NOT NULL DEFAULT false,
  band_count    integer     NOT NULL DEFAULT 0,
  status        text        NOT NULL CHECK (status IN ('pending', 'approved')),
  user_id       uuid        REFERENCES public.users(id) ON DELETE SET NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- 인덱스 (검색 성능 향상을 위해 선택적으로 추가)
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON public.posts(author_id);
CREATE INDEX IF NOT EXISTS idx_branches_user_id ON public.branches(user_id);
