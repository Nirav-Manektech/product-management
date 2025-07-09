import { Types } from 'mongoose';

export type ParseObjectType =
  | Record<string, string>
  | string
  | number
  | boolean
  | null
  | Date
  | undefined
  | Types.ObjectId
  | { [key: string]: ParseObjectType }
  | ParseObjectType[];

export const getObjectId = (value: string | Types.ObjectId): Types.ObjectId => {
  if (value instanceof Types.ObjectId) return value;

  if (Types.ObjectId.isValid(value)) return new Types.ObjectId(value);

  throw new Error('Invalid ObjectId');
};

export const capitalize = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1);

export function normalizeObjectIds(
  ids?: (Types.ObjectId | string)[],
): Types.ObjectId[] | undefined {
  if (!ids) return undefined;

  const uniqueIds = new Set<string>();
  const deduped: Types.ObjectId[] = [];

  for (const id of ids) {
    const strId = id.toString();
    if (!uniqueIds.has(strId)) {
      uniqueIds.add(strId);
      deduped.push(new Types.ObjectId(strId));
    }
  }

  return deduped;
}

export const parseObject = (passObj: ParseObjectType): ParseObjectType => {
  if (Array.isArray(passObj)) return passObj.map(parseObject);

  if (passObj instanceof Types.ObjectId) return { id: passObj.toString() };

  if (passObj instanceof Date) return passObj;

  if (passObj && typeof passObj === 'object') {
    const newObj: Record<string, ParseObjectType> = {};
    for (const key in passObj)
      if (Object.prototype.hasOwnProperty.call(passObj, key))
        newObj[key] = parseObject(passObj[key]);

    return newObj;
  }

  return passObj;
};
