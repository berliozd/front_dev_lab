/**
 * Created by Berlioz on 25/09/2015.
 */

var app = app || {};

(function (boo, str) {
  boo.controller = function () {

    return {
      fonctionDeController: function () {
        console.log('dans fonctionDeController => ' + str);
      }
    };
  }();
})(app, 'test');
