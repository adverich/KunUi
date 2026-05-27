const isUsableKey = (value) => value !== undefined && value !== null && value !== '';

const getPathValue = (item, path) => {
  if (!item || typeof item !== 'object' || !path) return undefined;
  return path.split('.').reduce((acc, part) => acc?.[part], item);
};

const getCompositeFallbackKey = (item) => {
  if (!item || typeof item !== 'object') return null;

  const type = item?.type ?? item?.kind ?? item?.entityType ?? item?.entity_type;
  const identity = item?.id ?? item?.uuid;

  if (!isUsableKey(type) || !isUsableKey(identity)) return null;
  return `${type}-${identity}`;
};

export function resolveRowKeyValue(item, rowKey = 'id', index = -1) {
  if (item === null || item === undefined) return null;

  if (typeof item !== 'object') {
    return isUsableKey(item) ? item : null;
  }

  if (typeof rowKey === 'function') {
    const resolved = rowKey(item, index);
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
