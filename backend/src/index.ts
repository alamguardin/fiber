import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as fs from 'node:fs/promises';
import { json } from 'node:stream/consumers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = await open({
	filename: path.resolve(__dirname, './db/users.db'),
	driver: sqlite3.Database,
});

await db.exec(/*SQL*/ `
    CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER,
        user_id INTEGER,
        body TEXT,
        created_at TEXT
    )
`);

// const commentsList = JSON.parse(
// 	await fs.readFile(path.join(__dirname, './mock/comments.json'), {
// 		encoding: 'utf8',
// 	}),
// );

// const stmt = await db.prepare(
// 	'INSERT INTO comments (post_id, user_id, body, created_at) VALUES (?,?,?,?)',
// );

// for (const comment of commentsList) {
// 	stmt.run(comment.postId, comment.userId, comment.body, comment.createdAt);
// }

// await stmt.finalize();

// await db.close();

const app = new Hono();

app.get('/', (c) => {
	return c.json({
		users: 'http://localhost:3000/api/users',
		posts: 'http://localhost:3000/api/posts',
		comments: 'http://localhost:3000/api/comments',
	});
});

app.get('/api/users', async (c) => {
	const users = await db.all('SELECT * FROM users');
	return c.json(users);
});

app.get('/api/posts', async (c) => {
	const posts = await db.all('SELECT * FROM posts');
	return c.json(posts);
});

app.get('/api/comments', async (c) => {
	const comments = await db.all('SELECT * FROM comments');
	return c.json(comments);
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
	fetch: app.fetch,
	port,
});
