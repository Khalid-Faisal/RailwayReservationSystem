var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('./app');
var should = chai.should();

chai.use(chaiHttp);

describe('/', function () {
  it('It should return train list', (done) => {
    chai.request(server).get("/").end((err, res) => {
      if (err) done(err)
      res.should.have.status(200);
      res.should.be.a("object")
      done();

    })
  });
});

describe('/availability', function () {
  it('It should return seats available in train', (done) => {
    chai.request(server).get("/availability").end((err, res) => {
      if (err) done(err)
      res.should.have.status(200);
      res.should.be.a("object")
      done();

    })
  });
});

describe('/passengers', function () {
  let payload = {
    "trainNo": 2809
  }
  it('It should get passenger list of given trains number', (done) => {
    chai.request(server).post("/passengers").send(payload).end((err, res) => {
      if (err) done(err)
      res.should.have.status(200);
      res.should.be.a("object")
      done();
    })
  });

  it('It should fail of wrong payload provided', (done) => {
    delete payload.trainNo;
    payload.name = 'hello';
    chai.request(server).post("/passengers").send(payload).end((err, res) => {
      if (err) done(err)
      res.should.have.status(400);
      done();
    })
  });
});

describe('/stopStations', function () {
  let payload = {
    "trainNo": 1015
  }
  it('It should return stoppage station of given train', (done) => {
    chai.request(server).post("/stopStations").send(payload).end((err, res) => {
      if (err) done(err)
      res.should.have.status(200);
      res.should.be.a("object")
      done();
    })
  });
  it('It should return 400 if trainNo is not provided', (done) => {
    payload.trainNo = null;
    chai.request(server).post("/stopStations").send(payload).end((err, res) => {
      if (err) done(err)
      res.should.have.status(400);
      res.should.be.a("object")
      done();
    })
  });
});

describe('/book', function () {
  let payload = {
    "name": "Zaid",
    "age": 15,
    "from": "CSMT",
    "to": "JL",
    "fare": 290.5,
    "trainNumber": 2809,
    "seatNumber": "SL-21"
  }
  it('It should reserve ticket for passenger', (done) => {
    chai.request(server).post("/book").send(payload).end((err, res) => {
      if (err) done(err)
      res.should.have.status(200);
      res.should.be.a("object")
      done();
    })
  });
  it('It should return 400 if name is not provided', (done) => {
    payload.name = null;
    chai.request(server).post("/book").send(payload).end((err, res) => {
      if (err) done(err)
      res.should.have.status(400);
      res.should.be.a("object")
      done();
    })
  });
  it('It should return 400 if age is less than 0', (done) => {
    payload.name = 'Shreyash Wagh';
    payload.age = 0;
    chai.request(server).post("/book").send(payload).end((err, res) => {
      if (err) done(err)
      res.should.have.status(400);
      res.should.be.a("object")
      done();
    })
  });
  it('It should return 400 if fare is invalid or 0', (done) => {
    payload.age = 23;
    payload.fare = 0.0;
    chai.request(server).post("/book").send(payload).end((err, res) => {
      if (err) done(err)
      res.should.have.status(400);
      res.should.be.a("object")
      done();
    })
  });
});

describe('/cancel', function () {
  let payload = {
    "pnr": 8
  }
  it('It should cancel ticket with given ticket Id', (done) => {
    chai.request(server).post("/cancel").send(payload).end((err, res) => {
      if (err) done(err)
      res.should.have.status(200);
      res.should.be.a("object")
      done();
    })
  });

  it('It should ticket Id is blank', (done) => {
    payload.pnr= null;
    chai.request(server).post("/cancel").send(payload).end((err, res) => {
      if (err) done(err)
      res.should.have.status(400);
      res.should.be.a("object")
      done();
    })
  });
});