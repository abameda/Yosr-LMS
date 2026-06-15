begin;

select plan(16);

select has_table('public', 'users', 'users table exists');
select has_table(
  'public',
  'learner_profiles',
  'learner_profiles table exists'
);
select has_table(
  'public',
  'admin_audit_events',
  'admin_audit_events table exists'
);

select is(
  (
    select jsonb_agg(enumlabel order by enumsortorder)
    from pg_enum
    join pg_type on pg_type.oid = pg_enum.enumtypid
    join pg_namespace on pg_namespace.oid = pg_type.typnamespace
    where pg_namespace.nspname = 'public'
      and pg_type.typname = 'UserRole'
  ),
  '["CUSTOMER", "ADMIN"]'::jsonb,
  'UserRole contains only CUSTOMER and ADMIN'
);

select is(
  (
    select jsonb_agg(enumlabel order by enumsortorder)
    from pg_enum
    join pg_type on pg_type.oid = pg_enum.enumtypid
    join pg_namespace on pg_namespace.oid = pg_type.typnamespace
    where pg_namespace.nspname = 'public'
      and pg_type.typname = 'UserStatus'
  ),
  '["ACTIVE", "DISABLED"]'::jsonb,
  'UserStatus contains only ACTIVE and DISABLED'
);

select ok(
  exists(
    select 1
    from pg_constraint
    where conrelid = to_regclass('public.users')
      and contype = 'u'
      and pg_get_constraintdef(oid) = 'UNIQUE (auth_user_id)'
  ),
  'users.auth_user_id is unique'
);

select ok(
  exists(
    select 1
    from pg_constraint
    where conrelid = to_regclass('public.users')
      and contype = 'u'
      and pg_get_constraintdef(oid) = 'UNIQUE (normalized_email)'
  ),
  'users.normalized_email is unique'
);

select ok(
  exists(
    select 1
    from pg_constraint
    where conrelid = to_regclass('public.learner_profiles')
      and contype = 'u'
      and pg_get_constraintdef(oid) = 'UNIQUE (user_id)'
  ),
  'learner_profiles.user_id is unique'
);

select ok(
  exists(
    select 1
    from pg_constraint
    where conrelid = to_regclass('public.learner_profiles')
      and contype = 'f'
      and confrelid = to_regclass('public.users')
  ),
  'learner_profiles.user_id references users.id'
);

select ok(
  coalesce(
    (
      select relrowsecurity
      from pg_class
      where oid = to_regclass('public.users')
    ),
    false
  ),
  'users has row level security enabled'
);

select ok(
  coalesce(
    (
      select relrowsecurity
      from pg_class
      where oid = to_regclass('public.learner_profiles')
    ),
    false
  ),
  'learner_profiles has row level security enabled'
);

select ok(
  coalesce(
    (
      select relrowsecurity
      from pg_class
      where oid = to_regclass('public.admin_audit_events')
    ),
    false
  ),
  'admin_audit_events has row level security enabled'
);

select is(
  (
    select count(*)
    from pg_policies
    where schemaname = 'public'
      and tablename = 'users'
  ),
  0::bigint,
  'users exposes no browser policy'
);

select is(
  (
    select count(*)
    from pg_policies
    where schemaname = 'public'
      and tablename = 'learner_profiles'
  ),
  0::bigint,
  'learner_profiles exposes no browser policy'
);

select is(
  (
    select count(*)
    from pg_policies
    where schemaname = 'public'
      and tablename = 'admin_audit_events'
  ),
  0::bigint,
  'admin_audit_events exposes no browser policy'
);

select results_eq(
  $$
    select tablename
    from pg_tables
    where schemaname = 'public'
      and tablename in (
        'categories',
        'courses',
        'enrollments',
        'orders',
        'payments',
        'videos'
      )
    order by tablename
  $$,
  array[]::text[],
  'future domain tables are not introduced'
);

select * from finish();

rollback;
