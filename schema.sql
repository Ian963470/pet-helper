-- ── Lost Pets ──────────────────────────────────────────────────────────────────
create table if not exists lost_pets (
  id                    text primary key,
  pet_type              text    not null,
  color                 text    not null,
  size                  text    not null,
  gender                text    not null,
  description           text,
  street                text    not null,
  city                  text    not null,
  contact               text    not null,
  photo                 text,
  timestamp             bigint  not null,
  status                text    not null default 'active',
  owner_code_hash       text,
  pending_found_claim_id text,
  created_at            timestamptz default now()
);

-- ── Sightings ──────────────────────────────────────────────────────────────────
create table if not exists sightings (
  id         text    primary key,
  pet_type   text    not null,
  color      text    not null,
  size       text    not null,
  gender     text    not null,
  street     text    not null,
  city       text    not null,
  phone      text    not null,
  photo      text,
  timestamp  bigint  not null,
  flagged    boolean not null default false,
  created_at timestamptz default now()
);

-- ── Found Claims ───────────────────────────────────────────────────────────────
create table if not exists found_claims (
  id              text    primary key,
  pet_type        text    not null,
  color           text    not null,
  size            text    not null,
  gender          text    not null,
  street          text    not null,
  city            text    not null,
  circumstances   text    not null,
  finder_name     text    not null,
  finder_phone    text    not null,
  finder_email    text    not null,
  photo           text,
  timestamp       bigint  not null,
  expires_at      bigint  not null,
  status          text    not null default 'pending',
  matched_pet_id  text,
  created_at      timestamptz default now()
);

-- ── Row Level Security ─────────────────────────────────────────────────────────
alter table lost_pets   enable row level security;
alter table sightings   enable row level security;
alter table found_claims enable row level security;

-- Public read/write for all three tables (no auth on this app)
drop policy if exists "public lost_pets"    on lost_pets;
drop policy if exists "public sightings"    on sightings;
drop policy if exists "public found_claims" on found_claims;

create policy "public lost_pets"    on lost_pets    for all to anon using (true) with check (true);
create policy "public sightings"    on sightings    for all to anon using (true) with check (true);
create policy "public found_claims" on found_claims for all to anon using (true) with check (true);
