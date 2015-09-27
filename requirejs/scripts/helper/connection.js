/**
 * Created by Berlioz on 27/09/2015.
 */

var app = app || {};

app.connection = (function () {
  this.db = '1988.22.33.33';

  return {
    open : function() {
      console.log('opening connection to ' + db);
    },
    close : function() {
      console.log('closing connectionto ' + db);
    }
  }



})();
