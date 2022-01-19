CREATE POLICY "only note author can see note-tags"
    ON note_tags
    FOR SELECT
    USING (auth.uid() = (SELECT user_id FROM notes WHERE id = note_id));

CREATE POLICY "only note author can delete note-tags"
    ON note_tags
    FOR DELETE
    USING (auth.uid() = (SELECT user_id FROM notes WHERE id = note_id));

CREATE POLICY "only note author and tag author can insert note-tags"
    ON note_tags
    FOR INSERT
    WITH CHECK (
        auth.uid() = (SELECT user_id FROM notes WHERE id = note_id) AND
        auth.uid() = (SELECT author_id FROM tags WHERE id = tag_id)
    );
