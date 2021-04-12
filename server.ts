import * as mongoose from 'mongoose';
import * as express from 'express';
 const path  = require('path');
import * as graphqlHTTP from 'express-graphql';
import * as morgan from 'morgan';
import * as cors from 'cors';
import * as errorHandler from 'errorhandler';
import * as bodyParser from 'body-parser';
import { printSchema } from 'graphql/utilities/schemaPrinter';
import * as dotenv from 'dotenv';
import { graphqlSchema } from './src/schema';
import { setupPPAuthentication } from './src/authenticate';
import { onlyAuthorized } from './src/middleware/auth';
import taskRoutes from './src/routes/tasks';


dotenv.config({ path: __dirname + '/.env' });
// Use node like promise for mongoose
(mongoose as any).Promise = global.Promise;

const GENERAL_PORT = 3004;
const MONGODB_CONNECTION_URI = process.env.DB_CONNEXION_STRING;

// Main App
const app = express();

// Setup MongoDb connection
mongoose.connect(MONGODB_CONNECTION_URI, { useMongoClient: true });

// Express morgan logs
app.use(morgan('combined'));

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));

// Setting view Engine

app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());

const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

// Parse application/json
app.use(bodyParser.json())

// tasks routes
app.use(taskRoutes);

// Set Auth
setupPPAuthentication(app);

app.use('/graphql',
    cors(),
    onlyAuthorized(),
    graphqlHTTP(request => {
        const startTime = Date.now();
        return {
            schema: graphqlSchema,
            graphiql: true,
            extensions({ document, variables, operationName, result }) {
                return { runTime: Date.now() - startTime };
            }
        };
    })
);

app.use('/schema',
    onlyAuthorized(),
    (req, res, _next) => {
        res.set('Content-Type', 'text/plain');
        res.send(printSchema(graphqlSchema));
    }
);

app.use(errorHandler());

app.listen(GENERAL_PORT, '0.0.0.0');

console.log(`Server has started on http://localhost:${GENERAL_PORT}/`);
