import { serve } from '@hono/node-server';
import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => {
	return c.text('Hello Hono!');
});

app.get('/api/hello', (c) => {
	return c.json({
		ok: true,
		message: 'Hello Fiber!',
	});
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
	fetch: app.fetch,
	port,
});
