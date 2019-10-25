// Init
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer  = require('multer');
const upload = multer();

const app = express();
const APP_PORT = process.env.PORT || 3001;

// BTC order array
const btcOrderList = [];

// app.use(bodyParser.json({limit: '50mb'}));

// Initialize static content
// Homepage will be index.html at localhost:xxxx
// Temp set to Angular dist folder
app.use(express.static(path.join(__dirname, '../', 'dist', 'day09a')));

// bodyParser
// app.use(bodyParser.json());
// !!! Take out for now
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded());

// CORS
app.use(cors());

// POST (receiving the info)
app.post('/setinfo', upload.none(), (req,res,next) => {
    const btcData = req.body;
    btcOrderList.push(req.body);
    res.status(200);
    res.format({
        html: () => { res.send('html, data received') },
        json: () => { res.json({ status: 'json, data received' })}
    })
});

// GET (gives a list of all orders)
app.get('/getallinfo', (req,res,next) => {
    res.status(201);
    res.format({
        html: () => { res.send('HTML format not supported') },
        json: () => { res.json(JSON.stringify(btcOrderList))}
    })
});

// GET (giving the list of a single order)
app.get('/getsingleinfo', (req,res,next) => {
    const id = req.query.id;
    const orderMatched = btcOrderList.find((value) => value.orderID === id);
    console.log('Order matched and sent', orderMatched);
    res.status(200);
    res.format({
        html: () => { res.send('HTML format not supported') },
        json: () => { res.json(JSON.stringify(orderMatched))}
    })
});

// PUT (updates the single order)
app.put('/updatesingleinfo',upload.none(), (req,res,next) => {
    console.log('This is updated value: ', req.body);
    const updatedOrderData = req.body;
    const id = req.query.id;
    const orderIndex = btcOrderList.findIndex((value) => value.orderID === id);
    // Update/replace the order object
    btcOrderList[orderIndex] = updatedOrderData;
    res.format({
        html: () => { res.send('HTML format not supported') },
        json: () => { res.json({ status: 'ok' })}
    })
});

// !!! Rmb to add error.html to dist folder
// Catch-all
app.use((req, res, next) => {
    res.redirect('/error.html');
});

// Logs the port that is used
app.listen(APP_PORT, () => {
    console.info(`Webserver at port ${APP_PORT}`);
});
