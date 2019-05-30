/* eslint-disable global-require */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai');

const data = require('../data');

describe('Data', function() {
  describe('Sanity Checks', function() {
    it('should return empty strings for all data at start', function(done) {
      const streamData = data.getAllData();

      expect(streamData).to.not.be.undefined;

      expect(streamData.followers).to.be.empty;
      expect(streamData.subscribers).to.be.empty;
      expect(streamData.cheerers).to.be.empty;
      expect(streamData.raiders).to.be.empty;

      done();
    });
  });

  describe('Followers', function() {
    it('should not add a follower with undefined username', function(done) {
      data.addFollower();
      const followerData = data.getAllData().followers;

      expect(followerData).to.be.empty;

      done();
    });

    it('should not add a follower with empty string username', function(done) {
      data.addFollower('');
      const followerData = data.getAllData().followers;

      expect(followerData).to.be.empty;

      done();
    });

    it('should add a follower with username clarkio', function(done) {
      data.addFollower('clarkio');
      const followerData = data.getAllData().followers;

      expect(followerData).not.be.empty;

      expect(followerData).to.be.equal(
        '- [@clarkio](https://twitch.tv/clarkio)\n'
      );

      done();
    });
  });

  describe('Subscribers', function() {
    it('should not add a subscriber with undefined username', function(done) {
      data.addSubscriber();
      const subscriberData = data.getAllData().subscribers;

      expect(subscriberData).to.be.empty;

      done();
    });

    it('should not add a subscriber with empty string username', function(done) {
      data.addSubscriber('');
      const subscriberData = data.getAllData().subscribers;

      expect(subscriberData).to.be.empty;

      done();
    });

    it('should not add a subscriber with undefined months', function(done) {
      data.addSubscriber('clarkio');
      const subscriberData = data.getAllData().subscribers;

      expect(subscriberData).to.be.empty;

      done();
    });

    it('should add a subscriber with username clarkio with singular month', function(done) {
      data.addSubscriber('clarkio', 1);
      const subscriberData = data.getAllData().subscribers;

      expect(subscriberData).not.be.empty;

      expect(subscriberData).to.be.equal(
        '- [@clarkio](https://twitch.tv/clarkio) (1 month)\n'
      );

      done();
    });

    it('should add a subscriber with username clarkiobot with plural months', function(done) {
      data.addSubscriber('clarkiobot', 2);
      const subscriberData = data.getAllData().subscribers;

      expect(subscriberData).not.be.empty;

      expect(subscriberData).to.include(
        '- [@clarkiobot](https://twitch.tv/clarkiobot) (2 months)\n'
      );

      done();
    });
  });

  describe('Gifted Subscribers', function() {
    it('should not add a gifted subscriber with undefined username', function(done) {
      data.addGiftedSubscriber();
      const giftedSubscriberData = data.getAllData().subscribers;

      expect(giftedSubscriberData).to.not.include(
        '- [@](https://twitch.tv/) ( month) `gifted by` [@](https://twitch.tv/)\n'
      );

      done();
    });

    it('should not add a gifted subscriber with empty string username', function(done) {
      data.addGiftedSubscriber('');
      const giftedSubscriberData = data.getAllData().subscribers;

      expect(giftedSubscriberData).to.not.include(
        '- [@](https://twitch.tv/) ( month) `gifted by` [@](https://twitch.tv/)\n'
      );

      done();
    });

    it('should not add a gifted subscriber with undefined months', function(done) {
      data.addGiftedSubscriber('clarkio');
      const giftedSubscriberData = data.getAllData().subscribers;

      expect(giftedSubscriberData).to.not.include(
        '- [@clarkio](https://twitch.tv/clarkio) ( month) `gifted by` [@](https://twitch.tv/)\n'
      );

      done();
    });

    it('should not add a gifted subscriber with undefined gifterUsername', function(done) {
      data.addGiftedSubscriber('clarkio', 1);
      const giftedSubscriberData = data.getAllData().subscribers;

      expect(giftedSubscriberData).to.not.include(
        '- [@clarkio](https://twitch.tv/clarkio) (1 month) `gifted by` [@](https://twitch.tv/)\n'
      );

      done();
    });

    it('should not add a gifted subscriber with empty string gifterUsername', function(done) {
      data.addGiftedSubscriber('clarkio', 1, '');
      const giftedSubscriberData = data.getAllData().subscribers;

      expect(giftedSubscriberData).to.not.include(
        '- [@clarkio](https://twitch.tv/clarkio) (1 month) `gifted by` [@](https://twitch.tv/)\n'
      );

      done();
    });

    it('should add a gifted subscriber with username clarkio with singular month', function(done) {
      data.addGiftedSubscriber('clarkio', 1, 'bestgifter');
      const giftedSubscriberData = data.getAllData().subscribers;

      expect(giftedSubscriberData).not.be.empty;

      expect(giftedSubscriberData).to.include(
        '- [@clarkio](https://twitch.tv/clarkio) (1 month) `gifted by` [@bestgifter](https://twitch.tv/bestgifter)\n'
      );

      done();
    });

    it('should add a gifted subscriber with username clarkiobot with plural months', function(done) {
      data.addGiftedSubscriber('clarkiobot', 2, 'bestgifter');
      const giftedSubscriberData = data.getAllData().subscribers;

      expect(giftedSubscriberData).not.be.empty;

      expect(giftedSubscriberData).to.include(
        '- [@clarkiobot](https://twitch.tv/clarkiobot) (2 months) `gifted by` [@bestgifter](https://twitch.tv/bestgifter)\n'
      );

      done();
    });
  });

  describe('Cheerers', function() {
    it('should not add a cheerer with undefined username', function(done) {
      data.addCheerer();
      const cheererData = data.getAllData().cheerers;

      expect(cheererData).to.be.empty;

      done();
    });

    it('should not add a cheerer with empty string username', function(done) {
      data.addCheerer('');
      const cheererData = data.getAllData().cheerers;

      expect(cheererData).to.be.empty;

      done();
    });

    it('should not add a cheerer with undefined bits', function(done) {
      data.addCheerer('clarkio');
      const cheererData = data.getAllData().cheerers;

      expect(cheererData).to.be.empty;

      done();
    });

    it('should not add a cheerer with empty string bits', function(done) {
      data.addCheerer('clarkio', '');
      const cheererData = data.getAllData().cheerers;

      expect(cheererData).to.be.empty;

      done();
    });

    it('should add a cheerer with username clarkio', function(done) {
      data.addCheerer('clarkio', 100);
      const cheererData = data.getAllData().cheerers;

      expect(cheererData).not.be.empty;

      expect(cheererData).to.be.equal(
        '- [@clarkio](https://twitch.tv/clarkio): 100 bits\n'
      );

      done();
    });
  });

  describe('Raiders', function() {
    it('should not add a raider with undefined username', function(done) {
      data.addRaider();
      const raiderData = data.getAllData().raiders;

      expect(raiderData).to.be.empty;

      done();
    });

    it('should not add a raider with empty string username', function(done) {
      data.addRaider('');
      const raiderData = data.getAllData().raiders;

      expect(raiderData).to.be.empty;

      done();
    });

    it('should not add a raider with undefined raid count', function(done) {
      data.addRaider('clarkio');
      const raiderData = data.getAllData().raiders;

      expect(raiderData).to.be.empty;

      done();
    });

    it('should not add a raider with empty string raid count', function(done) {
      data.addRaider('clarkio', '');
      const raiderData = data.getAllData().raiders;

      expect(raiderData).to.be.empty;

      done();
    });

    it('should add a raider with valid arguments', function(done) {
      data.addRaider('clarkio', 10);
      const raiderData = data.getAllData().raiders;

      expect(raiderData).to.be.equal(
        '- [@clarkio](https://twitch.tv/clarkio) (10)\n'
      );

      done();
    });
  });
});
