
-- Update the profiles table constraints to allow only 'applicant' or 'alumni' for role values
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('applicant', 'alumni'));
