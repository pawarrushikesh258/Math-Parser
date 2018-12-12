var http = require('http');
var path = require('path');
var Express = require('express');
var multer = require('multer');
var bodyParser = require('body-parser');
var app = Express();
var shell= require('shelljs');
var exshell= require('exec-sh');
var mongoose=require("mongoose");
var cors = require('cors');
var fs = require('fs');
var bcrypt=require('bcrypt');
var User=require('./model/usermodel');
var result=require('./model/resultmodel');
var count=require('./model/usercount');
var morgan=require('morgan');
var response={};
var upload = multer().single('imgUploader'); //Field name and max count
mongoose.Promise = global.Promise;
var connection = mongoose.connect('mongodb://pawar:pawar1@ds113522.mlab.com:13522/mathparser',  { useNewUrlParser: true} );
const router = Express.Router();
const mathpix= require('./routes/mathpix');



app.use(cors());
app.use(Express.static(path.join(__dirname, '/js')));
app.use(Express.static(path.join(__dirname, '/public')));
app.use(Express.static(path.join(__dirname, '/css')));
//app.use(Express.bodyParser());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(morgan('combined'));
app.use('/result', mathpix);
//app.use('/resulthistory',)

//
// app.get("/home", function (req, res) {
//     res.sendFile(__dirname + "/index.html");
// });

