-- 1️⃣ site_settings 테이블 RLS 비활성화 (일반 anon 클라이언트에서 upsert가 가능하도록 설정)
ALTER TABLE public.site_settings DISABLE ROW LEVEL SECURITY;

-- 2️⃣ board_permissions 테이블 신설 (게시판별 읽기/쓰기 등급 권한)
CREATE TABLE IF NOT EXISTS public.board_permissions (
  category     text        PRIMARY KEY,
  read_level   integer     NOT NULL DEFAULT 1 CHECK (read_level BETWEEN 1 AND 6),
  write_level  integer     NOT NULL DEFAULT 2 CHECK (write_level BETWEEN 1 AND 6),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- RLS 비활성화
ALTER TABLE public.board_permissions DISABLE ROW LEVEL SECURITY;

-- 3️⃣ 기본 카테고리 권한 데이터 삽입
INSERT INTO public.board_permissions (category, read_level, write_level) VALUES
('notice', 1, 5),     -- 공지사항: 준회원(LV1) 이상 읽기 가능, 관리자(LV5) 이상 쓰기 가능
('free', 2, 2),       -- 자유게시판: 정회원(LV2) 이상 읽기/쓰기 가능
('greeting', 1, 1),   -- 가입인사: 준회원(LV1) 이상 읽기/쓰기 가능
('promotion', 2, 2),  -- 홍보게시판: 정회원(LV2) 이상 읽기/쓰기 가능
('market', 2, 2),     -- 장터: 정회원(LV2) 이상 읽기/쓰기 가능
('archive', 2, 2),    -- 자료실: 정회원(LV2) 이상 읽기/쓰기 가능
('qa', 1, 1),         -- Q&A: 준회원(LV1) 이상 읽기/쓰기 가능
('press', 1, 5),      -- 보도자료: 준회원(LV1) 이상 읽기 가능, 관리자(LV5) 이상 쓰기 가능
('event', 1, 5)       -- 이벤트: 준회원(LV1) 이상 읽기 가능, 관리자(LV5) 이상 쓰기 가능
ON CONFLICT (category) DO NOTHING;
