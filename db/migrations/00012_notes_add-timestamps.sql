ALTER TABLE notes
    ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE FUNCTION public.handle_note_update()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_note_updated
    BEFORE UPDATE ON notes
    FOR EACH ROW EXECUTE PROCEDURE public.handle_note_update();