app.post("/getstrokeresult", function (req, res) {

    console.log("Reached backend get");
    //let scgText = Object.keys(req.query)[0];
    let scgText = req.body.scg;
    let uname = req.body.username;
    let qry = {"userName": uname};
    //var ctr=0;
    console.log(scgText);
    scgText = scgText.replace(/X/g, '\n');
    console.log("after:");
    console.log(scgText);
    count.findOne(qry, {userCount: 1, _id: 0}).sort('-userCount').exec(function (err, resultmsg) {
        if (err) {

            console.log("Error, couldn't fetch counter for user");
        }
        else {
            console.log("value fetched from count collection is", resultmsg.userCount);
            let ctr = resultmsg.userCount;
            // ctr = ctr + 1;
            console.log("type of ctr is", typeof (ctr));
            console.log("ctr is", ctr);
            let ctr_str = ctr.toString();
            console.log("Counter is", typeof (ctr_str));
            console.log(ctr_str);
            fs.writeFile(`./OPSCG/${uname}_scgtext_${ctr_str}.scgink`, scgText, function (err) {
                if (err) {
                    console.log(err);
                    res.send(err);
                }
                else {
                    exshell(`touch OPTXT/${uname}_output_${ctr_str}.txt && rm OPTXT/${uname}_output_${ctr_str}.txt  && cd seshat-master && ./seshat -c Config/CONFIG -i ../OPSCG/${uname}_scgtext_${ctr_str}.scgink -r ../OPIMG/${uname}_render_${ctr_str}.pgm >> ../OPTXT/${uname}_output_${ctr_str}.txt && cd ..`, {}, function (err) {
                        if (err) {
                            console.log("Exit code: ", err.code);
                            res.send(err);
                            return err;
                        }
                        else {

                            console.log(`generated ${uname}_output_${ctr_str}.txt`);

                            fs.readFile(`./OPTXT/${uname}_output_${ctr_str}.txt`, "utf-8", function read(err, data) {
                                if (err) {
                                    res.send(err);
                                    return err;
                                }
                                else {
                                    console.log("successfully read sata from OPTXT folder");
                                    exshell(`touch OPLATEX/${uname}_latex_${ctr_str}.txt && rm OPLATEX/${uname}_latex_${ctr_str}.txt && tail -1 OPTXT/${uname}_output_${ctr_str}.txt >> OPLATEX/${uname}_latex_${ctr_str}.txt`, {}, function (err) {
                                        if (err) {
                                            res.send(err);
                                            console.log("Exit code: ", err.code);
                                        }
                                        else {
                                            console.log(`generated ${uname}_latex_${ctr_str}.txt`);
                                            fs.readFile(`./OPLATEX/${uname}_latex_${ctr_str}.txt`, "utf-8", function read(err, data) {
                                                if (err) {
                                                    res.send(err);
                                                    return err;
                                                }
                                                else {
                                                    let latex_content;
                                                    latex_content = data;
                                                    latex_content = latex_content.trim();
                                                    console.log("ltx ct", latex_content);
                                                    let imgpath = `./OPIMG/${uname}_render_${ctr_str}.pgm`;
                                                    console.log(imgpath);
                                                    let res_data=fs.readFileSync(imgpath);
                                                    let addResult = new result({
                                                        result_id : ctr,
                                                        latex_op : latex_content,
                                                        userName : uname,
                                                        date: Date.now(),
                                                        img: {
                                                            data: res_data,
                                                            contentType: 'image/png'
                                                        }});
                                                    addResult.save(function (err, success) {
                                                        if (err){
                                                            console.log(err);
                                                        }
                                                        else {
                                                            count.findOneAndUpdate({"userName": uname}, { $inc:{"userCount":1}}, {new: true}, function (err, doc) {
                                                                if (err){
                                                                    console.log(err);
                                                                }
                                                                else {
                                                                    res.send(latex_content);
                                                                    console.log("Success!");
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});




function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}


app.post("/signup", signUp);
function signUp(req,res,next) {

    console.log("Reached SignUp API", req.body);
//  creating a document
    var email = req.body.email;
    var username = req.body.username;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var pw = req.body.password;
    var institute=req.body.institute;



    var addUser = new User({

        email: email,
        userName: username,
        firstName: firstname,
        lastName: lastname,
        passWord: pw,
        institute:institute,
        createdDate:Date.now(),
        counter:1

    });

    let result_counter = new count(
        {
            userCount: 1,
            userName: username
}
    );

//  For sending mail
    var mailOptions = {
        from: '@gmail.com',
        to: addUser.emailID,
        subject: 'Verification code',
        text: ''
    };

//  encrypting password
   // addUser.passWord = myHasher(addUser.passWord);

//  adding a document to database

    var query = {"userName": username};
    User.findOne(query, function (err, seeUser) {
        if(seeUser==null||seeUser==undefined) {
            addUser.save(function (err) {
                if (err) {
                    response["status"] = "false";
                    response["msg"] = "can't add user";
                    res.send(response);
                    console.log("unable to add : " + addUser.userName);
                }
                else {
                    response["status"] = "true";
                    response["msg"] = "Account Added successfully. Please check your email to verify your account.";
                    //sendMaill(mailOptions);
                    res.send(response);
                    console.log("New User Added : " + addUser.userName);
                    result_counter.save(function(error){

                        if (error)
                        {
                            response["status"] = "false";
                            response["msg"] = "can't add counter value";
                            res.send(response);
                        }

                    });
                }
            });

        }
        else{
            response["status"] = "false";
            response["msg"] = "User already exists.";
            res.send(response);
            console.log("User already exists with username : " + addUser.userName);
        }
    });
};



let myHasher = function(password) {
    if(password.trim()==="")
        return "";
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

app.post('/login', Login);

function Login(req, res){

    //var newpw=myHasher(req.body.password);

    var query={"userName":req.body.username, "passWord":req.body.password};
    console.log(req.body.username);
    User.findOne(query, function(err, user){
        if (err){
            console.log("incorrect username");
            response["msg"]="User not found";
            response["status"]=false;
            res.send(response);
        }
        else
        {
            if(user===undefined||user===null)
            {
                console.log("incorrect username");
                response["msg"]="User not found";
                response["status"]=false;
                res.send(response);
            }

            else{
                console.log("found this user", user);
                response["status"]=true;
                response["msg"]={data:user};
                res.send(response);
            }
        }
    })
};


app.post('/resulthistory', resulthistory);

function resulthistory(req, res){
    console.log(req.body.username);
    //let user=req.query.username;
     let user=req.body.username;
    let querydb= {"userName":user};
    result.find(querydb, {img:0}).exec( function (err,resultdb){

        if(err)
        {
            response["status"]=false;
            response["msg"]="Could not find results for current user";
            console.log("Error in results history is", err);
            res.send(response);
        }

        else{

            //console.log("Results are as follows", resultdb);
            response["status"]=true;
            response["msg"]={data:resultdb};
            res.send(response);
        }
    })



}


app.post('/savetodb', savetodb );


function savetodb (req, res){

    let uname=req.body.username;
    var countersavedb;

    count.findOne({"userName":uname}, {userCount: 1, _id: 0} ).sort('-userCount').exec(function (err, resultmsg) {
        if (err) {

            console.log("Error, couldn't fetch counter for user");
            response["status"]=false;
            response["msg"]="Could notfetch counter from Db";
            res.send(response);
        }
        else {

            console.log("Reached first else");
            countersavedb=resultmsg.userCount;

            let addResult = new result({
                result_id : countersavedb,
                latex_op :  req.body.op,
                userName : uname,
                date: Date.now(),
            });

            addResult.save((err,res)=>{
            if (err)
            {
                response["status"]=false;
                response["msg"]="Could not save to Db";
                res.send(response);
                console.log("Error, could not save result to db");
            }
            else{

                console.log("Reached Second else");

                count.findOneAndUpdate({"userName": uname}, { $inc:{"userCount":1}}, {new: true}, function (err, res) {
                    if (err){
                        //console.log(err);
                        response["status"]=false;
                        response["msg"]="Could not save to Db";
                        res.send(response);
                    }
                    else {
                      //  response["status"]=true;
                        //response["msg"]="Result saved to Db";
                      //  res.send(response);
                        console.log("Success!");
                    }});

            }});
        }
    });

}



app.listen(2000, function(err) {
    console.log("Listening to port 2000");
});
