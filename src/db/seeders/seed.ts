import {sqlite} from '../client';
import {addProvidersSeeder} from './add_providers';
import {addUserSeeder} from './add_user';

export async function seedDatabase() {
  // 1. create seed tracker table
  await sqlite.execute(`
    CREATE TABLE IF NOT EXISTS __seeds (
      id TEXT PRIMARY KEY
    );
  `);

  // 2. check if already seeded
  const result = await sqlite.execute(`SELECT id FROM __seeds WHERE id = ?`, ['init']);

  const alreadySeeded = (result?.rows ?? result ?? []).length > 0;

  if (alreadySeeded) {
    console.log('🌱 Seed already applied');
    return;
  }

  // 3. run seeders
  console.log('🌱 Running seed...');

  // seed 01: add providers
  await addProvidersSeeder();
  // seed 02: add user
  await addUserSeeder();

  // 4. mark as seeded
  await sqlite.execute(`INSERT INTO __seeds (id) VALUES (?)`, ['init']);

  console.log('🌱 Seed completed');
}
