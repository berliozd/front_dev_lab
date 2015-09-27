/**
 * Created by Berlioz on 27/09/2015.
 */

var app = app || {};

app.util = (function () {
  this.color = 'blue';

  return {
    display : function () {
      console.log('displaying ' + color);
    },
    hide : function() {
      console.log('hiding 1');
    },
    close : function() {
      console.log('closing 1');
    }
  }



})();
