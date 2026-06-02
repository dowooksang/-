create table public.admins (
  id uuid default uuid_generate_v4() primary key,
  email text not null unique,
  level int not null default 6,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
