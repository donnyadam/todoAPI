CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users(
  user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL UNIQUE,
  user_password TEXT NOT NULL
);

CREATE SEQUENCE checklist_id_seq;

CREATE TABLE checklist(
  checklist_id integer PRIMARY KEY DEFAULT nextval('checklist_id_seq'),
  checklist_title TEXT,
);

CREATE SEQUENCE todos_id_seq;

CREATE TABLE todos(
  todos_id integer NOT NULL DEFAULT nextval('todos_id_seq'),
  checklist_id integer,
  todos_item TEXT NOT NULL,
  complete boolean NOT NULL,
  FOREIGN KEY (checklist_id) REFERENCES checklist(checklist_id)
)