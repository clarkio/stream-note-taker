/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const sinon = require('sinon');

const sessionData = require('../src/data');
const eventsListener = require('../src/events-listener');
const eventsMockData = require('./event-mock-data.json');
const streamElementsSocket = require('../src/streamelements-socket');

const { onEvent } = eventsListener;

describe('Events Listener', function() {
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
    it('should do nothing on unsupported event', function(done) {
      // Arrange
      // Inject with blank object because nothing should be done
      const inject = {};

      // Act
      onEvent({ type: 'bathroom break' }, inject);

      // Assert
      // We only need to assert nothing has changed as
      // exception will be thrown on unwanted call
      expect(inject).to.deep.equal({});
      done();
    });

    it('should add follower to session data on follow event', function(done) {
      // Arrange
      const inject = {
        addFollower: sinon.spy(),
      };

      // Act
      onEvent(eventsMockData.follow, inject);

      // Assert
      expect(inject.addFollower.calledOnce).to.be.true;
      done();
    });

    it('should add subscriber to session data on subscribe event', function(done) {
      // Arrange
      const inject = {
        addSubscriber: sinon.spy(),
      };

      // Act
      onEvent(eventsMockData.subscriber, inject);

      // Assert
      expect(inject.addSubscriber.calledOnce).to.be.true;
      done();
    });

    it('should add gifted subscriber to session data on gifted subscribe event', function(done) {
      // Arrange
      const inject = {
        addGiftedSubscriber: sinon.spy(),
      };

      // Act
      onEvent(eventsMockData.giftedSubscriber, inject);

      // Assert
      expect(inject.addGiftedSubscriber.calledOnce).to.be.true;
      done();
    });

    it('should add cheerer to session data on cheer event', function(done) {
      // Arrange
      const inject = {
        addCheerer: sinon.spy(),
      };

      // Act
      onEvent(eventsMockData.cheer, inject);

      // Assert
      expect(inject.addCheerer.calledOnce).to.be.true;
      done();
    });

    it('should add raider to session data on raid event', function(done) {
      // Arrange
      const inject = {
        addRaider: sinon.spy(),
      };

      // Act
      onEvent(eventsMockData.raid, inject);

      // Assert
      expect(inject.addRaider.calledOnce).to.be.true;
      done();
    });
  });
});
