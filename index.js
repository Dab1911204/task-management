const express = require('express');
const database = require('./config/database');
require('dotenv').config(); // nạp biến môi trường từ .env
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const routes = require('./api/v1/routes/index.route');

database.connect();

const app = express();
const port = process.env.PORT

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());//cần thêm thư viện cookie-parser


routes(app);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})