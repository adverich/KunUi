export type TableItem = Record<string, unknown>;
export type RowKeyOption = string | ((item: TableItem, index: number) => unknown);

const isUsableKey = (value: unknown): boolean => value !== undefined && value !== null && value !== '';

const getPathValue = (item: unknown, path: string | undefined): unknown => {
  if (!item || typeof item !== 'object' || !path) return undefined;
  return path.split('.').reduce((acc: unknown, part: string) => (acc as Record<string, unknown> | undefined)?.[part], item);
};

const getCompositeFallbackKey = (item: unknown): string | null => {
  if (!item || typeof item !== 'object') return null;
  const rec = item as Record<string, unknown>;

  const type = rec?.type ?? rec?.kind ?? rec?.entityType ?? rec?.entity_type;
  const identity = rec?.id ?? rec?.uuid;

  if (!isUsableKey(type) || !isUsableKey(identity)) return null;
  return `${String(type)}-${String(identity)}`;
};

export function resolveRowKeyValue(item: unknown, rowKey: RowKeyOption = 'id', index = -1): unknown {
  if (item === null || item === undefined) return null;

  if (typeof item !== 'object') {
    return isUsableKey(item) ? item : null;
  }

  if (typeof rowKey === 'function') {
    const resolved = (rowKey as (item: TableItem, index: number) => unknown)(item as TableItem, index);
    if (isUsableKey(resolved)) return resolved;
  }

  const normalizedRowKey = typeof rowKey === 'string' && rowKey.trim()
    ? rowKey.trim()
    : 'id';

  const lookupPaths = normalizedRowKey === 'uuid'
    ? ['uuid', 'id']
    : normalizedRowKey === 'id'
      ? ['id', 'uuid']
      : [normalizedRowKey, 'id', 'uuid'];

  for (const path of lookupPaths) {
    const resolved = getPathValue(item, path);
    if (isUsableKey(resolved)) return resolved;
  }

  const compositeFallback = getCompositeFallbackKey(item);
  if (isUsableKey(compositeFallback)) return compositeFallback;

  return null;
}
