/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const sinon = require('sinon');
const axios = require('axios');

const streamStatus = require('../stream-status');

describe('Stream Status', function() {
  it('should return false by default', function(done) {
    const result = streamStatus.isStreamOnline();

    expect(result).to.be.false;

    done();
  });

  it('should return true when stream is online', function(done) {
    const stub = sinon.stub(axios, 'get').resolves({ data: ['', ''] });

    streamStatus.getStreamStatus().then(() => {
      const isOnline = streamStatus.isStreamOnline();
      expect(isOnline).to.be.true;
      stub.restore();
      done();
    });
  });

  it('should return false when stream is offline', function(done) {
    const stub = sinon.stub(axios, 'get').resolves({});

    streamStatus.getStreamStatus().then(() => {
      const isOnline = streamStatus.isStreamOnline();
      expect(isOnline).to.be.false;
      stub.restore();
      done();
    });
  });

  it('should return false when API request errors', function(done) {
    const stub = sinon.stub(axios, 'get').rejects('Testing error case');

    streamStatus.getStreamStatus().then(() => {
      const isOnline = streamStatus.isStreamOnline();
      expect(isOnline).to.be.false;
      stub.restore();
      done();
    });
  });

  it('should create an interval on start of monitoring stream status');

  it('should clear/destroy an interval on stop of monitoring stream status');
});
