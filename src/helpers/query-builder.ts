export function applyWhere<T>(query: T, condition: any) {
  return condition ? (query as any).where(condition) : query;
}

export function applyLimit<T>(query: T, limit?: number) {
  return limit !== undefined ? (query as any).limit(limit) : query;
}
