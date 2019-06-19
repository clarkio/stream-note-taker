/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const sinon = require('sinon');
const axios = require('axios');

const stream = require('../src/stream');

describe('Stream', function() {
  afterEach(() => {
    // Restore the default sandbox here
    // sinon.restore();
  });

  it('should return false by default', function(done) {
    const result = stream.isOnline();

    expect(result).to.be.false;

    done();
  });

  it('should return true when stream is online', function(done) {
    const stub = sinon
      .stub(axios, 'get')
      .resolves({ data: { data: ['', ''] } });

    stream.getStreamStatus().then(() => {
      const isOnline = stream.isOnline();
      expect(isOnline).to.be.true;
      stub.restore();
      done();
    });
  });

  it('should check stream status on an interval', function(done) {
    // Arrange
    const getStreamStatusAxiosStub = sinon
      .stub(axios, 'get')
      .resolves({ data: { data: ['', ''] } });
    const clock = sinon.useFakeTimers();
    const getStreamStatusSpy = sinon.spy(stream, 'getStreamStatus');

    // Act
    stream.startMonitoring(1000, getStreamStatusSpy);
    clock.tick(1000);

    // Assert
    expect(getStreamStatusAxiosStub.calledTwice).to.be.true;
    expect(getStreamStatusSpy.calledTwice).to.be.true;

    clock.restore();
    getStreamStatusAxiosStub.restore();
    done();
  });

  it('should return false when stream is offline', function(done) {
    const stub = sinon.stub(axios, 'get').resolves({});

    stream.getStreamStatus().then(() => {
      const isOnline = stream.isOnline();
      expect(isOnline).to.be.false;
      stub.restore();
      done();
    });
  });

  it('should return false when API request errors', function(done) {
    const stub = sinon.stub(axios, 'get').rejects('Testing error case');

    stream.getStreamStatus().then(() => {
      const isOnline = stream.isOnline();
      expect(isOnline).to.be.false;
      stub.restore();
      done();
    });
  });

  it('should create an interval on start of monitoring stream status');

  it('should clear/destroy an interval on stop of monitoring stream status');

  // Need to stub the axios.get call to Twitch API streams endpoint and fake a time that was 3 hours ago
  it('should return expected uptime');
});
