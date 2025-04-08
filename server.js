import express from 'express';
import dbConnect from './src/server/db.js';
import cors from 'cors';
import helmet from 'helmet';
import router from './src/server/routes/routes.js';
import cookieParser from 'cookie-parser';
import compression from 'compression';



const app = express();
const port = process.env.PORT;

app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true}));
    router.use(helmet({
        contentSecurityPolicy: { 
            directives: {
                defaultSrc: ["'self'"], 
                scriptSrc: ["'self'", "'unsafe-inline'"], 
                objectSrc: ["'none'"], 
                upgradeInsecureRequests: [], 
            },
        },
        referrerPolicy: { policy: 'strict-origin-when-cross-origin' }, 
        hsts: { maxAge: 31536000, includeSubDomains: true }, 
    }));

app.use(compression());
app.use(express.json());



dbConnect();
app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.use('/api', router);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});