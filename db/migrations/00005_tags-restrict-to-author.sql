CREATE POLICY "restrict tags to author"
    ON tags
    FOR ALL
    USING (auth.uid() = author_id);
