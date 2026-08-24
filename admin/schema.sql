-- Внеклассное чтение: схема анонимной аналитики (Supabase)
-- Выполните в SQL Editor проекта Supabase один раз.
-- Затем создайте пользователя автора: Authentication → Users → Add user

create table if not exists public.events (
  id bigserial primary key,
  session_id uuid not null,
  event_name text not null,
  expedition_id text,
  book_id text,
  task_id text,
  survey_id text,
  created_at timestamptz not null default now()
);

create index if not exists events_event_name_idx on public.events (event_name);
create index if not exists events_created_at_idx on public.events (created_at desc);
create index if not exists events_session_event_idx on public.events (session_id, event_name);

alter table public.events enable row level security;

-- Публичный сайт может только писать события (не читать)
drop policy if exists "anon_insert_events" on public.events;
create policy "anon_insert_events"
  on public.events
  for insert
  to anon, authenticated
  with check (
    event_name in (
      'site_opened',
      'expedition_started',
      'book_selected',
      'alice_opened',
      'episode_started',
      'episode_completed',
      'characters_opened',
      'characters_completed',
      'character_quiz_started',
      'character_quiz_completed',
      'character_card_started',
      'character_card_completed',
      'field_task_opened',
      'field_task_completed',
      'achievements_opened',
      'expedition_completed',
      'photo_diary_question_viewed',
      'photo_diary_interest_yes',
      'photo_diary_interest_no',
      'photo_diary_interest_unsure'
    )
    and char_length(coalesce(expedition_id, '')) <= 64
    and char_length(coalesce(book_id, '')) <= 64
    and char_length(coalesce(task_id, '')) <= 64
    and char_length(coalesce(survey_id, '')) <= 64
  );

-- Читать события может только вошедший автор
drop policy if exists "admin_select_events" on public.events;
create policy "admin_select_events"
  on public.events
  for select
  to authenticated
  using (true);

-- Запретить update/delete для anon (по умолчанию без policy = запрещено)
