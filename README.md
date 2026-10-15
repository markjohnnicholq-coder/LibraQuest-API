# LibraQuest API

Backend API for **LibraQuest**, a tournament game for the SorSU Bulan Campus library.
CS 313 Software Engineering 1, A.Y. 2026-2027.

- Developer: Mark John Nichol R. Quezon (markjohnnicholq-coder), BSCS 3-2
- Group and game concept: LibraQuest

This is my own build of my group's game concept. Every commit in this repository was made by me, with Git, on my own computer or in my own Codespace.

## Tech stack

| Layer              | Tool                           |
| ------------------ | ------------------------------ |
| Runtime            | Node.js 22 LTS or newer        |
| Web framework      | Express 5                      |
| Database           | PostgreSQL 16 or newer         |
| ORM and migrations | Sequelize 6 with sequelize-cli |

## Setup

```
git clone https://github.com/markjohnnicholq-coder/LibraQuest-API.git
cd LibraQuest-API
npm install
```

Copy `.env.example` to `.env`, then put your own PostgreSQL password in `DB_PASSWORD`.

```
npm run db:create     (first time only)
npm run db:migrate
npm run db:seed
npm run db:check
npm run dev
```

## Environment variables

| Key         | Example        | Purpose                                                                                       |
| ----------- | -------------- | --------------------------------------------------------------------------------------------- |
| NODE_ENV    | development    | Which config block to use                                                                     |
| PORT        | 3001           | Port the API listens on (the library assigns the final port at deployment)                    |
| DB_HOST     | 127.0.0.1      | PostgreSQL host                                                                               |
| DB_PORT     | 5432           | PostgreSQL port                                                                               |
| DB_NAME     | your_game_slug | Database name: your game slug, with underscores                                               |
| DB_USER     | postgres       | Database user                                                                                 |
| DB_PASSWORD | (your own)     | Database password. Never commit this.                                                         |
| HUB_API_KEY | dev-hub-key    | Key the Library Game Hub sends to read results. The library gives the real one at deployment. |

## Endpoints (Hub Contract v1.2)

Base URL: `http://localhost:3001/api/v1`

| Method | Path       | Purpose                                                                                       | Success                             |
| ------ | ---------- | --------------------------------------------------------------------------------------------- | ----------------------------------- |
| GET    | /health    | Is the API up and can it reach the database?                                                  | 200 (503 when the database is down) |
| GET    | /game-info | Slug, name, group, developer, description, player limits, version                             | 200                                 |
| GET    | /results   | Finished games, every player, and the top 3. Needs the `X-Hub-Key` header. Optional `?since=` | 200 (401 without the key)           |

## What "completed" means in my game

A player completed the game when they have finished answering all questions in the active game session, even if some answers were incorrect or timed out.

## Tables

1. `users` - Player and host accounts, school IDs, full names, emails, and roles (Design Change Notice 01).
2. `question_sets` - Question sets and modules categorized by subject and grade level.
3. `questions` - Questions belonging to a question set, including choices, correct answers, and time limits.
4. `game_sessions` - Game sessions hosted by users with a unique 6-digit join code and status lifecycle.
5. `players` - Player session seats tracking nicknames, scores, completion status, and the rejoin rule constraint.
6. `answers` - Individual question submissions recording player choices, response times, and stars earned.

## Database scripts

| Command                   | What it does                                                         |
| ------------------------- | -------------------------------------------------------------------- |
| npm run db:migrate        | Runs migrations that have not run yet                                |
| npm run db:migrate:status | Lists every migration as up or down                                  |
| npm run db:seed           | Loads the seed data                                                  |
| npm run db:check          | Counts the rows in every table                                       |
| npm run db:reset          | Empties the database, rebuilds every table and reloads the seed data |
| npm run check             | Runs the same automatic check that GitHub runs after every push      |
