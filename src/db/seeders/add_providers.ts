import {providerOptions} from '@/constants/options';
import {ProviderRepo} from '../repositories';

export const addProvidersSeeder = async () => {
  const providerRepo = new ProviderRepo();

  const now = Date.now();

  const seedDatas: {
    name: string;
    identifier: string;
    logo: string;
    createdAt: number;
    updatedAt: number;
  }[] = providerOptions.map(provider => {
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
