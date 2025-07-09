export const baseResponseCodes = {
  SUCCESS: 0,
  NOT_FOUND: 1,
  ALREADY_EXISTS: 2,
  INVALID_FIELDS: 3,
  ERROR: 4,
} as const;

export type BaseResponseCodeKey = keyof typeof baseResponseCodes;

export interface EntityDefinition {
  name: string;
  customCodes?: string[];
}

export interface EntityWithKey extends EntityDefinition {
  key: number;
}

const entitiesAndCustomCodes: EntityDefinition[] = [{ name: 'Products' }];

export const generateEntitiesWithKeys = (
  entities: EntityDefinition[],
): EntityWithKey[] => {
  let lastKey = 1000;

  return entities.map((entity) => {
    const entityWithKey: EntityWithKey = {
      ...entity,
      key: lastKey,
    };
    lastKey += 1000;
    return entityWithKey;
  });
};

// Final result with keys
export const entities = generateEntitiesWithKeys(entitiesAndCustomCodes);
