/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const sinon = require('sinon');

const sessionData = require('../data');
const eventsListener = require('../events-listener');
const eventsMockData = require('./event-mock-data.json');
const streamElementsSocket = require('../streamelements-socket');

describe('Connection', function() {
  it('should use streamelements socket to start connection', function(done) {
    // Arrange
    const stub = sinon.stub(streamElementsSocket);

    // Act
    eventsListener.start();

    // Assert
    expect(stub.connect.calledOnce).to.be.true;
    done();
  });
});

describe('Other Uncategorized Members to Test', function() {
  it('should call sessionData function once to retrieve all data', function(done) {
    // Arrange
    const stub = sinon.stub(sessionData, 'getAllData');

    // Act
    eventsListener.getSessionData();

    // Assert
    expect(stub.calledOnce).to.be.true;
    done();
  });
});

describe('Twitch Alerts', function() {
  it('should add follower to session data on follow event', function(done) {
    // Arrange
    const stub = sinon.stub(sessionData, 'addFollower');

    // Act
    eventsListener.onEvent(eventsMockData.follow);

    // Assert
    expect(stub.calledOnce).to.be.true;
    done();
  });

  it('should add subscriber to session data on subscribe event', function(done) {
    // Arrange
    const stub = sinon.stub(sessionData, 'addSubscriber');

    // Act
    eventsListener.onEvent(eventsMockData.subscriber);

    // Assert
    expect(stub.calledOnce).to.be.true;
    done();
  });

  it('should add gifted subscriber to session data on gifted subscribe event', function(done) {
    // Arrange
    const stub = sinon.stub(sessionData, 'addGiftedSubscriber');

    // Act
    eventsListener.onEvent(eventsMockData.giftedSubscriber);

    // Assert
    expect(stub.calledOnce).to.be.true;
    done();
  });

  it('should add cheerer to session data on cheer event', function(done) {
    // Arrange
    const stub = sinon.stub(sessionData, 'addCheerer');

    // Act
    eventsListener.onEvent(eventsMockData.cheer);

    // Assert
    expect(stub.calledOnce).to.be.true;
    done();
  });

  it('should add raider to session data on raid event', function(done) {
    // Arrange
    const stub = sinon.stub(sessionData, 'addRaider');

    // Act
    eventsListener.onEvent(eventsMockData.raid);

    // Assert
    expect(stub.calledOnce).to.be.true;
    done();
  });
});
