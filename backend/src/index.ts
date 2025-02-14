import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = await open({
	filename: path.resolve(__dirname, './db/users.db'),
	driver: sqlite3.Database,
});

await db.exec(/*SQL*/ `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        last_name TEXT,
        username TEXT UNIQUE,
        age INTEGER
    )
`);

// const listUsers = [
// 	{ name: 'Jhon', lastName: 'Doe' },
// 	{ name: 'Jay', lastName: 'Stevents' },
// 	{ name: 'Carl', lastName: 'Madison' },
// 	{ name: 'Ferd', lastName: 'MCdonald' },
// 	{ name: 'Anya', lastName: 'Taylor' },
// ];

// const stmt = await db.prepare(
// 	'INSERT INTO users (name, last_name) VALUES (?,?)',
// );

// for (const user of listUsers) {
// 	stmt.run(user.name, user.lastName);
// }

// await stmt.finalize();

// await db.close();

const app = new Hono();

app.get('/', (c) => {
	return c.text('Hello Hono!');
});

app.get('/api/hello', async (c) => {
	const users = await db.all('SELECT * FROM users');
	return c.json(users);
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
	fetch: app.fetch,
	port,
});
