
const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server'); 
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const sinon = require('sinon');
const Conference = require('../models/Conference');
const { updateConference,getConferences,addConference,deleteConference } = require('../controllers/conferenceController');
const { expect } = chai;

chai.use(chaiHttp);
let server;
let port;


describe('AddConference Function Test', () => {

  it('should create a new conference successfully', async () => {
    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { title: "New Conference", description: "Conference description", host: "John Smith", date: "2025-12-31" }
    };

    // Mock conference that would be created
    const createdConference = { _id: new mongoose.Types.ObjectId(), ...req.body, userId: req.user.id };

    // Stub Conference.create to return the createdConference
    const createStub = sinon.stub(Conference, 'create').resolves(createdConference);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addConference(req, res);

    // Assertions
    expect(createStub.calledOnceWith({ userId: req.user.id, ...req.body })).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdConference)).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Conference.create to throw an error
    const createStub = sinon.stub(Conference, 'create').throws(new Error('DB Error'));

    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { title: "New Conference", description: "Conference description", host: "John Smith", date: "2025-12-31" }
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addConference(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

});


describe('Update Function Test', () => {

  it('should update conference successfully', async () => {
    // Mock conference data
    const conferenceId = new mongoose.Types.ObjectId();
    const existingConference = {
      _id: conferenceId,
      title: "Old Conference",
      description: "Old Description",
      host: "Jane Doe",
      completed: false,
      date: new Date(),
      save: sinon.stub().resolvesThis(), // Mock save method
    };
    // Stub Conference.findById to return mock conference
    const findByIdStub = sinon.stub(Conference, 'findById').resolves(existingConference);

    // Mock request & response
    const req = {
      params: { id: conferenceId },
      body: { title: "New Conference", completed: true }
    };
    const res = {
      json: sinon.spy(), 
      status: sinon.stub().returnsThis()
    };

    // Call function
    await updateConference(req, res);

    // Assertions
    expect(existingConference.title).to.equal("New Conference");
    expect(existingConference.completed).to.equal(true);
    expect(res.status.called).to.be.false; // No error status should be set
    expect(res.json.calledOnce).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });



  it('should return 404 if conference is not found', async () => {
    const findByIdStub = sinon.stub(Conference, 'findById').resolves(null);

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateConference(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Conference not found' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 500 on error', async () => {
    const findByIdStub = sinon.stub(Conference, 'findById').throws(new Error('DB Error'));

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateConference(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.called).to.be.true;

    findByIdStub.restore();
  });



});



describe('GetConference Function Test', () => {

  it('should return conferences for the given user', async () => {
    // Mock user ID
    const userId = new mongoose.Types.ObjectId();

    // Mock conference data
    const conferences = [
      { _id: new mongoose.Types.ObjectId(), title: "Conference 1", userId },
      { _id: new mongoose.Types.ObjectId(), title: "Conference 2", userId }
    ];

    // Stub Conference.find to return mock conferences
    const findStub = sinon.stub(Conference, 'find').resolves(conferences);

    // Mock request & response
    const req = { user: { id: userId } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getConferences(req, res);

    // Assertions
    expect(findStub.calledOnceWith({ userId })).to.be.true;
    expect(res.json.calledWith(conferences)).to.be.true;
    expect(res.status.called).to.be.false; // No error status should be set

    // Restore stubbed methods
    findStub.restore();
  });

  it('should return 500 on error', async () => {
    // Stub Conference.find to throw an error
    const findStub = sinon.stub(Conference, 'find').throws(new Error('DB Error'));

    // Mock request & response
    const req = { user: { id: new mongoose.Types.ObjectId() } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getConferences(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findStub.restore();
  });

});



describe('DeleteConference Function Test', () => {

  it('should delete a conference successfully', async () => {
    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock conference found in the database
    const conference = { remove: sinon.stub().resolves() };

    // Stub Conference.findById to return the mock conference
    const findByIdStub = sinon.stub(Conference, 'findById').resolves(conference);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteConference(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(conference.remove.calledOnce).to.be.true;
    expect(res.json.calledWith({ message: 'Conference deleted' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 404 if conference is not found', async () => {
    // Stub Conference.findById to return null
    const findByIdStub = sinon.stub(Conference, 'findById').resolves(null);

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteConference(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Conference not found' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Conference.findById to throw an error
    const findByIdStub = sinon.stub(Conference, 'findById').throws(new Error('DB Error'));

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteConference(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

});