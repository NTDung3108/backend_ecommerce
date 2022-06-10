const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

require('dotenv').config();
var port = 3000;
var host = '192.168.2.151';
// var host = '192.168.2.101';
// var host = '10.50.10.135';

//'10.50.10.135';//

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

//Routes
app.use( require('./src/Routes/route') );

app.use(express.static(path.join(__dirname, 'src/Uploads/Profile')));
app.use(express.static(path.join(__dirname, 'src/Uploads/Home')));
app.use(express.static(path.join(__dirname, 'src/Uploads/Products')));
app.use(express.static(path.join(__dirname, 'src/Uploads/Categories')));
app.use(express.static(path.join(__dirname, 'src/Uploads/Brands')));
app.use(express.static(path.join(__dirname, 'src/Uploads/Discount')));
app.use(express.static(path.join(__dirname, 'src/Download')));
// io.on('connection', client => {
//     console.log(`New client connected`);
//     client.on('fromClient', data => { 
//         console.log(data); 
//         client.emit('fromServer', `${Number(data)+1}`)
//     })
//     client.on('disconnect', () => console.log(`Client disconnected`))
// });

io.on('connection', client => {
    console.log('client connect...', client.id);

    client.on('fromClient', data => { 
        console.log(data); 
        client.emit('fromServer', `${Number(data)+1}`)
    })
    
    client.on('typing', function name(data) {
        console.log(data);
        io.emit('typing', data);
    })

    client.on('message', function name(data){
        console.log(data);
        io.emit('message', data);
    })

    client.on('location', function name(data){
        console.log(data);
        io.emit('location', data);
    })

    client.on('connect', function () {
    })

    client.on('disconnect', function () {
        console.log('client disconnect...', client.id)
        // handleDisconnect()
    })

    client.on('error', function (err) {
        console.log('received error from client:', client.id)
        console.log(err)
    })
})

server.listen(port, host, () => console.log('Listen on port ' + port + host));
