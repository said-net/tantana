require('dotenv').config();
const express = require('express');
const app = express();
require('mongoose').connect(process.env.MONGO_URI);
app.use(express.json());
require('./src/helpers/admin')();
app.use(require('express-fileupload')());
app.use(require('cors')({
    origin: ["http://tantana-admin.uz","https://tantana-admin.uz", "http://localhost:3000"]
}));
app.use('/public', express.static('public'));
app.use('/api',require('./src/router'));
app.listen(process.env.APP_PORT)