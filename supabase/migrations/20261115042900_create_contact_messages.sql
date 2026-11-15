create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) between 5 and 200 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  subject text check (subject is null or char_length(subject) <= 150),
  message text not null check (char_length(message) between 10 and 5000),
  ip_hash text,
  email_sent boolean not null default false
);

comment on table public.contact_messages is 'Mensajes del formulario de contacto de conradojulio.com. Solo la Edge Function "contact" escribe aquí (service role).';

-- RLS activado y sin políticas: ni anon ni authenticated pueden leer ni escribir.
alter table public.contact_messages enable row level security;

create index contact_messages_created_at_idx on public.contact_messages (created_at desc);
create index contact_messages_ip_hash_created_at_idx on public.contact_messages (ip_hash, created_at desc);
