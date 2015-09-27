/**
 * Created by Berlioz on 27/09/2015.
 */
/**
 * Created by Berlioz on 27/09/2015.
 */

var connection = require("./connection.js");

module.exports = function (connection) {

  this.pro1 = 'tatata';

  return {
    call: function () {
      console.log('call ' + pro1 + ' => ' + connection.database_ip);
    }
  }
}(connection);
