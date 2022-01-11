CREATE TABLE note_tags (
    note_id uuid REFERENCES notes (id) NOT NULL,
    tag_id uuid REFERENCES tags (id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (note_id, tag_id)
)
