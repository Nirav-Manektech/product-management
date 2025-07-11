import express, { Express } from 'express';
import compression from 'compression';
import cors from 'cors';
import httpStatus from 'http-status';
import { authLimiter } from '@/shared/utils/index.js';
import {
  ApiError,
  errorConverter,
  errorHandler,
} from '@/shared/utils/errors/index.js';
import config from '@/shared/config/config.js';
import routes from '@/routes/index.js';
import { successResponseMiddleware } from '@/shared/utils/middlewares/success.middleware.js';

const app: Express = express();

// set security HTTP headers
// app.use(helmet());

app.use(cors({
  origin: 'https://incredible-shortbread-0fe296.netlify.app',
  credentials: true, // only if you're using cookies/auth
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}));

// app.options('*', cors());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
// app.use(ExpressMongoSanitize());

// gzip compression
app.use(compression());

app.use(successResponseMiddleware);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') app.use('/v1/auth', authLimiter);

app.get('/', (_req, res) => {
  res.status(200).send('Welcome to the API!!');
});

// health check
app.get('/health', (_req, res) => {
  res.status(200).send('Makanify API is running!!!');
});

// v1 api routes
app.use('/api/v1', routes);

// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
