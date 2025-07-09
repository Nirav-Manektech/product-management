import Joi, { AnySchema } from 'joi';
import { objectId } from '@/shared/validations/custom.validation.js';

type MongoosePath = {
  instance: string;
  options?: {
    ref?: string;
  };
  isRequired?: boolean | (() => boolean);
  enumValues?: unknown[];
};

type MongooseSchemaLike = {
  paths: {
    [key: string]: MongoosePath;
  };
};

const mongooseToJoiTypeMap: Record<string, AnySchema> = {
  String: Joi.string(),
  Number: Joi.number(),
  Boolean: Joi.boolean(),
  Date: Joi.date(),
  ObjectId: Joi.string().custom(objectId),
  Array: Joi.array().items(Joi.string()),
};

/**
 * Helper to generate Joi type for a MongoosePath
 */
const generateJoiForPath = (
  path: MongoosePath,
  isUpdate: boolean,
): AnySchema => {
  let joiType = mongooseToJoiTypeMap[path.instance] || Joi.any();

  if (path.options?.ref) joiType = Joi.string().custom(objectId);

  if (path.instance === 'Array' && path.options?.ref)
    joiType = Joi.array().items(Joi.string().custom(objectId));

  if (path.enumValues?.length) joiType = joiType.valid(...path.enumValues);

  const isRequired =
    typeof path.isRequired === 'function' ? path.isRequired() : path.isRequired;

  joiType = isUpdate
    ? joiType.optional()
    : isRequired
      ? joiType.required()
      : joiType.optional();

  return joiType;
};

/**
 * Generate Joi validation schema from Mongoose schema paths recursively
 * Handles nested paths like "phone.dialCode"
 * @param paths - The mongoose schema paths
 * @param isUpdate - Whether validation is for update operation
 * @returns Joi schema object
 */
const buildJoiSchema = (
  paths: Record<string, MongoosePath>,
  isUpdate: boolean,
  omitKeys: string[] = [],
): Record<string, AnySchema> => {
  const schemaTree: Record<string, AnySchema> = {};

  // Group keys by first segment (rootKey)
  const grouped: Record<string, Record<string, MongoosePath>> = {};

  Object.entries(paths).forEach(([fullKey, path]) => {
    const [rootKey, ...rest] = fullKey.split('.');

    if (omitKeys.includes(rootKey)) return;

    if (rest.length === 0) {
      grouped[rootKey] = grouped[rootKey] || {};
      grouped[rootKey][rootKey] = path;
    } else {
      grouped[rootKey] = grouped[rootKey] || {};
      grouped[rootKey][rest.join('.')] = path;
    }
  });

  Object.entries(grouped).forEach(([rootKey, subPaths]) => {
    if (Object.keys(subPaths).length === 1 && subPaths[rootKey])
      schemaTree[rootKey] = generateJoiForPath(subPaths[rootKey], isUpdate);
    else schemaTree[rootKey] = Joi.object(buildJoiSchema(subPaths, isUpdate));
  });

  return schemaTree;
};

export const generateJoiValidation = (
  mongooseSchema: MongooseSchemaLike,
  isUpdate = false,
  omitKeys: string[] = [],
): Joi.ObjectSchema => {
  const joiSchema = buildJoiSchema(mongooseSchema.paths, isUpdate, omitKeys);

  //TODO: need to verify lat and long is mandatory for all the schema.
  // Add custom optional global fields
  joiSchema.longitude = Joi.number().optional();
  joiSchema.latitude = Joi.number().optional();

  return Joi.object(joiSchema);
};
