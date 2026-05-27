-- 2024-05-27 fix users password column type and clear test data
ALTER TABLE public.users ALTER COLUMN password TYPE TEXT;
-- Delete all existing user rows (test accounts)
DELETE FROM public.users;
