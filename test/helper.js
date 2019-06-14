const sinon = require('sinon');
const logger = require('../src/logger');

beforeEach(function() {
  sinon.stub(logger, 'info');
  sinon.stub(logger, 'dir');
  sinon.stub(logger, 'log');
  sinon.stub(logger, 'error');
});

afterEach(function() {
  logger.info.restore();
  logger.dir.restore();
  logger.log.restore();
  logger.error.restore();
});
