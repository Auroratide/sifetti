ALTER TABLE tags
    ADD CONSTRAINT name_restrict_spaces CHECK (name ~ '^[^\s](?!.*\s\s)(?!.*\s$)[^\n\t\r]*$');
