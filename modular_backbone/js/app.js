/**
 * Created by Berlioz on 28/09/2015.
 */
// Filename: app.js
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;
var Router = require('./router');

module.exports = function ($, _, Backbone, Router) {
  var initialize = function () {

    console.log('in app');
    console.log(Router);

    // Pass in our Router module and call it's initialize function
    Router.initialize();
  }

  return {
    initialize: initialize
  };
}($, _, Backbone, Router);
