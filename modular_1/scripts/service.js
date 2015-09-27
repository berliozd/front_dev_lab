/**
 * Created by Berlioz on 25/09/2015.
 */

var app = app || {};

(function (app) {

  app.service = function () {

    return {
      functionDeService1 : function(arg1, arg2) {
        console.log('dans functionDeService 1');
      },
      functionDeService2 : function(arg1, arg2) {
        console.log('dans functionDeService 2');
      },
    }
  }();

})(app);
