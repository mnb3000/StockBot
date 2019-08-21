import { createConnection } from 'typeorm';
import { seedDatabase } from './seedDatabase';

export async function bootstrapDatabase() {
  await createConnection();
  await seedDatabase();
}
