-- ─────────────────────────────────────────────────────────
-- Diseños JK — Schema Supabase
-- Ejecutar en orden en el SQL Editor de Supabase
-- ─────────────────────────────────────────────────────────

-- 1. Perfiles de usuario (role: admin | user)
create table if not exists profiles (
  id      uuid references auth.users on delete cascade primary key,
  role    text not null default 'user'
            check (role in ('admin', 'user')),
  created_at timestamptz default now()
);

-- 2. Leads (configuraciones enviadas)
create table if not exists leads (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz default now(),

  -- Datos del cliente
  nombre              text not null,
  email               text not null,
  telefono            text,

  -- Configuración de la puerta
  ambiente            text not null,
  tipo                text not null,
  material            text not null,
  revestimiento       text not null default 'estandar'
                        check (revestimiento in ('estandar', 'premium')),
  ancho               numeric not null,
  alto                numeric not null,

  -- Instalación
  instalacion         boolean default false,
  localidad           text default '',

  -- Precios
  precio_puerta       numeric,
  precio_instalacion  numeric,

  -- Mercado Pago
  mp_preference_id    text,
  mp_payment_id       text,

  -- Estado
  status              text not null default 'pendiente'
                        check (status in ('pendiente', 'pagado', 'cancelado'))
);

-- ─── Row Level Security ────────────────────────────────────

alter table profiles enable row level security;
alter table leads    enable row level security;

-- Profiles: cada usuario ve solo el suyo
create policy "profiles_own_select" on profiles
  for select using (auth.uid() = id);

create policy "profiles_own_update" on profiles
  for update using (auth.uid() = id);

-- Leads: solo admin puede leer todos los leads
create policy "leads_admin_select" on leads
  for select using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Leads: cualquiera (incluso anónimo) puede crear un lead
-- El insert viene del servidor vía service_role, no del cliente
create policy "leads_service_insert" on leads
  for insert with check (true);

-- Leads: solo admin puede actualizar (webhook de MP)
create policy "leads_admin_update" on leads
  for update using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ─── Trigger: crear perfil automáticamente al registrarse ──

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'user')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ─── Para darle rol admin al dueño (ejecutar manualmente) ──
-- Reemplazar con el UUID real del usuario admin:
--
-- update profiles
-- set role = 'admin'
-- where id = 'UUID-DEL-ADMIN-ACÁ';

-- ─── Índices útiles ────────────────────────────────────────

create index if not exists leads_created_at_idx  on leads (created_at desc);
create index if not exists leads_status_idx       on leads (status);
create index if not exists leads_email_idx        on leads (email);
create index if not exists leads_mp_pref_idx      on leads (mp_preference_id);

-- ─── Tabla de precios — editable desde el dashboard ───────────────────────────
-- Ejecutar en Supabase SQL Editor para habilitar el editor de precios del panel

create table if not exists precios (
  id          uuid primary key default gen_random_uuid(),
  tipo        text not null check (tipo in ('corredera_simple', 'plegable_doble')),
  ancho_max   integer not null,   -- cm (hasta este ancho aplica el precio)
  alto        integer not null,   -- cm
  precio      integer not null,   -- ARS, sin decimales
  activo      boolean default true,
  updated_at  timestamptz default now()
);

alter table precios enable row level security;

-- Todos pueden leer los precios activos (landing + configurador)
create policy "precios_public_select" on precios
  for select using (activo = true);

-- Solo admin puede modificar
create policy "precios_admin_insert" on precios
  for insert with check (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );
create policy "precios_admin_update" on precios
  for update using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Datos iniciales (ejecutar DESPUÉS de crear la tabla)
insert into precios (tipo, ancho_max, alto, precio) values
  ('corredera_simple', 90,  220, 150000),
  ('corredera_simple', 120, 220, 185000),
  ('corredera_simple', 150, 220, 220000),
  ('plegable_doble',   150, 220, 280000),
  ('plegable_doble',   200, 220, 340000)
on conflict do nothing;

-- ─── Migración: revestimiento premium (aluminio anti-humedad) ──────────────────
-- Idempotente: correr en SQL Editor sobre la DB existente para agregar la columna.
alter table leads
  add column if not exists revestimiento text not null default 'estandar';

-- Asegura el check constraint solo si todavía no existe
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'leads_revestimiento_check'
  ) then
    alter table leads
      add constraint leads_revestimiento_check
      check (revestimiento in ('estandar', 'premium'));
  end if;
end $$;

-- ─── Modelos de la galería — fotos editables desde el dashboard ────────────────
-- El dueño sube la foto de cada modelo desde el panel (pestaña "Productos").
-- Correr este bloque completo en el SQL Editor de Supabase.

create table if not exists modelos (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  titulo      text not null,
  tag         text not null,
  tipo        text not null check (tipo in ('corredera_simple', 'plegable_doble')),
  premium     boolean not null default false,
  imagen_url  text,                          -- null → la web usa la foto de respaldo
  alt         text not null default '',
  orden       integer not null default 0,    -- orden en que aparecen en la galería
  activo      boolean default true,
  updated_at  timestamptz default now()
);

alter table modelos enable row level security;

-- Todos pueden ver los modelos activos (la landing los lee)
create policy "modelos_public_select" on modelos
  for select using (activo = true);

-- Solo admin puede crear / modificar
create policy "modelos_admin_insert" on modelos
  for insert with check (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );
create policy "modelos_admin_update" on modelos
  for update using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Datos iniciales: los 6 modelos actuales con sus fotos de respaldo
insert into modelos (slug, titulo, tag, tipo, premium, imagen_url, alt, orden) values
  ('granero-estandar',  'Estilo granero',         'Corrediza simple · Living',          'corredera_simple', false, '/puerta-granero.webp',  'Puerta estilo granero',             1),
  ('granero-premium',   'Estilo granero Premium', 'Aluminio anti-humedad · Living',     'corredera_simple', true,  '/puerta-granero.webp',  'Puerta estilo granero premium',     2),
  ('blanca-estandar',   'Lisa blanca',            'Corrediza simple · Dormitorio',      'corredera_simple', false, '/puerta-blanca.webp',   'Puerta corrediza blanca',           3),
  ('blanca-premium',    'Lisa blanca Premium',    'Aluminio anti-humedad · Baño',       'corredera_simple', true,  '/puerta-blanca.webp',   'Puerta corrediza blanca premium',   4),
  ('plegable-estandar', 'Plegable doble',         'Plegable doble · Ambientes amplios', 'plegable_doble',   false, '/puerta-producto.webp', 'Modelo de puerta plegable',         5),
  ('plegable-premium',  'Plegable doble Premium', 'Aluminio anti-humedad · Amplios',    'plegable_doble',   true,  '/puerta-producto.webp', 'Modelo de puerta plegable premium', 6)
on conflict (slug) do nothing;

-- ─── Storage: bucket público para las fotos de productos ──────────────────────
-- La subida pasa por el servidor con service_role (salta RLS); el bucket público
-- permite que la web muestre las imágenes sin autenticación.
insert into storage.buckets (id, name, public) values ('productos', 'productos', true)
on conflict (id) do nothing;
