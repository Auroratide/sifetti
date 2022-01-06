CREATE POLICY "restrict to author"
    ON notes
    FOR ALL
    USING (auth.uid() = user_id);
