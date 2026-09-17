type entityType = 'BUDGET' | 'EXPENSE' | 'EXPENSE_PROVIDER' | 'PROVIDER' | 'USER' | 'USER_PROVIDER';

type syncStatusType = 'PENDING' | 'SYNCED' | 'FAILED';

type operationType = 'CREATE' | 'UPDATE' | 'DELETE';

interface ISyncQueueSchema {
  id: string;
  entityType: string;
  entityId: string;
  syncStatus: string;
  operation: string;
  retryCount: number;
  lastError: string | null;
  createdAt: number;
  updatedAt: number;
}
