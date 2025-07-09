/**
 * A mongoose schema plugin which applies the following in the toJSON transform call:
 *  - removes __v, createdAt, updatedAt, and any path that has private: true
 *  - replaces _id with id
 *  - applies alias mapping (supports nested, arrays, and semicolon-separated alias string)
 */

// TODO: later add correct type any
/* eslint-disable @typescript-eslint/no-explicit-any */

import { parseObject } from '../../commonHelper';

const deleteAtPath = (obj, path, index = 0) => {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) {
    obj.forEach((item) => deleteAtPath(item, path, index));
    return;
  }
  if (index === path.length - 1) {
    delete obj[path[index]];
    return;
  }
  deleteAtPath(obj[path[index]], path, index + 1);
};

const getNestedValue = (obj, pathSegments) => {
  if (!obj) return undefined;
  let current = obj;
  for (let key of pathSegments) {
    if (Array.isArray(current))
      current = current
        .map((item) => item?.[key])
        .filter((v) => v !== undefined);
    else current = current?.[key];

    if (current === undefined) return undefined;
  }
  return current;
};

const setNestedValue = (obj, pathSegments, value) => {
  if (!obj) return;
  let current = obj;
  for (let i = 0; i < pathSegments.length; i++) {
    const key = pathSegments[i];
    if (i === pathSegments.length - 1) {
      current[key] = value;
    } else if (Array.isArray(current[key])) {
      current = current[key];
    } else {
      current[key] = current[key] || {};
      current = current[key];
    }
  }
};

// Helper to rename deeply nested keys, supports arrays
const renameDeepKey = (ret, fromPath, toPath) => {
  const fromSegments = fromPath.split('.');
  const toSegments = toPath.split('.');

  const value = getNestedValue(ret, fromSegments);
  if (value === undefined) return;

  if (Array.isArray(value)) {
    const parentArray = getNestedValue(ret, fromSegments.slice(0, -1));
    if (Array.isArray(parentArray))
      parentArray.forEach((item, idx) => {
        const val = value[idx];
        if (val !== undefined)
          setNestedValue(item, [toSegments[toSegments.length - 1]], val);
      });
  } else {
    setNestedValue(ret, toSegments, value);
  }

  deleteAtPath(ret, fromSegments);
};

// Parser for your alias string input
const parseAliasString = (aliasString) => {
  const aliasMap = {};
  const parts = aliasString
    .split(';')
    .map((p) => p.trim())
    .filter(Boolean);

  for (const part of parts) {
    const [from, to] = part.split(':').map((s) => s.trim());
    if (from && to) aliasMap[from] = to;
  }
  return aliasMap;
};

interface ToJSONOptions {
  includeTimeStamps?: boolean;
  alias?: string | Record<string, string>;
}

// TODO: later add correct type any

// interface Schema {
//   options: {
//     toJSON: {
//       transform?: Function;
//     };
//   };
//   paths: {
//     [key: string]: {
//       options: {
//         private?: boolean;
//       };
//     };
//   };
// }

const toJSON = (schema: any) => {
  const existingTransform = schema.options.toJSON?.transform;

  schema.options.toJSON = {
    ...schema.options.toJSON,
    transform(
      doc: Record<string, string>,
      ret: any,
      options: ToJSONOptions = {},
    ) {
      // Remove private fields
      Object.keys(schema.paths).forEach((path) => {
        if (schema.paths[path]?.options?.private)
          deleteAtPath(ret, path.split('.'));
      });

      ret.id = ret._id?.toString();

      if (options.includeTimeStamps) {
        ret.createdAt = ret.createdAt || doc.createdAt;
        ret.updatedAt = ret.updatedAt || doc.updatedAt;
      } else {
        delete ret.createdAt;
        delete ret.updatedAt;
      }

      delete ret._id;
      delete ret.__v;
      delete ret.password;

      ret = parseObject(ret);

      // if (!options.includeTimeStamps) {
      //   delete ret.createdAt;
      //   delete ret.updatedAt;
      // }

      // Apply alias mapping
      if (options.alias) {
        let aliasObject = options.alias;
        if (typeof options.alias === 'string')
          aliasObject = parseAliasString(options.alias);

        for (const [fromPath, toPath] of Object.entries(aliasObject))
          renameDeepKey(ret, fromPath, toPath);
      }

      if (existingTransform) return existingTransform(doc, ret, options);

      return ret;
    },
    virtuals: true,
    getters: true,
  };
};

export default toJSON;
