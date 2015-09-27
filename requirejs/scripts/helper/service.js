/**
 * Created by Berlioz on 27/09/2015.
 */
/**
 * Created by Berlioz on 27/09/2015.
 */

define(["helper/connection"],
  function (connection) {
    this.pro1 = 'tatata';

    var service = {
      call: function () {
        console.log('call ' + pro1 + ' => ' + connection.database_ip);
      }
    }
    return service;
  }
);
