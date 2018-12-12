const express = require('express');
const router = express.Router();
const multer = require('multer');
//const upload = multer({dest:'uploads/'});
var http = require('http');
var path = require('path');
var fs = require('fs');
// const Result = require('../Schema/resultSchema');
var upload = multer().single('imgUploader');
//var upload = upload.single('recfile');
var postheaders = {
    'app_id' : 'liranlr1992_gmail_com',
    'app_key' : '953eb7027c03de769781',
    'Content-Type': 'application/json',
    crossOrigin: true
};
var mpresult=require('../model/resultmodel');
var count=require('../model/usercount');
var counter;

var options = {
    host: 'api.mathpix.com',
    path: '/v3/latex',
    method: 'POST',
    headers: postheaders
};

router.post('/upload', (req, res, next) => {
    var fileInfo = [];

    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            return res.end("Something went wrong!");
        }
        fileInfo.push({
            "src": 'data:image/jpeg;base64,'+new Buffer(req.file.buffer).toString("base64")
        });

        var post_req =   http.request(options, function(resp) {
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            resp.setEncoding('utf8');
            var body ='';
            resp.on('data', function (chunk) {
                console.log('BODY: ' + chunk);
                body = chunk;
                body = JSON.parse(body);
                if (body.error) {
                    res.send(body.error);
                }
                else {
                    console.log("reached");

                    res.send(body.latex);
                }
            });

        });
        post_req.write(JSON.stringify(fileInfo[0]));
        post_req.end();
    });

    function base64_encode(file) {
        // read binary data
        var bitmap = fs.readFileSync(file);
        // convert binary data to base64 encoded string
        return new Buffer(bitmap).toString('base64');
    }


});



module.exports = router;