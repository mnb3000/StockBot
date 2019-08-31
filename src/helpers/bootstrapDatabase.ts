import { createConnection } from 'typeorm';

export async function bootstrapDatabase() {
  await createConnection();
}
