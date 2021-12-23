CREATE TABLE notes (
    id uuid DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users NOT NULL,
    title varchar(255),
    content text,
    PRIMARY KEY(id)
)
