import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon')
    ? { rejectUnauthorized: false }
    : false,
});

const sql = `
DROP TABLE IF EXISTS student_exam_attempts CASCADE;
DROP TABLE IF EXISTS choices CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS exams CASCADE;
DROP TABLE IF EXISTS resources CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS session CASCADE;
DROP TABLE IF EXISTS account CASCADE;
DROP TABLE IF EXISTS verification CASCADE;
DROP TABLE IF EXISTS rate_limit CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;

CREATE TABLE "user" (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  email_verified boolean NOT NULL DEFAULT false,
  image text,
  role varchar(20) NOT NULL DEFAULT 'student',
  department_id integer,
  year integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE session (
  id text PRIMARY KEY,
  expires_at timestamptz NOT NULL,
  token text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  ip_address text,
  user_agent text,
  user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
);
CREATE INDEX session_userId_idx ON session(user_id);

CREATE TABLE account (
  id text PRIMARY KEY,
  account_id text NOT NULL,
  provider_id text NOT NULL,
  user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  access_token text,
  refresh_token text,
  id_token text,
  access_token_expires_at timestamptz,
  refresh_token_expires_at timestamptz,
  scope text,
  password text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX account_userId_idx ON account(user_id);

CREATE TABLE verification (
  id text PRIMARY KEY,
  identifier text NOT NULL,
  value text NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX verification_identifier_idx ON verification(identifier);

CREATE TABLE rate_limit (
  id text PRIMARY KEY,
  key text NOT NULL UNIQUE,
  count integer NOT NULL,
  last_request bigint NOT NULL
);

CREATE TABLE departments (
  id serial PRIMARY KEY,
  name varchar(255) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE "user"
  ADD CONSTRAINT user_department_id_fkey
  FOREIGN KEY (department_id) REFERENCES departments(id);

CREATE TABLE courses (
  id serial PRIMARY KEY,
  name varchar(255) NOT NULL,
  department_id integer NOT NULL REFERENCES departments(id),
  year integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE resources (
  id serial PRIMARY KEY,
  course_id integer NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title varchar(255) NOT NULL,
  type varchar(20) NOT NULL,
  url text NOT NULL,
  public_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE exams (
  id serial PRIMARY KEY,
  course_id integer NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title varchar(255) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE questions (
  id serial PRIMARY KEY,
  exam_id integer NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE choices (
  id serial PRIMARY KEY,
  question_id integer NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  choice_text text NOT NULL,
  is_correct boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE student_exam_attempts (
  id serial PRIMARY KEY,
  student_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  exam_id integer NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  score decimal(5, 2),
  submitted_at timestamptz NOT NULL DEFAULT now()
);
`;

async function run() {
  const client = await pool.connect();
  try {
    await client.query(sql);
    console.log('LMS schema reset successfully');
  } catch (err) {
    console.error('Reset failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
