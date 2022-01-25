ALTER TABLE people DROP CONSTRAINT people_id_fkey;
ALTER TABLE people ADD CONSTRAINT people_id_fkey
    FOREIGN KEY (id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;
