/**
 * Created by Berlioz on 28/09/2015.
 */
// Filename: app.js
var Router = require('./router');

module.exports = (function (Router) {
  var initialize = function () {
    // Pass in our Router module and call it's initialize function
    Router.initialize();
  }

  return {
    initialize: initialize
  };
})(Router);
