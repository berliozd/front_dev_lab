/**
 * Created by Berlioz on 28/09/2015.
 */
// Filename: app.js
var Backbone = require('backbone');
var Router = require('./router');

module.exports = (function (Backbone, Router) {
  var initialize = function () {

    // Pass in our Router module and call it's initialize function
    Router.initialize();
  }

  return {
    initialize: initialize
  };
})(Backbone, Router);
