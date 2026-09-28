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
  identifier: string;
  description: string | null;
  createdAt: number;
  updatedAt: number;
}
