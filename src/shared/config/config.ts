import Joi from 'joi';
import dotenv from 'dotenv';

const dotenvPath =
  process.env['NODE_ENV'] === 'development' ? '.env.dev' : '.env';
console.log('🚀 ~ dotenvPath:', dotenvPath);

dotenv.config({
  path: dotenvPath,
});

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid('production', 'development', 'test')
      .required(),
    PORT: Joi.number().default(3000),
    MONGODB_PROTOCOL: Joi.string().required().description('Mongo Protocol'),
    MONGODB_HOST: Joi.string().required().description('Mongo Host URL'),
    MONGODB_USERNAME: Joi.string().required().description('Mongo DB Name'),
    MONGODB_NAME: Joi.string().required().description('Mongo DB Password'),
    MONGODB_PASSWORD: Joi.string().required().description('Mongo DB Password'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    protocol: envVars.MONGODB_PROTOCOL,
    name: envVars.MONGODB_NAME,
    username: envVars.MONGODB_USERNAME,
    password: envVars.MONGODB_PASSWORD,
    host: envVars.MONGODB_HOST,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes:
      envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    cookieOptions: {
      httpOnly: true,
      secure: envVars.NODE_ENV === 'production',
      signed: true,
    },
  },
};

export default config;
