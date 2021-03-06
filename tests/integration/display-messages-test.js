import Em from 'ember';
import { test } from 'ember-qunit';
import message from '../helpers/message';
import startApp from '../helpers/start-app';

var secondMessage = {
  content: 'well done',
  duration: 3000, // Default
  type: 'error'
};

var App, container, controller;

module('Flash Messages - display messages', {
  needs: ['component:flash-message'],
  setup: function() {
    App = startApp();
    container = App.__container__;
    controller = container.lookup('controller:index');
  },

  teardown: function() {
    Em.run(App, 'reset');
  }

});



test('Message queue component should render', function() {

  visit('/');

  andThen(function() {
    var queueComponent = inspect('queue');

    ok(queueComponent, 'Message queue component should render on the page');
    equal(queueComponent.text().trim(), '', 'Message queue component should render empty');

    Em.run(function() {
      controller.flashMessage(message['type'], message['content']);
    });

    ['content', 'type'].forEach(function(property) {
      var report = 'Message ' + property + ' should render';

      equal(inspect(property).html().trim(), message[property], report);
    });
  });

});



test('Message queue component should display multiple messages in sequence', function() {

  visit('/');

  andThen(function() {
    // var queueComponent = inspect('queue');

    /* Send messages to queue */

    Em.run(function() {
      controller.flashMessage(message['type'], message['content']);
      controller.flashMessage(secondMessage['type'], secondMessage['content']);
    });

    /* Check first message displays */

    ['content', 'type'].forEach(function(property) {
      var report = 'First flash message: ' + property + ' should render';

      equal(inspect(property).html().trim(), message[property], report);
    });

    Em.run.later(function() {
      ['content', 'type'].forEach(function(property) {
        var report = 'First flash message: ' + property + ' should not have changed yet';

        notEqual(inspect(property).html().trim(), secondMessage[property], report);
      });
    }, message['duration'] - 100);

    /* Check second message displays after change */

    Em.run.later(function() {
      ['content', 'type'].forEach(function(property) {
        var report = 'Second flash message: ' + property + ' should change';

        equal(inspect(property).html().trim(), secondMessage[property], report);
      });
    }, message['duration']);
  });

});
