import { getRepository } from 'typeorm';
import { User } from '../entities';

export async function seedDatabase() {
  const userRepository = getRepository(User);

  await userRepository.save([
    {
      tgId: 73628236,
      firstName: 'Misha',
      lastName: 'mnb3000',
      username: 'mnb3000',
    },
  ]);
}
