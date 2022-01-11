CREATE TABLE tags (
    id uuid DEFAULT uuid_generate_v4(),
    author_id uuid REFERENCES auth.users NOT NULL,
    name varchar(255) NOT NULL,
    PRIMARY KEY(id),
    UNIQUE(author_id, name)
);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
