const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');

// Create Redis Client
let client = redis.createClient();
client.on('connect', function () {
    console.log('Connected to Redis...');
});
const port = 3000;
const app = express();
// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/user/search/:id', function (req, res, next) {
    let id = req.params.id;
    client.hgetall(id,  (err, obj) =>{
        if (!obj) {
            res.status(400).send('User khong ton tai')
        } else {
            obj.id = id;
            res.status(200).send({user: obj})
        }
    });
});
app.post('/user/add', function (req, res, next) {
    let id = req.body.id;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let phone = req.body.phone;

    client.hmset(id, [
        'first_name', first_name,
        'last_name', last_name,
        'email', email,
        'phone', phone
    ],  (err, reply)=> {
        if (err) {
            console.log(err);
        }
        console.log(reply);
        res.status(200).send('done');
    });
});
app.delete('/user/delete/:id', function (req, res, next) {
    client.del(req.params.id);
    res.status(200).send('da xoa thanh cong')
});

app.listen(port, function () {
    console.log('Server started on port ' + port);
});
