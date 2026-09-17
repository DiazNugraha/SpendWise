interface IUserSchema {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string | null;
  primaryCurrencyCode: string | null;
  isGuest: boolean;
  avatarUrl: string | null;
  createdAt: number;
  updatedAt: number;
}

interface IUserProviderSchema {
  id: string;
  userId: string;
  providerId: string;
  identifier: string;
  createdAt: number;
  updatedAt: number;
}
