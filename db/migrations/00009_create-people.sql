CREATE TABLE people (
    id uuid REFERENCES auth.users NOT NULL,
    -- Whitelist some characters, no consecutive spaces
    unique_name varchar(64) CHECK (unique_name ~ '^[a-zA-Z0-9](?!.*  )(?!.* $)[a-zA-Z0-9 _\-]*$'),
    PRIMARY KEY (id),
    UNIQUE (unique_name)
);

ALTER TABLE people ENABLE ROW LEVEL SECURITY;

CREATE POLICY "people viewable publicly"
    ON people
    FOR SELECT
    USING (true);

CREATE POLICY "people insert into their own profile"
    ON people
    FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "people update their own profile"
    ON people
    FOR UPDATE
    USING (auth.uid() = id);

CREATE UNIQUE INDEX lower_unique_name_idx ON people (LOWER(unique_name));

-- People may already exist on the system
INSERT INTO people (id) SELECT id FROM auth.users;

-- Create trigger within this transaction to prevent in-between periods
CREATE FUNCTION public.handle_new_person()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public
AS $$
BEGIN
    INSERT INTO public.people (id) VALUES (new.id);
    RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_person();
