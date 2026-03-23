-- Drop existing tables in correct order (to handle foreign key constraints)
DROP TABLE IF EXISTS public.votes CASCADE;
DROP TABLE IF EXISTS public.comments CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Drop the trigger function if it exists
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Now run the full schema.sql after this
