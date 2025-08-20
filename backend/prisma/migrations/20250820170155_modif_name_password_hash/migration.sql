-- Make the migration resilient: handle "password" OR "passwordHach" -> "passwordHash"
DO $$
BEGIN
  -- Case A: if passwordHash missing but passwordHach exists, rename it
  IF NOT EXISTS (
       SELECT 1 FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'passwordHash'
     )
     AND EXISTS (
       SELECT 1 FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'passwordHach'
     )
  THEN
    EXECUTE 'ALTER TABLE public.users RENAME COLUMN "passwordHach" TO "passwordHash"';
  END IF;

  -- Case B: if passwordHash missing but password exists, rename it
  IF NOT EXISTS (
       SELECT 1 FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'passwordHash'
     )
     AND EXISTS (
       SELECT 1 FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'password'
     )
  THEN
    EXECUTE 'ALTER TABLE public.users RENAME COLUMN "password" TO "passwordHash"';
  END IF;

  -- Case C: if passwordHash still missing, create it
  IF NOT EXISTS (
       SELECT 1 FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'passwordHash'
     )
  THEN
    EXECUTE 'ALTER TABLE public.users ADD COLUMN "passwordHash" VARCHAR(200)';
  END IF;

  -- If legacy columns still exist alongside passwordHash, backfill then drop them
  IF EXISTS (
       SELECT 1 FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'passwordHach'
     )
     AND EXISTS (
       SELECT 1 FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'passwordHash'
     )
  THEN
    EXECUTE 'UPDATE public.users SET "passwordHash" = COALESCE("passwordHash", "passwordHach")';
    EXECUTE 'ALTER TABLE public.users DROP COLUMN "passwordHach"';
  END IF;

  IF EXISTS (
       SELECT 1 FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'password'
     )
     AND EXISTS (
       SELECT 1 FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'passwordHash'
     )
  THEN
    EXECUTE 'UPDATE public.users SET "passwordHash" = COALESCE("passwordHash", "password")';
    EXECUTE 'ALTER TABLE public.users DROP COLUMN "password"';
  END IF;

  -- Enforce type & NOT NULL (fill empties just in case)
  EXECUTE 'ALTER TABLE public.users ALTER COLUMN "passwordHash" TYPE VARCHAR(200)';
  EXECUTE 'UPDATE public.users SET "passwordHash" = '''' WHERE "passwordHash" IS NULL';
  EXECUTE 'ALTER TABLE public.users ALTER COLUMN "passwordHash" SET NOT NULL';
END $$;
