/**
 * Created by Berlioz on 27/09/2015.
 */

define(
  function () {
    this.dbip = '1988.22.33.33';

    var connection = {
      database_ip: dbip,
      open: function () {
        console.log('---- opening connection to ' + dbip);
      },
      close: function () {
        console.log('closing connection to ' + db);
      }
    };

    return connection;
  }
);
