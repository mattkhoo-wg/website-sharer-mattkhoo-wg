import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import sessions from 'express-session'
import msIdExpress from 'microsoft-identity-express'
const appSettings = {
    appCredentials: {
        clientId: "e68c1f38-f164-422d-a37f-dda599aa44fe",
        tenantId: "f6b6dd5b-f02f-441a-99a0-162ac5060bd2",
        clientSecret: "MCC8Q~SryBfhyBBVnLXf2eFXWAnbMoNKulFAoc1-"
    },
    authRoutes: {
        redirect: "https://www.mkhoo98.me//redirect", //change to mkhoo.me/redirect later
        err: "/error",
        unauthorized: "/unauthorized"
    }
};

import models from './models.js'

import apiRouter from './routes/api/v3/apiv3.js';  

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    req.models = models
    next()
})

app.use(sessions({
    secret: "this is a super secret key, please don't tell anyone about it",
    saveUninitialized: true,
    cookie: {maxAge: 1000 * 60 * 60 * 24},
    resave: false
}))

const msid = new msIdExpress.WebAppAuthClientBuilder(appSettings).build()
app.use(msid.initialize())

app.use('/api/v3', apiRouter);

app.get('/signin', 
    msid.signIn({postLoginRedirect: '/'})
)

app.get('/signout',
    msid.signOut({postLogoutRedirect: '/'})
)

app.get('/error', (req, res) => {
    res.status(500).send("Error: Server error")
})

app.get('/unauthorized', (req, res) => {
    res.status(401).send("Error: Unauthorized")
})


export default app;
