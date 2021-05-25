import express from 'express';
import cors from 'cors';
import { authMiddleware } from '../middlewares/authMiddleware';
import { tenantMiddleware } from '../middlewares/tenantMiddleware';
import { databaseMiddleware } from '../middlewares/databaseMiddleware';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import { createRateLimiter } from './apiRateLimiter';
import { languageMiddleware } from '../middlewares/languageMiddleware';
import authSocial from './auth/authSocial';
import setupSwaggerUI from './apiDocumentation';

const app = express();

// Enables CORS
app.use(cors({ origin: true }));

// Initializes and adds the database middleware.
app.use(databaseMiddleware);

// Sets the current language of the request
app.use(languageMiddleware);

// Configures the authentication middleware
// to set the currentUser to the requests
app.use(authMiddleware);

// Setup the Documentation
setupSwaggerUI(app);

// Default rate limiter
const defaultRateLimiter = createRateLimiter({
  max: 500,
  windowMs: 15 * 60 * 1000,
  message: 'errors.429',
});
app.use(defaultRateLimiter);

// Enables Helmet, a set of tools to
// increase security.
app.use(helmet());

// Parses the body of POST/PUT request
// to JSON
app.use(
  bodyParser.json({
    verify: function (req, res, buf) {
      const url = (<any>req).originalUrl;
      if (url.startsWith('/api/plan/stripe/webhook')) {
        // Stripe Webhook needs the body raw in order
        // to validate the request
        (<any>req).rawBody = buf.toString();
      }
    },
  }),
);

// Configure the Entity routes
const routes = express.Router();

// Enable Passport for Social Sign-in
authSocial(app, routes);

require('./auditLog').default(routes);
require('./auth').default(routes);
require('./plan').default(routes);
require('./tenant').default(routes);
require('./file').default(routes);
require('./user').default(routes);
require('./settings').default(routes);
require('./customer').default(routes);
require('./product').default(routes);
require('./order').default(routes);
require('./pet').default(routes);
require('./breed').default(routes);
require('./petTypes').default(routes);
require('./business').default(routes);
require('./place').default(routes);
require('./businessServicesTypes').default(routes);
require('./serviceReservation').default(routes);
require('./businessPlaceServiceAvailability').default(routes);
require('./country').default(routes);
require('./city').default(routes);
require('./state').default(routes);
require('./messages').default(routes);
require('./professionalsServiceAvailability').default(routes);
require('./languages').default(routes);
require('./currency').default(routes);
require('./discounts').default(routes);
require('./wallet').default(routes);
require('./businessCategory').default(routes);
require('./providers').default(routes);
require('./vaccineTypes').default(routes);
require('./petVaccines').default(routes);
require('./placeType').default(routes);
require('./landingSurvey').default(routes);

// Loads the Tenant if the :tenantId param is passed
routes.param('tenantId', tenantMiddleware);

// Add the routes to the /api endpoint
app.use('/api', routes);

export default app;
