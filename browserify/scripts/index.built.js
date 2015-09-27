(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
/**
 * Created by Berlioz on 27/09/2015.
 */

var util = require('./helper/util.js');

console.log(util);

util.display();
util.hide();


},{"./helper/util.js":1}]},{},[2]);
