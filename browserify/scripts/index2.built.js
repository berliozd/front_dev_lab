(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by Berlioz on 27/09/2015.
 */

module.exports = function () {
  this.dbip = '1988.22.33.33';

  return {
    database_ip: dbip,
    open: function () {
      console.log('---- opening connection to ' + dbip);
    },
    close: function () {
      console.log('closing connection to ' + db);
    }
  }

}();

},{}],2:[function(require,module,exports){
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

},{"./connection.js":1}],3:[function(require,module,exports){
/**
 * Created by Berlioz on 27/09/2015.
 */


module.exports = function () {
  //Do setup work here
  this.color = 'blue';

  return {
    size: "unisize",
    display: function () {
      console.log('dispddddddddlaying ' + color);
    },
    hide: function () {
      console.log('hiding 1');
    },
    close: function () {
      console.log('closing 1');
    }
  }
}();

},{}],4:[function(require,module,exports){
/**
 * Created by Berlioz on 27/09/2015.
 */

var util = require('./helper/util.js');
var service = require('./helper/service.js');

util.display();
util.hide();
service.call();

},{"./helper/service.js":2,"./helper/util.js":3}]},{},[4]);
