import {drizzle} from 'drizzle-orm/op-sqlite';
import {open} from '@op-engineering/op-sqlite';
import * as schema from './schema';

// open db
export const sqlite = open({
  name: 'app.db',
});

sqlite.execute('PRAGMA foreign_keys = ON;');

// drizzle instance
export const db = drizzle(sqlite, {
  schema,
  logger: __DEV__, // optional: log queries in dev
});
