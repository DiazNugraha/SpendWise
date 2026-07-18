import {providerOptions} from '@/constants/options';
import {ProviderRepo} from '../repositories';
import {db} from '../client';
import {providers} from '../schema';

export const addProvidersSeeder = async () => {
  const providerRepo = new ProviderRepo();

  const now = Date.now();

  const existingProviders = await db.select().from(providers);

  const filteredProviderOptions = providerOptions.filter(e => !existingProviders.find(x => x.identifier === e.value));

  if (filteredProviderOptions.length < 1) return;

  const seedDatas: {
    name: string;
    identifier: string;
    logo: string;
    createdAt: number;
    updatedAt: number;
  }[] = filteredProviderOptions.map(provider => {
    return {
      name: provider.label,
      identifier: provider.value,
      logo: provider.value,
      createdAt: now,
      updatedAt: now,
    };
  });

  return await providerRepo.createProviders(seedDatas);
};
