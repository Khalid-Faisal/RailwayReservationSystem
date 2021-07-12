const express = require("express");
const app = express()
const mysql = require('mysql');

app.use(express.json())
const swaggerUi = require('swagger-ui-express'),
swaggerDocument = require('./swagger.json');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "Railways"
});
con.connect(function (err) {
    if (err) console.log("Database Connection Failure!");
    else  console.log("Connected to the Database!");
});

function databaseActivity(type, sql, res) {
    con.query(sql, function (err, result) {
        //console.log("Result  : ",result,"  Error : ",err);
        if (err)
            res.send((err) ? err : "");
        if (type === "save")
            res.status(200).send({ "message": "Record Submitted Successfully" });
        else if (type === "delete")
            res.status(200).send({ "message": "Record Deleted Successfully" });
        else if (type === 'get')
            res.status(200).send(result);
    });
}
app.post('/book', function (req, res) {
    //console.log("Data : ",req.body);
    let cname = req.body.name;
    let age = req.body.age;
    let src = req.body.from;
    let dstn = req.body.to;
    let fare = req.body.fare;
    let trainNo = req.body.trainNumber;
    let seatNo = req.body.seatNumber;
    if (cname && age && src && dstn && fare && trainNo && seatNo && fare>0 && age>0) {
        var sql = `INSERT INTO passenger(pName,age,trainNo,src,dstn,fare,seatNo) VALUES('${cname}',${age},${trainNo},'${src}','${dstn}',${fare},'${seatNo}')`;
        databaseActivity("save", sql, res);
    } else
        res.status(400).send("Invalid Input");
});

app.post('/cancel', function (req, res) {
    let ticketNo = req.body.pnr;
    if (ticketNo && ticketNo>0) {
        var sql = `DELETE FROM passenger WHERE ticketId=${ticketNo}`;
        databaseActivity("delete", sql, res);
    } else
        res.status(400).send({ "Message": "Invalid Input" });
})

app.get('/', function (req, res) {
    var sql = `SELECT * FROM train`;
    databaseActivity("get", sql, res)
})

app.post('/stopStations', function (req, res) {
    if(req.body.trainNo){
        var sql = `SELECT stn FROM stoppage WHERE trainNo=${req.body.trainNo}`;
        databaseActivity("get", sql, res)
    }
    else
        res.status(400).send({ "Message": "Invalid Input" });
})

app.get('/availability', function (req, res) {
    var sql = "SELECT DISTINCT(a.trainNo),a.trainName,a.space AS 'Available' FROM train as a inner join stoppage as b on a.trainNo=b.trainNo WHERE a.space>0"
    databaseActivity("get", sql, res)
})

app.post('/passengers', function (req, res) {
    if(req.body.trainNo){
        var sql = `SELECT * FROM passenger WHERE trainNo=${req.body.trainNo}`;
        databaseActivity("get", sql, res)
    }else{
        res.status(400).send({ "Message": "Invalid Input" });
    }
})

app.use(
    '/api-docs',
    swaggerUi.serve, 
    swaggerUi.setup(swaggerDocument)
  );
  
const port = process.env.PORT || 3000
module.exports = app.listen(port, () => console.log(`Listening on ${port}`))
