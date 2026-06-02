create table admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  level integer not null default 6,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password_hash text not null,
  phone text,
  branch text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
